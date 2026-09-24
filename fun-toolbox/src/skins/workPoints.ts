/* ===================== 工分体系（由使用记录实时派生，不落盘） =====================
 * 工分 = Σ(各工具打开次数) × 10；等级每 200 工分一级，上限 Lv.10
 * 本机等级不能作为云端账号或会员权益的凭据。
 */

import { get, set } from '../utils/storage'
import { TOOLS } from '../data/tools'

export const WORK_POINT_PER_OPEN = 10
export const LEVEL_STEP = 200
export const MAX_LEVEL = 10

export const TITLE_PREFIXES = ['快乐的', '有趣的', '好玩的'] as const
export const TITLE_PREFIX_EVENT = 'title-prefix-changed'
const TITLE_PREFIX_KEY = 'home_title_prefix'

export function getLevelThreshold(level: number): number {
  return Math.max(0, Math.min(MAX_LEVEL, level) - 1) * LEVEL_STEP
}

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

export function getWorkPoints(): number {
  const opens = TOOLS.reduce((sum, t) => sum + (get<number>(`usage_${t.id}`, 0) || 0), 0)
  return opens * WORK_POINT_PER_OPEN
}

export interface WorkLevel {
  level: number
  curBase: number
  nextAt: number
}

export function getWorkLevel(points: number): WorkLevel {
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(points / LEVEL_STEP))
  const curBase = (level - 1) * LEVEL_STEP
  const nextAt = level >= MAX_LEVEL ? curBase : level * LEVEL_STEP
  return { level, curBase, nextAt }
}

export function getLevelTitle(level: number): string {
  const titles = ['初来乍到', '熟门熟路', '快乐工友', '趣味达人', '好玩行家', '闪耀匠人', '奇想大师', '资深玩家', '传奇工友', '工局局长']
  return titles[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
}

export function getLevelBenefit(level: number): { text: string; implemented: boolean } {
  const benefits = [
    { text: '查看工局等级与成长进度', implemented: true },
    { text: '获得「熟门熟路」称号', implemented: true },
    { text: '首页选择「快乐的 / 有趣的 / 好玩的」前缀', implemented: true },
    { text: '等级专属皮肤权益（规划中）', implemented: false },
    { text: '首页标题点击触发专属彩带', implemented: true },
    { text: '更多装饰物展示位（规划中）', implemented: false },
    { text: '高级工局徽章（规划中）', implemented: false },
    { text: '专属分享卡片边框（规划中）', implemented: false },
    { text: '局长候选权益（规划中）', implemented: false },
    { text: '终极局长徽章（规划中）', implemented: false }
  ]
  return benefits[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
}
