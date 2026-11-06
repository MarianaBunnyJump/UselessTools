/* ===================== 访客资料（昵称 + 头像色） =====================
 * 设计稿：头像用「颜色 + 昵称首字」拼出来，不上传图片、不占空间；仅存本机。
 * 昵称沿用旧 key `user_nickname`，头像色是新增 key。
 */

import { get, set } from './storage'

export const AVA_COLORS = ['#E8795A', '#2F4B43', '#B39DDB', '#FFB74D', '#4DB6AC', '#F48FB1']

export const NICK_MAX = 16

const NICK_KEY = 'user_nickname'
const COLOR_KEY = 'user_ava_color'

export function getNick(): string {
  const raw = get<string>(NICK_KEY, '')
  return typeof raw === 'string' ? raw.trim() : ''
}

/* 返回是否保存成功；空昵称按设计稿不允许保存（由调用方提示） */
export function setNick(v: string): boolean {
  const clean = String(v == null ? '' : v).trim().slice(0, NICK_MAX)
  if (!clean) return false
  return set(NICK_KEY, clean)
}

export function getColorIdx(): number {
  const i = get<number>(COLOR_KEY, 0)
  return Number.isFinite(i) ? ((i % AVA_COLORS.length) + AVA_COLORS.length) % AVA_COLORS.length : 0
}

export function setColorIdx(i: number): boolean {
  const n = Number(i)
  if (!Number.isFinite(n)) return false
  return set(COLOR_KEY, ((Math.floor(n) % AVA_COLORS.length) + AVA_COLORS.length) % AVA_COLORS.length)
}

export function avaColor(): string {
  return AVA_COLORS[getColorIdx()]
}

/* 首字：ASCII 字母转大写，其余原样；空值返回 '?' */
export function initialOf(v: string): string {
  const t = String(v == null ? '' : v).trim()
  if (!t) return '?'
  const c = t.charAt(0)
  return /[a-zA-Z]/.test(c) ? c.toUpperCase() : c
}

export function displayName(): string {
  return getNick() || '趣工局访客'
}

/* Lv.9 奖励：专属称号「摸鱼传奇」——名字后面挂个金标 */
export function hasTitleBadge(level: number): boolean {
  return level >= 9
}
