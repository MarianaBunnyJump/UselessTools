import Taro from '@tarojs/taro'
import {
  CounterCard,
  CounterMark,
  CounterMember,
  colorOf,
  enqueue,
  loadAccountId,
  loadCards,
  loadOutbox,
  loadToken,
  removeOutbox,
  saveAccountId,
  saveCards,
  saveToken,
  clearToken,
  hasPending
} from './counterStore'

/* ===================== 一起数数 · 云端同步 =====================
 * 服务器地址就填在下面这一行。留空 = 纯本地模式（不发送任何数据）。
 * 正式版必须使用已备案的 HTTPS 域名，并在小程序后台加入 request 合法域名。
 * 本地调试可在开发者工具勾选「不校验合法域名」。
 */
export const COUNTER_API_BASE = 'http://127.0.0.1:8787'

const API_PREFIX = '/api/v1'
const TIMEOUT = 10000

export function isCloudEnabled(): boolean {
  return !!COUNTER_API_BASE
}

class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

interface RemoteMember {
  id: string
  name: string
  colorIdx: number
  role: 'owner' | 'member'
  contribution: number
}

interface RemoteMark {
  id: string
  ts: number
  value: number
}

interface RemoteCard {
  id: string
  title: string
  unit: string
  value: number
  colorIdx: number
  shareCode: string
  version: number
  createdAt: number
  updatedAt: number
  isOwner: boolean
  members: RemoteMember[]
  marks: RemoteMark[]
  lastBy?: string
  lastAt?: number
}

interface Envelope<T> {
  ok: boolean
  data?: T
  error?: { code: string; message: string }
}

function urlOf(path: string): string {
  return COUNTER_API_BASE.replace(/\/+$/, '') + API_PREFIX + path
}

async function rawRequest<T>(path: string, method: 'GET' | 'POST' | 'DELETE', data?: any, auth = true): Promise<T> {
  const token = auth ? loadToken() : ''
  let res: Taro.request.SuccessCallbackResult<any>
  try {
    res = await Taro.request({
      url: urlOf(path),
      method,
      data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    } as any)
  } catch (e) {
    throw new ApiError(0, 'NETWORK', '网络连接失败，已保存在本机')
  }
  const body = res.data as Envelope<T>
  if (res.statusCode === 401) {
    throw new ApiError(401, 'UNAUTHORIZED', '登录状态已失效')
  }
  if (!body || typeof body !== 'object' || body.ok !== true) {
    const err = body && body.error
    throw new ApiError(res.statusCode, err?.code || 'SERVER', err?.message || '服务器开小差了')
  }
  return body.data as T
}

/* 匿名会话：首次联网时领取一个设备令牌，之后所有请求都带它。
 * 不收集手机号、openid、位置等任何个人信息。 */
let sessionTask: Promise<void> | null = null

export function ensureSession(): Promise<void> {
  if (!isCloudEnabled()) return Promise.resolve()
  if (loadToken()) return Promise.resolve()
  if (sessionTask) return sessionTask
  sessionTask = rawRequest<{ accountId: string; token: string }>('/session', 'POST', {}, false)
    .then(data => {
      saveToken(data.token)
      saveAccountId(data.accountId)
    })
    .catch(err => {
      if (err instanceof ApiError && err.status === 401) clearToken()
      throw err
    })
    .finally(() => {
      sessionTask = null
    })
  return sessionTask
}

/* 令牌失效时重新领取一次，避免用户手动处理 */
async function request<T>(path: string, method: 'GET' | 'POST' | 'DELETE', data?: any): Promise<T> {
  try {
    return await rawRequest<T>(path, method, data)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearToken()
      await ensureSession()
      return rawRequest<T>(path, method, data)
    }
    throw err
  }
}

/* ---------------- 服务端卡片 → 本地卡片 ---------------- */

function toLocalCard(remote: RemoteCard): CounterCard {
  const members: CounterMember[] = (remote.members || []).map(m => ({
    id: m.id,
    name: m.name,
    colorIdx: m.colorIdx,
    role: m.role,
    contribution: m.contribution
  }))
  const history: CounterMark[] = (remote.marks || []).map(m => ({ id: m.id, ts: m.ts, value: m.value }))
  return {
    id: remote.id,
    title: remote.title,
    unit: remote.unit,
    value: remote.value,
    colorIdx: remote.colorIdx,
    history,
    members,
    version: remote.version,
    synced: true,
    shareCode: remote.shareCode,
    createdAt: remote.createdAt,
    updatedAt: remote.updatedAt,
    lastBy: remote.lastBy,
    lastAt: remote.lastAt
  }
}

function mergeMark(local: CounterMark[], remote: CounterMark[]): CounterMark[] {
  const map = new Map<string, CounterMark>()
  local.forEach(m => map.set(m.id, m))
  remote.forEach(m => map.set(m.id, m))
  return Array.from(map.values()).sort((a, b) => b.ts - a.ts).slice(0, 500)
}

/* 合并时永远保留本地未同步的计数与历史，云端只补齐成员 / 版本 / 口令 */
function mergeRemote(local: CounterCard, remote: RemoteCard, pending: boolean): CounterCard {
  const fresh = toLocalCard(remote)
  return {
    ...local,
    title: fresh.title,
    unit: fresh.unit,
    value: pending ? local.value : fresh.value,
    colorIdx: fresh.colorIdx,
    history: pending ? mergeMark(local.history, fresh.history) : fresh.history,
    members: fresh.members,
    version: fresh.version,
    synced: !pending,
    shareCode: fresh.shareCode,
    updatedAt: fresh.updatedAt,
    lastBy: fresh.lastBy,
    lastAt: fresh.lastAt
  }
}

function updateCardFromServer(remote: RemoteCard, remainingPending: boolean) {
  const cards = loadCards()
  const idx = cards.findIndex(c => c.id === remote.id)
  if (idx < 0) {
    cards.push(toLocalCard(remote))
  } else {
    cards[idx] = mergeRemote(cards[idx], remote, remainingPending)
  }
  saveCards(cards)
}

/* ---------------- 出站队列 ---------------- */

/* 离线期间本地已加上、但还没同步的增量总和：创建时先从初始值里扣掉，
 * 避免「创建时带上当前值 + 随后补传 delta」造成服务器重复计数。 */
function pendingDelta(cardId: string): number {
  return loadOutbox()
    .filter((i): i is Extract<typeof i, { type: 'events' }> => i.type === 'events' && i.cardId === cardId)
    .flatMap(i => i.events)
    .reduce((sum, e) => sum + (e.type === 'delta' ? Number(e.delta) || 0 : 0), 0)
}

async function flushOutbox() {
  for (let guard = 0; guard < 60; guard++) {
    const items = loadOutbox()
    if (!items.length) return
    const item = items[0]

    try {
      if (item.type === 'create') {
        const card = loadCards().find(c => c.id === item.cardId)
        if (!card) {
          removeOutbox([item.key])
          continue
        }
        const base = Math.max(0, card.value - pendingDelta(card.id))
        const remote = await request<RemoteCard>('/cards', 'POST', {
          id: card.id,
          title: card.title,
          unit: card.unit,
          value: base,
          colorIdx: card.colorIdx
        })
        removeOutbox([item.key])
        updateCardFromServer(remote, hasPending(card.id))
      } else if (item.type === 'events') {
        const card = loadCards().find(c => c.id === item.cardId)
        if (!card) {
          removeOutbox([item.key])
          continue
        }
        const eventItems = items
          .filter((i): i is Extract<typeof item, { type: 'events' }> => i.type === 'events' && i.cardId === item.cardId)
          .slice(0, 50)
        const keys = eventItems.map(i => i.key)
        const batch = eventItems.flatMap(i => i.events)
        const remote = await request<RemoteCard>(`/cards/${encodeURIComponent(item.cardId)}/events`, 'POST', {
          events: batch
        })
        removeOutbox(keys)
        updateCardFromServer(remote, hasPending(card.id))
      } else if (item.type === 'deleteMark') {
        try {
          await request(`/cards/${encodeURIComponent(item.cardId)}/events/${encodeURIComponent(item.markId)}`, 'DELETE')
        } catch (err) {
          if (!(err instanceof ApiError) || (err.status !== 404 && err.status !== 403)) throw err
        }
        removeOutbox([item.key])
      } else if (item.type === 'deleteCard') {
        try {
          await request(`/cards/${encodeURIComponent(item.cardId)}`, 'DELETE')
        } catch (err) {
          if (!(err instanceof ApiError) || err.status !== 404) throw err
        }
        removeOutbox([item.key])
      }
    } catch (err) {
      /* 4xx 是数据问题，丢弃以免堵住队列；网络 / 5xx 保留，下次重试 */
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        removeOutbox([item.key])
        continue
      }
      throw err
    }
  }
}

/* ---------------- 拉取与整体同步 ---------------- */

async function pullCards() {
  const remote = await request<RemoteCard[]>('/cards', 'GET')
  const local = loadCards()
  const byId = new Map(local.map(c => [c.id, c]))
  const next: CounterCard[] = [...local]

  remote.forEach(rc => {
    const found = byId.get(rc.id)
    if (found) {
      const idx = next.findIndex(c => c.id === rc.id)
      next[idx] = mergeRemote(found, rc, hasPending(rc.id))
    } else {
      next.push(toLocalCard(rc))
    }
  })
  saveCards(next)
}

let syncing: Promise<void> | null = null
let syncAgain = false

export async function syncAll(): Promise<void> {
  if (!isCloudEnabled()) return
  if (syncing) {
    syncAgain = true
    return syncing
  }
  syncing = (async () => {
    await ensureSession()
    await flushOutbox()
    await pullCards()
  })()
  try {
    await syncing
  } finally {
    syncing = null
    if (syncAgain) {
      syncAgain = false
      await syncAll()
    }
  }
}

export async function joinByCode(code: string): Promise<CounterCard> {
  const remote = await request<RemoteCard>('/cards/join', 'POST', { code: code.trim().toUpperCase() })
  const cards = loadCards()
  const idx = cards.findIndex(c => c.id === remote.id)
  const local = idx >= 0 ? mergeRemote(cards[idx], remote, hasPending(remote.id)) : toLocalCard(remote)
  if (idx >= 0) cards[idx] = local
  else cards.push(local)
  saveCards(cards)
  return local
}

export function memberDisplayName(member: CounterMember): string {
  if (member.id === loadAccountId()) return '我'
  return member.name || '好友'
}

export function memberColor(member: CounterMember) {
  return colorOf(member.colorIdx)
}

export { enqueue }
