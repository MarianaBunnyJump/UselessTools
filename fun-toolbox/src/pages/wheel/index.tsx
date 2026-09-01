import { View, Text, Input, Canvas, ScrollView, Button } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro'
import { useState, useRef, useCallback, useEffect } from 'react'
import { WHEEL_WISHES } from '../../data/wheelWishes'
import { getTheme, type BackgroundPreset } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import { randomOf } from '../../utils/format'
import NavBar from '../../components/NavBar'
import './index.scss'

interface WheelItem {
  text: string
  weight: number
}

interface WheelConfig {
  name: string
  items: WheelItem[]
  seed: string
}

interface HistoryEntry {
  ts: number
  config: string
  result: string
}

const MAX_ITEMS = 30
const SPIN_MS = 3800
/* 范围权重：默认 50，步进 5，范围 1-100 */
const WEIGHT_DEFAULT = 50
const WEIGHT_STEP = 5

function defaultConfig(): WheelConfig {
  return {
    name: '今天吃什么',
    items: [
      { text: '火锅', weight: WEIGHT_DEFAULT },
      { text: '烤肉', weight: WEIGHT_DEFAULT },
      { text: '日料', weight: WEIGHT_DEFAULT },
      { text: '自己做饭', weight: WEIGHT_DEFAULT },
      { text: '随便吃点', weight: WEIGHT_DEFAULT }
    ],
    seed: ''
  }
}

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function clampWeight(w: number): number {
  if (!Number.isFinite(w)) return WEIGHT_DEFAULT
  return Math.max(1, Math.min(100, Math.floor(w)))
}

/* 兼容字符串 / 对象 / 老版本(1-9倍数权重) 的选项数据 */
function normalizeItems(raw: any[]): WheelItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(it => {
      if (typeof it === 'string') return { text: it, weight: WEIGHT_DEFAULT }
      const text = String((it && it.text) || '').trim()
      return { text, weight: clampWeight(Number(it && it.weight)) }
    })
    .filter(it => it.text !== '')
    .slice(0, MAX_ITEMS)
}

/* 旧数据迁移：老版权重是 1-9 倍数，换算为 50 基准 */
function loadConfigs(): WheelConfig[] {
  const raw = get<WheelConfig[]>('wheel_configs', [defaultConfig()])
  if (get<number>('wheel_weight_v3', 0) === 1) return raw
  const next = raw.map(c => ({
    ...c,
    items: (c.items || []).map(it => ({
      text: it.text,
      weight: clampWeight(WEIGHT_DEFAULT * (it.weight || 1))
    }))
  }))
  set('wheel_configs', next)
  set('wheel_weight_v3', 1)
  return next
}

const INITIAL_CONFIGS: WheelConfig[] = loadConfigs()

function formatTime(ts: number): string {
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

export default function Wheel() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [configs, setConfigs] = useState<WheelConfig[]>(INITIAL_CONFIGS)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(Math.max(0, get<number>('wheel_last_config', 0)), INITIAL_CONFIGS.length - 1)
  )
  const [newItemText, setNewItemText] = useState('')
  const [seedText, setSeedText] = useState('')
  const [result, setResult] = useState('')
  const [wish, setWish] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(get<HistoryEntry[]>('wheel_history', []))

  const canvasRef = useRef<any>(null)
  const rotRef = useRef(0)
  const rafRef = useRef(0)
  const spinningRef = useRef(false)
  const drawRef = useRef<((rot: number) => void) | null>(null)
  const configRef = useRef<WheelConfig | null>(null)
  const themeRef = useRef<BackgroundPreset>(theme)

  const config = configs[Math.min(activeIndex, configs.length - 1)]
  configRef.current = config
  themeRef.current = theme

  const totalWeight = config ? config.items.reduce((s, i) => s + i.weight, 0) : 0

  useEffect(() => {
    setSeedText(config ? config.seed : '')
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeIndex])

  useDidShow(() => {
    setHistory(get<HistoryEntry[]>('wheel_history', []))
  })

  useEffect(() => {
    const listener = (bg: BackgroundPreset) => setTh(bg)
    Taro.eventCenter.on('theme-changed', listener)
    return () => {
      Taro.eventCenter.off('theme-changed', listener)
      spinningRef.current = false
      if (canvasRef.current && rafRef.current) {
        try {
          canvasRef.current.cancelAnimationFrame(rafRef.current)
        } catch (e) {
          /* 忽略 */
        }
      }
    }
  }, [])

  useShareAppMessage(() => ({
    title: result !== '' ? `转盘替我选了：${result}` : '让转盘替你做决定',
    path: '/pages/index/index'
  }))

  const persistConfigs = (next: WheelConfig[], active: number) => {
    setConfigs(next)
    setActiveIndex(active)
    set('wheel_configs', next)
    set('wheel_last_config', active)
  }

  const updateItems = (updater: (items: WheelItem[]) => WheelItem[]) => {
    const next = configs.map((c, i) => (i === activeIndex ? { ...c, items: updater(c.items) } : c))
    setConfigs(next)
    set('wheel_configs', next)
  }

  /* ---------- 转盘绘制（从 ref 读取最新数据，避免过期闭包） ---------- */
  const drawWheel = (ctx: any, w: number, h: number, rot: number) => {
    const cfg = configRef.current
    const th = themeRef.current
    const cx = w / 2
    const cy = h / 2
    const R = Math.min(w, h) / 2 - 14
    const items = cfg ? cfg.items : []
    ctx.clearRect(0, 0, w, h)

    ctx.beginPath()
    ctx.arc(cx, cy, R + 8, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fill()

    if (items.length === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fill()
      ctx.fillStyle = '#B8A99E'
      ctx.font = '600 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('先去添加选项吧', cx, cy)
      return
    }

    const tw = items.reduce((s, i) => s + i.weight, 0) || 1
    const colors = th.wheelColors

    let startAngle = 0
    items.forEach((item, i) => {
      const sweep = (Math.PI * 2 * item.weight) / tw
      const endAngle = startAngle + sweep

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, startAngle + rot, endAngle + rot)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 3
      ctx.stroke()

      /* 文字沿半径排布，字号随选项数收敛 */
      const midAngle = startAngle + sweep / 2 + rot
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(midAngle)
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#4A3B32'
      const fs = Math.max(12, Math.min(17, 20 - items.length * 0.5))
      ctx.font = `700 ${fs}px sans-serif`
      let label = item.text
      const maxLen = items.length > 12 ? 6 : 10
      if (label.length > maxLen) label = `${label.slice(0, maxLen)}…`
      ctx.textAlign = 'right'
      ctx.fillText(label, R - 16, 0)
      ctx.restore()

      startAngle = endAngle
    })

    /* 中心底座（GO 按钮的衬底） */
    ctx.beginPath()
    ctx.arc(cx, cy, 54, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.strokeStyle = colors[0]
    ctx.lineWidth = 6
    ctx.stroke()
  }

  const setupCanvas = useCallback((cb: () => void) => {
    const query = Taro.createSelectorQuery()
    query
      .select('#wheelCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (!res || !res[0] || !res[0].node) return
        const canvas = res[0].node
        canvasRef.current = canvas
        let dpr = 2
        try {
          dpr = Taro.getSystemInfoSync().pixelRatio || 2
        } catch (e) {
          /* 默认值兜底 */
        }
        const w = res[0].width
        const h = res[0].height
        canvas.width = w * dpr
        canvas.height = h * dpr
        const ctx = canvas.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawRef.current = (rot: number) => drawWheel(ctx, w, h, rot)
        cb()
      })
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const redraw = useCallback(() => {
    if (drawRef.current) drawRef.current(rotRef.current)
  }, [])

  /* 数据或主题变化后重绘 */
  useEffect(() => {
    if (canvasRef.current && drawRef.current) {
      redraw()
    } else {
      setupCanvas(() => redraw())
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [config && config.items, config && config.items.length, theme])

  /* ---------- 旋转 ---------- */
  const spin = () => {
    if (spinningRef.current) return
    const items = config ? config.items : []
    if (items.length < 2) {
      Taro.showToast({ title: '至少需要 2 个选项', icon: 'none' })
      return
    }

    const run = () => {
      spinningRef.current = true
      setSpinning(true)
      setResult('')
      setWish(randomOf(WHEEL_WISHES))

      const tw = items.reduce((s, i) => s + i.weight, 0)
      const seedNum = Number(seedText)
      const useSeed = seedText !== '' && !Number.isNaN(seedNum)
      const rng = useSeed ? mulberry32(Math.floor(Math.abs(seedNum)) + 1) : Math.random

      let r = rng() * tw
      let targetIndex = 0
      for (let i = 0; i < items.length; i++) {
        r -= items[i].weight
        if (r < 0) {
          targetIndex = i
          break
        }
      }

      let cumWeight = 0
      for (let i = 0; i < targetIndex; i++) cumWeight += items[i].weight
      const sweep = (Math.PI * 2 * items[targetIndex].weight) / tw
      const sectorStart = (Math.PI * 2 * cumWeight) / tw
      const mid = sectorStart + sweep / 2
      const jitterRatio = useSeed ? rng() : Math.random()
      const jitter = (jitterRatio - 0.5) * sweep * 0.8

      const startRot = rotRef.current
      let delta = -Math.PI / 2 - (mid + jitter) - startRot
      while (delta < Math.PI * 10) delta += Math.PI * 2
      const endRot = startRot + delta

      const startTime = Date.now()
      const animate = () => {
        if (!spinningRef.current) return
        const t = Math.min(1, (Date.now() - startTime) / SPIN_MS)
        rotRef.current = startRot + (endRot - startRot) * easeOutCubic(t)
        if (drawRef.current) drawRef.current(rotRef.current)
        if (t < 1) {
          rafRef.current = canvasRef.current.requestAnimationFrame(animate)
        } else {
          spinningRef.current = false
          setSpinning(false)
          const winner = items[targetIndex].text
          setResult(winner)
          const nextHistory = get<HistoryEntry[]>('wheel_history', [])
          nextHistory.unshift({ ts: Date.now(), config: config ? config.name : '', result: winner })
          set('wheel_history', nextHistory.slice(0, 100))
          setHistory(nextHistory.slice(0, 100))
        }
      }
      rafRef.current = canvasRef.current.requestAnimationFrame(animate)
    }

    if (canvasRef.current && drawRef.current) {
      run()
    } else {
      setupCanvas(run)
    }
  }

  /* ---------- 方案管理 ---------- */
  const switchConfig = (index: number) => {
    if (spinningRef.current) return
    setActiveIndex(index)
    set('wheel_last_config', index)
    setResult('')
    setSeedText(configs[index].seed)
  }

  const createConfig = () => {
    if (spinningRef.current) return
    /* editable 为基础库 2.17.1+ 扩展参数，Taro 类型定义未覆盖 */
    const opts: any = {
      title: '新建方案',
      editable: true,
      placeholderText: '比如：谁来洗碗',
      success: (res: any) => {
        if (!res.confirm) return
        const name = (res.content || '').trim() || `方案 ${configs.length + 1}`
        const next = [...configs, { name, items: [], seed: '' }]
        persistConfigs(next, next.length - 1)
        setResult('')
      }
    }
    Taro.showModal(opts)
  }

  const removeConfig = (index: number) => {
    if (spinningRef.current) return
    if (configs.length <= 1) {
      Taro.showToast({ title: '至少保留一个方案', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '删除方案',
      content: `确定删除"${configs[index].name}"？`,
      confirmColor: '#EF5350',
      success: res => {
        if (!res.confirm) return
        const next = configs.filter((_, i) => i !== index)
        const nextActive = index < activeIndex ? activeIndex - 1 : Math.min(activeIndex, next.length - 1)
        persistConfigs(next, nextActive)
        setResult('')
      }
    })
  }

  /* ---------- 选项管理 ---------- */
  const addItem = () => {
    const text = newItemText.trim()
    if (!text) return
    if (config.items.length >= MAX_ITEMS) {
      Taro.showToast({ title: `最多 ${MAX_ITEMS} 个选项`, icon: 'none' })
      return
    }
    updateItems(items => [...items, { text, weight: WEIGHT_DEFAULT }])
    setNewItemText('')
    setResult('')
  }

  const changeWeight = (index: number, delta: number) => {
    updateItems(items =>
      items.map((it, i) =>
        i === index ? { ...it, weight: Math.max(1, Math.min(100, it.weight + delta)) } : it
      )
    )
  }

  const removeItem = (index: number) => {
    if (spinningRef.current) return
    Taro.showModal({
      title: '删除选项',
      content: `确定删除"${config.items[index].text}"？`,
      confirmColor: '#EF5350',
      success: res => {
        if (!res.confirm) return
        updateItems(items => items.filter((_, i) => i !== index))
        setResult('')
      }
    })
  }

  const resetWeights = () => {
    if (config.items.length === 0) {
      Taro.showToast({ title: '列表为空', icon: 'none' })
      return
    }
    updateItems(items => items.map(it => ({ ...it, weight: WEIGHT_DEFAULT })))
    Taro.showToast({ title: '权重已重置为 50', icon: 'none' })
  }

  const setSeed = (v: string) => {
    setSeedText(v)
    const next = configs.map((c, i) => (i === activeIndex ? { ...c, seed: v } : c))
    setConfigs(next)
    set('wheel_configs', next)
  }

  /* ---------- 导入 / 导出 / 分享 ---------- */
  const exportCurrent = () => {
    if (!config || config.items.length === 0) {
      Taro.showToast({ title: '当前方案为空', icon: 'none' })
      return
    }
    const data = JSON.stringify(
      { app: 'uselesstools-wheel', version: 3, type: 'single', exportedAt: new Date().toISOString(), config },
      null,
      2
    )
    Taro.setClipboardData({
      data,
      success: () => Taro.showToast({ title: '已复制，粘贴即可保存/转发', icon: 'none' })
    })
  }

  const exportAll = () => {
    if (configs.every(c => c.items.length === 0)) {
      Taro.showToast({ title: '所有方案为空', icon: 'none' })
      return
    }
    const data = JSON.stringify(
      {
        app: 'uselesstools-wheel',
        version: 3,
        type: 'all',
        exportedAt: new Date().toISOString(),
        configs,
        activeIndex
      },
      null,
      2
    )
    Taro.setClipboardData({
      data,
      success: () => Taro.showToast({ title: '已复制，粘贴即可保存/转发', icon: 'none' })
    })
  }

  const applyImport = (mode: 'replace' | 'append' | 'items', payload: any) => {
    if (mode === 'replace') {
      const next: WheelConfig[] = (payload as any[]).map((c: any, i: number) => ({
        name: String((c && c.name) || `方案 ${i + 1}`),
        items: normalizeItems(c && c.items),
        seed: String((c && c.seed) || '')
      }))
      if (next.length === 0) {
        Taro.showToast({ title: '没有可用方案', icon: 'none' })
        return
      }
      Taro.showModal({
        title: '导入全部方案',
        content: `将替换现有 ${configs.length} 个方案为导入的 ${next.length} 个，确定？`,
        success: res => {
          if (!res.confirm) return
          persistConfigs(next, 0)
          setResult('')
          Taro.showToast({ title: '导入成功', icon: 'success' })
        }
      })
      return
    }

    if (mode === 'append') {
      const name = String((payload && payload.name) || `导入方案 ${configs.length + 1}`)
      const items = normalizeItems(payload && payload.items)
      if (items.length === 0) {
        Taro.showToast({ title: '方案里没有有效选项', icon: 'none' })
        return
      }
      const next = [...configs, { name, items, seed: String((payload && payload.seed) || '') }]
      persistConfigs(next, next.length - 1)
      setResult('')
      Taro.showToast({ title: `已导入「${name}」`, icon: 'success' })
      return
    }

    /* 追加为当前方案的选项 */
    const items = normalizeItems(payload)
    if (items.length === 0) {
      Taro.showToast({ title: '没有识别到有效选项', icon: 'none' })
      return
    }
    updateItems(cur => [...cur, ...items].slice(0, MAX_ITEMS))
    setResult('')
    Taro.showToast({ title: `已添加 ${items.length} 个选项`, icon: 'success' })
  }

  const importFromClipboard = () => {
    if (spinningRef.current) return
    Taro.getClipboardData({
      success: res => {
        const raw = (res.data || '').trim()
        if (raw === '') {
          Taro.showToast({ title: '剪贴板是空的', icon: 'none' })
          return
        }
        let data: any = null
        try {
          data = JSON.parse(raw)
        } catch (e) {
          data = null
        }
        if (data && typeof data === 'object') {
          if (data.type === 'all' && Array.isArray(data.configs)) {
            applyImport('replace', data.configs)
          } else if (data.type === 'single' && data.config) {
            applyImport('append', data.config)
          } else if (Array.isArray(data.items)) {
            applyImport('items', data.items)
          } else if (Array.isArray(data)) {
            applyImport('items', data)
          } else {
            Taro.showToast({ title: '内容无法识别', icon: 'none' })
          }
          return
        }
        /* 纯文本：按行或顿号拆成选项 */
        const parts = raw
          .split(/[\n、,，;；]+/)
          .map(s => s.trim())
          .filter(s => s !== '')
        if (parts.length > 0) {
          applyImport('items', parts)
        } else {
          Taro.showToast({ title: '内容无法识别', icon: 'none' })
        }
      },
      fail: () => {
        Taro.showToast({ title: '读取剪贴板失败', icon: 'none' })
      }
    })
  }

  const goHistory = () => {
    Taro.navigateTo({ url: '/pages/wheel/history' })
  }

  return (
    <View className='page-root wheel-root' style={{ background: theme.bg }}>
      <NavBar
        title='转盘选择器'
        right={
          <Text className='wheel-history-btn' onClick={goHistory}>
            📜
          </Text>
        }
      />

      {/* ---------- 方案 Tab ---------- */}
      <ScrollView className='wheel-tabs' scrollX enhanced showScrollbar={false}>
        {configs.map((c, i) => (
          <View
            key={`${c.name}-${i}`}
            className={`wheel-tab ${i === activeIndex ? 'wheel-tab--active' : ''}`}
            onClick={() => switchConfig(i)}
            onLongPress={() => removeConfig(i)}
          >
            {c.name}
            <Text className='wheel-tab-count'>{c.items.length}</Text>
          </View>
        ))}
        <View className='wheel-tab wheel-tab--new' onClick={createConfig}>
          ＋新建
        </View>
      </ScrollView>

      {/* ---------- 转盘 ---------- */}
      <View className='wheel-stage'>
        <View className='wheel-pointer' />
        <Canvas type='2d' id='wheelCanvas' className='wheel-canvas' />
        {!spinning && (
          <View className='wheel-go' onClick={spin}>
            GO
          </View>
        )}
      </View>

      {/* ---------- 结果 ---------- */}
      <View className={`wheel-result ${result !== '' ? 'wheel-result--show' : ''}`}>
        {result !== '' ? (
          <>
            <Text className='wheel-result-label'>转盘替你选了</Text>
            <Text className='wheel-result-text'>{result}</Text>
          </>
        ) : (
          <Text className='wheel-result-idle'>
            {wish !== '' ? wish : '点 GO 开始，让转盘替你决定'}
          </Text>
        )}
      </View>

      {/* ---------- 种子 ---------- */}
      <View className='wheel-seed-row'>
        <Input
          className='wheel-seed-input'
          type='number'
          value={seedText}
          placeholder='数字种子（可复现结果）'
          onInput={e => setSeed(e.detail.value)}
        />
        <View
          className='wheel-seed-random'
          onClick={() => setSeed(String(Math.floor(Math.random() * 100000)))}
        >
          随机
        </View>
      </View>

      {/* ---------- 选项列表 ---------- */}
      <View className='wheel-section-label'>
        选项列表 · {config ? config.items.length : 0}/{MAX_ITEMS}
        <Text className='wheel-reset-weight' onClick={resetWeights}>
          重置权重
        </Text>
      </View>
      {config && config.items.length > 0 ? (
        <View className='wheel-items'>
          {config.items.map((item, i) => (
            <View key={`${item.text}-${i}`} className='wheel-item' onLongPress={() => removeItem(i)}>
              <View className='wheel-item-left'>
                <Text className='wheel-item-text'>{item.text}</Text>
                <Text className='wheel-item-prob'>
                  {totalWeight > 0 ? Math.round((item.weight / totalWeight) * 100) : 0}%
                </Text>
              </View>
              <View className='wheel-item-weight'>
                <Text className='wheel-weight-btn' onClick={() => changeWeight(i, -WEIGHT_STEP)}>
                  −
                </Text>
                <Text className='wheel-weight-num'>{item.weight}</Text>
                <Text className='wheel-weight-btn' onClick={() => changeWeight(i, WEIGHT_STEP)}>
                  ＋
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className='wheel-items-empty'>列表是空的，先添加几个选项吧</View>
      )}

      <View className='wheel-add-row'>
        <Input
          className='wheel-add-input'
          value={newItemText}
          maxlength={12}
          placeholder='输入新选项'
          onInput={e => setNewItemText(e.detail.value)}
        />
        <View className='wheel-add-btn' onClick={addItem}>
          添加
        </View>
      </View>

      {/* ---------- 导入导出分享 ---------- */}
      <View className='wheel-tool-row'>
        <View className='wheel-tool-btn' onClick={exportCurrent}>
          导出当前
        </View>
        <View className='wheel-tool-btn' onClick={exportAll}>
          导出全部
        </View>
        <View className='wheel-tool-btn' onClick={importFromClipboard}>
          导入
        </View>
        <Button className='wheel-tool-btn wheel-tool-btn--share' openType='share'>
          分享
        </Button>
      </View>

      {/* ---------- 历史记录 ---------- */}
      <View className='wheel-section-label'>
        历史记录
        <Text className='wheel-history-more' onClick={goHistory}>
          查看全部 ›
        </Text>
      </View>
      {history.length > 0 ? (
        <View className='wheel-history-list'>
          {history.slice(0, 8).map((h, i) => (
            <View key={`${h.ts}-${i}`} className='wheel-history-item'>
              <View className='wheel-history-main'>
                <Text className='wheel-history-result'>{h.result}</Text>
                <Text className='wheel-history-config'>「{h.config}」</Text>
              </View>
              <Text className='wheel-history-time'>{formatTime(h.ts)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className='wheel-items-empty'>还没有记录，转一次试试</View>
      )}

      <View className='wheel-tip'>长按选项或方案名可删除 · 权重决定扇区大小和中奖概率</View>
    </View>
  )
}
