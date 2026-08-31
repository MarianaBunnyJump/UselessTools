import Taro from '@tarojs/taro'

/* ===================== 本地存储封装 ===================== */

export function get<T>(key: string, defaultValue: T): T {
  try {
    const raw = Taro.getStorageSync(key)
    if (raw === '' || raw === null || raw === undefined) return defaultValue
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    return defaultValue
  }
}

export function set(key: string, value: unknown): boolean {
  try {
    Taro.setStorageSync(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

export function remove(key: string) {
  try {
    Taro.removeStorageSync(key)
  } catch (e) {
    /* 忽略 */
  }
}

export function getDatePart(d?: Date): string {
  const date = d || new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* 按日计数的结构，跨天自动清零 */
export interface DailyCount {
  date: string
  count: number
}

export function getDailyCount(keyBase: string): DailyCount {
  const today = getDatePart()
  const data = get<DailyCount>(keyBase, { date: today, count: 0 })
  if (data.date !== today) {
    return { date: today, count: 0 }
  }
  return data
}

export function addDailyCount(keyBase: string, amount = 1): number {
  const data = getDailyCount(keyBase)
  data.count += amount
  set(keyBase, data)
  return data.count
}

export function addTotalCount(key: string, amount = 1): number {
  const total = get<number>(key, 0) + amount
  set(key, total)
  return total
}

/* 应用启动时检查跨天，把当日的动态数据滚动 */
export function ensureDailyReset() {
  getDailyCount('crusher_today')
  getDailyCount('merit_today')
}

/* 连续使用天数计算（供电子木鱼成就） */
export function bumpStreak(lastDateKey: string, streakKey: string): number {
  const today = getDatePart()
  const last = get<string>(lastDateKey, '')
  if (last === today) {
    return get<number>(streakKey, 0)
  }
  const yesterday = getDatePart(new Date(Date.now() - 86400000))
  const streak = last === yesterday ? get<number>(streakKey, 0) + 1 : 1
  set(streakKey, streak)
  set(lastDateKey, today)
  return streak
}
