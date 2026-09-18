import { HOLIDAYS } from '../data/holidays'
import { daysBetween, countWeekdays, countBirthdays, parseDate } from './format'

/* ===================== 人生倒计时统计 ===================== */

export interface LifeStats {
  remainDays: number
  remainHours: number
  remainSundays: number
  remainBirthdays: number
  remainMeals: number
  remainHolidays: number
  livedDays: number
  totalDays: number
  percent: number
}

export interface LifeMetric {
  id: string
  label: string
  value: number
  unit: string
}

/* 剩余法定节假日次数：表内精确统计，表外按每年 7 个估算 */
function countHolidayTimes(from: Date, to: Date): number {
  let count = 0
  for (const h of HOLIDAYS) {
    const start = parseDate(h.start)
    if (start >= from && start <= to) count++
  }
  const tableEnd = parseDate('2035-12-31')
  if (to > tableEnd) {
    const years = daysBetween(tableEnd, to) / 365.25
    count += Math.round(years * 7)
  }
  return count
}

export function computeLifeStats(birthdate: string, expectancy: number): LifeStats {
  const birth = parseDate(birthdate)
  const today = new Date()
  const endDate = new Date(birth)
  endDate.setFullYear(birth.getFullYear() + expectancy)
  endDate.setHours(23, 59, 59, 999)

  const livedDays = daysBetween(birth, today)
  const totalDays = Math.round(expectancy * 365.25)
  const remainDays = daysBetween(today, endDate)
  const remainHours = Math.floor((endDate.getTime() - today.getTime()) / 3600000)

  return {
    remainDays,
    remainHours,
    /* 周日而不是周五：单休的人也有周日，双休的人周日也在（避免扎心） */
    remainSundays: countWeekdays(today, endDate, 0),
    /* 只数今天以后的生日：此前误从出生日起算，把过过的生日也算进「剩余」 */
    remainBirthdays: countBirthdays(today, endDate),
    remainMeals: remainDays * 3,
    remainHolidays: countHolidayTimes(today, endDate),
    livedDays,
    totalDays,
    percent: Math.min(100, Math.max(0, (livedDays / totalDays) * 100))
  }
}

export function lifeMetrics(stats: LifeStats): LifeMetric[] {
  return [
    { id: 'days', label: '剩余天数', value: stats.remainDays, unit: '天' },
    { id: 'sundays', label: '剩余周日', value: stats.remainSundays, unit: '个' },
    { id: 'birthdays', label: '剩余生日', value: stats.remainBirthdays, unit: '次' },
    { id: 'meals', label: '还能吃几顿美味的饭', value: stats.remainMeals, unit: '顿' },
    { id: 'holidays', label: '剩余法定节假日', value: stats.remainHolidays, unit: '个' }
  ]
}
