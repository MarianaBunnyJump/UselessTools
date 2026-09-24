import { View, Text, Canvas, Button, Image } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow, useDidHide } from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { TOOLS, type ToolMeta } from '../../data/tools'
import { SLOGANS } from '../../data/slogans'
import { HAPPY_QUIPS } from '../../data/happyQuips'
import { SHARE_PHRASES } from '../../data/sharePhrases'
import { PATTERNS, getPatternConfig, renderPattern } from '../../data/patterns'
import { DRAG_CONFIG } from '../../data/dragConfig'
import { getTheme, type BackgroundPreset } from '../../utils/theme'
import { get, set, addTotalCount } from '../../utils/storage'
import { getHomeOrder, saveHomeOrder } from '../../utils/homeOrder'
import { hitSlot, moveItem, VxTracker, tiltTowards } from '../../utils/dragSort'
import { getSkinById, getActiveSkinId, getPreviewSkinId, setPreviewSkinId, SKIN_EVENT, SKIN_PREVIEW_EVENT, type SkinDefinition, type SkinSlot } from '../../skins/registry'
import { getWorkPoints, getWorkLevel, getLevelTitle, getSelectedTitlePrefix, TITLE_PREFIX_EVENT } from '../../skins/workPoints'
import { startSkinFx, type SkinFxHandle } from '../../utils/skinFx'
import { track } from '../../utils/analytics'
import ToolCard, { type CardState } from '../../components/ToolCard'
import Onboarding from './onboarding'
import './index.scss'

interface ConfettiPiece {
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  rot: number
  vr: number
  color: string
  sway: number
  phase: number
}

const CONFETTI_COLORS = [
  '#FF8A80', '#FFB74D', '#FFD54F', '#A5D6A7', '#81D4FA', '#B39DDB', '#F48FB1', '#FFAB91'
]

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

/* ---- 拖动上下文（高频数据走 ref，状态机走 state）---- */
type DragPhase = 'idle' | 'pressing' | 'grabbed' | 'dragging' | 'settling'

interface DragGeom {
  gridX: number      /* 容器 viewport 系偏移（抓起时查询） */
  gridY: number
}

interface GridMetrics {
  gridW: number
  cardW: number
  cardH: number
  rowGap: number      /* 24 设计 px 换算 */
  bottomPad: number
}

export default function Index() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [guestNickname, setGuestNickname] = useState(() => get<string>('user_nickname', ''))
  const [slogan, setSlogan] = useState(SLOGANS[dayOfYear() % SLOGANS.length])

  /* 分享按钮：每次随机一句俏皮话推荐 */
  useShareAppMessage(() => ({
    title: SHARE_PHRASES[Math.floor(Math.random() * SHARE_PHRASES.length)],
    path: '/pages/index/index'
  }))

  const [openingId, setOpeningId] = useState('')
  /* 工局等级条（原在设置页，移到首页；可收起，状态落存储） */
  const [points, setPoints] = useState(getWorkPoints())
  const [titlePrefix, setTitlePrefix] = useState(() => getSelectedTitlePrefix(getWorkLevel(getWorkPoints()).level))
  const [levelFolded, setLevelFolded] = useState(() => get<boolean>('home_level_folded', false))
  /* 设置按钮固定在左上角（避开微信胶囊区域）；H5 用固定值兜底 */
  const [layout, setLayout] = useState({ gearTop: 40, headerPad: 60 })
  /* 彩带画布尺寸用真实 px：小程序 inline style 的 vh 不可靠，半屏设置会失效 */
  const [confettiSize, setConfettiSize] = useState({ w: 375, h: 400 })

  /* ---------- 排序与拖动 ---------- */
  const [order, setOrder] = useState<string[]>(() => getHomeOrder())
  const [phase, setPhase] = useState<DragPhase>('idle')
  const [dragId, setDragId] = useState('')
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [tiltDeg, setTiltDeg] = useState(0)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [pinPulseId, setPinPulseId] = useState('')
  const [hintVisible, setHintVisible] = useState(() => !get<boolean>('drag_hint_done', false))
  /* 首次导引：未看过显示；about 页「再看一遍」通过 onboarding_replay 一次性旗标重放（重放不写完成标记） */
  const [showOnboarding, setShowOnboarding] = useState(() => !get<boolean>('onboarding_done', false))
  const onboardingReplayRef = useRef(false)
  const [metrics, setMetrics] = useState<GridMetrics | null>(null)
  /* 落地反馈（弹跳+震动），设置可关；返回首页时从存储刷新 */
  const [dropFeedback, setDropFeedback] = useState(() => get<boolean>('drop_feedback_enabled', true))
  /* 皮肤：设置页切换后通过 SKIN_EVENT 热更新，返回首页也会刷新 */
  const [skinId, setSkinId] = useState(getActiveSkinId())
  /* 工坊「预览」：临时渲染未解锁皮肤，不写存储；由首页提示条退出或真实切换覆盖 */
  const [previewId, setPreviewId] = useState(getPreviewSkinId())
  /* 页面隐藏时置 false：停掉粒子/彩带循环，避免后台页占满 JS 线程把其它页面卡死 */
  const [fxActive, setFxActive] = useState(true)
  /* 树景在网格外的离屏 Canvas 绘制并导出图片；网格内始终只有普通 Image 与卡片 */
  const [treeImage, setTreeImage] = useState<{ key: string; src: string } | null>(null)
  const [treeImageFailedKey, setTreeImageFailedKey] = useState('')

  const canvasRef = useRef<any>(null)
  const ctxRef = useRef<any>(null)
  const piecesRef = useRef<ConfettiPiece[]>([])
  const loopActiveRef = useRef(false)
  const lastTsRef = useRef(0)

  /* 拖动 refs：事件回调里读写，避免闭包过期 */
  const phaseRef = useRef<DragPhase>('idle')
  const pressTimer = useRef<any>(null)
  const settleTimer = useRef<any>(null)
  const touchIdRef = useRef<number>(-1)
  const startRef = useRef({ x: 0, y: 0 })
  const geomRef = useRef<DragGeom | null>(null)
  const dragStartSlotRef = useRef<{ x: number; y: number; scale: number } | null>(null)
  const vxRef = useRef(new VxTracker(DRAG_CONFIG.speedSamples))
  const orderChangedRef = useRef(false)
  const hintRef = useRef(!get<boolean>('drag_hint_done', false))
  const dragIdRef = useRef('')
  const orderRef = useRef<string[]>(order)
  const metricsRef = useRef<GridMetrics | null>(null)
  const slotsRef = useRef<SkinSlot[]>([])
  const openingRef = useRef('')
  const containerHRef = useRef(0)
  const dropFeedbackRef = useRef(dropFeedback)
  const skinIdRef = useRef(skinId)
  const skinFxRef = useRef<SkinFxHandle | null>(null)
  const skinCanvasRef = useRef<{ node: any; w: number; h: number } | null>(null)
  /* 当前生效皮肤（含预览）：供事件回调读取最新值 */
  const activeSkinRef = useRef<SkinDefinition | null>(null)

  /* 预览优先于正式皮肤（预览不落存储） */
  const activeSkin: SkinDefinition = useMemo(() => getSkinById(previewId || skinId), [previewId, skinId])

  const setPhaseBoth = (p: DragPhase) => {
    phaseRef.current = p
    setPhase(p)
  }

  const toolsOrdered = useMemo(
    () => order.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolMeta[],
    [order]
  )

  /* 槽位：由当前皮肤决定（网格两列 / 树挂锚点 / 星夜散落），只与数量和尺寸相关 */
  const slots = useMemo(() => {
    if (!metrics) return []
    return activeSkin.slots(order.length, metrics.gridW, metrics.cardW, metrics.cardH, metrics.rowGap)
  }, [metrics, order.length, activeSkin])

  const containerH = useMemo(() => {
    if (!metrics || slots.length === 0) return 0
    const maxY = Math.max(...slots.map(s => s.y + metrics.cardH * (s.scale || 1)))
    return maxY + metrics.bottomPad
  }, [metrics, slots])

  /* 非拖动卡片的静止视图：引用稳定，配合 ToolCard 的 memo 跳过触摸帧重渲染 */
  const idleViews = useMemo(
    () => slots.map(s => ({ translate: { x: s.x, y: s.y }, scale: s.scale || 1, rotate: s.rotate || 0, z: s.z })),
    [slots]
  )

  useEffect(() => {
    slotsRef.current = slots
  }, [slots])
  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])
  useEffect(() => {
    orderRef.current = order
  }, [order])
  useEffect(() => {
    openingRef.current = openingId
  }, [openingId])
  useEffect(() => {
    containerHRef.current = containerH
  }, [containerH])
  useEffect(() => {
    skinIdRef.current = skinId
  }, [skinId])
  useEffect(() => {
    activeSkinRef.current = activeSkin
  }, [activeSkin])

  /* 皮肤切换事件：设置页触发，热更新槽位与背景（真实切换同时清除预览） */
  useEffect(() => {
    const listener = (id: string) => {
      skinIdRef.current = id
      setPreviewSkinId('')
      setPreviewId('')
      setSkinId(id)
    }
    Taro.eventCenter.on(SKIN_EVENT, listener)
    const previewListener = (id: string) => setPreviewId(id || '')
    Taro.eventCenter.on(SKIN_PREVIEW_EVENT, previewListener)
    return () => {
      Taro.eventCenter.off(SKIN_EVENT, listener)
      Taro.eventCenter.off(SKIN_PREVIEW_EVENT, previewListener)
    }
  }, [])

  /* ---------- 首帧尺寸标定：真实卡片宽高反推槽位（兼容安卓字体高度差异） ---------- */
  useEffect(() => {
    try {
      const info = Taro.getSystemInfoSync()
      const sbh = info.statusBarHeight || 20
      /* home-root 的 padding-top: 20(设计px) 折算成真实 px，按钮定位相对 home-header */
      const rootPad = (20 * (info.windowWidth || 375)) / 750
      let gearTop = sbh + 8 - rootPad
      let headerPad = sbh + 48 - rootPad
      if (process.env.TARO_ENV === 'weapp' && Taro.getMenuButtonBoundingClientRect) {
        const menu = Taro.getMenuButtonBoundingClientRect()
        if (menu && menu.top > 0 && menu.height > 0) {
          /* 齿轮 CSS 高 72(设计px) 折算真实 px，与胶囊垂直居中对齐 */
          const gearSize = (72 * (info.windowWidth || 375)) / 750
          gearTop = menu.top + (menu.height - gearSize) / 2 - rootPad
          headerPad = Math.max(menu.bottom + 12 - rootPad, sbh + 48)
        }
      }
      setLayout({ gearTop, headerPad })
      setConfettiSize({
        w: info.windowWidth || 375,
        h: Math.round((info.windowHeight || 800) * 0.5)
      })
    } catch (e) {
      /* 默认值兜底 */
    }

    const query = Taro.createSelectorQuery()
    query.select('.home-grid').boundingClientRect()
    query.select('.tool-card').boundingClientRect()
    query.exec(res => {
      const grid = res && res[0]
      const card = res && res[1]
      if (!grid || !card || !(card.width > 0)) return
      const windowW = (Taro.getSystemInfoSync().windowWidth) || grid.width
      const scale = windowW / 750
      setMetrics({
        gridW: grid.width,
        cardW: card.width,
        cardH: card.height,
        rowGap: 24 * scale,
        bottomPad: 30 * scale
      })
    })
    return () => {
      clearTimeout(pressTimer.current)
      clearTimeout(settleTimer.current)
    }
  }, [])

  /* ---------- 背景印花 ---------- */
  /* 缓存画布节点：设置页触发重绘时本页不在栈顶，
     createSelectorQuery 会查到设置页上下文而找不到 #patternCanvas，导致印花永不更新 */
  const patternCanvasRef = useRef<{ node: any; w: number; h: number } | null>(null)

  const renderToPatternCanvas = (canvas: any, w: number, h: number) => {
    let dpr = 2
    let winW = 375
    try {
      const info = Taro.getSystemInfoSync()
      dpr = info.pixelRatio || 2
      winW = info.windowWidth || 375
    } catch (e) {
      /* 默认值兜底 */
    }
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cfg = getPatternConfig()
    const pattern = PATTERNS.find(p => p.id === cfg.id)
    if (!pattern) {
      ctx.clearRect(0, 0, w, h)
      return
    }
    const scale = winW / 750
    renderPattern(ctx, w, h, pattern, {
      size: cfg.size * scale,
      gap: cfg.gap * scale,
      opacity: cfg.opacity,
      color: getTheme().accent
    })
  }

  const drawPattern = useCallback(() => {
    /* 皮肤自带背景时不画印花，保持画布透明（由皮肤画布接管）；预览态同样生效 */
    if (activeSkinRef.current?.hidePattern) return
    const cached = patternCanvasRef.current
    if (cached) {
      renderToPatternCanvas(cached.node, cached.w, cached.h)
      return
    }
    const query = Taro.createSelectorQuery()
    query
      .select('#patternCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (!res || !res[0] || !res[0].node) return
        patternCanvasRef.current = { node: res[0].node, w: res[0].width, h: res[0].height }
        renderToPatternCanvas(res[0].node, res[0].width, res[0].height)
      })
  }, [])

  /* 印花 Canvas 挂载后再查询绘制 */
  useEffect(() => {
    const timer = setTimeout(drawPattern, 80)
    return () => clearTimeout(timer)
  }, [drawPattern])

  /* 皮肤切换后：自带背景时清掉全屏印花画布残留，否则照常画印花 */
  useEffect(() => {
    const cached = patternCanvasRef.current
    if (activeSkin.hidePattern) {
      if (cached) {
        const ctx = cached.node.getContext('2d')
        ctx.clearRect(0, 0, cached.w, cached.h)
      }
    } else {
      drawPattern()
    }
  }, [activeSkin, drawPattern])

  const treeImageKey = activeSkin.id === 'tree' && metrics && containerH
    ? `${metrics.gridW}:${containerH}` : ''
  const treeImageReady = Boolean(treeImageKey && treeImage?.key === treeImageKey)
  const treeImageFailed = Boolean(treeImageKey && treeImageFailedKey === treeImageKey)

  /* 树景用网格外的独立画布烘焙成图片；其他皮肤继续在网格内播放粒子。
   * fxActive=false（页面被设置页覆盖等）时只画一帧静态，循环停掉——
   * 常驻 60fps 循环会在后台页继续跑，占满 JS 线程导致全局卡顿 */
  useEffect(() => {
    if (!activeSkin.draw || !metrics || containerH <= 0 || treeImageReady || treeImageFailed) {
      skinCanvasRef.current = null
      return
    }
    let destroyed = false

    const boot = (canvas: any, w: number, h: number) => {
      if (destroyed) return
      let dpr = 2
      try {
        dpr = Taro.getSystemInfoSync().pixelRatio || 2
      } catch (e) {
        /* 默认值兜底 */
      }
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const drawFn = activeSkin.draw
      const staticDraw = drawFn ? () => drawFn(ctx, w, h) : undefined
      skinFxRef.current?.stop()
      skinFxRef.current = null
      if (activeSkin.id === 'tree' && staticDraw) {
        /* 树景只绘制一次并导出：不把原生 Canvas 留在卡片上方。 */
        staticDraw()
        Taro.canvasToTempFilePath({ canvas, success: res => {
          if (destroyed) return
          if (res.tempFilePath) setTreeImage({ key: treeImageKey, src: res.tempFilePath })
          else setTreeImageFailedKey(treeImageKey)
        }, fail: () => {
          if (!destroyed) setTreeImageFailedKey(treeImageKey)
        } })
      } else if (fxActive) {
        const fxType = activeSkin.particles === 'twinkle' ? 'twinkle' : activeSkin.particles === 'confetti' ? 'confetti' : 'snow'
        skinFxRef.current = startSkinFx(canvas, ctx, w, h, fxType, staticDraw)
      } else if (staticDraw) {
        staticDraw()
      }
    }

    /* 树景画布与其他皮肤画布按皮肤切换挂载，不能复用已脱离页面的节点。 */
    skinCanvasRef.current = null
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query
        .select('#skinCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          if (destroyed) return
          if (!res?.[0]?.node) {
            if (activeSkin.id === 'tree') setTreeImageFailedKey(treeImageKey)
            return
          }
          const entry = { node: res[0].node, w: res[0].width, h: res[0].height }
          skinCanvasRef.current = entry
          boot(entry.node, entry.w, entry.h)
        })
    }, 80)
    return () => {
      destroyed = true
      clearTimeout(timer)
      skinFxRef.current?.stop()
      skinFxRef.current = null
    }
  }, [activeSkin, metrics, containerH, fxActive, treeImageKey, treeImageReady, treeImageFailed])

  useEffect(() => {
    const listener = (bg: BackgroundPreset) => {
      setTh(bg)
      /* 主题色变了，印花跟着重绘 */
      drawPattern()
    }
    Taro.eventCenter.on('theme-changed', listener)
    const patternListener = () => drawPattern()
    Taro.eventCenter.on('pattern-changed', patternListener)
    return () => {
      Taro.eventCenter.off('theme-changed', listener)
      Taro.eventCenter.off('pattern-changed', patternListener)
      loopActiveRef.current = false
    }
  }, [drawPattern])

  /* 等级页选择后即刻同步标题；返回页面时仍从本机存储校准。 */
  useEffect(() => {
    const listener = (prefix: string) => setTitlePrefix(prefix)
    Taro.eventCenter.on(TITLE_PREFIX_EVENT, listener)
    return () => { Taro.eventCenter.off(TITLE_PREFIX_EVENT, listener) }
  }, [])

  /* ---------- 彩带：数量收敛、慢速飘落、半屏渐隐 ---------- */
  const makePieces = (w: number, h: number): ConfettiPiece[] => {
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 55; i++) {
      pieces.push({
        x: 14 + Math.random() * (w - 28),
        y: -20 - Math.random() * h * 0.4,
        w: 7 + Math.random() * 6,
        h: 9 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: 2.4 + Math.random() * 1.8,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.24,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        sway: 0.6 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2
      })
    }
    return pieces
  }

  /* 画布常驻（透明不挡点击），就绪后初始化一次 2D 上下文 */
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query
        .select('#confettiCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res || !res[0] || !res[0].node) return
          const canvas = res[0].node
          let dpr = 2
          try {
            dpr = Taro.getSystemInfoSync().pixelRatio || 2
          } catch (e) {
            /* 默认值兜底 */
          }
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          const ctx = canvas.getContext('2d')
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          canvasRef.current = canvas
          ctxRef.current = ctx
        })
    }, 80)
    return () => clearTimeout(timer)
  }, [confettiSize])

  const handleTitleTap = () => {
    if (getWorkLevel(getWorkPoints()).level < 5) return
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const w = confettiSize.w
    const h = confettiSize.h
    /* H5 画布节点没有 requestAnimationFrame，退化为定时器 */
    const raf = (fn: () => void) => {
      if (typeof canvas.requestAnimationFrame === 'function') {
        canvas.requestAnimationFrame(fn)
      } else {
        setTimeout(fn, 16)
      }
    }

    if (loopActiveRef.current) {
      /* 连点不叠加动画循环：把还没落完的旧彩带和新一波合并 */
      piecesRef.current = [...piecesRef.current.filter(p => p.y < h), ...makePieces(w, h)]
      return
    }

    piecesRef.current = makePieces(w, h)
    loopActiveRef.current = true
    lastTsRef.current = Date.now()

    const render = () => {
      if (!loopActiveRef.current) return
      /* 按真实时间差推进，帧率不稳或连点时速度都一致 */
      const now = Date.now()
      const k = Math.min(50, now - lastTsRef.current) / 16.67
      lastTsRef.current = now
      ctx.clearRect(0, 0, w, h)
      let alive = false
      piecesRef.current.forEach(p => {
        if (p.y > h + 24) return
        alive = true
        p.phase += 0.055 * k
        p.x += (p.vx + Math.sin(p.phase) * p.sway) * k
        p.y += p.vy * k
        p.rot += p.vr * k
        /* 转动的纸片贴屏幕边缘会被切成半截，碰壁就弹回来 */
        if (p.x < 12) {
          p.x = 12
          p.vx = Math.abs(p.vx)
        } else if (p.x > w - 12) {
          p.x = w - 12
          p.vx = -Math.abs(p.vx)
        }
        /* 靠近画布底边渐隐，消除半屏处的生硬截断 */
        const alpha = Math.min(1, Math.max(0, (h - p.y) / 90))
        if (alpha <= 0) return
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive) {
        raf(render)
      } else {
        loopActiveRef.current = false
        ctx.clearRect(0, 0, w, h)
      }
    }
    raf(render)
  }

  const handleSloganTap = () => {
    let next = slogan
    while (next === slogan) {
      next = HAPPY_QUIPS[Math.floor(Math.random() * HAPPY_QUIPS.length)]
    }
    setSlogan(next)
  }

  /* ---------- 工局等级条 ---------- */
  const level = getWorkLevel(points)
  const levelPct = level.nextAt > level.curBase
    ? Math.min(100, Math.round(((points - level.curBase) / (level.nextAt - level.curBase)) * 100))
    : 100

  const toggleLevelFold = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setLevelFolded(v => {
      set('home_level_folded', !v)
      return !v
    })
  }

  const openLevelPage = () => {
    Taro.navigateTo({ url: '/pages/level/index' })
  }

  /* 退出皮肤预览：还原正式皮肤（预览态不落存储） */
  const exitPreview = () => {
    setPreviewSkinId('')
    setPreviewId('')
    track('skin_preview', { exit: true })
  }

  const handleOpen = useCallback((tool: ToolMeta) => {
    /* 拖动中（多指场景）忽略卡片点击 */
    if (phaseRef.current !== 'idle' || openingRef.current) return
    openingRef.current = tool.id
    setOpeningId(tool.id)
    addTotalCount(`usage_${tool.id}`)
    track('tool_open', { tool_id: tool.id })
    setTimeout(() => {
      Taro.navigateTo({ url: tool.path })
      setTimeout(() => {
        openingRef.current = ''
        setOpeningId('')
      }, 500)
    }, 480)
  }, [])

  const handleLongPress = useCallback((_tool: ToolMeta) => {
    /* 长按简介弹窗已按用户要求移除：长按不再弹「打开过几次」提示框 */
  }, [])

  /* ---------- 提示气泡 ---------- */
  const dismissHint = useCallback((by: string) => {
    if (!hintRef.current) return
    hintRef.current = false
    setHintVisible(false)
    set('drag_hint_done', true)
    track('hint_dismiss', { by })
  }, [])

  /* ---------- 首次导引 ---------- */
  const handleOnboardingFinish = useCallback((by: 'finish' | 'skip') => {
    setShowOnboarding(false)
    if (!onboardingReplayRef.current) {
      set('onboarding_done', true)
    }
    onboardingReplayRef.current = false
    track(by === 'finish' ? 'onboarding_finish' : 'onboarding_skip')
  }, [])

  /* ---------- 长按拖动状态机 ---------- */
  const handleGrabStart = useCallback((tool: ToolMeta, e: any) => {
    if (phaseRef.current !== 'idle' || openingRef.current || !metricsRef.current) return
    const t = e.touches && e.touches[0]
    if (!t) return
    if (typeof e.preventDefault === 'function') {
      try { e.preventDefault() } catch (err) { /* 忽略 */ }
    }
    touchIdRef.current = t.identifier || 0
    startRef.current = { x: t.clientX, y: t.clientY }
    dragIdRef.current = tool.id
    setDragId(tool.id)
    setPhaseBoth('pressing')

    /* 立即查询卡片与容器的实时位置（viewport 系），350ms 计时结束前就绪 */
    geomRef.current = null
    dragStartSlotRef.current = null
    const query = Taro.createSelectorQuery()
    query.select('.home-grid').boundingClientRect()
    query.select(`#tc-${tool.id}`).boundingClientRect()
    query.exec(res => {
      const grid = res && res[0]
      const card = res && res[1]
      if (!grid || !card) {
        geomRef.current = null
        return
      }
      geomRef.current = { gridX: grid.left, gridY: grid.top }
    })

    pressTimer.current = setTimeout(() => {
      if (phaseRef.current !== 'pressing' || !geomRef.current) return
      const idx = orderRef.current.indexOf(dragIdRef.current)
      const slot = slotsRef.current[idx]
      if (!slot) return
      dragStartSlotRef.current = { x: slot.x, y: slot.y, scale: slot.scale || 1 }
      setDragPos({ x: slot.x, y: slot.y })
      /* 外层以左上角缩放；旋转中心需将屏幕触点换回卡片本地坐标。 */
      const scale = slot.scale || 1
      setOrigin({
        x: (startRef.current.x - geomRef.current.gridX - slot.x) / scale,
        y: (startRef.current.y - geomRef.current.gridY - slot.y) / scale
      })
      setTiltDeg(0)
      vxRef.current.reset()
      setPhaseBoth('grabbed')
      /* 抓起不弹不震：顿挫感移除，爽感集中在松手落地（finishDrag） */
    }, DRAG_CONFIG.pressActivateMs)
  }, [])

  const handleGrabMove = useCallback((e: any) => {
    const p = phaseRef.current
    if (p !== 'pressing' && p !== 'grabbed' && p !== 'dragging') return
    const m = metricsRef.current
    if (!m) return
    const touches = e.touches || []
    const t = touches.find((tt: any) => tt.identifier === touchIdRef.current) || touches[0]
    if (!t) return

    const dx = t.clientX - startRef.current.x
    const dy = t.clientY - startRef.current.y

    if (p === 'pressing') {
      /* 激活前滑走即取消计时 */
      if (Math.hypot(dx, dy) > DRAG_CONFIG.pressCancelDist) {
        clearTimeout(pressTimer.current)
        setPhaseBoth('idle')
      }
      return
    }

    const initialSlot = dragStartSlotRef.current
    if (!initialSlot) return
    if (typeof e.preventDefault === 'function') {
      try { e.preventDefault() } catch (err) { /* 忽略 */ }
    }
    if (p === 'grabbed') setPhaseBoth('dragging')

    /* 直接以抓取时槽位为锚点累加手指位移，避免旋转后 boundingRect 变宽导致跳位。 */
    const idx = orderRef.current.indexOf(dragIdRef.current)
    const cardW = m.cardW * initialSlot.scale
    const cardH = m.cardH * initialSlot.scale
    let x = initialSlot.x + dx
    let y = initialSlot.y + dy
    const maxX = m.gridW - cardW + DRAG_CONFIG.clampOvershootPx
    const maxY = containerHRef.current - cardH + DRAG_CONFIG.clampOvershootPx
    x = Math.max(-DRAG_CONFIG.clampOvershootPx, Math.min(maxX, x))
    y = Math.max(-DRAG_CONFIG.clampOvershootPx, Math.min(maxY, y))
    setDragPos({ x, y })

    /* 惯性倾斜：变化小于阈值不更新状态，省一次渲染 */
    vxRef.current.push(Date.now(), t.clientX)
    setTiltDeg(prev => {
      const next = tiltTowards(prev, vxRef.current.get(), DRAG_CONFIG)
      return Math.abs(next - prev) < 0.08 ? prev : next
    })

    /* 让位判定：拖动卡中心进入某槽位矩形 → 实时重排 */
    if (idx < 0) return
    const center = { x: x + cardW / 2, y: y + cardH / 2 }
    const target = hitSlot(center, slotsRef.current, m.cardW, m.cardH, idx, DRAG_CONFIG.slotInsetPx)
    if (target >= 0) {
      const next = moveItem(orderRef.current, idx, target)
      if (next !== orderRef.current) {
        orderRef.current = next
        orderChangedRef.current = true
        setOrder(next)
      }
    }
  }, [])

  /* 松手：位移落位 + 惯性回转；落地压扁回弹与轻震动组成「放下」的爽感（设置可关） */
  const finishDrag = useCallback(() => {
    const p = phaseRef.current
    if (p !== 'grabbed' && p !== 'dragging') return
    const idx = orderRef.current.indexOf(dragIdRef.current)
    const slot = slotsRef.current[idx] || { x: 0, y: 0 }
    setDragPos({ x: slot.x, y: slot.y })
    setTiltDeg(0)
    setPhaseBoth('settling')
    if (dropFeedbackRef.current && process.env.TARO_ENV === 'weapp') {
      try {
        const r = Taro.vibrateShort({ type: 'light' } as any)
        if (r && typeof r.catch === 'function') r.catch(() => {})
      } catch (err) {
        /* 低版本基础库无 type 参数，忽略 */
      }
    }
    dragStartSlotRef.current = null
    if (orderChangedRef.current) {
      saveHomeOrder(orderRef.current)
      track('drag_reorder', { tool_id: dragIdRef.current })
      dismissHint('drag')
    }
    orderChangedRef.current = false
    settleTimer.current = setTimeout(() => {
      setPhaseBoth('idle')
      setOrigin(null)
    }, (activeSkinRef.current?.settleMs ?? DRAG_CONFIG.settleRotateMs) + 80)
  }, [dismissHint])

  const handleGrabEnd = useCallback((_e: any) => {
    clearTimeout(pressTimer.current)
    if (phaseRef.current === 'pressing') {
      setPhaseBoth('idle')
      return
    }
    finishDrag()
  }, [finishDrag])

  /* ---------- 置顶 ---------- */
  const handlePinTop = useCallback((tool: ToolMeta) => {
    if (phaseRef.current !== 'idle') return
    const next = [tool.id, ...orderRef.current.filter(id => id !== tool.id)]
    orderRef.current = next
    setOrder(next)
    saveHomeOrder(next)
    track('pin_top', { tool_id: tool.id })
    dismissHint('pin')
    setPinPulseId(tool.id)
    setTimeout(() => setPinPulseId(''), 450)
  }, [dismissHint])

  /* ---------- 埋点与生命周期 ---------- */
  useDidShow(() => {
    setGuestNickname(get<string>('user_nickname', ''))
    track('home_show')
    /* about 页「再看一遍导引」：消费一次性旗标，进入重放 */
    if (get<boolean>('onboarding_replay', false)) {
      set('onboarding_replay', false)
      onboardingReplayRef.current = true
      setShowOnboarding(true)
    }
    /* 从工具/设置页返回时刷新工分（等级条）与拖放反馈开关 */
    const latestPoints = getWorkPoints()
    setPoints(latestPoints)
    setTitlePrefix(getSelectedTitlePrefix(getWorkLevel(latestPoints).level))
    const df = get<boolean>('drop_feedback_enabled', true)
    dropFeedbackRef.current = df
    setDropFeedback(df)
    /* 回到前台：恢复粒子循环，并清掉隐藏时冻住的彩带残影 */
    setFxActive(true)
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, confettiSize.w, confettiSize.h)
    }
    piecesRef.current = []
  })
  useDidHide(() => {
    dismissHint('leave')
    /* 页面被覆盖（如进设置页）时停掉所有常驻动画循环——
       否则粒子循环在后台继续跑，占满 JS 线程导致设置页卡到动不了 */
    setFxActive(false)
    loopActiveRef.current = false
  })

  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' })
  }

  const goAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  const renderCard = (tool: ToolMeta, i: number) => {
    const active = tool.id === dragId && (phase === 'grabbed' || phase === 'dragging' || phase === 'settling')
    let state: CardState = 'idle'
    if (active) {
      state = phase === 'settling' ? 'settling' : phase === 'dragging' ? 'dragging' : 'grabbed'
    }
    /* 静止卡片取稳定引用（配合 memo 跳过触摸帧重渲染），拖动卡取实时位置 */
    const idle = idleViews[i] || { translate: { x: 0, y: 0 }, scale: 1, rotate: 0, z: i }
    const translate = active ? dragPos : idle.translate
    return (
      <ToolCard
        key={tool.id}
        tool={tool}
        opening={openingId === tool.id}
        state={state}
        pressing={phase === 'pressing' && tool.id === dragId}
        translate={translate}
        /* 皮肤画布在独立层叠上下文内，卡片只需保持同一上下文的前景层 */
        z={active ? 900 : 100 + idle.z}
        tiltDeg={active ? tiltDeg : idle.rotate}
        /* 卡片始终保持树挂尺寸；拖动只抬高层级和跟手，不再突然放大 */
        slotScale={idle.scale}
        origin={active ? origin : null}
        landEffect={dropFeedback}
        settleMs={activeSkin.settleMs}
        hangingString={activeSkin.hangingString}
        idleSway={activeSkin.idleSway}
        swayDelayMs={(i % 6) * 700}
        pinnedTop={i === 0}
        pinPulse={tool.id === pinPulseId}
        showHint={hintVisible && i === 0}
        onOpen={handleOpen}
        onLongPressInfo={handleLongPress}
        onGrabTouchStart={handleGrabStart}
        onGrabTouchMove={handleGrabMove}
        onGrabTouchEnd={handleGrabEnd}
        onGrabTouchCancel={handleGrabEnd}
        onPinTop={handlePinTop}
      />
    )
  }

  return (
    <View
      className='page-root home-root'
      style={{ background: activeSkin.backgroundCss || theme.bg }}
    >
      <Canvas type='2d' id='patternCanvas' className='pattern-canvas' />
      <View className='home-header' style={{ paddingTop: `${layout.headerPad}px` }}>
        <View className='home-gear' style={{ top: `${layout.gearTop}px` }} onClick={handleSettings}>
          <Text className='home-gear-icon'>⚙️</Text>
        </View>
        <View className='home-user' style={{ top: `${layout.gearTop}px` }} onClick={() => Taro.navigateTo({ url: '/pages/user/index' })}>
          <Text className='home-user-icon'>{guestNickname ? guestNickname.slice(0, 1) : '👤'}</Text>
        </View>
        <Button
          className='home-gear home-share-btn'
          style={{ top: `${layout.gearTop}px` }}
          openType='share'
        >
          <Text className='home-gear-icon'>💌</Text>
        </Button>
        <View className='home-title' onClick={handleTitleTap}>
          <Text className='home-title-prefix'>{titlePrefix}</Text>
          <Text className='home-title-char'>趣</Text>
          <Text className='home-title-char home-title-char--2'>工</Text>
          <Text className='home-title-char home-title-char--3'>局</Text>
        </View>
        <View className='home-slogan' onClick={handleSloganTap}>
          {slogan}
        </View>
      </View>

      {/* 皮肤预览提示条 */}
      {previewId && (
        <View className='home-preview-bar'>
          <Text className='home-preview-text'>👀 正在预览：{activeSkin.name}</Text>
          <Text className='home-preview-exit' onClick={exitPreview}>
            退出预览
          </Text>
        </View>
      )}

      {/* 工局等级条（可收起） */}
      <View className='home-level'>
        {levelFolded ? (
          <View className='home-level-mini' onClick={openLevelPage}>
            <Text className='home-level-mini-text'>🏅 Lv.{level.level}</Text>
            <Text className='home-level-mini-arrow'>▸</Text>
          </View>
        ) : (
          <View className='home-level-bar' onClick={openLevelPage}>
            <Text className='home-level-name'>工局 Lv.{level.level} · {getLevelTitle(level.level)}</Text>
            <View className='home-level-track'>
              <View
                className='home-level-fill'
                style={{ width: `${levelPct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDeep})` }}
              />
            </View>
            <Text className='home-level-remain'>
              {level.nextAt > level.curBase ? `还差 ${level.nextAt - points} 工分` : '已满级'}
            </Text>
            <Text className='home-level-fold' onClick={toggleLevelFold}>
              ▾
            </Text>
          </View>
        )}
      </View>

      <View
        className='home-grid'
        style={{
          height: containerH ? `${containerH}px` : undefined,
          opacity: metrics && (activeSkin.id !== 'tree' || treeImageReady || treeImageFailed) ? 1 : 0
        }}
      >
        {treeImageReady && (
          <Image className='skin-image' src={treeImage.src} mode='scaleToFill' />
        )}
        {treeImageFailed && <Text className='tree-image-fallback'>树景暂不可用，工具仍可使用</Text>}
        {activeSkin.draw && activeSkin.id !== 'tree' && (
          <Canvas type='2d' id='skinCanvas' className='skin-canvas' />
        )}
        {toolsOrdered.map(renderCard)}

        {hintVisible && !showOnboarding && metrics && slots.length > 0 && (
          <View
            className='home-hint'
            style={{
              left: `${Math.max(4, slots[0].x + metrics.cardW - 216)}px`,
              top: `${slots[0].y - 82}px`
            }}
          >
            <View className='home-hint-text'>{DRAG_CONFIG.hintBubbleText}</View>
            <View className='home-hint-btn' onClick={() => dismissHint('tap')}>{DRAG_CONFIG.hintBubbleArrow}</View>
            <View className='home-hint-arrow' />
          </View>
        )}
      </View>

      {/* 树景专用画布不属于卡片网格，导出后卸载；原生层绝不与卡片叠放。 */}
      {treeImageKey && !treeImageReady && !treeImageFailed && (
        <Canvas type='2d' id='skinCanvas' className='tree-export-canvas' style={{ width: `${metrics!.gridW}px`, height: `${containerH}px` }} />
      )}

      <View className='home-footer-wrap'>
        <View className='home-footer' onClick={goAbout}>
          关于
        </View>
        <View className='home-author'>design by Mariana</View>
      </View>

      <Canvas
        type='2d'
        id='confettiCanvas'
        className='confetti-canvas'
        style={{ width: `${confettiSize.w}px`, height: `${confettiSize.h}px` }}
      />

      {showOnboarding && <Onboarding theme={theme} onFinish={handleOnboardingFinish} />}
    </View>
  )
}
