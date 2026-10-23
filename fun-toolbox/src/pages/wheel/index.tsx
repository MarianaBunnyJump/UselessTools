import { View, Text, Input, Canvas, ScrollView, Button } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro'
import { useState, useRef, useCallback, useEffect } from 'react'
import { WHEEL_WISHES } from '../../data/wheelWishes'
import { getTheme, type BackgroundPreset } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import { randomOf } from '../../utils/format'
import NavBar from '../../components/NavBar'
import { WHEEL_SCENES } from '../../data/wheelScenes'
import './index.scss'

interface WheelItem {
  text: string
  weight: number
}

interface WheelConfig {
  id: string
  name: string
  items: WheelItem[]
  seed: string
}

interface HistoryEntry {
  ts: number
  config: string
  result: string
  seed?: number
}

type HistoryMap = Record<string, HistoryEntry[]>

const MAX_ITEMS = 30
const SPIN_MS = 3800
/* 范围权重：默认 50，步进 5，范围 1-100 */
const WEIGHT_DEFAULT = 50
const WEIGHT_STEP = 5

const CONFIGS_KEY = 'wheel_configs'
const HISTORY_KEY = 'wheel_history_v2'
const LEGACY_HISTORY_KEY = 'wheel_history'

function genId(): string {
  return `c${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`
}

function defaultConfig(): WheelConfig {
  return {
    id: genId(),
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

/* 读取时补齐方案 id（老数据迁移），v4 权重体系只迁移一次 */
function loadConfigs(): WheelConfig[] {
  const raw = get<any[]>(CONFIGS_KEY, null)
  let list: WheelConfig[]
  if (Array.isArray(raw) && raw.length > 0) {
    list = raw.map(c => ({
      id: String((c && c.id) || genId()),
      name: String((c && c.name) || `方案`),
      items: normalizeItems(c && c.items),
      seed: String((c && c.seed) || '')
    }))
  } else {
    list = [defaultConfig()]
  }
  if (get<number>('wheel_weight_v4', 0) !== 1) {
    list = list.map(c => ({
      ...c,
      items: c.items.map(it => ({ text: it.text, weight: WEIGHT_DEFAULT }))
    }))
    set('wheel_weight_v4', 1)
  }
  set(CONFIGS_KEY, list)
  return list
}

/* 旧全局历史按方案名归位到各自名下；无匹配方案的记录丢弃 */
function loadHistoryMap(configs: WheelConfig[]): HistoryMap {
  const map = get<HistoryMap>(HISTORY_KEY, {})
  const legacy = get<HistoryEntry[]>(LEGACY_HISTORY_KEY, null)
  if (Array.isArray(legacy) && legacy.length > 0) {
    for (let i = legacy.length - 1; i >= 0; i--) {
      const h = legacy[i]
      const cfg = configs.find(c => c.name === h.config)
      if (!cfg) continue
      if (!Array.isArray(map[cfg.id])) map[cfg.id] = []
      map[cfg.id].push(h)
    }
    Object.keys(map).forEach(k => {
      map[k] = map[k].slice(0, 100)
    })
    set(HISTORY_KEY, map)
    set(LEGACY_HISTORY_KEY, [])
  }
  return map
}

/* 每次挂载都重新读库：修复返回再进入后新建方案丢数据的问题 */
function loadWheelState() {
  const configs = loadConfigs()
  const historyMap = loadHistoryMap(configs)
  const lastIdx = Math.min(Math.max(0, get<number>('wheel_last_config', 0)), configs.length - 1)
  return { configs, historyMap, lastIdx }
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

export default function Wheel() {
  const initRef = useRef<ReturnType<typeof loadWheelState> | null>(null)
  if (!initRef.current) initRef.current = loadWheelState()

  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [configs, setConfigs] = useState<WheelConfig[]>(initRef.current.configs)
  const [historyMap, setHistoryMap] = useState<HistoryMap>(initRef.current.historyMap)
  const [activeIndex, setActiveIndex] = useState(initRef.current.lastIdx)
  const [newItemText, setNewItemText] = useState('')
  const [seedText, setSeedText] = useState('')
  const [result, setResult] = useState('')
  const [wish, setWish] = useState('')
  /* 本次旋转实际采用的种子（没填就现场摇一个） */
  const [spinSeed, setSpinSeed] = useState(0)
  /* 历史记录区收纳开关（记住偏好） */
  const [historyOpen, setHistoryOpen] = useState(!get<boolean>('wheel_history_collapsed', false))

  const toggleHistory = () => {
    setHistoryOpen(v => {
      set('wheel_history_collapsed', !v)
      return !v
    })
  }

  const canvasRef = useRef<any>(null)
  const rotRef = useRef(0)
  const rafRef = useRef(0)
  const spinningRef = useRef(false)
  /* 上一次中奖下标：连续两次点 GO 结果不重复 */
  const lastWinRef = useRef(-1)
  const drawRef = useRef<((rot: number) => void) | null>(null)
  const configRef = useRef<WheelConfig | null>(null)
  const themeRef = useRef<BackgroundPreset>(theme)
  /* 拖拽转盘：画布尺寸/视口中心与拖拽瞬时状态 */
  const centerRef = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const dragRef = useRef({ active: false, lastAngle: 0, lastT: 0, vel: 0, moved: 0, startT: 0 })

  const config = configs[Math.min(activeIndex, configs.length - 1)]
  configRef.current = config
  themeRef.current = theme

  const totalWeight = config ? config.items.reduce((s, i) => s + i.weight, 0) : 0
  const history = (config && historyMap[config.id]) || []

  useEffect(() => {
    setSeedText(config ? config.seed : '')
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeIndex, configs])

  useDidShow(() => {
    setHistoryMap(get<HistoryMap>(HISTORY_KEY, {}))
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
    set(CONFIGS_KEY, next)
    set('wheel_last_config', active)
  }

  const updateItems = (updater: (items: WheelItem[]) => WheelItem[]) => {
    const next = configs.map((c, i) => (i === activeIndex ? { ...c, items: updater(c.items) } : c))
    setConfigs(next)
    set(CONFIGS_KEY, next)
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

    /* 中心 GO 与顶部指针直接画进 canvas：原生组件层级会把普通 View 盖住 */
    if (!spinningRef.current) {
      /* 奶白底座 */
      ctx.save()
      ctx.shadowColor = 'rgba(255, 112, 67, 0.35)'
      ctx.shadowBlur = 14
      ctx.shadowOffsetY = 6
      ctx.beginPath()
      ctx.arc(cx, cy, 54, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.restore()
      /* 暖阳珊瑚渐变主体 */
      const grad = ctx.createLinearGradient(cx - 44, cy - 44, cx + 44, cy + 44)
      grad.addColorStop(0, '#FFCC80')
      grad.addColorStop(0.55, '#FF9E80')
      grad.addColorStop(1, '#FF7043')
      ctx.beginPath()
      ctx.arc(cx, cy, 44, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      /* 高光小月牙 */
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, 34, Math.PI * 1.08, Math.PI * 1.42)
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '800 30px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('GO', cx, cy + 2)
    } else {
      ctx.beginPath()
      ctx.arc(cx, cy, 16, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
    }

    /* 顶部指针 */
    ctx.beginPath()
    ctx.moveTo(cx - 15, 2)
    ctx.lineTo(cx + 15, 2)
    ctx.lineTo(cx, 30)
    ctx.closePath()
    ctx.fillStyle = '#FF7043'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = 3
    ctx.stroke()
  }

  const setupCanvas = useCallback((cb: () => void) => {
    const query = Taro.createSelectorQuery()
    query
      .select('#wheelCanvas')
      .fields({ node: true, size: true, rect: true })
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
        if (typeof res[0].left === 'number') {
          centerRef.current = {
            x: res[0].left + w / 2,
            y: res[0].top + h / 2,
            w,
            h
          }
        }
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

  /* ---------- 物理拖动 ---------- */
  const angleOfTouch = (e: any): number => {
    const t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e.touches && e.touches[0]
    if (!t) return 0
    const c = centerRef.current
    /* 小程序 canvas 触摸事件的坐标是相对画布的 x/y；H5 只有视口坐标 clientX/clientY */
    if (typeof t.x === 'number' && typeof t.y === 'number') {
      return Math.atan2(t.y - c.h / 2, t.x - c.w / 2)
    }
    if (typeof t.clientX === 'number' && typeof t.clientY === 'number') {
      return Math.atan2(t.clientY - c.y, t.clientX - c.x)
    }
    return 0
  }

  const handleWheelTouchStart = (e: any) => {
    if (spinningRef.current) return
    const d = dragRef.current
    d.active = true
    d.lastAngle = angleOfTouch(e)
    d.startT = d.lastT = Date.now()
    d.vel = 0
    d.moved = 0
  }

  const handleWheelTouchMove = (e: any) => {
    const d = dragRef.current
    if (!d.active || spinningRef.current) return
    const a = angleOfTouch(e)
    let delta = a - d.lastAngle
    if (delta > Math.PI) delta -= Math.PI * 2
    else if (delta < -Math.PI) delta += Math.PI * 2
    const now = Date.now()
    const dt = Math.max(1, now - d.lastT)
    rotRef.current += delta
    d.moved += Math.abs(delta)
    d.vel = d.vel * 0.6 + (delta / dt) * 0.4
    d.lastAngle = a
    d.lastT = now
    if (drawRef.current) drawRef.current(rotRef.current)
  }

  const handleWheelTouchEnd = () => {
    const d = dragRef.current
    if (!d.active) return
    d.active = false
    if (spinningRef.current) return
    const dur = Date.now() - d.startT
    /* 几乎没动 → 视作点按 GO */
    if (d.moved < 0.06 && dur < 350) {
      spin(1)
      return
    }
    /* 甩得够快才触发挥霍旋转；慢速拖动只把盘留在原地 */
    if (Math.abs(d.vel) > 0.004) {
      spin(d.vel >= 0 ? 1 : -1)
    }
  }

  const handleWheelTouchCancel = () => {
    dragRef.current.active = false
  }

  /* ---------- 旋转（dir: 1 顺时针 / -1 逆时针，跟随甩动方向） ---------- */
  const spin = (dir: number = 1) => {
    if (spinningRef.current) return
    const items = config ? config.items : []
    if (items.length < 2) {
      Taro.showToast({ title: '至少需要 2 个选项', icon: 'none' })
      return
    }

    const run = () => {
      spinningRef.current = true
      setResult('')
      setWish(randomOf(WHEEL_WISHES))

      const tw = items.reduce((s, i) => s + i.weight, 0)
      /* 没填种子就现场摇一个（与手填同量级的小数字），本次结果同样可复现 */
      const seedNum = Number(seedText)
      const seedValue =
        seedText !== '' && !Number.isNaN(seedNum) && seedNum > 0
          ? Math.floor(seedNum)
          : Math.floor(Math.random() * 999) + 1
      const rng = mulberry32(seedValue)
      setSpinSeed(seedValue)

      const pickIndex = (): number => {
        let r = rng() * tw
        let idx = 0
        for (let i = 0; i < items.length; i++) {
          r -= items[i].weight
          if (r < 0) {
            idx = i
            break
          }
        }
        return idx
      }

      /* 和上一次结果相同就重新随机，保证每次转动都有变化 */
      let targetIndex = pickIndex()
      let guard = 0
      while (items.length > 1 && targetIndex === lastWinRef.current && guard < 24) {
        targetIndex = pickIndex()
        guard++
      }
      lastWinRef.current = targetIndex

      let cumWeight = 0
      for (let i = 0; i < targetIndex; i++) cumWeight += items[i].weight
      const sweep = (Math.PI * 2 * items[targetIndex].weight) / tw
      const sectorStart = (Math.PI * 2 * cumWeight) / tw
      const mid = sectorStart + sweep / 2
      const jitterRatio = rng()
      const jitter = (jitterRatio - 0.5) * sweep * 0.8

      const startRot = rotRef.current
      let delta = -Math.PI / 2 - (mid + jitter) - startRot
      if (dir >= 0) {
        while (delta < Math.PI * 10) delta += Math.PI * 2
      } else {
        while (delta > -Math.PI * 10) delta -= Math.PI * 2
      }
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
          const winner = items[targetIndex].text
          setResult(winner)
          const cfg = configRef.current
          if (cfg) {
            const cur = get<HistoryMap>(HISTORY_KEY, {})
            const nextList = [
              { ts: Date.now(), config: cfg.name, result: winner, seed: seedValue },
              ...(cur[cfg.id] || [])
            ].slice(0, 100)
            const nextMap = { ...cur, [cfg.id]: nextList }
            set(HISTORY_KEY, nextMap)
            setHistoryMap(nextMap)
          }
          /* 结束后重绘一次，把中心 GO 画回来 */
          if (drawRef.current) drawRef.current(rotRef.current)
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

  /* ---------- 场景包：一键装入预设选项 ---------- */
  const applyScene = (sceneId: string) => {
    const scene = WHEEL_SCENES.find(x => x.id === sceneId)
    if (!scene) return
    const next = configs.map((c, i) =>
      i === activeIndex
        ? { ...c, name: scene.name, items: scene.options.map(t => ({ text: t, weight: WEIGHT_DEFAULT })) }
        : c
    )
    setConfigs(next)
    set(CONFIGS_KEY, next)
    Taro.showToast({ title: `已装上「${scene.name}」`, icon: 'none', duration: 1400 })
  }

  /* ---------- 方案管理 ---------- */
  const switchConfig = (index: number) => {
    if (spinningRef.current) return
    setActiveIndex(index)
    set('wheel_last_config', index)
    setResult('')
    setSeedText(configs[index].seed)
    /* 换了方案，上次结果作废，不参与去重 */
    lastWinRef.current = -1
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
        const next = [...configs, { id: genId(), name, items: [], seed: '' }]
        persistConfigs(next, next.length - 1)
        setResult('')
      }
    }
    Taro.showModal(opts)
  }

  /* 长按方案名重命名 */
  const renameConfig = (index: number) => {
    if (spinningRef.current) return
    /* editable 为基础库 2.17.1+ 扩展参数，Taro 类型定义未覆盖 */
    const opts: any = {
      title: '重命名方案',
      editable: true,
      content: configs[index].name,
      success: (res: any) => {
        if (!res.confirm) return
        const name = (res.content || '').trim()
        if (!name || name === configs[index].name) return
        const next = configs.map((c, i) => (i === index ? { ...c, name } : c))
        setConfigs(next)
        set(CONFIGS_KEY, next)
        Taro.showToast({ title: '已重命名', icon: 'success' })
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
        const removedId = configs[index].id
        const next = configs.filter((_, i) => i !== index)
        const nextActive = index < activeIndex ? activeIndex - 1 : Math.min(activeIndex, next.length - 1)
        persistConfigs(next, nextActive)
        /* 方案没了，它的历史记录也一起清掉 */
        const nextMap = { ...historyMap }
        delete nextMap[removedId]
        set(HISTORY_KEY, nextMap)
        setHistoryMap(nextMap)
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
    set(CONFIGS_KEY, next)
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
        id: genId(),
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
      const next = [...configs, { id: genId(), name, items, seed: String((payload && payload.seed) || '') }]
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

      {/* ---------- 场景包 ---------- */}
      <ScrollView className='wheel-scenes' scrollX enhanced showScrollbar={false}>
        {WHEEL_SCENES.map(sc => (
          <View key={sc.id} className='wheel-scene' onClick={() => applyScene(sc.id)}>
            <Text className='wheel-scene-icon'>{sc.icon}</Text>
            <Text className='wheel-scene-name'>{sc.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ---------- 方案 Tab ---------- */}
      <ScrollView className='wheel-tabs' scrollX enhanced showScrollbar={false}>
        {configs.map((c, i) => (
          <View
            key={c.id}
            className={`wheel-tab ${i === activeIndex ? 'wheel-tab--active' : ''}`}
            onClick={() => switchConfig(i)}
            onLongPress={() => renameConfig(i)}
          >
            {c.name}
            <Text
              className='wheel-tab-del'
              onClick={e => {
                e.stopPropagation()
                removeConfig(i)
              }}
            >
              ×
            </Text>
          </View>
        ))}
        <View className='wheel-tab wheel-tab--new' onClick={createConfig}>
          ＋新建
        </View>
      </ScrollView>

      {/* ---------- 转盘（支持拖动甩动 / 点按启动） ---------- */}
      <View className='wheel-stage'>
        <Canvas
          type='2d'
          id='wheelCanvas'
          className='wheel-canvas'
          onTouchStart={handleWheelTouchStart}
          onTouchMove={handleWheelTouchMove}
          onTouchEnd={handleWheelTouchEnd}
          onTouchCancel={handleWheelTouchCancel}
        />
      </View>

      {/* ---------- 结果 ---------- */}
      <View className={`wheel-result ${result !== '' ? 'wheel-result--show' : ''}`}>
        {result !== '' ? (
          <>
            <Text className='wheel-result-label'>转盘替你选了</Text>
            <Text className='wheel-result-text'>{result}</Text>
            {spinSeed > 0 && <Text className='wheel-result-seed'>🌱 本次种子 {spinSeed}</Text>}
          </>
        ) : (
          <Text className='wheel-result-idle'>
            {wish !== '' ? wish : '点 GO 或甩动转盘开始'}
          </Text>
        )}
      </View>

      {/* ---------- 种子 ---------- */}
      <View className='wheel-seed-row'>
        <Input
          className='wheel-seed-input'
          type='number'
          value={seedText}
          placeholder='埋下种子许个愿'
          onInput={e => setSeed(e.detail.value)}
        />
        <View
          className='wheel-seed-random'
          onClick={() => setSeed(String(Math.floor(Math.random() * 999) + 1))}
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

      {/* ---------- 历史记录（仅当前方案，可收纳） ---------- */}
      <View className='wheel-section-label'>
        <View className='wheel-history-title' onClick={toggleHistory}>
          <Text>历史记录 · {history.length}</Text>
          <Text className={`wheel-history-toggle ${historyOpen ? 'wheel-history-toggle--open' : ''}`}>
            ▾
          </Text>
        </View>
        <Text className='wheel-history-more' onClick={goHistory}>
          查看全部 ›
        </Text>
      </View>
      {historyOpen &&
        (history.length > 0 ? (
          <View className='wheel-history-list'>
            {history.slice(0, 8).map((h, i) => (
              <View key={`${h.ts}-${i}`} className='wheel-history-item'>
                <View className='wheel-history-main'>
                  <Text className='wheel-history-result'>{h.result}</Text>
                </View>
                <Text className='wheel-history-time'>{formatTime(h.ts)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className='wheel-items-empty'>当前方案还没有记录，转一次试试</View>
        ))}

      <View className='wheel-tip'>
        点 GO 或快速甩动转盘开始 · 长按选项可删除 · 长按方案名可重命名
      </View>
    </View>
  )
}
