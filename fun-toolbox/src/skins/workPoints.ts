/* ===================== 工分体系兼容层 =====================
 * 规则与数值已全部迁到 utils/growth.ts（等级非线性、工分独立落盘）。
 * 本文件只保留旧签名，供尚未重构的页面（level / settings / SimpleHome / registry）继续调用，
 * 三栏重构完成后会逐步移除这些调用点。
 */

import { get, set } from '../utils/storage'
import {
  LV_NEED,
  MAX_LEVEL,
  getPoints,
  lvOf,
  lvName,
  lvRemain,
  LV_REWARD
} from '../utils/growth'

export { MAX_LEVEL }

/* 旧常量名保留（旧代码里有引用）；新代码请用 growth 的 POINTS_PER_OPEN */
export const WORK_POINT_PER_OPEN = 10
/** 旧版每级固定 200 分，新版已非线性——仅为兼容旧调用点保留，勿用于新逻辑 */
export const LEVEL_STEP = 0

export const TITLE_PREFIXES = ['快乐的', '有趣的', '好玩的'] as const
export const TITLE_PREFIX_EVENT = 'title-prefix-changed'
const TITLE_PREFIX_KEY = 'home_title_prefix'

export function getWorkPoints(): number {
  return getPoints()
}

export interface WorkLevel {
  level: number
  curBase: number
  nextAt: number
}

export function getWorkLevel(points: number): WorkLevel {
  const level = lvOf(points)
  const curBase = LV_NEED[level - 1]
  const nextAt = level >= MAX_LEVEL ? curBase : LV_NEED[level]
  return { level, curBase, nextAt }
}

export function getLevelThreshold(level: number): number {
  return LV_NEED[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
}

export function getLevelRemain(points: number): number | null {
  return lvRemain(points)
}

/* 称号改为设计稿的「摸鱼」系列 */
export function getLevelTitle(level: number): string {
  return lvName(level)
}

export function getLevelBenefit(level: number): { text: string; implemented: boolean } {
  const r = LV_REWARD[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
  return { text: `${r.t} · ${r.d}`, implemented: true }
}

/* ---- 标题前缀（旧功能，三栏首页改用设计稿的固定「摸鱼界」前缀后移除） ---- */

export function getAvailableTitlePrefixes(level: number): readonly string[] {
  return level >= 3 ? TITLE_PREFIXES : []
}

export function getSelectedTitlePrefix(level: number): string {
  if (level < 3) return ''
  const saved = get<string>(TITLE_PREFIX_KEY, TITLE_PREFIXES[0])
  return TITLE_PREFIXES.includes(saved as typeof TITLE_PREFIXES[number]) ? saved : TITLE_PREFIXES[0]
}

export function saveTitlePrefix(prefix: string, level: number): boolean {
  if (!getAvailableTitlePrefixes(level).includes(prefix)) return false
  return set(TITLE_PREFIX_KEY, prefix)
}
