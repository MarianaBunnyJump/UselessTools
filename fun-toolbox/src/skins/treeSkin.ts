/* ===================== 圣诞树皮肤：礼物盒挂上圣诞树 =====================
 * 夜幕背景由 backgroundCss 提供；画布画完整树景（与槽位同坐标系）：
 * 星顶 + 蓬松多层树冠（层数随容器高自适应）+ 积雪边缘 + 彩灯带 + 彩球
 * + 树干礼物堆 + 积雪短枝挂台。卡片全部沿树中线纵向悬挂，页面随内容滚动。
 * 常量均为 750 设计 px，运行时按容器宽换算。
 */

import type { SkinDefinition } from './registry'

/* 小挂牌挂在树前，拖动时保持同样的尺寸 */
const CARD_SCALE = 0.58

/* 中线左右交错偏移（设计 px），循环取用 */
const ROW_OFFSETS = [-70, 70, -45, 52, -60, 62, -30, 42, -58]
/* 各排静置倾角 */
const ROW_TILTS = [-4, 4, -6, 5, -3, 6, -5, 3, -4]

/* 行布局（设计 px） */
const ROW_TOP = 240
const ROW_PITCH = 172

const TIER_GREENS = ['#2F7D58', '#296F4E', '#256045', '#205238', '#1D4A34']
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
  ctx.beginPath()
  ctx.arc(x + w / 2 - w * 0.1, y - h * 0.06, w * 0.09, 0, Math.PI * 2)
  ctx.arc(x + w / 2 + w * 0.1, y - h * 0.06, w * 0.09, 0, Math.PI * 2)
  ctx.fill()
}

function drawTree(ctx: any, w: number, h: number) {
  const k = w / 750
  const cx = w / 2
  const d = (v: number) => v * k

  /* ---- 夜空小星（静态） ---- */
  const SKY: [number, number, number][] = [
    [0.07, 0.05, 2], [0.15, 0.11, 1.4], [0.25, 0.04, 1.8], [0.33, 0.1, 1.3],
    [0.67, 0.05, 1.7], [0.77, 0.1, 1.3], [0.88, 0.04, 2], [0.95, 0.1, 1.4],
    [0.05, 0.22, 1.5], [0.95, 0.2, 1.6], [0.1, 0.4, 1.3], [0.9, 0.42, 1.3]
  ]
  SKY.forEach(([fx, fy, r]) => {
    ctx.globalAlpha = 0.65
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(fx * w, fy * h, r * k * 2, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  /* ---- 树冠：层数随容器高自适应，自下而上绘制 ---- */
  const trunkTop = h - d(200)
  const tierPitch = d(240)
  const tierCount = Math.max(3, Math.min(9, Math.round((h - d(340)) / tierPitch)))
  for (let j = 0; j < tierCount; j++) {
    /* j=0 最底层（最宽），越往上越窄 */
    const baseY = trunkTop - j * tierPitch
    const halfW = w * (0.46 - (0.26 * j) / Math.max(1, tierCount - 1))
    const apexY = baseY - tierPitch * 0.98
    const color = TIER_GREENS[j % TIER_GREENS.length]
    /* 主三角 + 两侧矮三角（蓬松轮廓） */
    ;[
      { ax: cx, ay: apexY, hw: halfW, bh: baseY - apexY },
      { ax: cx - halfW * 0.52, ay: apexY + (baseY - apexY) * 0.18, hw: halfW * 0.72, bh: (baseY - apexY) * 0.9 },
      { ax: cx + halfW * 0.52, ay: apexY + (baseY - apexY) * 0.18, hw: halfW * 0.72, bh: (baseY - apexY) * 0.9 }
    ].forEach(tri => {
      ctx.beginPath()
      ctx.moveTo(tri.ax, tri.ay)
      ctx.lineTo(tri.ax + tri.hw, tri.ay + tri.bh)
      ctx.lineTo(tri.ax - tri.hw, tri.ay + tri.bh)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    })
    /* 层底积雪鼓包 */
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    for (let sx = cx - halfW * 0.9; sx <= cx + halfW * 0.9; sx += d(36)) {
      ctx.beginPath()
      ctx.arc(sx, baseY, d(13), Math.PI, 0)
      ctx.fill()
    }
    /* 彩球 */
    ;[-0.6, -0.28, 0.32, 0.64].forEach((fx, bi) => {
      ctx.fillStyle = BAUBLE_COLORS[(j + bi) % BAUBLE_COLORS.length]
      ctx.beginPath()
      ctx.arc(cx + fx * halfW, baseY - d(16), d(8), 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.beginPath()
      ctx.arc(cx + fx * halfW - d(2.5), baseY - d(18.5), d(2.4), 0, Math.PI * 2)
      ctx.fill()
    })
    /* 隔层一条彩灯带 */
    if (j % 2 === 0 && j > 0) {
      ctx.strokeStyle = '#FFD54F'
      ctx.globalAlpha = 0.9
      ctx.lineWidth = d(4)
      const gTop = baseY - tierPitch * 0.72
      const gHalf = halfW * 0.8
      ctx.beginPath()
      ctx.moveTo(cx - gHalf, gTop)
      ctx.quadraticCurveTo(cx, gTop + tierPitch * 0.5, cx + gHalf, gTop - d(8))
      ctx.stroke()
      for (const t of [0.25, 0.5, 0.75]) {
        const mt = 1 - t
        const bx = mt * mt * (cx - gHalf) + 2 * mt * t * cx + t * t * (cx + gHalf)
        const by = mt * mt * gTop + 2 * mt * t * (gTop + tierPitch * 0.5) + t * t * (gTop - d(8))
        ctx.fillStyle = '#FFF59D'
        ctx.beginPath()
        ctx.arc(bx, by + d(8), d(5), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
  }

  /* ---- 树干 + 树下礼物 + 雪地 ---- */
  ctx.fillStyle = '#7A5230'
  ctx.fillRect(cx - d(19), trunkTop - d(6), d(38), d(96))
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(cx + d(9), trunkTop - d(6), d(10), d(96))
  giftBox(ctx, cx - d(150), h - d(108), d(92), d(66), '#EF5350', '#FFD54F')
  giftBox(ctx, cx - d(26), h - d(92), d(64), d(50), '#FFCA28', '#EF5350')
  giftBox(ctx, cx + d(60), h - d(102), d(100), d(60), '#42A5F5', '#FFF176')
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.beginPath()
  ctx.ellipse(cx, h - d(42), w * 0.55, d(24), 0, 0, Math.PI * 2)
  ctx.fill()

  /* ---- 树顶五角星 + 光晕 ---- */
  const glow = ctx.createRadialGradient(cx, d(46), d(4), cx, d(46), d(72))
  glow.addColorStop(0, 'rgba(255,213,79,0.9)')
  glow.addColorStop(1, 'rgba(255,213,79,0)')
  ctx.fillStyle = glow
  ctx.fillRect(cx - d(72), -d(26), d(144), d(144))
  ctx.fillStyle = '#FFD54F'
  starPath(ctx, cx, d(46), d(30), d(12))
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = d(1.6)
  ctx.stroke()

  /* ---- 枝干挂台：沿中线每排一条积雪短枝，卡片从这里垂下 ---- */
  const visibleRows = Math.min(9, Math.max(0, Math.floor((h - d(ROW_TOP)) / d(ROW_PITCH)) + 1))
  for (let i = 0; i < visibleRows; i++) {
    const center = cx + ROW_OFFSETS[i % ROW_OFFSETS.length] * k
    const ly = d(ROW_TOP + i * ROW_PITCH) - d(24)
    ctx.fillStyle = '#256045'
    ctx.fillRect(center - d(125), ly - d(11), d(250), d(22))
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    for (let sx = center - d(100); sx <= center + d(100); sx += d(34)) {
      ctx.beginPath()
      ctx.arc(sx, ly - d(10), d(10), Math.PI, 0)
      ctx.fill()
    }
  }
}

export const treeSkin: SkinDefinition = {
  id: 'tree',
  name: '圣诞工局',
  desc: '礼物盒挂上圣诞树，雪花慢慢飘',
  accent: '#A5D6A7',
  preview: 'linear-gradient(160deg, #123024 0%, #1F4A3C 55%, #2F7D58 100%)',
  unlock: { type: 'season', from: '12-01', to: '12-31', offSeasonCost: 0, previewOnlyOutsideSeason: true },
  /* 森林绿夜幕：与星夜工局的藏蓝明显区分 */
  backgroundCss: 'linear-gradient(180deg, #123024 0%, #1E4A38 55%, #173B2C 100%)',
  draw: drawTree,
  particles: 'snow',
  slots: (count, containerW, cardW, cardH, rowGap) => {
    const k = containerW / 750
    return Array.from({ length: count }, (_, i) => ({
      /* 卡片中心贴树中线，左右小偏移交错 */
      x: containerW / 2 - (cardW * CARD_SCALE) / 2 + ROW_OFFSETS[i % ROW_OFFSETS.length] * k,
      y: (ROW_TOP + i * ROW_PITCH) * k,
      scale: CARD_SCALE,
      rotate: ROW_TILTS[i % ROW_TILTS.length],
      z: i
    }))
  },
  hangingString: true,
  settleMs: 650,
  idleSway: true,
  hidePattern: true
}
