/* ===================== 首页工具位（礼盒格） =====================
 * 设计稿：首页只放「选中的工具」，数量上限随等级增长（Lv.1 起 6 个 → Lv.10 满 10 个）；
 * 没选中的全部留在「列表」。旧的 home_tool_order 是「全部工具排序」，语义不同，
 * 这里首次读取时按当前等级位上限截断结转。
 */

import { get, set } from './storage'
import { TOOLS } from '../data/tools'
import { homeSlots, lvOf, getPoints } from './growth'

const MINE_KEY = 'home_mine_v1'
const ORDER_KEY = 'home_tool_order'

/* 设计稿默认首页（Lv.1 的 6 个位） */
export const DEFAULT_MINE = ['counter', 'merit', 'mixer', 'wheel', 'crusher', 'life']

export const MAX_HOME_SLOTS = 10

const validIds = new Set(TOOLS.map(t => t.id))

function sanitize(list: unknown): string[] {
  if (!Array.isArray(list)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of list) {
    if (typeof id === 'string' && validIds.has(id) && !seen.has(id)) {
      seen.add(id)
      out.push(id)
    }
  }
  return out
}

/* 当前等级允许的位数是硬上限，存储里超出部分不显示 */
export function slotCap(): number {
  return homeSlots(lvOf(getPoints()))
}

export function getMine(): string[] {
  const saved = get<string[] | null>(MINE_KEY, null)
  if (Array.isArray(saved)) {
    /* 用户已经选过就以存储为准（哪怕选空了也不回落旧排序），
     * 否则「把首页工具全部收起 → 再回首页」会被旧 home_tool_order 重新填满 */
    return sanitize(saved).slice(0, MAX_HOME_SLOTS)
  }

  /* 首次打开：用旧版本的排序表前 N 个结转为首页工具 */
  const oldOrder = sanitize(get<string[]>(ORDER_KEY, []))
  const base = oldOrder.length ? oldOrder : DEFAULT_MINE.filter(id => validIds.has(id))
  const mine = base.slice(0, slotCap())
  set(MINE_KEY, mine)
  return mine
}

export function saveMine(list: string[]): boolean {
  return set(MINE_KEY, sanitize(list).slice(0, MAX_HOME_SLOTS))
}

/* 首页实际渲染的（受当前等级位上限约束） */
export function visibleMine(): string[] {
  return getMine().slice(0, slotCap())
}

export interface PickResult {
  ok: boolean
  reason?: 'unknown' | 'full' | 'dup'
  mine: string[]
}

export function toggleMine(id: string): PickResult {
  const mine = getMine()
  if (!validIds.has(id)) return { ok: false, reason: 'unknown', mine }

  if (mine.includes(id)) {
    const next = mine.filter(x => x !== id)
    saveMine(next)
    return { ok: true, mine: next }
  }

  const cap = slotCap()
  if (mine.length >= cap) return { ok: false, reason: 'full', mine }

  const next = [...mine, id]
  saveMine(next)
  return { ok: true, mine: next }
}

export function removeMine(id: string): string[] {
  const next = getMine().filter(x => x !== id)
  saveMine(next)
  return next
}

/* 列表页「👁 从首页收起」用同一份数据 */
export function isInMine(id: string): boolean {
  return getMine().includes(id)
}
