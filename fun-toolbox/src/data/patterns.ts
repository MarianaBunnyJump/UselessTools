import Taro from '@tarojs/taro'
import { get, set } from '../utils/storage'

/* ===================== 首页背景印花（可配置） =====================
 * 每种印花是一个 Canvas 绘制函数，配合「大小 / 间距 / 浓度」参数平铺整屏，
 * 类似着色器的 uniform 调参方式；颜色自动跟随全局背景主题色。
 * 新增印花：在 PATTERNS 里加一项即可，设置页会自动出现新选项。
 */

export interface PatternDef {
  id: string
  name: string
  draw: (ctx: any, x: number, y: number, size: number) => void
}

function fillCircle(ctx: any, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

export const PATTERNS: PatternDef[] = [
  {
    id: 'dots',
    name: '圆点',
    draw: (ctx, x, y, s) => fillCircle(ctx, x, y, s * 0.2)
  },
  {
    id: 'heart',
    name: '爱心',
    draw: (ctx, x, y, s) => {
      const r = s * 0.2
      ctx.beginPath()
      ctx.moveTo(x, y + r * 0.95)
      ctx.bezierCurveTo(x - r * 1.6, y - r * 0.25, x - r * 0.75, y - r * 1.15, x, y - r * 0.35)
      ctx.bezierCurveTo(x + r * 0.75, y - r * 1.15, x + r * 1.6, y - r * 0.25, x, y + r * 0.95)
      ctx.closePath()
      ctx.fill()
    }
  },
  {
    id: 'star',
    name: '星星',
    draw: (ctx, x, y, s) => {
      const R = s * 0.24
      const r = R * 0.45
      ctx.beginPath()
      for (let i = 0; i < 10; i++) {
        const ang = -Math.PI / 2 + (i * Math.PI) / 5
        const rad = i % 2 === 0 ? R : r
        const px = x + Math.cos(ang) * rad
        const py = y + Math.sin(ang) * rad
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
  },
  {
    id: 'triangle',
    name: '三角',
    draw: (ctx, x, y, s) => {
      const r = s * 0.22
      ctx.beginPath()
      for (let i = 0; i < 3; i++) {
        const ang = -Math.PI / 2 + (i * Math.PI * 2) / 3
        const px = x + Math.cos(ang) * r
        const py = y + Math.sin(ang) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
  },
  {
    id: 'cross',
    name: '十字',
    draw: (ctx, x, y, s) => {
      ctx.lineWidth = s * 0.09
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x - s * 0.2, y)
      ctx.lineTo(x + s * 0.2, y)
      ctx.moveTo(x, y - s * 0.2)
      ctx.lineTo(x, y + s * 0.2)
      ctx.stroke()
    }
  },
  {
    id: 'wave',
    name: '波浪',
    draw: (ctx, x, y, s) => {
      ctx.lineWidth = s * 0.07
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x - s * 0.26, y + s * 0.08)
      ctx.quadraticCurveTo(x - s * 0.13, y - s * 0.14, x, y + s * 0.06)
      ctx.quadraticCurveTo(x + s * 0.13, y + s * 0.24, x + s * 0.26, y + s * 0.02)
      ctx.stroke()
    }
  },
  {
    id: 'flower',
    name: '花朵',
    draw: (ctx, x, y, s) => {
      const pr = s * 0.1
      const orbit = s * 0.15
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5 - Math.PI / 2
        fillCircle(ctx, x + Math.cos(ang) * orbit, y + Math.sin(ang) * orbit, pr)
      }
      fillCircle(ctx, x, y, s * 0.05)
    }
  },
  {
    id: 'bubble',
    name: '气泡',
    draw: (ctx, x, y, s) => {
      ctx.lineWidth = s * 0.05
      ctx.beginPath()
      ctx.arc(x, y, s * 0.22, 0, Math.PI * 2)
      ctx.stroke()
      fillCircle(ctx, x + s * 0.13, y - s * 0.13, s * 0.045)
    }
  }
]

export interface PatternConfig {
  id: string
  opacity: number
  size: number
  gap: number
}

const DEFAULT_CONFIG: PatternConfig = { id: 'dots', opacity: 14, size: 36, gap: 130 }

export function getPatternConfig(): PatternConfig {
  return {
    id: get<string>('pattern_id', DEFAULT_CONFIG.id),
    opacity: get<number>('pattern_opacity', DEFAULT_CONFIG.opacity),
    size: get<number>('pattern_size', DEFAULT_CONFIG.size),
    gap: get<number>('pattern_gap', DEFAULT_CONFIG.gap)
  }
}

export function setPatternConfig(patch: Partial<PatternConfig>): PatternConfig {
  const next = { ...getPatternConfig(), ...patch }
  set('pattern_id', next.id)
  set('pattern_opacity', next.opacity)
  set('pattern_size', next.size)
  set('pattern_gap', next.gap)
  Taro.eventCenter.trigger('pattern-changed', next)
  return next
}

/* 确定性伪随机：同一格点每次重绘结果一致，避免闪变 */
function hash01(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/* 平铺渲染：奇偶行交错 + 每个图案带确定性微旋转/微缩放 */
export function renderPattern(
  ctx: any,
  w: number,
  h: number,
  pattern: PatternDef,
  opts: { size: number; gap: number; opacity: number; color: string },
  keepContent = false
) {
  if (!keepContent) ctx.clearRect(0, 0, w, h)
  const step = Math.max(opts.size + 14, opts.gap)
  ctx.save()
  ctx.globalAlpha = Math.min(0.6, Math.max(0.03, opts.opacity / 100))
  ctx.fillStyle = opts.color
  ctx.strokeStyle = opts.color
  let row = 0
  for (let y = step / 2; y < h + step; y += step, row++) {
    const rowOffset = row % 2 === 0 ? 0 : step / 2
    let col = 0
    for (let x = step / 2; x < w + step; x += step, col++) {
      const j = hash01(row + 7, col + 13)
      ctx.save()
      ctx.translate(x + rowOffset, y)
      ctx.rotate((j - 0.5) * 0.9)
      pattern.draw(ctx, 0, 0, opts.size * (0.8 + j * 0.4))
      ctx.restore()
    }
  }
  ctx.restore()
}

/* 设置页预览：先铺背景渐变，再叠印花 */
export function renderPatternPreview(
  ctx: any,
  w: number,
  h: number,
  cfg: PatternConfig,
  bgFrom: string,
  bgTo: string,
  color: string,
  scale = 0.5
) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, bgFrom)
  g.addColorStop(1, bgTo)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const p = PATTERNS.find(it => it.id === cfg.id)
  if (!p) return
  renderPattern(
    ctx,
    w,
    h,
    p,
    { size: cfg.size * scale, gap: cfg.gap * scale, opacity: cfg.opacity, color },
    true
  )
}
