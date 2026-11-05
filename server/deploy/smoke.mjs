#!/usr/bin/env node
/**
 * 一起数数后端 · 端到端冒烟测试
 * 用法：
 *   BASE_URL=https://counter.mariana66.xyz node server/deploy/smoke.mjs
 *   BASE_URL=http://127.0.0.1:8787        node server/deploy/smoke.mjs   # 本地自测
 * 覆盖 26 项断言：口令/权限/幂等/未来日期/照片/删除重算/软删。
 * 注意：会在目标库写入一条测试标签（结束时软删除）与一张测试照片文件。
 */
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:8787').replace(/\/$/, '')

let passed = 0
const failed = []

function assert(cond, label) {
  if (cond) {
    passed += 1
    console.log('ok   ' + label)
  } else {
    failed.push(label)
    console.log('FAIL ' + label)
  }
}

async function call(path, method, body, token) {
  const headers = {}
  if (token) headers.Authorization = 'Bearer ' + token
  let payload
  if (body instanceof Uint8Array || Buffer.isBuffer(body)) {
    headers['Content-Type'] = 'image/jpeg'
    payload = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(BASE + path, { method, headers, body: payload })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('json') ? await res.json() : Buffer.from(await res.arrayBuffer())
  return { status: res.status, json: data, raw: data }
}

// 北京时间日期，避免 UTC 跨天导致"未来日期"误判
function bjDate(offsetDays = 0) {
  const d = new Date(Date.now() + 8 * 3600 * 1000 + offsetDays * 86400 * 1000)
  return d.toISOString().slice(0, 10)
}

const rid = Math.random().toString(36).slice(2, 8)

async function main() {
  console.log('BASE = ' + BASE)

  // 1) health
  const h = await call('/api/v1/health', 'GET')
  assert(h.status === 200 && h.json.ok, 'health')

  // 2) 两个匿名账号
  const sA = await call('/api/v1/session', 'POST', {})
  const sB = await call('/api/v1/session', 'POST', {})
  const tokA = sA.json?.data?.token
  const tokB = sB.json?.data?.token
  assert(!!tokA, 'session A token')
  assert(!!tokB, 'session B token')

  // 3) 建标签 + 6 位口令
  const TAG = 't' + rid + 'aa'
  const c1 = await call('/api/v1/tags', 'POST', { id: TAG, name: 'smoke-tag', unit: 'ci', colorIdx: 2, target: 100 }, tokA)
  assert(c1.status === 201 && c1.json.ok && /^[0-9A-Za-z]{6}$/.test(c1.json.data.shareCode || ''), 'create tag + shareCode')

  // 4) 幂等：同 id 再建返回同一条
  const c2 = await call('/api/v1/tags', 'POST', { id: TAG, name: 'smoke-tag', unit: 'ci', colorIdx: 2, target: 100 }, tokA)
  assert(c2.status === 200 && c2.json.data.id === TAG, 'create idempotent')

  // 5) 改元信息
  const m1 = await call('/api/v1/tags/' + TAG, 'POST', { name: 'smoke-tag2', unit: 'ge', colorIdx: 3, target: 50 }, tokA)
  assert(m1.json.data.name === 'smoke-tag2' && m1.json.data.target === 50, 'update meta')

  // 6) 写 2 条记录
  const e1 = await call('/api/v1/tags/' + TAG + '/entries', 'POST', {
    entries: [
      { id: 'cid' + rid + '1', date: bjDate(-1), time: '08:00', amount: 1, note: 'n1' },
      { id: 'cid' + rid + '2', date: bjDate(0), time: '18:30', amount: 2, note: '' },
    ],
  }, tokA)
  assert(e1.json.ok && e1.json.data.applied === 2, 'write 2 entries')
  assert(e1.json.data.tag.allSum === 3, 'allSum = 3')

  // 7) 同 id 覆盖（编辑）
  const e2 = await call('/api/v1/tags/' + TAG + '/entries', 'POST', {
    entries: [{ id: 'cid' + rid + '1', date: bjDate(-1), time: '08:00', amount: 4, note: 'n1' }],
  }, tokA)
  assert(e2.json.data.duplicates === 1 && e2.json.data.tag.allSum === 6, 'upsert same id -> allSum = 6')

  // 8) 非成员拒绝
  const g0 = await call('/api/v1/tags/' + TAG, 'GET', undefined, tokB)
  assert(g0.status === 403 || g0.status === 404, 'non-member read rejected ' + g0.status)

  // 9) 未来日期拒绝
  const e3 = await call('/api/v1/tags/' + TAG + '/entries', 'POST', {
    entries: [{ id: 'cid' + rid + '9', date: bjDate(3), time: '08:00', amount: 1 }],
  }, tokA)
  assert(e3.status === 400, 'future date rejected 400')

  // 10) 写标记
  const k1 = await call('/api/v1/tags/' + TAG + '/marks', 'POST', {
    marks: [{ id: 'mid' + rid + '1', date: bjDate(-1), time: '09:00', label: 'milestone', valueAtMark: 3 }],
  }, tokA)
  assert(k1.json.ok && k1.json.data.applied === 1, 'write mark')

  // 11) 明细含 2 条记录 + 1 个标记（GET /tags/:id 返回 { tag, entries, marks }）
  const g1 = await call('/api/v1/tags/' + TAG, 'GET', undefined, tokA)
  assert(g1.json.ok && g1.json.data.entries.length === 2 && g1.json.data.marks.length === 1, 'detail 2 entries + 1 mark')
  assert(g1.json.data.tag.unit === 'ge' && g1.json.data.tag.allSum === 6, 'meta visible in detail')
  const list = await call('/api/v1/tags/' + TAG + '/entries', 'GET', undefined, tokA)
  assert(Array.isArray(list.json.data) && list.json.data.length === 2, 'entries list is bare array')

  // 12) B 凭口令加入
  const j1 = await call('/api/v1/tags/join', 'POST', { code: c1.json.data.shareCode }, tokB)
  assert(j1.json.ok && j1.json.data.id === TAG, 'B join by code')
  const e4 = await call('/api/v1/tags/' + TAG + '/entries', 'POST', {
    entries: [{ id: 'cid' + rid + 'b', date: bjDate(0), time: '21:00', amount: 5 }],
  }, tokB)
  assert(e4.json.data.tag.allSum === 11, 'B write entry -> allSum = 11')

  // 13) 记录带署名
  const detail2 = await call('/api/v1/tags/' + TAG + '/entries', 'GET', undefined, tokA)
  const bEntry = detail2.json.data.find((x) => x.id === 'cid' + rid + 'b')
  assert(!!(bEntry && bEntry.byId && bEntry.by), 'entry has byId + by(nickname)')

  // 14) 照片上传 + 公开读取
  const jpg = Buffer.from(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a' +
    'HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAA' +
    'AAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==',
    'base64'
  )
  const p1 = await call('/api/v1/tags/' + TAG + '/photo', 'POST', jpg, tokA)
  assert(p1.json.ok && String(p1.json.data.photoUrl).includes('/api/v1/photos/'), 'photo binary upload')
  const ph = await fetch(BASE + p1.json.data.photoUrl)
  const phBuf = Buffer.from(await ph.arrayBuffer())
  assert(ph.status === 200 && phBuf.length === jpg.length && ph.headers.get('content-type') === 'image/jpeg', 'photo public read ' + ph.status)

  // 15) 删记录后合计重算
  const d1 = await call('/api/v1/tags/' + TAG + '/entries/cid' + rid + '1', 'DELETE', undefined, tokA)
  assert(d1.json.ok, 'delete entry')
  const g3 = await call('/api/v1/tags/' + TAG, 'GET', undefined, tokA)
  assert(g3.json.data.entries.length === 2 && g3.json.data.tag.allSum === 7, 'after delete: 2 entries left, allSum = 7')

  // 16) 标记删除权限：B 删 A 的标记 403，A 自删 OK（tag owner 是 A）
  const dm1 = await call('/api/v1/tags/' + TAG + '/marks/mid' + rid + '1', 'DELETE', undefined, tokB)
  assert(dm1.status === 403, 'B delete A mark rejected 403')
  const dm2 = await call('/api/v1/tags/' + TAG + '/marks/mid' + rid + '1', 'DELETE', undefined, tokA)
  assert(dm2.json.ok, 'A owner delete mark')

  // 17) 删标签：非 owner 拒绝，owner 成功，之后 404
  const dt0 = await call('/api/v1/tags/' + TAG, 'DELETE', undefined, tokB)
  assert(dt0.status === 403, 'B delete tag rejected 403')
  const dt1 = await call('/api/v1/tags/' + TAG, 'DELETE', undefined, tokA)
  assert(dt1.json.ok, 'A delete tag')
  const g4 = await call('/api/v1/tags/' + TAG, 'GET', undefined, tokA)
  assert(g4.status === 404, 'deleted tag 404')

  // 18) 未鉴权
  const au = await call('/api/v1/tags', 'GET')
  assert(au.status === 401, 'unauthorized 401')

  console.log('\npassed ' + passed + ', failed ' + failed.length)
  if (failed.length) {
    console.log('FAILED: ' + failed.join(' | '))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('ERROR', e && e.message ? e.message : e)
  process.exit(1)
})
