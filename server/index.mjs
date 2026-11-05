/* ===================== 一起数数 · 零依赖后端 =====================
 * 运行：node server/index.mjs
 * 环境变量：
 *   PORT=8787            监听端口
 *   HOST=0.0.0.0         监听地址
 *   DB_PATH=server/data/counter.db
 *   ALLOWED_ORIGIN=      允许的网页来源（小程序不需要，留空即可）
 *   TRUST_PROXY=1        部署在 Nginx 等反向代理后面时开启，用于取真实 IP
 *   TLS_KEY_FILE / TLS_CERT_FILE  直接由 Node 提供 HTTPS 时填写证书路径
 *
 * 数据安全：
 *   - 匿名设备令牌，只存 SHA-256 哈希，不保存 openid / 手机号等个人信息
 *   - 全部 SQL 参数化；输入长度、数值、事件类型白名单校验
 *   - 分享口令 6 位随机码 + 频率限制，避免枚举
 *   - 卡片数据仅创建者与加入的成员可读写；删除仅创建者
 *   - 备份：直接复制 server/data/counter.db（WAL 模式下请先停服或使用 sqlite3 .backup）
 */

import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, randomBytes, randomInt } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '0.0.0.0'
const DB_PATH = process.env.DB_PATH || path.join(ROOT, 'data', 'counter.db')
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)
const TRUST_PROXY = process.env.TRUST_PROXY === '1'

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
const db = new DatabaseSync(DB_PATH)
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_seen_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    share_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT '次',
    value INTEGER NOT NULL DEFAULT 0,
    color_idx INTEGER NOT NULL DEFAULT 0,
    owner_id TEXT NOT NULL REFERENCES accounts(id),
    version INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS members (
    card_id TEXT NOT NULL REFERENCES cards(id),
    account_id TEXT NOT NULL REFERENCES accounts(id),
    nickname TEXT NOT NULL,
    color_idx INTEGER NOT NULL DEFAULT 0,
    role TEXT NOT NULL DEFAULT 'member',
    contribution INTEGER NOT NULL DEFAULT 0,
    joined_at INTEGER NOT NULL,
    PRIMARY KEY (card_id, account_id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL REFERENCES cards(id),
    account_id TEXT NOT NULL REFERENCES accounts(id),
    client_id TEXT NOT NULL,
    type TEXT NOT NULL,
    delta INTEGER NOT NULL DEFAULT 0,
    value INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    deleted_at INTEGER,
    UNIQUE (card_id, client_id)
  );

  CREATE INDEX IF NOT EXISTS idx_cards_owner ON cards(owner_id, updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_members_account ON members(account_id, joined_at DESC);
  CREATE INDEX IF NOT EXISTS idx_events_card ON events(card_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_events_client ON events(card_id, client_id);
`)

const MAX_BODY = 64 * 1024
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const now = () => Date.now()

class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

/* ---------------- 基础工具 ---------------- */

function sha256(text) {
  return createHash('sha256').update(text).digest('hex')
}

function clientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.length) {
      return forwarded.split(',')[0].trim()
    }
  }
  return req.socket.remoteAddress || 'unknown'
}

const buckets = new Map()
function rateLimit(key, limit, windowMs) {
  const t = now()
  const bucket = buckets.get(key)
  if (!bucket || t > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: t + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}
function limit(req, scope, limitCount, windowMs, identity) {
  const key = `${scope}:${identity || clientIp(req)}`
  if (!rateLimit(key, limitCount, windowMs)) {
    throw new HttpError(429, 'RATE_LIMITED', '操作太频繁，休息一下再试')
  }
}
setInterval(() => {
  const t = now()
  for (const [key, bucket] of buckets) {
    if (t > bucket.resetAt) buckets.delete(key)
  }
}, 10 * 60 * 1000).unref()

function send(res, status, payload) {
  const body = JSON.stringify(payload)
  for (const [k, v] of Object.entries(baseHeaders)) res.setHeader(k, v)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
}

function ok(res, data, status = 200) {
  send(res, status, { ok: true, data })
}

function fail(res, status, code, message) {
  send(res, status, { ok: false, error: { code, message } })
}

const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
}

function applyCors(req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    let settled = false
    const chunks = []
    req.on('data', chunk => {
      if (settled) return
      size += chunk.length
      if (size > MAX_BODY) {
        settled = true
        reject(new HttpError(413, 'BODY_TOO_LARGE', '请求内容过大'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      if (!chunks.length) return resolve({})
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          reject(new HttpError(400, 'BAD_JSON', '请求格式不正确'))
          return
        }
        resolve(parsed)
      } catch {
        reject(new HttpError(400, 'BAD_JSON', '请求格式不正确'))
      }
    })
    req.on('error', err => {
      if (settled) return
      settled = true
      reject(err)
    })
  })
}

/* ---------------- 校验 ---------------- */

function cleanText(value, max, fallback = '') {
  if (typeof value !== 'string') return fallback
  const text = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return text ? text.slice(0, max) : fallback
}

function intIn(value, min, max, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  const i = Math.floor(n)
  if (i < min || i > max) return fallback
  return i
}

function validId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{8,40}$/.test(value)
}

function validCode(value) {
  return typeof value === 'string' && /^[A-Z0-9]{6}$/.test(value)
}

function normalizeCode(value) {
  return typeof value === 'string' ? value.replace(/[\s-]/g, '').toUpperCase() : ''
}

function makeShareCode() {
  let code = ''
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)]
  return code
}

function uniqueShareCode() {
  for (let i = 0; i < 8; i++) {
    const code = makeShareCode()
    const exists = db.prepare('SELECT 1 FROM cards WHERE share_code = ?').get(code)
    if (!exists) return code
  }
  throw new HttpError(500, 'CODE_FAILED', '口令生成失败，请重试')
}

function colorFor(accountId) {
  return parseInt(accountId.slice(-4), 36) % 6 || 0
}

/* ---------------- 鉴权 ---------------- */

function auth(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token || token.length < 20 || token.length > 128) return null
  const account = db.prepare('SELECT id, nickname FROM accounts WHERE token_hash = ?').get(sha256(token))
  if (!account) return null
  db.prepare('UPDATE accounts SET last_seen_at = ? WHERE id = ?').run(now(), account.id)
  return account
}

function requireAuth(req) {
  const account = auth(req)
  if (!account) throw new HttpError(401, 'UNAUTHORIZED', '登录状态已失效')
  return account
}

/* ---------------- 卡片读写 ---------------- */

function cardRow(cardId) {
  return db.prepare('SELECT * FROM cards WHERE id = ? AND deleted_at IS NULL').get(cardId)
}

function membership(cardId, accountId) {
  return db.prepare('SELECT * FROM members WHERE card_id = ? AND account_id = ?').get(cardId, accountId)
}

function buildCard(account, row) {
  const members = db.prepare(`
    SELECT m.account_id AS id, m.nickname AS name, m.color_idx AS colorIdx,
           m.role AS role, m.contribution AS contribution
    FROM members m
    WHERE m.card_id = ?
    ORDER BY CASE WHEN m.role = 'owner' THEN 0 ELSE 1 END, m.joined_at ASC
    LIMIT 20
  `).all(row.id)

  const marks = db.prepare(`
    SELECT client_id AS id, created_at AS ts, value AS value
    FROM events
    WHERE card_id = ? AND type = 'mark' AND deleted_at IS NULL
    ORDER BY created_at DESC, rowid DESC
    LIMIT 200
  `).all(row.id)

  const last = db.prepare(`
    SELECT e.type AS type, e.delta AS delta, e.created_at AS ts, m.nickname AS name
    FROM events e
    JOIN members m ON m.card_id = e.card_id AND m.account_id = e.account_id
    WHERE e.card_id = ? AND e.deleted_at IS NULL
    ORDER BY e.created_at DESC, e.rowid DESC
    LIMIT 1
  `).get(row.id)

  return {
    id: row.id,
    title: row.title,
    unit: row.unit,
    value: row.value,
    colorIdx: row.color_idx,
    shareCode: row.share_code,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isOwner: row.owner_id === account.id,
    members,
    marks,
    lastBy: last ? last.name : undefined,
    lastAt: last ? last.ts : undefined
  }
}

function visibleCard(account, cardId) {
  const row = cardRow(cardId)
  if (!row) throw new HttpError(404, 'CARD_NOT_FOUND', '计数不存在或已删除')
  if (!membership(cardId, account.id)) throw new HttpError(403, 'NOT_MEMBER', '你还没有加入这个计数')
  return row
}

/* ---------------- 路由处理 ---------------- */

async function handleSession(req, res) {
  limit(req, 'session', 12, 60 * 1000)
  const token = randomBytes(32).toString('base64url')
  const accountId = 'a' + randomBytes(8).toString('hex')
  const nickname = '数友' + accountId.slice(-4).toUpperCase()
  const t = now()
  db.prepare('INSERT INTO accounts (id, token_hash, nickname, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)')
    .run(accountId, sha256(token), nickname, t, t)
  ok(res, { accountId, token, nickname })
}

async function handleCreateCard(req, res, account) {
  limit(req, 'card-create', 30, 60 * 60 * 1000, account.id)
  const body = await readBody(req)
  const id = body.id === undefined ? 'c' + randomBytes(10).toString('hex') : String(body.id)
  if (!validId(id)) throw new HttpError(400, 'BAD_ID', '计数 ID 格式不正确')

  const existing = db.prepare('SELECT * FROM cards WHERE id = ?').get(id)
  if (existing) {
    if (existing.owner_id === account.id && !existing.deleted_at) {
      return ok(res, buildCard(account, existing))
    }
    throw new HttpError(409, 'ID_TAKEN', '计数 ID 已被占用')
  }

  const title = cleanText(body.title, 20, '我的计数')
  const unit = cleanText(body.unit, 6, '次')
  const value = intIn(body.value, 0, 1_000_000_000, 0)
  const colorIdx = intIn(body.colorIdx, 0, 5, 0)
  const shareCode = uniqueShareCode()
  const t = now()

  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare(`
      INSERT INTO cards (id, share_code, title, unit, value, color_idx, owner_id, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(id, shareCode, title, unit, value, colorIdx, account.id, t, t)
    db.prepare(`
      INSERT INTO members (card_id, account_id, nickname, color_idx, role, contribution, joined_at)
      VALUES (?, ?, ?, ?, 'owner', ?, ?)
    `).run(id, account.id, account.nickname, colorFor(account.id), Math.max(0, value), t)
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }

  const row = cardRow(id)
  ok(res, buildCard(account, row), 201)
}

function handleListCards(req, res, account) {
  limit(req, 'card-list', 120, 60 * 1000, account.id)
  const rows = db.prepare(`
    SELECT c.* FROM cards c
    JOIN members m ON m.card_id = c.id
    WHERE m.account_id = ? AND c.deleted_at IS NULL
    ORDER BY c.updated_at DESC
    LIMIT 100
  `).all(account.id)
  ok(res, rows.map(row => buildCard(account, row)))
}

function handleGetCard(req, res, account, cardId) {
  limit(req, 'card-get', 180, 60 * 1000, account.id)
  const row = visibleCard(account, cardId)
  ok(res, buildCard(account, row))
}

async function handleJoin(req, res, account) {
  limit(req, 'join-account', 8, 60 * 1000, account.id)
  limit(req, 'join-ip', 20, 60 * 1000)
  const body = await readBody(req)
  const code = normalizeCode(body.code)
  if (!validCode(code)) throw new HttpError(400, 'BAD_CODE', '口令格式不正确')

  const row = db.prepare('SELECT * FROM cards WHERE share_code = ? AND deleted_at IS NULL').get(code)
  if (!row) throw new HttpError(404, 'CODE_NOT_FOUND', '口令无效或已过期')

  const exists = membership(row.id, account.id)
  if (!exists) {
    db.prepare(`
      INSERT INTO members (card_id, account_id, nickname, color_idx, role, contribution, joined_at)
      VALUES (?, ?, ?, ?, 'member', 0, ?)
    `).run(row.id, account.id, account.nickname, colorFor(account.id), now())
  }
  ok(res, buildCard(account, row))
}

async function handleEvents(req, res, account, cardId) {
  limit(req, 'events', 240, 60 * 1000, account.id)
  limit(req, 'events-ip', 400, 60 * 1000)
  visibleCard(account, cardId)
  const body = await readBody(req)
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 50) {
    throw new HttpError(400, 'BAD_EVENTS', '每次需提交 1-50 条增量')
  }

  const t = now()
  const minTs = t - 30 * 24 * 60 * 60 * 1000
  const maxTs = t + 5 * 60 * 1000
  const prepared = []

  for (const raw of body.events) {
    if (!raw || typeof raw !== 'object') throw new HttpError(400, 'BAD_EVENT', '增量格式不正确')
    const clientId = String(raw.id || '')
    if (!validId(clientId)) throw new HttpError(400, 'BAD_EVENT_ID', '增量 ID 格式不正确')
    const type = raw.type === 'mark' ? 'mark' : raw.type === 'delta' ? 'delta' : ''
    if (!type) throw new HttpError(400, 'BAD_EVENT_TYPE', '增量类型不正确')

    const ts = Number(raw.ts)
    const createdAt = Number.isFinite(ts) ? Math.min(maxTs, Math.max(minTs, Math.floor(ts))) : t

    if (type === 'delta') {
      const delta = intIn(raw.delta, -100, 100, 0)
      if (!delta) throw new HttpError(400, 'BAD_DELTA', '计数增量需在 ±100 之间')
      prepared.push({ clientId, type, delta, value: 0, createdAt })
    } else {
      const value = intIn(raw.value, 0, 1_000_000_000, null)
      if (value === null) throw new HttpError(400, 'BAD_VALUE', '标记数值不正确')
      prepared.push({ clientId, type, delta: 0, value, createdAt })
    }
  }

  let applied = 0
  let duplicates = 0
  let value = 0

  db.exec('BEGIN IMMEDIATE')
  try {
    const row = cardRow(cardId)
    if (!row) throw new HttpError(404, 'CARD_NOT_FOUND', '计数不存在或已删除')
    value = row.value

    const findEvent = db.prepare('SELECT id FROM events WHERE card_id = ? AND client_id = ?')
    const insertEvent = db.prepare(`
      INSERT INTO events (id, card_id, account_id, client_id, type, delta, value, created_at, deleted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
    `)
    const bumpMember = db.prepare(`
      UPDATE members SET contribution = MAX(0, contribution + ?) WHERE card_id = ? AND account_id = ?
    `)

    for (const e of prepared) {
      if (findEvent.get(cardId, e.clientId)) {
        duplicates += 1
        continue
      }
      insertEvent.run(
        'e' + randomBytes(12).toString('hex'),
        cardId,
        account.id,
        e.clientId,
        e.type,
        e.delta,
        e.type === 'mark' ? e.value : 0,
        e.createdAt
      )
      if (e.type === 'delta') {
        value = Math.max(0, value + e.delta)
        if (e.delta > 0) bumpMember.run(e.delta, cardId, account.id)
      }
      applied += 1
    }

    if (applied > 0) {
      db.prepare('UPDATE cards SET value = ?, version = version + ?, updated_at = ? WHERE id = ?')
        .run(value, applied, t, cardId)
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }

  const row = cardRow(cardId)
  ok(res, { card: buildCard(account, row), applied, duplicates })
}

function handleListEvents(req, res, account, cardId, since) {
  limit(req, 'event-list', 120, 60 * 1000, account.id)
  visibleCard(account, cardId)
  const rows = db.prepare(`
    SELECT client_id AS id, type, delta, value, created_at AS ts
    FROM events
    WHERE card_id = ? AND deleted_at IS NULL AND created_at > ?
    ORDER BY created_at ASC, rowid ASC
    LIMIT 200
  `).all(cardId, since)
  ok(res, rows)
}

function handleDeleteMark(req, res, account, cardId, eventId) {
  limit(req, 'event-delete', 60, 60 * 1000, account.id)
  const row = visibleCard(account, cardId)
  const event = db.prepare(`
    SELECT * FROM events WHERE card_id = ? AND client_id = ? AND type = 'mark' AND deleted_at IS NULL
  `).get(cardId, eventId)
  if (!event) throw new HttpError(404, 'MARK_NOT_FOUND', '这条时间戳不存在')
  if (row.owner_id !== account.id && event.account_id !== account.id) {
    throw new HttpError(403, 'NOT_ALLOWED', '只能删除自己的时间戳')
  }
  db.prepare('UPDATE events SET deleted_at = ? WHERE id = ?').run(now(), event.id)
  ok(res, { deleted: true })
}

function handleDeleteCard(req, res, account, cardId) {
  limit(req, 'card-delete', 30, 60 * 1000, account.id)
  const row = visibleCard(account, cardId)
  if (row.owner_id !== account.id) throw new HttpError(403, 'NOT_OWNER', '只有创建者可以删除')
  db.prepare('UPDATE cards SET deleted_at = ?, updated_at = ? WHERE id = ?').run(now(), now(), cardId)
  ok(res, { deleted: true })
}

/* ---------------- 请求入口 ---------------- */

async function route(req, res) {
  applyCors(req, res)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  limit(req, 'global-ip', 600, 60 * 1000)

  const url = new URL(req.url || '/', 'http://localhost')
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2 || parts[0] !== 'api' || parts[1] !== 'v1') {
    throw new HttpError(404, 'NOT_FOUND', '接口不存在')
  }
  const tail = parts.slice(2)

  if (tail.length === 1 && tail[0] === 'health' && req.method === 'GET') {
    return ok(res, { service: 'counter', time: now() })
  }

  if (tail.length === 1 && tail[0] === 'session' && req.method === 'POST') {
    return handleSession(req, res)
  }

  const account = requireAuth(req)

  if (tail.length === 1 && tail[0] === 'cards') {
    if (req.method === 'GET') return handleListCards(req, res, account)
    if (req.method === 'POST') return handleCreateCard(req, res, account)
    throw new HttpError(405, 'METHOD_NOT_ALLOWED', '请求方法不支持')
  }

  if (tail.length === 2 && tail[0] === 'cards' && tail[1] === 'join' && req.method === 'POST') {
    return handleJoin(req, res, account)
  }

  if (tail.length >= 2 && tail[0] === 'cards') {
    const cardId = decodeURIComponent(tail[1])

    if (tail.length === 2) {
      if (req.method === 'GET') return handleGetCard(req, res, account, cardId)
      if (req.method === 'DELETE') return handleDeleteCard(req, res, account, cardId)
    }

    if (tail.length === 3 && tail[2] === 'events') {
      if (req.method === 'GET') {
        const since = intIn(url.searchParams.get('since'), 0, Number.MAX_SAFE_INTEGER, 0)
        return handleListEvents(req, res, account, cardId, since)
      }
      if (req.method === 'POST') return handleEvents(req, res, account, cardId)
    }

    if (tail.length === 4 && tail[2] === 'events' && req.method === 'DELETE') {
      return handleDeleteMark(req, res, account, cardId, decodeURIComponent(tail[3]))
    }
  }

  throw new HttpError(404, 'NOT_FOUND', '接口不存在')
}

async function handler(req, res) {
  try {
    await route(req, res)
  } catch (err) {
    if (err instanceof HttpError) {
      fail(res, err.status, err.code, err.message)
      return
    }
    console.error('[counter]', err && err.message ? err.message : err)
    fail(res, 500, 'INTERNAL', '服务器开小差了')
  }
}

const keyFile = process.env.TLS_KEY_FILE
const certFile = process.env.TLS_CERT_FILE
const server =
  keyFile && certFile
    ? https.createServer({ key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) }, handler)
    : http.createServer(handler)

server.requestTimeout = 30 * 1000
server.headersTimeout = 20 * 1000
server.listen(PORT, HOST, () => {
  const scheme = keyFile && certFile ? 'https' : 'http'
  console.log(`[counter] ${scheme}://${HOST}:${PORT}  db=${DB_PATH}`)
})

function shutdown() {
  server.close(() => {
    try {
      db.close()
    } catch {
      /* ignore */
    }
    process.exit(0)
  })
  setTimeout(() => process.exit(0), 3000).unref()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
