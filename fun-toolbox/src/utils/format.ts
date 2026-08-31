/* ===================== 数字与日期工具 ===================== */

export function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString('en-US')
}

export function daysBetween(from: Date, to: Date): number {
  const msPerDay = 86400000
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.floor((b - a) / msPerDay)
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/* 从生日到截止日之间有多少个周几 */
export function countWeekdays(birth: Date, end: Date, weekday: number): number {
  let count = 0
  const cursor = new Date(birth)
  while (cursor.getDay() !== weekday) {
    cursor.setDate(cursor.getDate() + 1)
  }
  while (cursor <= end) {
    count++
    cursor.setDate(cursor.getDate() + 7)
  }
  return Math.max(0, count)
}

/* 两个日期间的生日次数（不含出生当天） */
export function countBirthdays(birth: Date, end: Date): number {
  let count = 0
  const cursor = new Date(birth)
  cursor.setFullYear(cursor.getFullYear() + 1)
  while (cursor <= end) {
    count++
    cursor.setFullYear(cursor.getFullYear() + 1)
  }
  return count
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
