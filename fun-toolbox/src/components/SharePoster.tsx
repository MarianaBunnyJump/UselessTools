import { View, Text, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { HAPPY_QUIPS } from '../data/happyQuips'
import './share-poster.scss'

/* ===================== 统一分享卡片（canvas 海报） =====================
 * 各工具结果页共用：品牌 + 工具名 + 主内容 + 俏皮话 + 落款，
 * 一键生成图片保存到相册。hero（大字）与 longText（长文自动换行）二选一。
 */

export interface SharePosterProps {
  /* 每页唯一，用于离屏 canvas 查询 */
  canvasId: string
  toolName: string
  accent: string
  hero?: string
  heroUnit?: string
  lines?: string[]
  longText?: string
  quip?: string
  buttonText?: string
}

/* 导出画布的逻辑尺寸（实际像素 = 逻辑 x dpr） */
const CANVAS_W = 750
const CANVAS_H = 1150

function roundRectPath(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* #RRGGBB 与另一颜色按比例混合（ratio 为 mix 占比） */
function mixHex(hex: string, mix: string, ratio: number): string {
  const parse = (c: string) => {
    const v = c.replace('#', '')
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parse(hex)
  const [r2, g2, b2] = parse(mix)
  const f = (a: number, b: number) => Math.round(a + (b - a) * ratio)
  return `#${[f(r1, r2), f(g1, g2), f(b1, b2)].map(n => n.toString(16).padStart(2, '0')).join('')}`
}

/* 中文长文按字符宽度换行 */
function wrapText(ctx: any, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let cur = ''
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxWidth && cur) {
      lines.push(cur)
      cur = ch
    } else {
      cur += ch
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 8)
}

export default function SharePoster({
  canvasId,
  toolName,
  accent,
  hero,
  heroUnit,
  lines = [],
  longText,
  quip,
  buttonText = '生成分享卡片'
}: SharePosterProps) {
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef<any>(null)

  /* 首次成功查询后缓存节点（跨页查询会落空，沿用 patternCanvas 的教训） */
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query
        .select(`#${canvasId}`)
        .fields({ node: true })
        .exec(res => {
          if (res && res[0] && res[0].node) canvasRef.current = res[0].node
        })
    }, 80)
    return () => clearTimeout(timer)
  }, [canvasId])

  const drawPoster = () => {
    const canvas = canvasRef.current
    if (!canvas) return false
    const dpr = 2
    canvas.width = CANVAS_W * dpr
    canvas.height = CANVAS_H * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.textAlign = 'center'

    /* 背景：白 → 主题淡色 */
    const bgTint = mixHex(accent, '#ffffff', 0.9)
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W * 0.3, CANVAS_H)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(1, bgTint)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    /* 角落柔光 */
    const bokeh = (x: number, y: number, r: number) => {
      const g = ctx.createRadialGradient(x, y, 10, x, y, r)
      g.addColorStop(0, `${accent}33`)
      g.addColorStop(1, `${accent}00`)
      ctx.fillStyle = g
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    }
    bokeh(CANVAS_W - 60, 90, 210)
    bokeh(50, CANVAS_H - 160, 230)

    /* 品牌 + 工具名胶囊 */
    ctx.fillStyle = accent
    ctx.font = '600 32px sans-serif'
    ctx.fillText('趣 工 局', CANVAS_W / 2, 120)

    const pillText = ` ${toolName} `
    ctx.font = '600 34px sans-serif'
    const pillW = ctx.measureText(pillText).width + 56
    ctx.fillStyle = mixHex(accent, '#ffffff', 0.82)
    roundRectPath(ctx, (CANVAS_W - pillW) / 2, 170, pillW, 72, 36)
    ctx.fill()
    ctx.fillStyle = '#4a3b32'
    ctx.fillText(pillText, CANVAS_W / 2, 218)

    let y = 360

    /* 主内容 */
    if (hero) {
      const numGrad = ctx.createLinearGradient(0, 0, CANVAS_W, 0)
      numGrad.addColorStop(0, mixHex(accent, '#000000', 0.12))
      numGrad.addColorStop(1, accent)
      ctx.fillStyle = numGrad
      ctx.font = '800 160px sans-serif'
      ctx.fillText(hero, CANVAS_W / 2, y + 40)
      y += 130
      if (heroUnit) {
        ctx.fillStyle = '#4a3b32'
        ctx.font = '600 50px sans-serif'
        ctx.fillText(heroUnit, CANVAS_W / 2, y)
        y += 70
      }
    } else if (longText) {
      ctx.font = '500 46px sans-serif'
      ctx.fillStyle = '#4a3b32'
      const wrapped = wrapText(ctx, longText, CANVAS_W - 180)
      wrapped.forEach(line => {
        ctx.fillText(line, CANVAS_W / 2, y)
        y += 76
      })
      y += 10
    }

    /* 虚线分隔 */
    ctx.save()
    ctx.setLineDash([14, 14])
    ctx.strokeStyle = `${accent}66`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(90, y + 10)
    ctx.lineTo(CANVAS_W - 90, y + 10)
    ctx.stroke()
    ctx.restore()
    y += 80

    /* 附加行 */
    ctx.font = '500 38px sans-serif'
    ctx.fillStyle = '#8d7b70'
    lines.forEach(line => {
      ctx.fillText(line, CANVAS_W / 2, y)
      y += 66
    })

    /* 俏皮话 */
    const phrase = quip || HAPPY_QUIPS[Math.floor(Math.random() * HAPPY_QUIPS.length)]
    ctx.fillStyle = '#6d5f56'
    ctx.font = '500 36px sans-serif'
    ctx.fillText(`“${phrase}”`, CANVAS_W / 2, y + 40)

    /* 落款 */
    ctx.fillStyle = '#c9bdb4'
    ctx.font = '400 28px sans-serif'
    ctx.fillText(`趣工局 · ${toolName}`, CANVAS_W / 2, CANVAS_H - 78)
    ctx.fillStyle = '#d8cec7'
    ctx.font = '400 24px sans-serif'
    ctx.fillText('数据仅存于本机 · 仅供一乐', CANVAS_W / 2, CANVAS_H - 40)
    return true
  }

  const saveToAlbum = (filePath: string) => {
    Taro.saveImageToPhotosAlbum({
      filePath,
      success: () => Taro.showToast({ title: '已保存到相册', icon: 'success' }),
      fail: () => {
        Taro.showModal({
          title: '保存失败',
          content: '需要在设置中授权「保存到相册」',
          confirmText: '去设置',
          success: r => {
            if (r.confirm) Taro.openSetting()
          }
        })
      }
    })
  }

  const generate = () => {
    if (busy) return
    const canvas = canvasRef.current
    if (!canvas) {
      Taro.showToast({ title: '卡片还没准备好，再试一次', icon: 'none' })
      return
    }
    setBusy(true)
    if (!drawPoster()) {
      setBusy(false)
      return
    }

    if (process.env.TARO_ENV === 'h5') {
      /* H5：直接转 dataURL 触发下载 */
      try {
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `趣工局-${toolName}.png`
        a.click()
        Taro.showToast({ title: '已生成图片', icon: 'success' })
      } catch (e) {
        Taro.showToast({ title: '生成图片失败', icon: 'none' })
      }
      setBusy(false)
      return
    }

    Taro.canvasToTempFilePath({
      canvas,
      success: (res: any) => {
        saveToAlbum(res.tempFilePath)
        setBusy(false)
      },
      fail: () => {
        Taro.showToast({ title: '生成图片失败', icon: 'none' })
        setBusy(false)
      }
    })
  }

  return (
    <View className='sp-wrap'>
      <View className={`sp-btn ${busy ? 'sp-btn--busy' : ''}`} onClick={generate}>
        <Text className='sp-btn-icon'>📷</Text>
        <Text>{buttonText}</Text>
      </View>
      <Canvas type='2d' id={canvasId} className='sp-export-canvas' />
    </View>
  )
}
