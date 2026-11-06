/* ===================== 每日签到 =====================
 * 日历是「当月视图」（设计稿 .ci-cal 按当月天数 + 星期偏移渲染），
 * 所以已签日期按 年-月 分桶存；连签天数是跨月的连续自然日计数。
 * 断签（漏一整天）在下次读取时自动归零。
 */

import { get, set, getDatePart } from './storage'
import {
  CHECK_BASE,
  CHECK_STEPS,
  addPoints,
  getPoints,
  hasStreakBoost,
  lvOf
} from './growth'

const KEY = 'checkin_v1'

interface CheckinState {
  /* 当前展示月份，形如 2026-11；换月时 days 清空 */
  ym: string
  /* 本月已签的「几号」 */
  days: number[]
  /* 连签天数（跨月连续自然日） */
  streak: number
  /* 最近一次签到日期 YYYY-MM-DD */
  lastDate: string
}

const emptyState = (): CheckinState => ({ ym: currentYm(), days: [], streak: 0, lastDate: '' })

function currentYm(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/* 读取并滚动状态：换月清日历、断签清连签 */
export function loadCheckin(): CheckinState {
  const s = get<CheckinState>(KEY, emptyState())
  const today = getDatePart()
  const ym = currentYm()

  const days = Array.isArray(s.days) ? s.days.filter((n) => Number.isFinite(n)) : []
  const lastDate = typeof s.lastDate === 'string' ? s.lastDate : ''
  let streak = Number(s.streak) || 0

  /* 换月：日历视图归零，但连签与 lastDate 保留 */
  const rolled = s.ym !== ym
  const nextDays = rolled ? [] : days

  /* 断签：上次签到既不是今天也不是昨天，连签归零 */
  if (lastDate !== today) {
    const yesterday = getDatePart(new Date(Date.now() - 86400000))
    if (lastDate !== yesterday) streak = 0
  }

  const next: CheckinState = { ym, days: nextDays, streak, lastDate }
  /* 有变化才落盘，避免每次读取都写存储 */
  if (rolled || next.streak !== (Number(s.streak) || 0) || nextDays.length !== days.length) {
    set(KEY, next)
  }
  return next
}

export function signedToday(): boolean {
  return loadCheckin().days.includes(new Date().getDate())
}

export function getStreak(): number {
  return loadCheckin().streak
}

/* 本月已签日期（给日历格子用） */
export function getCheckedDays(): number[] {
  return loadCheckin().days
}

export interface CheckinResult {
  ok: boolean
  reason?: 'already'
  gain: number
  base: number
  stepBonus: number
  boost: number
  streak: number
  points: number
  levelUp: { from: number; to: number } | null
}

/* 今天没签就返回 null；已签返回命中的阶梯（用于展示） */
export function nextStepFor(streak: number) {
  return CHECK_STEPS.filter((s) => s.day === streak)[0] || null
}

export function doCheckin(): CheckinResult {
  const before = loadCheckin()
  const today = getDatePart()
  const dayNum = new Date().getDate()

  if (before.days.includes(dayNum)) {
    return {
      ok: false,
      reason: 'already',
      gain: 0,
      base: 0,
      stepBonus: 0,
      boost: 0,
      streak: before.streak,
      points: 0,
      levelUp: null
    }
  }

  /* 先跑一次结转检查，保证 addPoints 不会覆盖历史积累 */
  const pointsBefore = getPoints()
  const levelBefore = lvOf(pointsBefore)
  const yesterday = getDatePart(new Date(Date.now() - 86400000))
  const streak = before.lastDate === yesterday ? before.streak + 1 : 1

  const step = nextStepFor(streak)
  const stepBonus = step ? step.bonus : 0
  /* Lv.5 起，每次连签阶梯奖励多给 1 工分 */
  const boost = step && hasStreakBoost(levelBefore) ? 1 : 0
  const gain = CHECK_BASE + stepBonus + boost

  set(KEY, { ym: currentYm(), days: [...before.days, dayNum], streak, lastDate: today })
  const points = addPoints(gain)

  const levelAfter = lvOf(points)
  return {
    ok: true,
    gain,
    base: CHECK_BASE,
    stepBonus,
    boost,
    streak,
    points,
    levelUp: levelAfter > levelBefore ? { from: levelBefore, to: levelAfter } : null
  }
}
