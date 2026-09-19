/* ===================== 玩具工局皮肤：玩具反斗城风的可爱玩具店 =====================
 * 天蓝底 + 马卡龙彩虹拱桥 + 云朵 + 底部积木块，彩屑粒子慢慢飘。
 * 免费；槽位沿用两列网格，奇偶交替微倾制造玩具摆放的俏皮感。
 */

import { computeGridSlots } from '../utils/dragSort'
import { DRAG_CONFIG } from '../data/dragConfig'
import type { SkinDefinition } from './registry'

const RAINBOW = ['#FF8A80', '#FFB74D', '#FFF176', '#A5D6A7', '#81D4FA', '#B39DDB']
const BLOCK_COLORS = ['#EF5350', '#FFCA28', '#66BB6A', '#42A5F5', '#AB47BC']

function cloud(ctx: any, x: number, y: number, k: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ;[
    [0, 0, 26],
    [22, 6, 20],
    [-22, 7, 19]
  ].forEach(([dx, dy, r]) => {
    ctx.beginPath()
    ctx.arc(x + dx * k, y + dy * k, r * k, 0, Math.PI * 2)
    ctx.fill()
  })
}

function toyBlock(ctx: any, x: number, y: number, size: number, color: string, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.92
  const r = size * 0.18
  ctx.beginPath()
  ctx.moveTo(-size / 2 + r, -size / 2)
  ctx.arcTo(size / 2, -size / 2, size / 2, size / 2, r)
  ctx.arcTo(size / 2, size / 2, -size / 2, size / 2, r)
  ctx.arcTo(-size / 2, size / 2, -size / 2, -size / 2, r)
  ctx.arcTo(-size / 2, -size / 2, size / 2, -size / 2, r)
  ctx.closePath()
  ctx.fill()
  /* 顶部两个凸点（积木颗粒） */
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ;[-size * 0.22, size * 0.22].forEach(dx => {
    ctx.beginPath()
    ctx.arc(dx, -size / 2 + size * 0.1, size * 0.11, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
  ctx.restore()
}

function drawToyShop(ctx: any, w: number, h: number) {
  const k = w / 750

  /* 马卡龙彩虹拱桥：圆心在页面下方，拱跨过卡片区 */
  const cx = w / 2
  const cy = h * 1.04
  ctx.lineWidth = 13 * k
  RAINBOW.forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(cx, cy, w * 0.58 - i * 15 * k, Math.PI, 0)
    ctx.strokeStyle = c
    ctx.globalAlpha = 0.55
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  /* 云朵 */
  cloud(ctx, w * 0.18, h * 0.1, k)
  cloud(ctx, w * 0.82, h * 0.07, k)
  cloud(ctx, w * 0.9, h * 0.32, k)

  /* 地面 */
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h - 6 * k, w * 0.75, 22 * k, 0, 0, Math.PI * 2)
  ctx.fill()

  /* 底部散落的积木块 */
  toyBlock(ctx, w * 0.1, h - 54 * k, 52 * k, BLOCK_COLORS[0], -0.18)
  toyBlock(ctx, w * 0.26, h - 30 * k, 40 * k, BLOCK_COLORS[1], 0.14)
  toyBlock(ctx, w * 0.74, h - 36 * k, 46 * k, BLOCK_COLORS[2], -0.1)
  toyBlock(ctx, w * 0.9, h - 62 * k, 52 * k, BLOCK_COLORS[3], 0.2)
}

export const toySkin: SkinDefinition = {
  id: 'toy',
  name: '玩具工局',
  desc: '彩虹、云朵和积木，永远玩不腻',
  accent: '#4FC3F7',
  preview: 'linear-gradient(165deg, #81D4FA 0%, #B3E5FC 45%, #FFF176 100%)',
  unlock: { type: 'free' },
  backgroundCss: 'linear-gradient(180deg, #64C7F5 0%, #9FDDF9 55%, #C9EEFC 100%)',
  draw: drawToyShop,
  particles: 'confetti',
  slots: (count, containerW, cardW, cardH, rowGap) =>
    computeGridSlots(count, containerW, cardW, cardH, rowGap).map((s, i) => ({
      ...s,
      rotate: i % 2 === 0 ? -2 : 2
    })),
  hangingString: false,
  settleMs: DRAG_CONFIG.settleRotateMs,
  idleSway: false,
  hidePattern: true
}
