/* ===================== 皮肤注册表 =====================
 * 首页不认识任何具体皮肤，只消费 slots() 与渲染字段；
 * 新增皮肤 = 加一个定义文件并登记到 SKINS，首页零改动（商业化的货架前提）。
 */

import { get, set } from '../utils/storage'
import { getWorkPoints } from './workPoints'

export interface SkinSlot {
  x: number         /* 卡片左上角 x（容器系真实 px） */
  y: number
  scale: number     /* 静置缩放（网格 1，树挂 0.7） */
  rotate: number    /* 静置倾角 deg */
  z: number         /* 层级（树下层在前） */
}

export type SkinUnlock =
  | { type: 'free' }
  /* 季节限定：季中免费领取永久保留，非季中用工分解锁 */
  | { type: 'season'; from: string; to: string; offSeasonCost: number }
  | { type: 'points'; cost: number }

export interface SkinDefinition {
  id: string
  name: string
  desc: string
  accent: string
  /* 设置页缩略色块预览 */
  preview: string
  unlock: SkinUnlock
  /* 页面背景渐变（替代全局主题 bg），缺省跟随主题 */
  backgroundCss?: string
  /* 网格容器内画布的静态绘制（夜树/月亮等，坐标与槽位同系） */
  draw?: (ctx: any, w: number, h: number) => void
  particles?: 'none' | 'snow' | 'twinkle' | 'confetti'
  slots: (count: number, containerW: number, cardW: number, cardH: number, rowGap: number) => SkinSlot[]
  hangingString: boolean   /* 卡片顶部挂绳 */
  settleMs: number         /* 松手回位（惯性回转）时长 */
  idleSway: boolean        /* 静置时缓慢摆动 */
  hidePattern: boolean     /* 皮肤自带背景时印花不生效 */
}

export const SKIN_EVENT = 'skin-changed'
/* 预览事件：payload 为皮肤 id，传空串取消预览 */
export const SKIN_PREVIEW_EVENT = 'skin-preview'

/* ---- 预览态（模块级共享，首页与设置页读写同一份；不落存储） ----
 * 预览由首页的「正在预览」提示条退出，或被真实切换覆盖；
 * 设置页卸载不取消预览（否则「预览→返回首页」会立刻自我取消） */
let previewSkinId = ''

export function getPreviewSkinId(): string {
  return previewSkinId
}

export function setPreviewSkinId(id: string) {
  previewSkinId = id || ''
}

export function getSkinById(id: string): SkinDefinition {
  return SKINS.find(s => s.id === id) || SKINS[0]
}

export function getActiveSkinId(): string {
  return get<string>('skin_active', 'grid')
}

export function getOwnedSkins(): string[] {
  const owned = get<string[]>('skins_owned', ['grid'])
  if (!owned.includes('grid')) owned.unshift('grid')
  return owned
}

export function ownsSkin(id: string): boolean {
  return getOwnedSkins().includes(id)
}

/* MM-DD 季节区间（支持跨年，如 12-01 ~ 01-06） */
export function inSeason(from: string, to: string): boolean {
  const now = new Date()
  const md = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return from <= to ? md >= from && md <= to : md >= from || md <= to
}

/* 解锁所需工分（free 恒 0） */
export function skinCost(skin: SkinDefinition): number {
  if (skin.unlock.type === 'free') return 0
  if (skin.unlock.type === 'season') return inSeason(skin.unlock.from, skin.unlock.to) ? 0 : skin.unlock.offSeasonCost
  return skin.unlock.cost
}

/* 尝试领取/解锁：成功则写入 skins_owned（不扣工分，达标即可，解锁即永久） */
export function claimSkin(id: string): boolean {
  const skin = getSkinById(id)
  if (!skin || ownsSkin(id)) return ownsSkin(id)
  if (getWorkPoints() < skinCost(skin)) return false
  const owned = getOwnedSkins()
  owned.push(id)
  set('skins_owned', owned)
  return true
}

/* 激活（需已拥有）；调用方负责广播 SKIN_EVENT */
export function activateSkin(id: string): boolean {
  if (!ownsSkin(id)) return false
  set('skin_active', id)
  return true
}

/* ---- 具体皮肤 ---- */
import { gridSkin } from './gridSkin'
import { treeSkin } from './treeSkin'
import { starrySkin } from './starrySkin'
import { toySkin } from './toySkin'

export const SKINS: SkinDefinition[] = [gridSkin, treeSkin, starrySkin, toySkin]
