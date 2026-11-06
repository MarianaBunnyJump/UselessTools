/* ===================== 默认皮肤：经典货架（两列网格） =====================
 * 视觉与升级前完全一致：跟随全局背景 + 印花系统，零感知默认。
 */

import { computeGridSlots } from '../utils/dragSort'
import { DRAG_CONFIG } from '../data/dragConfig'
import type { SkinDefinition } from './registry'

export const gridSkin: SkinDefinition = {
  id: 'grid',
  name: '经典货架',
  desc: '两列网格 · 跟随全局背景',
  accent: '#FF9A8B',
  preview: 'linear-gradient(150deg, #FFE8D6 0%, #FFD3C8 55%, #F8DFF0 100%)',
  unlock: { type: 'level', level: 7 },
  slots: (count, containerW, cardW, cardH, rowGap) =>
    computeGridSlots(count, containerW, cardW, cardH, rowGap),
  hangingString: false,
  settleMs: DRAG_CONFIG.settleRotateMs,
  idleSway: false,
  hidePattern: false
}
