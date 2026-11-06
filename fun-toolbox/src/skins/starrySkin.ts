/* ===================== 星夜皮肤：卡片如星子散落夜空 =====================
 * 深蓝夜空 + 月亮 + 闪烁星子；网格槽位带轻微交错与倾角，像随手贴上去的星座。
 * 免费皮肤，用于让用户体验「皮肤换气质」。
 */

import { computeGridSlots } from '../utils/dragSort'
import { DRAG_CONFIG } from '../data/dragConfig'
import type { SkinDefinition } from './registry'

function drawStarry(ctx: any, w: number, h: number) {
  const k = w / 750
  /* 满月 + 光晕 */
  const mx = w * 0.82
  const my = 64 * k
  const glow = ctx.createRadialGradient(mx, my, 4 * k, mx, my, 60 * k)
  glow.addColorStop(0, 'rgba(255,244,214,0.5)')
  glow.addColorStop(1, 'rgba(255,244,214,0)')
  ctx.fillStyle = glow
  ctx.fillRect(mx - 60 * k, my - 60 * k, 120 * k, 120 * k)
  ctx.fillStyle = '#FFF4D6'
  ctx.beginPath()
  ctx.arc(mx, my, 24 * k, 0, Math.PI * 2)
  ctx.fill()
  /* 月面浅坑 */
  ctx.fillStyle = 'rgba(210,190,150,0.5)'
  ctx.beginPath()
  ctx.arc(mx - 7 * k, my - 5 * k, 5 * k, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(mx + 8 * k, my + 7 * k, 3.4 * k, 0, Math.PI * 2)
  ctx.fill()

  /* 底部远山剪影 */
  ctx.fillStyle = 'rgba(16,22,44,0.55)'
  ctx.beginPath()
  ctx.moveTo(0, h)
  ctx.lineTo(0, h - 30 * k)
  ctx.quadraticCurveTo(w * 0.25, h - 78 * k, w * 0.5, h - 34 * k)
  ctx.quadraticCurveTo(w * 0.75, h - 6 * k, w, h - 58 * k)
  ctx.lineTo(w, h)
  ctx.closePath()
  ctx.fill()
}

export const starrySkin: SkinDefinition = {
  id: 'starry',
  name: '星夜工局',
  desc: '卡片像星子一样，散在夜空里',
  accent: '#81D4FA',
  preview: 'linear-gradient(165deg, #1B2440 0%, #2A3560 55%, #3D4778 100%)',
  unlock: { type: 'level', level: 4 },
  backgroundCss: 'linear-gradient(180deg, #1B2440 0%, #2A3560 55%, #3D4778 100%)',
  draw: drawStarry,
  particles: 'twinkle',
  slots: (count, containerW, cardW, cardH, rowGap) => {
    const k = containerW / 750
    return computeGridSlots(count, containerW, cardW, cardH, rowGap).map((s, i) => ({
      ...s,
      /* 奇偶交错下沉 + 微倾，星座散落感 */
      y: s.y + (i % 2 === 1 ? 16 * k : 0),
      rotate: i % 2 === 0 ? -2.5 : 2.5
    }))
  },
  hangingString: false,
  settleMs: DRAG_CONFIG.settleRotateMs,
  idleSway: false,
  hidePattern: true
}
