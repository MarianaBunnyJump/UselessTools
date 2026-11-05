import type { CounterTag } from './counterStore'

/* ===================== 一起数数 · 派生计算（合计永远现算） =====================
 * 与手机测试版同一套算法：daySum / monthSum / allSum / forecast
 * （近 7 天 ×2 + 前 7 天 ×1 的加权日均，rate≤0 判 stall）
 */

export const WD = ['日', '一', '二', '三', '四', '五', '六']

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function dateFromToday(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fmtAmt(a: number): string {
  return (a > 0 ? '+' : '−') + Math.abs(a)
}

export function fmtCN(ds: string): string {
  const [y, m, d] = ds.split('-').map(Number)
  return `${m}月${d}日`
}

export function fmtMD(ds: string): string {
  return `${Number(ds.split('-')[1])}月${Number(ds.split('-')[2])}日`
}

export function weekOf(ds: string): string {
  const [y, m, d] = ds.split('-').map(Number)
  return WD[new Date(y, m - 1, d).getDay()]
}

export function relDay(ds: string): string {
  if (ds === todayStr()) return '今天'
  if (ds === dateFromToday(-1)) return '昨天'
  return ''
}

/* ---------------- 合计 ---------------- */

export function daySum(t: CounterTag, d: string): number {
  return t.entries.filter(e => e.date === d).reduce((s, e) => s + e.amount, 0)
}

export function monthSum(t: CounterTag, year: number, month: number): number {
  const prefix = `${year}-${pad(month)}`
  return t.entries.filter(e => (e.date || '').startsWith(prefix)).reduce((s, e) => s + e.amount, 0)
}

export function allSum(t: CounterTag): number {
  return t.entries.reduce((s, e) => s + e.amount, 0)
}

export function dayEntries(t: CounterTag, d: string) {
  return t.entries.filter(e => e.date === d).sort((a, b) => (a.time < b.time ? -1 : 1))
}

export function lastEntry(t: CounterTag) {
  return [...t.entries].sort((a, b) => ((a.date + a.time) < (b.date + b.time) ? 1 : -1))[0]
}

/* ---------------- 目标预测（端上现算，简单可解释） ---------------- */

export interface Forecast {
  done: boolean
  stall: boolean
  total: number
  remaining: number
  rate?: number
  days?: number
  date?: string
}

export function forecast(t: CounterTag): Forecast | null {
  if (!t.target) return null /* 目标不填 → 整个功能不触发 */
  const total = allSum(t)
  if (total >= t.target) return { done: true, stall: false, total, remaining: 0 }
  let wsum = 0
  let w = 0 /* 近 7 天 ×2、前 7 天 ×1 的加权日均 */
  for (let i = 1; i <= 14; i++) {
    const s = daySum(t, dateFromToday(-i))
    const wt = i <= 7 ? 2 : 1
    wsum += s * wt
    w += wt
  }
  const rate = wsum / w
  if (rate <= 0) return { done: false, stall: true, total, remaining: t.target - total }
  const days = Math.ceil((t.target - total) / rate)
  return { done: false, stall: false, total, remaining: t.target - total, rate, days, date: dateFromToday(days) }
}

/* ---------------- 月历网格（先算成数组再渲染，不在 render 里逐格算） ---------------- */

export interface CalCell {
  blank: boolean
  ds: string
  day: number
  sum: number
  has: boolean
  isToday: boolean
  isEta: boolean
  isFuture: boolean
  hasStar: boolean
}

export function buildMonthCells(t: CounterTag, calY: number, calM: number, etaDate?: string): CalCell[] {
  const today = todayStr()
  const firstDow = new Date(calY, calM - 1, 1).getDay()
  const off = (firstDow + 6) % 7
  const dim = new Date(calY, calM, 0).getDate()
  const cells: CalCell[] = []
  for (let i = 0; i < off; i++) cells.push({ blank: true, ds: '', day: 0, sum: 0, has: false, isToday: false, isEta: false, isFuture: false, hasStar: false })
  /* 先把当日合计聚成 Map，一格一次查表 */
  const sumMap = new Map<string, { sum: number; has: boolean }>()
  t.entries.forEach(e => {
    const cell = sumMap.get(e.date) || { sum: 0, has: false }
    cell.sum += e.amount
    cell.has = true
    sumMap.set(e.date, cell)
  })
  const starSet = new Set(t.anniversaries.map(a => a.date))
  for (let d = 1; d <= dim; d++) {
    const ds = `${calY}-${pad(calM)}-${pad(d)}`
    const cell = sumMap.get(ds) || { sum: 0, has: false }
    cells.push({
      blank: false,
      ds,
      day: d,
      sum: cell.sum,
      has: cell.has,
      isToday: ds === today,
      isEta: !!etaDate && etaDate === ds,
      isFuture: ds > today,
      hasStar: starSet.has(ds)
    })
  }
  return cells
}
