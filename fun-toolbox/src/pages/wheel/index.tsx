import { View, Text, Input, Canvas, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
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

function defaultConfig(): WheelConfig {
  return {
    name: '今天吃什么',
    items: [
      { text: '火锅', weight: 1 },
      { text: '烤肉', weight: 1 },
      { text: '日料', weight: 1 },
      { text: '自己做饭', weight: 1 },
      { text: '随便吃点', weight: 1 }
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

const INITIAL_CONFIGS: WheelConfig[] = get<WheelConfig[]>('wheel_configs', [defaultConfig()])

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

  useEffect(() => {
    setSeedText(config ? config.seed : '')
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeIndex])

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

  /* ---------- 转盘绘制（从 ref 读取最新数据，避免过期闭包） ---------- */
  const drawWheel = (ctx: any, w: number, h: number, rot: number) => {
    const cfg = configRef.current
    const th = themeRef.current
    const cx = w / 2
    const cy = h / 2
    const R = Math.min(w, h) / 2 - 14
    const items = cfg ? cfg.items : []
    ctx.clearRect(0, 0, w, h)

    if (items.length === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fill()
      ctx.fillStyle = '#B8A99E'
      ctx.font = '600 30px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('先去添加选项吧', cx, cy)
      return
    }

    const totalWeight = items.reduce((s, i) => s + i.weight, 0) || 1
    const colors = th.wheelColors

    ctx.beginPath()
    ctx.arc(cx, cy, R + 8, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fill()

    let startAngle = 0
    items.forEach((item, i) => {
      const sweep = (Math.PI * 2 * item.weight) / totalWeight
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

      const midAngle = startAngle + sweep / 2 + rot
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(midAngle)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#4A3B32'
      const fs = items.length <= 6 ? 32 : items.length <= 12 ? 26 : 22
      ctx.font = `700 ${fs}px sans-serif`
      let label = item.text
      if (label.length > 6) label = `${label.slice(0, 6)}…`
      ctx.fillText(label, R * 0.62, 0)
      if (item.weight > 1) {
        ctx.font = '600 20px sans-serif'
        ctx.fillStyle = 'rgba(74,59,50,0.55)'
        ctx.fillText(`x${item.weight}`, R * 0.62, fs + 4)
      }
      ctx.restore()

      startAngle = endAngle
    })

    ctx.beginPath()
    ctx.arc(cx, cy, 58, 0, Math.PI * 2)
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

      const totalWeight = items.reduce((s, i) => s + i.weight, 0)
      const seedNum = Number(seedText)
      const useSeed = seedText !== '' && !Number.isNaN(seedNum)
      const rng = useSeed ? mulberry32(Math.floor(Math.abs(seedNum)) + 1) : Math.random

      let r = rng() * totalWeight
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
      const sweep = (Math.PI * 2 * items[targetIndex].weight) / totalWeight
      const sectorStart = (Math.PI * 2 * cumWeight) / totalWeight
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
          const history = get<HistoryEntry[]>('wheel_history', [])
          history.unshift({ ts: Date.now(), config: config.name, result: winner })
          set('wheel_history', history.slice(0, 50))
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
  const updateItems = (updater: (items: WheelItem[]) => WheelItem[]) => {
    const next = configs.map((c, i) => (i === activeIndex ? { ...c, items: updater(c.items) } : c))
    setConfigs(next)
    set('wheel_configs', next)
  }

  const addItem = () => {
    const text = newItemText.trim()
    if (!text) return
    if (config.items.length >= MAX_ITEMS) {
      Taro.showToast({ title: `最多 ${MAX_ITEMS} 个选项`, icon: 'none' })
      return
    }
    updateItems(items => [...items, { text, weight: 1 }])
    setNewItemText('')
    setResult('')
  }

  const changeWeight = (index: number, delta: number) => {
    updateItems(items =>
      items.map((it, i) =>
        i === index ? { ...it, weight: Math.max(1, Math.min(9, it.weight + delta)) } : it
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

  const setSeed = (v: string) => {
    setSeedText(v)
    const next = configs.map((c, i) => (i === activeIndex ? { ...c, seed: v } : c))
    setConfigs(next)
    set('wheel_configs', next)
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

      {/* ---------- 命运文案 ---------- */}
      <View className='wheel-wish' key={wish}>
        {wish !== '' ? wish : '命运文案将在旋转时出现'}
      </View>

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
          <Text className='wheel-result-idle'>点 GO 开始，让转盘替你决定</Text>
        )}
      </View>

      {/* ---------- 种子 ---------- */}
      <View className='wheel-seed-row'>
        <Input
          className='wheel-seed-input'
          type='number'
          value={seedText}
          placeholder='输入数字种子（可复现结果）'
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
      </View>
      <View className='wheel-items'>
        {config &&
          config.items.map((item, i) => (
            <View key={`${item.text}-${i}`} className='wheel-item' onLongPress={() => removeItem(i)}>
              <Text className='wheel-item-text'>{item.text}</Text>
              <View className='wheel-item-weight'>
                <Text className='wheel-weight-btn' onClick={() => changeWeight(i, -1)}>
                  −
                </Text>
                <Text className='wheel-weight-num'>x{item.weight}</Text>
                <Text className='wheel-weight-btn' onClick={() => changeWeight(i, 1)}>
                  ＋
                </Text>
              </View>
            </View>
          ))}
      </View>

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

      <View className='wheel-tip'>长按选项或方案名可以删除 · 调权重影响中奖概率</View>
    </View>
  )
}
