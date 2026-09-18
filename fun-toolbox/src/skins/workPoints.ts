/* ===================== 工分体系（由使用记录实时派生，不落盘） =====================
 * 工分 = Σ(各工具打开次数) × 10；等级每 200 工分一级，上限 Lv.10
 * 只用于皮肤/装饰解锁，不做签到任务（守住工具类目定位）
 */

import { get } from '../utils/storage'
import { TOOLS } from '../data/tools'

export const WORK_POINT_PER_OPEN = 10
export const LEVEL_STEP = 200
export const MAX_LEVEL = 10

export function getWorkPoints(): number {
  const opens = TOOLS.reduce((sum, t) => sum + (get<number>(`usage_${t.id}`, 0) || 0), 0)
  return opens * WORK_POINT_PER_OPEN
}

export interface WorkLevel {
  level: number
  /* 当前等级起点工分 */
  curBase: number
  /* 下一级所需工分（满级时等于 curBase） */
  nextAt: number
}

export function getWorkLevel(points: number): WorkLevel {
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(points / LEVEL_STEP))
  const curBase = (level - 1) * LEVEL_STEP
  const nextAt = level >= MAX_LEVEL ? curBase : level * LEVEL_STEP
  return { level, curBase, nextAt }
}
