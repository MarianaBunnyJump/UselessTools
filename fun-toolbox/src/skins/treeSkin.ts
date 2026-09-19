/* ===================== 圣诞树皮肤：礼物盒挂上圣诞树 =====================
 * 夜幕背景由 backgroundCss 提供；本画布画完整树景（与槽位同坐标系）：
 * 蓬松四层树冠 + 积雪边缘 + 彩灯带 + 彩球 + 树顶五角星 + 树干礼物堆 + 枝干挂台。
 * 锚点/结构均为 750 设计 px，运行时按容器宽换算；调布局只改 ANCHORS / 树参数。
 */

import type { SkinDefinition } from './registry'

/* 卡片缩为一半，像小挂牌一样挂枝 */
const CARD_SCALE = 0.5

/* 挂点（设计 px，卡片 translate 左上角）：三排两列 */
const ANCHORS = [
  { x: 160, y: 190, rotate: -5 },
  { x: 415, y: 190, rotate: 4 },
  { x: 105, y: 400, rotate: 6 },
  { x: 455, y: 400, rotate: -5 },
  { x: 145, y: 610, rotate: -4 },
  { x: 420, y: 610, rotate: 5 }
]

/* 虚拟画布高（设计 px）：树景按此布局 */
const TREE_H = 780

/* 卡片视觉中心相对 translate 的偏移 = 卡宽 × 缩放（中心原点缩放）= 363 × 0.5 */
const CARD_VISUAL_OFFSET = 363 * CARD_SCALE

const TIER_GREENS = ['#2F7D58', '#296F4E', '#256045', '#205238']
const BAUBLE_COLORS = ['#EF5350', '#FFD54F', '#42A5F5', '#F48FB1', '#AB47BC']

function starPath(ctx: any, cx: number, cy: number, outer: number, inner: number) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function giftBox(ctx: any, x: number, y: number, w: number, h: number, body: string, ribbon: string) {
  ctx.fillStyle = body
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = ribbon
  ctx.fillRect(x + w / 2 - w * 0.07, y, w * 0.14, h)
  ctx.fillRect(x, y + h * 0.36, w, h * 0.12)
  /* 蝴蝶结 */
  ctx.beginPath()
  ctx.arc(x + w / 2 - w * 0.1, y - h * 0.04, w * 0.09, 0, Math.PI * 2)
  ctx.arc(x + w / 2 + w * 0.1, y - h * 0.04, w * 0.09, 0, Math.PI * 2)
  ctx.fill()
}

function drawTree(ctx: any, w: number, h: number) {
  const k = w / 750
  const cx = w / 2
  const d = (v: number) => v * k

  /* ---- 夜空小星（静态，两侧留白处） ---- */
  const SKY: [number, number, number][] = [
    [0.07, 0.07, 2], [0.14, 0.16, 1.4], [0.24, 0.05, 1.8], [0.32, 0.14, 1.3],
    [0.68, 0.06, 1.7], [0.78, 0.12, 1.3], [0.88, 0.05, 2], [0.95, 0.13, 1.4],
    [0.04, 0.3, 1.5], [0.96, 0.28, 1.6]
  ]
  SKY.forEach(([fx, fy, r]) => {
    ctx.globalAlpha = 0.65
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(fx * w, fy * h, r * k * 2, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  /* ---- 四层蓬松树冠：每层 3 个交叠三角；自下而上绘制 ---- */
  const tiers = [
    { base: 130, halfW: 0.24, color: TIER_GREENS[0] },
    { base: 310, halfW: 0.33, color: TIER_GREENS[1] },
    { base: 490, halfW: 0.42, color: TIER_GREENS[2] },
    { base: 660, halfW: 0.5, color: TIER_GREENS[3] }
  ]
  for (let i = tiers.length - 1; i >= 0; i--) {
    const t = tiers[i]
    const apexY = i === 0 ? 10 : tiers[i - 1].base
    const hw = t.halfW * w
    const bh = (t.base - apexY) * k
    /* 主三角 + 两侧矮三角（蓬松轮廓） */
    ;[
      { ax: cx, ay: d(apexY), hw, bh },
      { ax: cx - hw * 0.52, ay: d(apexY) + bh * 0.18, hw: hw * 0.72, bh: bh * 0.94 },
      { ax: cx + hw * 0.52, ay: d(apexY) + bh * 0.18, hw: hw * 0.72, bh: bh * 0.94 }
    ].forEach(tri => {
      ctx.beginPath()
      ctx.moveTo(tri.ax, tri.ay)
      ctx.lineTo(tri.ax + tri.hw, tri.ay + tri.bh)
      ctx.lineTo(tri.ax - tri.hw, tri.ay + tri.bh)
      ctx.closePath()
      ctx.fillStyle = t.color
      ctx.fill()
    })
    /* 层底积雪：一排半圆鼓包 */
    const snowY = d(t.base)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    for (let sx = cx - hw * 0.92; sx <= cx + hw * 0.92; sx += d(34)) {
      ctx.beginPath()
      ctx.arc(sx, snowY, d(13), Math.PI, 0)
      ctx.fill()
    }
  }

  /* ---- 彩灯带：两条金色弧线 + 串灯小点 ---- */
  ctx.strokeStyle = '#FFD54F'
  ctx.globalAlpha = 0.9
  ctx.lineWidth = d(4)
  const garlands = [
    { x1: cx - 0.26 * w, y1: d(210), cx2: cx, cy2: d(282), x2: cx + 0.26 * w, y2: d(200) },
    { x1: cx - 0.37 * w, y1: d(420), cx2: cx, cy2: d(500), x2: cx + 0.37 * w, y2: d(410) }
  ]
  garlands.forEach(g => {
    ctx.beginPath()
    ctx.moveTo(g.x1, g.y1)
    ctx.quadraticCurveTo(g.cx2, g.cy2, g.x2, g.y2)
    ctx.stroke()
    /* 灯泡点 */
    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      const mt = 1 - t
      const bx = mt * mt * g.x1 + 2 * mt * t * g.cx2 + t * t * g.x2
      const by = mt * mt * g.y1 + 2 * mt * t * g.cy2 + t * t * g.y2
      ctx.fillStyle = '#FFF59D'
      ctx.beginPath()
      ctx.arc(bx, by + d(8), d(5), 0, Math.PI * 2)
      ctx.fill()
    }
  })
  ctx.globalAlpha = 1

  /* ---- 彩球：沿各层底缘散布 ---- */
  tiers.forEach((t, ti) => {
    const hw = t.halfW * w
    ;[-0.62, -0.3, 0.34, 0.66].forEach((fx, bi) => {
      const bx = cx + fx * hw
      const by = d(t.base) - d(16)
      ctx.fillStyle = BAUBLE_COLORS[(ti + bi) % BAUBLE_COLORS.length]
      ctx.beginPath()
      ctx.arc(bx, by, d(8), 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.beginPath()
      ctx.arc(bx - d(2.5), by - d(2.5), d(2.4), 0, Math.PI * 2)
      ctx.fill()
    })
  })

  /* ---- 树干 + 树下礼物 + 雪地 ---- */
  ctx.fillStyle = '#7A5230'
  ctx.fillRect(cx - d(18), d(655), d(36), d(66))
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(cx + d(8), d(655), d(10), d(66))
  giftBox(ctx, cx - d(150), d(688), d(92), d(66), '#EF5350', '#FFD54F')
  giftBox(ctx, cx - d(24), d(704), d(64), d(50), '#FFCA28', '#EF5350')
  giftBox(ctx, cx + d(62), d(694), d(100), d(60), '#42A5F5', '#FFF176')

  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.beginPath()
  ctx.ellipse(cx, d(752), w * 0.55, d(24), 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx - w * 0.36, d(738), w * 0.16, d(14), 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + w * 0.38, d(742), w * 0.14, d(12), 0, 0, Math.PI * 2)
  ctx.fill()

  /* ---- 树顶五角星 + 光晕 ---- */
  const glow = ctx.createRadialGradient(cx, d(16), d(4), cx, d(16), d(70))
  glow.addColorStop(0, 'rgba(255,213,79,0.9)')
  glow.addColorStop(1, 'rgba(255,213,79,0)')
  ctx.fillStyle = glow
  ctx.fillRect(cx - d(70), -d(54), d(140), d(140))
  ctx.fillStyle = '#FFD54F'
  starPath(ctx, cx, d(16), d(30), d(12))
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = d(1.6)
  ctx.stroke()

  /* ---- 枝干挂台：每个锚点一条积雪短枝，卡片从这里垂下 ---- */
  ANCHORS.forEach(a => {
    const center = a.x + CARD_VISUAL_OFFSET
    const ly = a.y - d(24)
    ctx.fillStyle = '#256045'
    ctx.fillRect(d(center - 125), ly - d(11), d(250), d(22))
    /* 枝上积雪鼓包 */
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    for (let sx = d(center - 100); sx <= d(center + 100); sx += d(34)) {
      ctx.beginPath()
      ctx.arc(sx, ly - d(10), d(10), Math.PI, 0)
      ctx.fill()
    }
  })
}

export const treeSkin: SkinDefinition = {
  id: 'tree',
  name: '圣诞工局',
  desc: '礼物盒挂上圣诞树，雪花慢慢飘',
  accent: '#A5D6A7',
  preview: 'linear-gradient(160deg, #123024 0%, #1F4A3C 55%, #2F7D58 100%)',
  unlock: { type: 'season', from: '12-01', to: '01-06', offSeasonCost: 300 },
  /* 森林绿夜幕：与星夜工局的藏蓝明显区分 */
  backgroundCss: 'linear-gradient(180deg, #123024 0%, #1E4A38 55%, #173B2C 100%)',
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
