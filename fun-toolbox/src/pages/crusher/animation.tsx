import { View, Text, Button, Canvas } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect, useMemo } from 'react'
import { CRUSHER_PHRASES } from '../../data/crusherPhrases'
import { getTheme } from '../../utils/theme'
import { playCrushSound, isSupported } from '../../utils/audio'
import { randomOf } from '../../utils/format'
import NavBar from '../../components/NavBar'
import './animation.scss'

interface Particle {
  ch: string
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  alpha: number
  gone: boolean
  angle: number
  radius: number
  spin: number
}

interface Ash {
  x: number
  y: number
  vy: number
  drift: number
  phase: number
  alpha: number
  size: number
}

const HOLD_MS = 500
const ANIM_MS = 2200

const MODE_ICON: Record<string, string> = { shred: '✂️', burn: '🔥', flush: '🌊' }

export default function CrusherAnimation() {
  const [theme] = useState(getTheme())
  const params = Taro.getCurrentInstance().router?.params || {}
  const mode = params.mode || 'shred'
  const text = decodeURIComponent(params.text || '烦恼')

  const [done, setDone] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const phrase = useMemo(() => randomOf(CRUSHER_PHRASES), [animKey])

  const runningRef = useRef(false)

  useShareAppMessage(() => ({
    title: `${MODE_ICON[mode] || ''} 粉碎成功：${phrase}`,
    path: '/pages/index/index'
  }))

  useEffect(() => {
    if (done) return
    let destroyed = false

    const query = Taro.createSelectorQuery()
    query
      .select('#crushCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (destroyed || !res || !res[0] || !res[0].node) return
        const canvas = res[0].node
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

        /* ---------- 构建字符粒子（按画布尺寸动态排版，文字始终完整显示在页面内） ---------- */
        const chars = Array.from(text).slice(0, 100)
        const availW = w - 56
        const maxBlockH = h * 0.5
        let fontSize = 44
        let lineHeight = Math.round(fontSize * 1.5)
        let charsPerLine = Math.max(4, Math.floor(availW / fontSize))
        let lines: string[][] = []
        const layoutLines = () => {
          lines = []
          for (let i = 0; i < chars.length; i += charsPerLine) {
            lines.push(chars.slice(i, i + charsPerLine))
          }
        }
        layoutLines()
        /* 行数超预算就逐级缩小字号，直到放下或到达下限 */
        let guard = 0
        while (
          lines.length * lineHeight > maxBlockH &&
          fontSize > 20 &&
          guard < 8
        ) {
          fontSize -= 4
          lineHeight = Math.round(fontSize * 1.5)
          charsPerLine = Math.max(4, Math.floor(availW / fontSize))
          layoutLines()
          guard++
        }
        /* 仍放不下才截断加省略号 */
        const maxLines = Math.max(3, Math.floor(maxBlockH / lineHeight))
        if (lines.length > maxLines) {
          lines = lines.slice(0, maxLines)
          const last = lines[lines.length - 1]
          if (last.length >= charsPerLine) last[last.length - 1] = '…'
          else last.push('…')
        }
        const cx = w / 2
        const cy = h * 0.44
        const startY = cy - ((lines.length - 1) * lineHeight) / 2

        const particles: Particle[] = []
        lines.forEach((line, li) => {
          const lw = line.length * fontSize
          line.forEach((ch, ci) => {
            const px = cx - lw / 2 + ci * fontSize + fontSize / 2
            const py = startY + li * lineHeight
            particles.push({
              ch,
              x: px,
              y: py,
              vx: (px - cx) * (0.008 + Math.random() * 0.014) + (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 6 - 3,
              rot: 0,
              vr: (Math.random() - 0.5) * 0.35,
              alpha: 1,
              gone: false,
              angle: Math.atan2(py - cy, px - cx),
              radius: Math.sqrt((px - cx) ** 2 + (py - cy) ** 2),
              spin: 0.08 + Math.random() * 0.1
            })
          })
        })

        const textTop = startY - lineHeight / 2
        const textBottom = startY + (lines.length - 1) * lineHeight + lineHeight / 2
        const ashes: Ash[] = []

        if (isSupported()) {
          playCrushSound(mode)
        }

        runningRef.current = true
        const startTime = Date.now()

        const drawChars = () => {
          ctx.font = `700 ${fontSize}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          particles.forEach(p => {
            if (p.gone || p.alpha <= 0.01) return
            ctx.save()
            ctx.globalAlpha = Math.max(0, p.alpha)
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            ctx.fillStyle = '#4A3B32'
            ctx.fillText(p.ch, 0, 0)
            ctx.restore()
          })
        }

        const render = () => {
          if (!runningRef.current) return
          const t = Date.now() - startTime
          ctx.clearRect(0, 0, w, h)

          if (t < HOLD_MS) {
            drawChars()
            canvas.requestAnimationFrame(render)
            return
          }

          const prog = Math.min(1, (t - HOLD_MS) / ANIM_MS)

          if (mode === 'shred') {
            particles.forEach(p => {
              p.vy += 0.55
              p.x += p.vx
              p.y += p.vy
              p.rot += p.vr
              p.alpha = Math.max(0, 1 - prog ** 1.4)
            })
          } else if (mode === 'burn') {
            const burnY = textBottom + 30 - prog * (textBottom - textTop + 90)
            particles.forEach(p => {
              if (p.y > burnY) {
                if (!p.gone) {
                  p.gone = true
                  if (Math.random() < 0.8) {
                    ashes.push({
                      x: p.x + (Math.random() - 0.5) * 30,
                      y: burnY,
                      vy: -(0.8 + Math.random() * 1.6),
                      drift: (Math.random() - 0.5) * 0.8,
                      phase: Math.random() * Math.PI * 2,
                      alpha: 0.8,
                      size: 3 + Math.random() * 5
                    })
                  }
                }
                p.alpha = 0
              }
            })
            /* 火焰线 */
            const flameGrad = ctx.createLinearGradient(0, burnY - 26, 0, burnY + 30)
            flameGrad.addColorStop(0, 'rgba(255,214,64,0)')
            flameGrad.addColorStop(0.45, `rgba(255,152,0,${0.75 * (1 - prog * 0.25)})`)
            flameGrad.addColorStop(1, 'rgba(239,83,80,0)')
            ctx.fillStyle = flameGrad
            ctx.fillRect(0, burnY - 26, w, 56)
            ctx.fillStyle = `rgba(255,224,178,${0.9 * (1 - prog * 0.3)})`
            ctx.fillRect(0, burnY - 3, w, 4)
          } else if (mode === 'flush') {
            particles.forEach(p => {
              p.angle += p.spin * (1 + prog)
              p.radius += 1.1
              p.x = cx + Math.cos(p.angle) * p.radius
              p.y = cy + Math.sin(p.angle) * p.radius * 0.55 + prog * prog * h * 0.5
              p.rot += 0.12
              p.alpha = Math.max(0, 1 - prog ** 1.2)
            })
          }

          drawChars()

          /* 灰烬粒子 */
          ashes.forEach(a => {
            if (a.alpha <= 0) return
            a.phase += 0.05
            a.y += a.vy
            a.x += a.drift + Math.sin(a.phase) * 0.6
            a.alpha -= 0.006
            ctx.globalAlpha = Math.max(0, a.alpha) * 0.6
            ctx.fillStyle = '#8D7B70'
            ctx.beginPath()
            ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
          })

          if (prog >= 1) {
            runningRef.current = false
            ctx.clearRect(0, 0, w, h)
            setDone(true)
            return
          }
          canvas.requestAnimationFrame(render)
        }

        canvas.requestAnimationFrame(render)
      })

    return () => {
      destroyed = true
      runningRef.current = false
    }
  }, [animKey, mode, text, done])

  const again = () => {
    Taro.eventCenter.trigger('crusher:again')
    Taro.navigateBack()
  }

  return (
    <View className='crush-anim-root' style={{ background: theme.bg }}>
      <View className='crush-anim-nav'>
        <NavBar title={done ? '粉碎完成' : '粉碎中...'} />
      </View>

      <Canvas type='2d' id='crushCanvas' className='crush-canvas' />

      {done && (
        <View className='crush-done'>
          <View className='crush-done-card'>
            <Text className='crush-done-icon'>{MODE_ICON[mode] || '✅'}</Text>
            <Text className='crush-done-badge'>已粉碎</Text>
            <Text className='crush-done-phrase'>{phrase}</Text>
          </View>
          <View className='crush-done-ops'>
            <View className='btn-ghost crush-done-btn' onClick={again}>
              再来一次
            </View>
            <Button className='btn-ghost crush-done-btn crush-done-share' openType='share'>
              分享结果
            </Button>
          </View>
          <View className='crush-done-tip'>不可恢复，请放心生活</View>
        </View>
      )}
    </View>
  )
}
