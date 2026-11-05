import Taro from '@tarojs/taro'
import {
  CounterTag,
  CounterEntry,
  CounterAnniversary,
  CounterMember,
  enqueue,
  loadAccountId,
  loadOutbox,
  loadToken,
  removeOutbox,
  saveAccountId,
  saveTag,
  saveToken,
  clearToken,
  hasPending,
  removeTagLocal
} from './counterStore'

/* ===================== 一起数数 v2 · 云端同步（日历账模型） =====================
 * 服务器地址就填在下面这一行。留空 = 纯本地模式（不发送任何数据）。
 * 正式版必须使用已备案的 HTTPS 域名，并在小程序后台加入 request 合法域名。
 * 本地调试可在开发者工具勾选「不校验合法域名」。
 */
export const COUNTER_API_BASE = 'https://counter.mariana66.xyz'

const API_PREFIX = '/api/v1'
const TIMEOUT = 10000

export function isCloudEnabled(): boolean {
  return !!COUNTER_API_BASE
}

export function absoluteUrl(path: string): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return COUNTER_API_BASE.replace(/\/+$/, '') + path
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

interface RemoteTagMeta {
  id: string
  name: string
  unit: string
  colorIdx: number
  target?: number
  photoUrl?: string
  shareCode: string
  version: number
  createdAt: number
  updatedAt: number
  isOwner: boolean
  allSum: number
  entryCount: number
  members: RemoteMember[]
  lastBy?: string
  lastAt?: number
}

interface RemoteEntry {
  id: string
  date: string
  time: string
  amount: number
  note: string
  by: string
  byId?: string
  ts: number
}

interface RemoteMark {
  id: string
  date: string
  time: string
  label: string
  valueAtMark: number
  ts: number
}

interface TagDetail {
  tag: RemoteTagMeta
  entries: RemoteEntry[]
  marks: RemoteMark[]
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

/* 照片走独立二进制接口（JSON 有 64KB 上限，塞不进去） */
async function rawUpload(path: string, filePath: string): Promise<any> {
  const token = loadToken()
  let res: Taro.request.SuccessCallbackResult<any>
  try {
    const fs = Taro.getFileSystemManager()
    const buf = fs.readFileSync(filePath) as ArrayBuffer
    res = await Taro.request({
      url: urlOf(path),
      method: 'POST',
      data: buf,
      timeout: 30000,
      header: {
        'Content-Type': 'image/jpeg',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    } as any)
  } catch (e) {
    throw new ApiError(0, 'NETWORK', '网络连接失败，照片已留在本机')
  }
  const body = res.data as Envelope<any>
  if (!body || typeof body !== 'object' || body.ok !== true) {
    const err = body && body.error
    throw new ApiError(res.statusCode, err?.code || 'SERVER', err?.message || '服务器开小差了')
  }
  return body.data
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

/* ---------------- 服务端标签 → 本地标签 ---------------- */

function toLocalTag(meta: RemoteTagMeta, entries?: RemoteEntry[], marks?: RemoteMark[]): CounterTag {
  const members: CounterMember[] = (meta.members || []).map(m => ({
    id: m.id,
    name: m.name,
    colorIdx: m.colorIdx,
    role: m.role
  }))
  const myId = loadAccountId()
  const localEntries: CounterEntry[] = (entries || []).map(e => ({
    id: e.id,
    date: e.date,
    time: e.time,
    amount: e.amount,
    note: e.note || '',
    by: e.byId && myId && e.byId === myId ? '我' : e.by || '我'
  }))
  const anniversaries: CounterAnniversary[] = (marks || []).map(m => ({
    id: m.id,
    date: m.date,
    time: m.time,
    label: m.label,
    valueAtMark: m.valueAtMark
  }))
  return {
    id: meta.id,
    name: meta.name,
    unit: meta.unit,
    colorIdx: meta.colorIdx % 6,
    target: meta.target && meta.target > 0 ? meta.target : undefined,
    photoUrl: meta.photoUrl ? absoluteUrl(meta.photoUrl) : undefined,
    synced: true,
    shareCode: meta.shareCode,
    members,
    version: meta.version,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    entries: localEntries,
    anniversaries
  }
}

function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
  const map = new Map<string, T>()
  local.forEach(x => map.set(x.id, x))
  remote.forEach(x => map.set(x.id, x))
  return Array.from(map.values())
}

/* 合并时永远保留本地未同步的记录 / 标记，云端补齐元信息；
 * 本地照片路径优先，云端补 photoUrl。 */
function mergeTag(local: CounterTag, remote: CounterTag, pending: boolean): CounterTag {
  return {
    ...local,
    name: remote.name,
    unit: remote.unit,
    colorIdx: remote.colorIdx,
    target: remote.target,
    photo: local.photo || undefined,
    photoUrl: local.photoUrl || remote.photoUrl || undefined,
    synced: !pending,
    shareCode: remote.shareCode,
    members: remote.members,
    version: remote.version,
    updatedAt: remote.updatedAt,
    entries: pending ? mergeById(local.entries, remote.entries) : remote.entries,
    anniversaries: pending ? mergeById(local.anniversaries, remote.anniversaries) : remote.anniversaries
  }
}

function applyRemoteTag(meta: RemoteTagMeta, detail?: { entries: RemoteEntry[]; marks: RemoteMark[] }) {
  const fresh = toLocalTag(meta, detail?.entries, detail?.marks)
  const index = loadOutbox()
  const pending = index.some(i => i.tagId === meta.id)
  const localRaw = Taro.getStorageSync('c_tag_' + meta.id)
  const local: CounterTag | null = localRaw ? JSON.parse(localRaw) : null
  /* 本地照片路径永远保留：离线可用，也免去重复下载 */
  if (local && local.photo) fresh.photo = local.photo
  if (!pending) {
    const merged = local ? mergeTag(local, fresh, false) : fresh
    saveTag(merged)
    return merged
  }
  const merged = local ? mergeTag(local, fresh, true) : fresh
  saveTag(merged)
  return merged
}

/* ---------------- 出站队列 ---------------- */

async function flushOutbox() {
  for (let guard = 0; guard < 60; guard++) {
    const items = loadOutbox()
    if (!items.length) return
    const item = items[0]

    try {
      if (item.type === 'createTag') {
        const tag = JSON.parse(Taro.getStorageSync('c_tag_' + item.tagId) || 'null') as CounterTag | null
        if (!tag || tag.deleted) {
          removeOutbox([item.key])
          continue
        }
        const meta = await request<RemoteTagMeta>('/tags', 'POST', {
          id: tag.id,
          name: tag.name,
          unit: tag.unit,
          colorIdx: tag.colorIdx,
          target: tag.target
        })
        applyRemoteTag(meta)
        removeOutbox([item.key])
      } else if (item.type === 'updateMeta') {
        const tag = JSON.parse(Taro.getStorageSync('c_tag_' + item.tagId) || 'null') as CounterTag | null
        if (!tag) {
          removeOutbox([item.key])
          continue
        }
        const meta = await request<RemoteTagMeta>(`/tags/${encodeURIComponent(item.tagId)}`, 'POST', {
          name: tag.name,
          unit: tag.unit,
          colorIdx: tag.colorIdx,
          target: tag.target
        })
        applyRemoteTag(meta)
        removeOutbox([item.key])
      } else if (item.type === 'photo') {
        const tag = JSON.parse(Taro.getStorageSync('c_tag_' + item.tagId) || 'null') as CounterTag | null
        if (!tag || !tag.photo) {
          removeOutbox([item.key])
          continue
        }
        const data = await rawUpload(`/tags/${encodeURIComponent(item.tagId)}/photo`, tag.photo)
        /* 上传成功后记住云端地址，好友端拉的是同一张图 */
        const updated = JSON.parse(Taro.getStorageSync('c_tag_' + item.tagId) || 'null') as CounterTag | null
        if (updated) {
          updated.photoUrl = absoluteUrl(data.photoUrl)
          saveTag(updated)
        }
        removeOutbox([item.key])
      } else if (item.type === 'entries') {
        await request(`/tags/${encodeURIComponent(item.tagId)}/entries`, 'POST', {
          entries: item.entries.map(e => ({ id: e.id, date: e.date, time: e.time, amount: e.amount, note: e.note }))
        })
        removeOutbox([item.key])
      } else if (item.type === 'delEntry') {
        try {
          await request(`/tags/${encodeURIComponent(item.tagId)}/entries/${encodeURIComponent(item.entryId)}`, 'DELETE')
        } catch (err) {
          if (!(err instanceof ApiError) || (err.status !== 404 && err.status !== 403)) throw err
        }
        removeOutbox([item.key])
      } else if (item.type === 'marks') {
        await request(`/tags/${encodeURIComponent(item.tagId)}/marks`, 'POST', {
          marks: item.marks.map(m => ({ id: m.id, date: m.date, time: m.time, label: m.label, valueAtMark: m.valueAtMark }))
        })
        removeOutbox([item.key])
      } else if (item.type === 'delMark') {
        try {
          await request(`/tags/${encodeURIComponent(item.tagId)}/marks/${encodeURIComponent(item.markId)}`, 'DELETE')
        } catch (err) {
          if (!(err instanceof ApiError) || (err.status !== 404 && err.status !== 403)) throw err
        }
        removeOutbox([item.key])
      } else if (item.type === 'delTag') {
        try {
          await request(`/tags/${encodeURIComponent(item.tagId)}`, 'DELETE')
        } catch (err) {
          if (!(err instanceof ApiError) || err.status !== 404) throw err
        }
        removeOutbox([item.key])
        removeTagLocal(item.tagId)
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

async function pullTags() {
  const metas = await request<RemoteTagMeta[]>('/tags', 'GET')
  for (const meta of metas) {
    const detail = await request<TagDetail>(`/tags/${encodeURIComponent(meta.id)}`, 'GET')
    applyRemoteTag(detail.tag, { entries: detail.entries, marks: detail.marks })
  }
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
    await pullTags()
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

export async function joinByCode(code: string): Promise<CounterTag> {
  const meta = await request<RemoteTagMeta>('/tags/join', 'POST', { code: code.trim().toUpperCase() })
  const detail = await request<TagDetail>(`/tags/${encodeURIComponent(meta.id)}`, 'GET')
  return applyRemoteTag(detail.tag, { entries: detail.entries, marks: detail.marks })
}

export function memberDisplayName(member: CounterMember): string {
  if (member.id === loadAccountId()) return '我'
  return member.name || '好友'
}

export function memberColorIdx(member: CounterMember): number {
  return member.colorIdx
}

export { enqueue }
