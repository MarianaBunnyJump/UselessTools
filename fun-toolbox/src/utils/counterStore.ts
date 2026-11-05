import Taro from '@tarojs/taro'
import { get, set, remove } from './storage'
import { todayStr } from './counterCalc'

/* ===================== 一起数数 v2 · 本地数据层（日历账模型） =====================
 * 模型：tag{ entries[date,time,amount,note,by], anniversaries[date,time,label,valueAtMark], photo }
 * 设计原则：本地优先。没有服务器时也能完整地记数、标记历史；
 * 所有云端变更先写本地 outbox，联网后再按顺序补传。
 * 存储按标签分 key（c_tag_<id> + 索引），避免单个 key 超限。
 */

export const COUNTER_COLORS = [
  { name: '陶土', hex: '#E8795A', deep: ['#E8795A', '#CE5B3F'], soft: '#FFE9E0' },
  { name: '记分牌绿', hex: '#2F4B43', deep: ['#36564B', '#223931'], soft: '#E2EFEA' },
  { name: '紫薯', hex: '#B39DDB', deep: ['#9B7FD4', '#7E57C2'], soft: '#F0EAFB' },
  { name: '蜜瓜', hex: '#FFB74D', deep: ['#F5A623', '#EF8B00'], soft: '#FFF1DC' },
  { name: '薄荷', hex: '#4DB6AC', deep: ['#3FAF9F', '#00897B'], soft: '#E4F5F3' },
  { name: '樱花', hex: '#F48FB1', deep: ['#EF7FA6', '#D6658F'], soft: '#FDEBF1' }
]

/* 自定义照片背景在颜色条里的虚拟下标（6 = 照片） */
export const PHOTO_COLOR_IDX = 6

const INDEX_KEY = 'counter_index_v2'
const TAG_KEY_PREFIX = 'c_tag_'
const COLOR_CURSOR_KEY = 'counter_color_cursor_v1'
const OUTBOX_KEY = 'counter_outbox_v2'
const TOKEN_KEY = 'counter_token_v1'
const ACCOUNT_KEY = 'counter_account_v1'
const MIGRATED_KEY = 'counter_migrated_v2'

/* ---------------- 数据结构 ---------------- */

export interface CounterEntry {
  id: string
  date: string /* YYYY-MM-DD */
  time: string /* HH:MM */
  amount: number
  note: string
  by: string
}

export interface CounterAnniversary {
  id: string
  date: string
  time: string
  label: string
  valueAtMark: number
}

export interface CounterMember {
  id: string
  name: string
  colorIdx: number
  role: 'owner' | 'member'
}

export interface CounterTag {
  id: string
  name: string
  unit: string
  colorIdx: number
  target?: number
  photo?: string /* 本地持久文件路径 */
  photoUrl?: string /* 云端照片 URL */
  synced: boolean
  shareCode?: string
  members: CounterMember[]
  version: number
  createdAt: number
  updatedAt: number
  entries: CounterEntry[]
  anniversaries: CounterAnniversary[]
}

export type OutboxItem =
  | { key: string; type: 'createTag'; tagId: string }
  | { key: string; type: 'updateMeta'; tagId: string }
  | { key: string; type: 'photo'; tagId: string }
  | { key: string; type: 'entries'; tagId: string; entries: CounterEntry[] }
  | { key: string; type: 'delEntry'; tagId: string; entryId: string }
  | { key: string; type: 'marks'; tagId: string; marks: CounterAnniversary[] }
  | { key: string; type: 'delMark'; tagId: string; markId: string }
  | { key: string; type: 'delTag'; tagId: string }

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

export function peekColorIdx(): number {
  const cursor = get<number>(COLOR_CURSOR_KEY, 0)
  return cursor % COUNTER_COLORS.length
}

/* ---------------- v1 → v2 迁移（老卡片 → 日历账，不丢用户记录） ---------------- */

function migrateV1() {
  const legacy = get<any[]>('counter_cards_v1', [])
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  const now = Date.now()

  if (Array.isArray(legacy) && legacy.length) {
    legacy.forEach((raw: any, i: number) => {
      if (!raw || typeof raw.id !== 'string') return
      const today = todayStr()
      const entries: CounterEntry[] = []
      /* value 折算成一条 entry：date=迁移当天、time=00:00、note=迁移自旧版 */
      const value = Math.max(0, Math.floor(Number(raw.value) || 0))
      if (value > 0) {
        entries.push({ id: newId('e'), date: today, time: '00:00', amount: value, note: '迁移自旧版', by: '我' })
      }
      /* history[] 每条转成 anniversary：从 ts 拆出 date/time，label=历史 */
      const anniversaries: CounterAnniversary[] = []
      if (Array.isArray(raw.history)) {
        raw.history.forEach((h: any) => {
          const ts = Number(h && h.ts)
          if (!Number.isFinite(ts) || ts <= 0) return
          const d = new Date(ts)
          const pad = (n: number) => String(n).padStart(2, '0')
          anniversaries.push({
            id: typeof h.id === 'string' && h.id ? h.id : newId('a'),
            date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
            time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
            label: '历史',
            valueAtMark: Math.max(0, Math.floor(Number(h.value) || 0))
          })
        })
      }
      const members: CounterMember[] = Array.isArray(raw.members)
        ? raw.members
            .filter((m: any) => m && typeof m.id === 'string')
            .map((m: any) => ({
              id: m.id,
              name: typeof m.name === 'string' ? m.name.slice(0, 12) : '好友',
              colorIdx: Number.isFinite(Number(m.colorIdx)) ? Number(m.colorIdx) : 0,
              role: m.role === 'owner' ? ('owner' as const) : ('member' as const)
            }))
        : []
      const tag: CounterTag = {
        id: raw.id,
        name: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim().slice(0, 12) : '我的标签',
        unit: typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim().slice(0, 4) : '次',
        colorIdx: Math.max(0, Math.floor(Number(raw.colorIdx) || 0)) % COUNTER_COLORS.length,
        synced: !!raw.synced,
        shareCode: typeof raw.shareCode === 'string' ? raw.shareCode : undefined,
        members,
        version: Math.max(0, Math.floor(Number(raw.version) || 0)),
        createdAt: Number(raw.createdAt) || now,
        updatedAt: Number(raw.updatedAt) || now,
        entries,
        anniversaries
      }
      set(TAG_KEY_PREFIX + tag.id, tag)
      if (!index.ids.includes(tag.id)) index.ids.push(tag.id)
      if (!index.activeId && i === 0) index.activeId = tag.id
    })
  }
  if (!index.ids.length) {
    index.ids = []
    index.activeId = ''
  }
  set(INDEX_KEY, index)
  /* 旧队列 / 旧卡片 key 只读留底，不再参与同步 */
  remove('counter_outbox_v1')
  set(MIGRATED_KEY, 1)
}

export function ensureStoreReady() {
  if (!get<number>(MIGRATED_KEY, 0)) migrateV1()
}

/* ---------------- 标签读写（按标签分 key） ---------------- */

function sanitizeEntry(raw: any): CounterEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const date = String(raw.date || '')
  const time = String(raw.time || '')
  const amount = Number(raw.amount)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}:\d{2}$/.test(time)) return null
  if (!Number.isFinite(amount) || amount === 0) return null
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newId('e'),
    date,
    time: time.padStart(5, '0'),
    amount: Math.floor(amount),
    note: typeof raw.note === 'string' ? raw.note.slice(0, 20) : '',
    by: typeof raw.by === 'string' && raw.by ? raw.by.slice(0, 12) : '我'
  }
}

function sanitizeAnniversary(raw: any): CounterAnniversary | null {
  if (!raw || typeof raw !== 'object') return null
  const date = String(raw.date || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const valueAtMark = Number(raw.valueAtMark)
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newId('a'),
    date,
    time: /^\d{1,2}:\d{2}$/.test(String(raw.time)) ? String(raw.time).padStart(5, '0') : '12:00',
    label: typeof raw.label === 'string' && raw.label ? raw.label.slice(0, 20) : '纪念日',
    valueAtMark: Number.isFinite(valueAtMark) ? Math.floor(valueAtMark) : 0
  }
}

function sanitizeTag(raw: any): CounterTag | null {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') return null
  const entries = (Array.isArray(raw.entries) ? raw.entries.map(sanitizeEntry).filter(Boolean) : []) as CounterEntry[]
  const anniversaries = (Array.isArray(raw.anniversaries) ? raw.anniversaries.map(sanitizeAnniversary).filter(Boolean) : []) as CounterAnniversary[]
  const members: CounterMember[] = Array.isArray(raw.members)
    ? raw.members
        .filter((m: any) => m && typeof m.id === 'string')
        .map((m: any) => ({
          id: m.id,
          name: typeof m.name === 'string' ? m.name.slice(0, 12) : '好友',
          colorIdx: Number.isFinite(Number(m.colorIdx)) ? Number(m.colorIdx) : 0,
          role: m.role === 'owner' ? ('owner' as const) : ('member' as const)
        }))
    : []
  const target = Math.floor(Number(raw.target))
  return {
    id: raw.id,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 12) : '我的标签',
    unit: typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim().slice(0, 4) : '次',
    colorIdx: Math.max(0, Math.floor(Number(raw.colorIdx) || 0)) % COUNTER_COLORS.length,
    target: target > 0 ? target : undefined,
    photo: typeof raw.photo === 'string' && raw.photo ? raw.photo : undefined,
    photoUrl: typeof raw.photoUrl === 'string' && raw.photoUrl ? raw.photoUrl : undefined,
    synced: !!raw.synced,
    shareCode: typeof raw.shareCode === 'string' && raw.shareCode ? raw.shareCode : undefined,
    members,
    version: Math.max(0, Math.floor(Number(raw.version) || 0)),
    createdAt: Number(raw.createdAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Date.now(),
    entries,
    anniversaries
  }
}

function tagKey(id: string) {
  return TAG_KEY_PREFIX + id
}

export function loadTags(): CounterTag[] {
  ensureStoreReady()
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  const ids = Array.isArray(index.ids) ? index.ids : []

  /* 自愈：索引漏登记时（老版本或异常中断），按 key 前缀把游离标签找回来。
   * 否则用户建完标签会看到它凭空消失。 */
  const orphans = listTagIdsFromStorage().filter((id) => !ids.includes(id))
  if (orphans.length) {
    index.ids = [...ids, ...orphans]
    set(INDEX_KEY, index)
  }

  const tags: CounterTag[] = []
  ;(index.ids as string[]).forEach(id => {
    const raw = get<any>(tagKey(id), null)
    const tag = sanitizeTag(raw)
    if (tag) tags.push(tag)
  })
  return tags
}

function listTagIdsFromStorage(): string[] {
  try {
    const keys: string[] = (Taro.getStorageInfoSync() || {}).keys || []
    return keys
      .filter((k) => typeof k === 'string' && k.indexOf(TAG_KEY_PREFIX) === 0)
      .map((k) => k.slice(TAG_KEY_PREFIX.length))
  } catch (e) {
    return []
  }
}

export function saveTag(tag: CounterTag) {
  set(tagKey(tag.id), tag)
  /* 标签本体和索引必须一起落盘：只写本体会让 loadTags() 读不到它 */
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  const ids = Array.isArray(index.ids) ? index.ids : []
  if (!ids.includes(tag.id)) {
    index.ids = [...ids, tag.id]
    set(INDEX_KEY, index)
  }
}

export function saveTags(tags: CounterTag[]) {
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  const known = new Set(index.ids || [])
  tags.forEach(t => {
    saveTag(t)
    if (!known.has(t.id)) index.ids = [...(index.ids || []), t.id]
  })
  set(INDEX_KEY, index)
}

export function removeTagLocal(tagId: string) {
  remove(tagKey(tagId))
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  index.ids = (index.ids || []).filter((id: string) => id !== tagId)
  if (index.activeId === tagId) index.activeId = index.ids[0] || ''
  set(INDEX_KEY, index)
}

export function loadIndex(): { ids: string[]; activeId: string } {
  ensureStoreReady()
  const index = get<{ ids: string[]; activeId: string }>(INDEX_KEY, { ids: [], activeId: '' })
  return { ids: Array.isArray(index.ids) ? index.ids : [], activeId: typeof index.activeId === 'string' ? index.activeId : '' }
}

export function saveIndex(index: { ids: string[]; activeId: string }) {
  set(INDEX_KEY, index)
}

export function loadActiveId(): string {
  return loadIndex().activeId
}

export function saveActiveId(id: string) {
  const index = loadIndex()
  index.activeId = id
  set(INDEX_KEY, index)
}

/* ---------------- 增量队列（outbox v2） ---------------- */

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

export function enqueueEntries(tagId: string, entries: CounterEntry[]) {
  if (!entries.length) return
  const item: OutboxItem = { key: 'en' + entries[0].id, type: 'entries', tagId, entries }
  enqueue(item)
}

export function enqueueMarks(tagId: string, marks: CounterAnniversary[]) {
  if (!marks.length) return
  const item: OutboxItem = { key: 'mk' + marks[0].id, type: 'marks', tagId, marks }
  enqueue(item)
}

export function removeOutbox(keys: string[]) {
  if (!keys.length) return
  const setKeys = new Set(keys)
  saveOutbox(loadOutbox().filter(item => !setKeys.has(item.key)))
}

export function hasPending(tagId?: string): boolean {
  const list = loadOutbox()
  return tagId ? list.some(item => item.tagId === tagId) : list.length > 0
}

/* 整张标签还没上云就删掉时，清掉它的全部待办 */
export function clearPendingTag(tagId: string) {
  saveOutbox(loadOutbox().filter(item => item.tagId !== tagId))
}

/* 撤销还没发出的记录（本地删了，就不该再补传到服务器） */
export function removePendingEntry(tagId: string, entryId: string) {
  const list = loadOutbox()
  const next = list.filter(item => {
    if (item.type === 'entries' && item.tagId === tagId) {
      return !item.entries.some(e => e.id === entryId)
    }
    if (item.type === 'delEntry' && item.tagId === tagId) {
      return item.entryId !== entryId
    }
    return true
  })
  saveOutbox(next)
}

/* 撤销还没发出的历史标记 */
export function removePendingMark(tagId: string, markId: string) {
  const list = loadOutbox()
  const next = list.filter(item => {
    if (item.type === 'marks' && item.tagId === tagId) {
      return !item.marks.some(m => m.id === markId)
    }
    if (item.type === 'delMark' && item.tagId === tagId) {
      return item.markId !== markId
    }
    return true
  })
  saveOutbox(next)
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
