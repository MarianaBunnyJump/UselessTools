import { get, set } from './storage'

/* ===================== 一起数数 · 本地数据层 =====================
 * 设计原则：本地优先。没有服务器时也能完整地数数、标记历史；
 * 所有云端变更先写本地 outbox，联网后再按顺序补传。
 */

export const COUNTER_COLORS = [
  { name: '陶土', hex: '#E8795A', deep: ['#E8795A', '#CE5B3F'], soft: '#FFE9E0' },
  { name: '记分牌绿', hex: '#2F4B43', deep: ['#36564B', '#223931'], soft: '#E2EFEA' },
  { name: '紫薯', hex: '#B39DDB', deep: ['#9B7FD4', '#7E57C2'], soft: '#F0EAFB' },
  { name: '蜜瓜', hex: '#FFB74D', deep: ['#F5A623', '#EF8B00'], soft: '#FFF1DC' },
  { name: '薄荷', hex: '#4DB6AC', deep: ['#3FAF9F', '#00897B'], soft: '#E4F5F3' },
  { name: '樱花', hex: '#F48FB1', deep: ['#EF7FA6', '#D6658F'], soft: '#FDEBF1' }
]

const CARDS_KEY = 'counter_cards_v1'
const ACTIVE_KEY = 'counter_active_v1'
const COLOR_CURSOR_KEY = 'counter_color_cursor_v1'
const OUTBOX_KEY = 'counter_outbox_v1'
const TOKEN_KEY = 'counter_token_v1'
const ACCOUNT_KEY = 'counter_account_v1'

export interface CounterMark {
  id: string
  ts: number
  value: number
}

export interface CounterMember {
  id: string
  name: string
  colorIdx: number
  role: 'owner' | 'member'
  contribution: number
}

export interface CounterCard {
  id: string
  title: string
  unit: string
  value: number
  colorIdx: number
  history: CounterMark[]
  members: CounterMember[]
  version: number
  synced: boolean
  shareCode?: string
  createdAt: number
  updatedAt: number
  lastBy?: string
  lastAt?: number
}

export interface SyncEvent {
  id: string
  type: 'delta' | 'mark'
  delta?: number
  value?: number
  ts: number
}

export type OutboxItem =
  | { key: string; type: 'create'; cardId: string }
  | { key: string; type: 'events'; cardId: string; events: SyncEvent[] }
  | { key: string; type: 'deleteCard'; cardId: string }
  | { key: string; type: 'deleteMark'; cardId: string; markId: string }

let seq = 0

export function newId(prefix: string): string {
  seq = (seq + 1) % 1000
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + seq.toString(36)
}

export function colorOf(idx: number) {
  return COUNTER_COLORS[((idx % COUNTER_COLORS.length) + COUNTER_COLORS.length) % COUNTER_COLORS.length]
}

export function nextColorIdx(): number {
  const cursor = get<number>(COLOR_CURSOR_KEY, 0)
  set(COLOR_CURSOR_KEY, cursor + 1)
  return cursor % COUNTER_COLORS.length
}

export function formatStamp(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatRelative(ts?: number): string {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 48 * 60 * 60 * 1000) return '昨天'
  return formatStamp(ts)
}

function sanitizeMark(raw: any): CounterMark | null {
  if (!raw || typeof raw !== 'object') return null
  const ts = Number(raw.ts)
  const value = Number(raw.value)
  if (!Number.isFinite(ts) || !Number.isFinite(value)) return null
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newId('m'),
    ts,
    value: Math.max(0, Math.floor(value))
  }
}

function sanitizeMember(raw: any): CounterMember | null {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') return null
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name.slice(0, 12) : '好友',
    colorIdx: Number.isFinite(Number(raw.colorIdx)) ? Number(raw.colorIdx) % COUNTER_COLORS.length : 0,
    role: raw.role === 'owner' ? 'owner' : 'member',
    contribution: Math.max(0, Math.floor(Number(raw.contribution) || 0))
  }
}

function sanitizeCard(raw: any): CounterCard | null {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') return null
  const history = Array.isArray(raw.history)
    ? raw.history.map(sanitizeMark).filter(Boolean).slice(0, 500) as CounterMark[]
    : []
  const members = Array.isArray(raw.members)
    ? raw.members.map(sanitizeMember).filter(Boolean) as CounterMember[]
    : []
  return {
    id: raw.id,
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 12) : '我的计数',
    unit: typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim().slice(0, 4) : '次',
    value: Math.max(0, Math.floor(Number(raw.value) || 0)),
    colorIdx: Math.max(0, Math.floor(Number(raw.colorIdx) || 0)) % COUNTER_COLORS.length,
    history,
    members,
    version: Math.max(0, Math.floor(Number(raw.version) || 0)),
    synced: !!raw.synced,
    shareCode: typeof raw.shareCode === 'string' ? raw.shareCode : undefined,
    createdAt: Number(raw.createdAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Date.now(),
    lastBy: typeof raw.lastBy === 'string' ? raw.lastBy : undefined,
    lastAt: Number(raw.lastAt) || undefined
  }
}

export function starterCard(): CounterCard {
  const now = Date.now()
  return {
    id: newId('c'),
    title: '喝水打卡',
    unit: '杯',
    value: 0,
    colorIdx: 0,
    history: [],
    members: [],
    version: 0,
    synced: false,
    createdAt: now,
    updatedAt: now
  }
}

export function loadCards(): CounterCard[] {
  const raw = get<any[]>(CARDS_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.map(sanitizeCard).filter(Boolean) as CounterCard[]
}

export function saveCards(cards: CounterCard[]) {
  set(CARDS_KEY, cards)
}

export function loadActiveId(): string {
  return get<string>(ACTIVE_KEY, '')
}

export function saveActiveId(id: string) {
  set(ACTIVE_KEY, id)
}

/* ---------------- 增量队列 ---------------- */

export function loadOutbox(): OutboxItem[] {
  const raw = get<any[]>(OUTBOX_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw.filter(item => item && typeof item.key === 'string' && typeof item.type === 'string')
}

export function saveOutbox(items: OutboxItem[]) {
  set(OUTBOX_KEY, items.slice(-300))
}

export function enqueue(item: OutboxItem) {
  const list = loadOutbox()
  if (list.some(i => i.key === item.key)) return
  list.push(item)
  saveOutbox(list)
}

export function enqueueEvent(cardId: string, event: SyncEvent) {
  const item: OutboxItem = { key: 'e' + event.id, type: 'events', cardId, events: [event] }
  enqueue(item)
}

export function removeOutbox(keys: string[]) {
  if (!keys.length) return
  const setKeys = new Set(keys)
  saveOutbox(loadOutbox().filter(item => !setKeys.has(item.key)))
}

export function hasPending(cardId?: string): boolean {
  const list = loadOutbox()
  return cardId ? list.some(item => ('cardId' in item ? item.cardId === cardId : false)) : list.length > 0
}

/* 撤销还没发出的历史标记（本地删了，就不该再补传到服务器） */
export function removePendingEvent(cardId: string, eventId: string) {
  const list = loadOutbox()
  const next = list.filter(item => {
    if (item.type === 'events' && item.cardId === cardId) {
      return !item.events.some(e => e.id === eventId)
    }
    return true
  })
  saveOutbox(next)
}

/* 整张卡还没上云就删掉时，清掉它的创建 / 增量任务 */
export function clearPendingCard(cardId: string) {
  saveOutbox(loadOutbox().filter(item => !('cardId' in item) || item.cardId !== cardId))
}

/* ---------------- 会话（匿名设备令牌） ---------------- */

export function loadToken(): string {
  return get<string>(TOKEN_KEY, '')
}

export function saveToken(token: string) {
  set(TOKEN_KEY, token)
}

export function clearToken() {
  set(TOKEN_KEY, '')
}

export function loadAccountId(): string {
  return get<string>(ACCOUNT_KEY, '')
}

export function saveAccountId(id: string) {
  set(ACCOUNT_KEY, id)
}
