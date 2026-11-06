/* ===================== 等级成长规则（严格照 Docs/趣工局-三栏新版设计稿.html） =====================
 * 工分独立落盘（旧版是从 usage_* 实时派生，无存储）。
 * 来源：每日签到 + 打开工具。等级非线性，满级 Lv.10。
 * 本机等级只作本机激励，不作为云端账号或会员权益凭据。
 */

import { get, set } from './storage'
import { TOOLS } from '../data/tools'

export const MAX_LEVEL = 10

/* 每一级所需工分（下标 = 等级 - 1）。设计稿原值，未做调整。 */
export const LV_NEED = [0, 0, 300, 500, 700, 950, 1200, 1500, 1800, 2200]

export const LV_NAME = [
  '新手', '摸鱼学徒', '摸鱼小工', '摸鱼能手', '摸鱼达人',
  '摸鱼高手', '摸鱼大师', '摸鱼宗师', '摸鱼传奇', '摸鱼之神'
]

export interface GrowthReward {
  icon: string
  t: string
  d: string
}

/* 每一级的奖励（设计稿 LV_REWARD 原样） */
export const LV_REWARD: GrowthReward[] = [
  { icon: '🧰', t: '6 个首页工具位', d: '把最常用的工具摆在礼盒格里' },
  { icon: '📅', t: '每日签到领工分', d: '签到 +2 工分，连着签还有额外奖励' },
  { icon: '🧰', t: '工具位 +1', d: '首页可以放 7 个工具了' },
  { icon: '🌙', t: '解锁皮肤「星夜工局」', d: '深蓝夜空，月亮挂在山那边' },
  { icon: '🔥', t: '连签加成', d: '每次连签奖励多给 1 工分' },
  { icon: '🧰', t: '工具位 +1', d: '首页可以放 8 个工具了' },
  { icon: '🎨', t: '解锁皮肤「网格工局」', d: '暖米底 + 橙色点阵印花' },
  { icon: '🧰', t: '工具位 +1', d: '首页可以放 9 个工具了' },
  { icon: '🏅', t: '专属称号「摸鱼传奇」', d: '名字后面挂个金标，列表里能认出来' },
  { icon: '🧰', t: '工具位 +2', d: '首页放满 10 个工具' }
]

/* 连签阶梯奖励（设计稿 CHECK_STEPS 原样） */
export const CHECK_STEPS: { day: number; bonus: number }[] = [
  { day: 3, bonus: 2 },
  { day: 7, bonus: 5 },
  { day: 14, bonus: 8 },
  { day: 30, bonus: 20 }
]

/* 每天签到基础工分 */
export const CHECK_BASE = 2

/* 首页工具位上限：Lv1 起 6 个，Lv3/6/8 各 +1，Lv10 放满 10 个 */
const HOME_SLOTS = [6, 6, 7, 7, 7, 8, 8, 9, 9, 10]

/* 打开工具所得工分（沿用旧版 WORK_POINT_PER_OPEN，保证成长曲线可达） */
export const POINTS_PER_OPEN = 10

/* 皮肤解锁等级：玩具工局为默认免费；星夜 Lv.4；网格 Lv.7；圣诞工局走季节限定 */
export const SKIN_UNLOCK_LEVEL: Record<string, number> = { starry: 4, grid: 7 }

/* ---------------- 纯计算 ---------------- */

export function lvOf(points: number): number {
  /* 工分不会为负（写入时已 clamp），这里再兜一次，避免异常值绕过 Lv.2 起点 */
  const p = Math.max(0, Number(points) || 0)
  let lv = 1
  for (let i = 0; i < MAX_LEVEL; i++) {
    if (p >= LV_NEED[i]) lv = i + 1
  }
  return lv
}

/* 当前等级内的进度百分比（满级或门槛相同返回 100） */
export function lvProgress(points: number): number {
  const p = Number(points) || 0
  const lv = lvOf(p)
  const base = LV_NEED[lv - 1]
  const next = LV_NEED[lv] || base
  if (next <= base) return 100
  return Math.max(0, Math.min(100, Math.round(((p - base) / (next - base)) * 100)))
}

export function lvName(level: number): string {
  return LV_NAME[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
}

/* 距离下一级还差多少工分；满级返回 null */
export function lvRemain(points: number): number | null {
  const lv = lvOf(points)
  if (lv >= MAX_LEVEL) return null
  return Math.max(0, (LV_NEED[lv] || 0) - points)
}

export function homeSlots(level: number): number {
  return HOME_SLOTS[Math.max(0, Math.min(MAX_LEVEL, level) - 1)]
}

/* Lv.5 起，连签阶梯奖励每次多给 1 工分 */
export function hasStreakBoost(level: number): boolean {
  return level >= 5
}

/* ---------------- 工分存储与老数据结转 ---------------- */

const POINTS_KEY = 'growth_points_v1'
const MIGRATED_KEY = 'growth_migrated_v1'

/* 旧版工分 = Σ(usage_*) × 10。一次性结转时按低比例折算，
 * 避免老用户一上来就满级（220 次打开在旧模型里就是 2200 分）。 */
const MIGRATE_OPEN_RATIO = 2

export function getPoints(): number {
  ensureMigrated()
  return get<number>(POINTS_KEY, 0)
}

export function setPoints(n: number): boolean {
  return set(POINTS_KEY, Math.max(0, Math.floor(Number(n) || 0)))
}

export function addPoints(n: number): number {
  const next = Math.max(0, getPoints() + Math.floor(Number(n) || 0))
  setPoints(next)
  return next
}

/* 结转只做一次；新装用户 usage_* 为空，结果为 0 分 */
export function ensureMigrated() {
  if (get<number>(MIGRATED_KEY, 0)) return

  const opens = TOOLS.reduce((sum, t) => sum + (get<number>(`usage_${t.id}`, 0) || 0), 0)
  setPoints(opens * MIGRATE_OPEN_RATIO)

  /* 老用户权益保留：新版把「网格」改成 Lv.7 解锁，
   * 但老用户本来就在用它，不能升级后反而被锁掉。 */
  const hadOldSkin = get<string>('skin_active', '') !== '' || get<string[]>('skins_owned', []).length > 0
  if (hadOldSkin) {
    const owned = get<string[]>('skins_owned', [])
    const keep = new Set<string>([...owned, 'toy', 'grid'])
    set('skins_owned', Array.from(keep))
  }

  set(MIGRATED_KEY, 1)
}

/* 兼容旧调用点：旧代码统一用 getWorkPoints() 读实时派生值 */
export function getWorkPointsCompat(): number {
  return getPoints()
}
