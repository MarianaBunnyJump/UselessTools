import { View, Text, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback } from 'react'
import { TOOLS, type ToolMeta } from '../../data/tools'
import { SLOGANS } from '../../data/slogans'
import { HAPPY_QUIPS } from '../../data/happyQuips'
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
  const [openingId, setOpeningId] = useState('')
  const [confettiOn, setConfettiOn] = useState(false)
  /* 设置按钮与微信胶囊对齐（位于胶囊左侧），标题避开胶囊；H5 用固定值兜底 */
  const [layout, setLayout] = useState({ gearTop: 40, gearRight: 12, headerPad: 60 })

  const canvasRef = useRef<any>(null)
  const piecesRef = useRef<ConfettiPiece[]>([])
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)

  useEffect(() => {
    try {
      const info = Taro.getSystemInfoSync()
      const sbh = info.statusBarHeight || 20
      const winW = info.windowWidth || 375
      /* home-root 的 padding-top: 20(设计px) 折算成真实 px，按钮定位相对 home-header */
      const rootPad = (20 * winW) / 750
      let gearTop = sbh + 8 - rootPad
      let gearRight = 12
      let headerPad = sbh + 48 - rootPad
      if (process.env.TARO_ENV === 'weapp' && Taro.getMenuButtonBoundingClientRect) {
        const menu = Taro.getMenuButtonBoundingClientRect()
        if (menu && menu.top > 0 && menu.height > 0) {
          /* 齿轮 CSS 高 76(设计px) 折算真实 px，与胶囊垂直居中对齐 */
          const gearSize = (76 * winW) / 750
          gearTop = menu.top + (menu.height - gearSize) / 2 - rootPad
          gearRight = winW - menu.left + 10
          headerPad = Math.max(menu.bottom + 12 - rootPad, sbh + 48)
        }
      }
      setLayout({ gearTop, gearRight, headerPad })
    } catch (e) {
      /* 默认值兜底 */
    }
  }, [])

  useEffect(() => {
    const listener = (bg: BackgroundPreset) => setTh(bg)
    Taro.eventCenter.on('theme-changed', listener)
    return () => {
      Taro.eventCenter.off('theme-changed', listener)
      stopConfetti()
    }
  }, [])

  const startConfetti = useCallback(() => {
    const query = Taro.createSelectorQuery()
    query
      .select('#confettiCanvas')
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

        const pieces: ConfettiPiece[] = []
        const count = 150
        for (let i = 0; i < count; i++) {
          pieces.push({
            x: Math.random() * w,
            y: -30 - Math.random() * h * 0.6,
            w: 8 + Math.random() * 8,
            h: 10 + Math.random() * 10,
            vx: (Math.random() - 0.5) * 1.6,
            vy: 2.4 + Math.random() * 2.6,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.25,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            sway: 0.6 + Math.random() * 1.4,
            phase: Math.random() * Math.PI * 2
          })
        }
        piecesRef.current = pieces
        setConfettiOn(true)
        runningRef.current = true

        let frame = 0
        const render = () => {
          if (!runningRef.current) return
          frame++
          ctx.clearRect(0, 0, w, h)
          let alive = false
          pieces.forEach(p => {
            p.phase += 0.06
            p.x += p.vx + Math.sin(p.phase) * p.sway * 0.6
            p.y += p.vy
            p.rot += p.vr
            if (p.y < h + 40) alive = true
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
            ctx.restore()
          })
          if (alive && frame < 700) {
            canvas.requestAnimationFrame(render)
          } else {
            stopConfetti()
          }
        }
        canvas.requestAnimationFrame(render)
      })
  }, [])

  const stopConfetti = useCallback(() => {
    runningRef.current = false
    setConfettiOn(false)
  }, [])

  const handleTitleTap = () => {
    if (runningRef.current) return
    startConfetti()
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
      <View className='home-header' style={{ paddingTop: `${layout.headerPad}px` }}>
        <View
          className='home-gear'
          style={{ top: `${layout.gearTop}px`, right: `${layout.gearRight}px` }}
          onClick={handleSettings}
        >
          <Text className='home-gear-icon'>⚙️</Text>
        </View>
        <View className='home-title' onClick={handleTitleTap}>
          有点意思工具盒
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
          已收录 {TOOLS.length} 个工具 · 关于
        </View>
        <View className='home-author'>design by mariana</View>
      </View>

      {confettiOn && (
        <Canvas
          type='2d'
          id='confettiCanvas'
          className='confetti-canvas'
          style={{ width: '100vw', height: '100vh' }}
        />
      )}
    </View>
  )
}
