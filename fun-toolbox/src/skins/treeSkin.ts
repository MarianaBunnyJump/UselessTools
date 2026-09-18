/* ===================== 圣诞树皮肤：礼物盒挂上圣诞树 =====================
 * 夜幕背景由 backgroundCss 提供；本画布只画树本体（与槽位同坐标系，锚点即枝桠）。
 * 锚点为 750 设计 px，运行时按容器宽换算；调布局只改 ANCHORS。
 */

import type { SkinDefinition } from './registry'

const CARD_SCALE = 0.7

/* 3 层 × 左右 2 个枝桠（设计 px，容器系） */
const ANCHORS = [
  { x: 70, y: 66, rotate: -6 },
  { x: 436, y: 46, rotate: 5 },
  { x: 36, y: 296, rotate: 7 },
  { x: 478, y: 306, rotate: -5 },
  { x: 128, y: 536, rotate: -4 },
  { x: 416, y: 556, rotate: 6 }
]

/* 暖色光斑的确定性位置（比例坐标），避免每帧随机跳变 */
const BOKEH: [number, number][] = [
  [0.35, 0.3], [0.62, 0.38], [0.5, 0.52], [0.3, 0.6],
  [0.7, 0.68], [0.42, 0.78], [0.58, 0.85], [0.35, 0.92]
]
const BOKEH_COLORS = ['#FFD54F', '#FFAB91', '#FFE082', '#FFCC80']

function drawTree(ctx: any, w: number, h: number) {
  const k = w / 750
  const cx = w / 2

  /* 三层塔式树冠：自上而下渐深 */
  const layers = [
    { apex: -6 * k, base: h * 0.42, halfW: w * 0.3, fill: '#2F6B52' },
    { apex: h * 0.24, base: h * 0.66, halfW: w * 0.38, fill: '#285947' },
    { apex: h * 0.5, base: h * 0.95, halfW: w * 0.46, fill: '#1F4A3C' }
  ]
  layers.forEach(l => {
    ctx.beginPath()
    ctx.moveTo(cx, l.apex)
    ctx.lineTo(cx + l.halfW, l.base)
    ctx.lineTo(cx - l.halfW, l.base)
    ctx.closePath()
    ctx.fillStyle = l.fill
    ctx.fill()
    /* 底缘积雪高光 */
    ctx.beginPath()
    ctx.moveTo(cx - l.halfW, l.base)
    ctx.lineTo(cx + l.halfW, l.base)
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 3 * k
    ctx.stroke()
  })

  /* 树干（画布高度不够时自然被裁掉） */
  ctx.fillStyle = '#6D4C41'
  ctx.fillRect(cx - 16 * k, h * 0.92, 32 * k, h * 0.08)

  /* 树顶星星 */
  const starY = 2 * k
  const glow = ctx.createRadialGradient(cx, starY, 2 * k, cx, starY, 34 * k)
  glow.addColorStop(0, 'rgba(255,213,79,0.85)')
  glow.addColorStop(1, 'rgba(255,213,79,0)')
  ctx.fillStyle = glow
  ctx.fillRect(cx - 34 * k, starY - 34 * k, 68 * k, 68 * k)
  ctx.fillStyle = '#FFD54F'
  ctx.beginPath()
  ctx.arc(cx, starY + 4 * k, 9 * k, 0, Math.PI * 2)
  ctx.fill()

  /* 暖色光斑（彩灯氛围） */
  BOKEH.forEach(([fx, fy], i) => {
    ctx.globalAlpha = 0.4
    ctx.fillStyle = BOKEH_COLORS[i % BOKEH_COLORS.length]
    ctx.beginPath()
    ctx.arc(fx * w, fy * h, (4 + (i % 3)) * k, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  /* 底部雪堆 */
  ctx.fillStyle = 'rgba(255,255,255,0.82)'
  ;[-0.22, 0.05, 0.32].forEach((fx, i) => {
    ctx.beginPath()
    ctx.ellipse((0.5 + fx) * w, h - 8 * k, (64 + i * 14) * k, 16 * k, 0, 0, Math.PI * 2)
    ctx.fill()
  })
}

export const treeSkin: SkinDefinition = {
  id: 'tree',
  name: '圣诞工局',
  desc: '礼物盒挂上圣诞树，雪花慢慢飘',
  accent: '#A5D6A7',
  preview: 'linear-gradient(160deg, #14272E 0%, #1F4A3C 55%, #2F6B52 100%)',
  unlock: { type: 'season', from: '12-01', to: '01-06', offSeasonCost: 300 },
  backgroundCss: 'linear-gradient(180deg, #14272E 0%, #1D3A33 55%, #16302A 100%)',
  draw: drawTree,
  particles: 'snow',
  slots: (count, containerW, cardW, cardH, rowGap) => {
    const k = containerW / 750
    return Array.from({ length: count }, (_, i) => {
      const a = ANCHORS[i % ANCHORS.length]
      /* 工具超过锚点数时往下顺延一排 */
      const ring = Math.floor(i / ANCHORS.length)
      return {
        x: a.x * k,
        y: a.y * k + ring * (cardH * CARD_SCALE + 20 * k),
        scale: CARD_SCALE,
        rotate: a.rotate,
        z: i
      }
    })
  },
  hangingString: true,
  settleMs: 650,
  idleSway: true,
  hidePattern: true
}
