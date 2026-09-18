import { View, Text, Canvas, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback } from 'react'
import { TOOLS, type ToolMeta } from '../../data/tools'
import { SLOGANS } from '../../data/slogans'
import { HAPPY_QUIPS } from '../../data/happyQuips'
import { SHARE_PHRASES } from '../../data/sharePhrases'
import { PATTERNS, getPatternConfig, renderPattern } from '../../data/patterns'
import { getTheme, type BackgroundPreset } from '../../utils/theme'
import { get, addTotalCount } from '../../utils/storage'
import GiftBox from '../../components/GiftBox'
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

export default function Index() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [slogan, setSlogan] = useState(SLOGANS[dayOfYear() % SLOGANS.length])

  /* 分享按钮：每次随机一句俏皮话推荐 */
  useShareAppMessage(() => ({
    title: SHARE_PHRASES[Math.floor(Math.random() * SHARE_PHRASES.length)],
    path: '/pages/index/index'
  }))

  const [openingId, setOpeningId] = useState('')
  /* 设置按钮固定在左上角（避开微信胶囊区域）；H5 用固定值兜底 */
  const [layout, setLayout] = useState({ gearTop: 40, headerPad: 60 })
  /* 彩带画布尺寸用真实 px：小程序 inline style 的 vh 不可靠，半屏设置会失效 */
  const [confettiSize, setConfettiSize] = useState({ w: 375, h: 400 })

  const canvasRef = useRef<any>(null)
  const ctxRef = useRef<any>(null)
  const piecesRef = useRef<ConfettiPiece[]>([])
  const loopActiveRef = useRef(false)
  const lastTsRef = useRef(0)

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

  const handleOpen = (tool: ToolMeta) => {
    if (openingId) return
    setOpeningId(tool.id)
    addTotalCount(`usage_${tool.id}`)
    setTimeout(() => {
      Taro.navigateTo({ url: tool.path })
      setTimeout(() => setOpeningId(''), 500)
    }, 480)
  }

  const handleLongPress = (tool: ToolMeta) => {
    const usage = get<number>(`usage_${tool.id}`, 0)
    Taro.showModal({
      title: `${tool.icon} ${tool.name}`,
      content: `${tool.desc}\n\n你已经打开过它 ${usage} 次`,
      showCancel: false,
      confirmText: '关掉'
    })
  }

  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' })
  }

  const goAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  return (
    <View className='page-root home-root' style={{ background: theme.bg }}>
      <Canvas type='2d' id='patternCanvas' className='pattern-canvas' />
      <View className='home-header' style={{ paddingTop: `${layout.headerPad}px` }}>
        <View className='home-gear' style={{ top: `${layout.gearTop}px` }} onClick={handleSettings}>
          <Text className='home-gear-icon'>⚙️</Text>
        </View>
        <Button
          className='home-gear home-share-btn'
          style={{ top: `${layout.gearTop}px` }}
          openType='share'
        >
          <Text className='home-gear-icon'>💌</Text>
        </Button>
        <View className='home-title' onClick={handleTitleTap}>
          <Text className='home-title-char'>趣</Text>
          <Text className='home-title-char home-title-char--2'>工</Text>
          <Text className='home-title-char home-title-char--3'>局</Text>
        </View>
        <View className='home-slogan' onClick={handleSloganTap}>
          {slogan}
        </View>
      </View>

      <View className='home-grid'>
        {TOOLS.map(tool => (
          <View className='home-grid-item' key={tool.id}>
            <GiftBox
              tool={tool}
              opening={openingId === tool.id}
              onOpen={handleOpen}
              onLongPress={handleLongPress}
            />
          </View>
        ))}
      </View>

      <View className='home-footer-wrap'>
        <View className='home-footer' onClick={goAbout}>
          关于
        </View>
        <View className='home-author'>design by mariana</View>
      </View>

      <Canvas
        type='2d'
        id='confettiCanvas'
        className='confetti-canvas'
        style={{ width: `${confettiSize.w}px`, height: `${confettiSize.h}px` }}
      />
    </View>
  )
}
