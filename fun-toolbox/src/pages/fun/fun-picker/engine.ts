/* ===================== 趣味选择器 · 手写 3D 引擎 =====================
 * canvas 2d 上的真 3D：透视投影 + 四元数旋转 + 背面剔除 + 画家算法排序。
 * 三个场景共用：骰子（立方体六面点数）、硬币（薄圆柱正反面）、摇签（签筒+签）。
 * 纯 TS 无 Taro 依赖，页面负责驱动 RAF 循环。
 */

export type V3 = [number, number, number]
export type Quat = { w: number; x: number; y: number; z: number }

/* ---------- 向量 ---------- */
export const v3 = (x: number, y: number, z: number): V3 => [x, y, z]
const vAdd = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const vSub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const vScale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const vDot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const vCross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
]
const vNorm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/* ---------- 四元数 ---------- */
export const qId = (): Quat => ({ w: 1, x: 0, y: 0, z: 0 })
export const qAxis = (axis: V3, ang: number): Quat => {
  const a = vNorm(axis)
  const s = Math.sin(ang / 2)
  return { w: Math.cos(ang / 2), x: a[0] * s, y: a[1] * s, z: a[2] * s }
}
export const qMul = (p: Quat, q: Quat): Quat => ({
  w: p.w * q.w - p.x * q.x - p.y * q.y - p.z * q.z,
  x: p.w * q.x + p.x * q.w + p.y * q.z - p.z * q.y,
  y: p.w * q.y - p.x * q.z + p.y * q.w + p.z * q.x,
  z: p.w * q.z + p.x * q.y - p.y * q.x + p.z * q.w
})
export const qNorm = (q: Quat): Quat => {
  const l = Math.hypot(q.w, q.x, q.y, q.z) || 1
  return { w: q.w / l, x: q.x / l, y: q.y / l, z: q.z / l }
}
export const qNlerp = (a: Quat, b: Quat, t: number): Quat => {
  let s = 1
  if (a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z < 0) s = -1
  return qNorm({
    w: a.w + (b.w * s - a.w) * t,
    x: a.x + (b.x * s - a.x) * t,
    y: a.y + (b.y * s - a.y) * t,
    z: a.z + (b.z * s - a.z) * t
  })
}
export const qRotate = (q: Quat, v: V3): V3 => {
  const qv: Quat = { w: 0, x: v[0], y: v[1], z: v[2] }
  const c = qMul(qMul(q, qv), { w: q.w, x: -q.x, y: -q.y, z: -q.z })
  return [c.x, c.y, c.z]
}
/* 最短弧旋转：把单位向量 from 转到 to */
export const qFromTo = (from: V3, to: V3): Quat => {
  const f = vNorm(from)
  const t = vNorm(to)
  const d = vDot(f, t)
  if (d > 0.9999) return qId()
  if (d < -0.9999) {
    const ortho = vNorm(vCross(f, Math.abs(f[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]))
    return qAxis(vCross(f, ortho).length ? vCross(ortho, f) : [1, 0, 0], Math.PI)
  }
  return qNorm(qAxis(vCross(f, t), Math.acos(d) * 2))
}

/* ---------- 颜色明暗 ---------- */
export function shade(hex: string, k: number): string {
  const m = hex.replace('#', '')
  const r = Math.min(255, Math.round(parseInt(m.slice(0, 2), 16) * k))
  const g = Math.min(255, Math.round(parseInt(m.slice(2, 4), 16) * k))
  const b = Math.min(255, Math.round(parseInt(m.slice(4, 6), 16) * k))
  return `rgb(${r},${g},${b})`
}

/* ---------- 相机投影 ---------- */
export interface Cam {
  cx: number
  cy: number
  f: number      /* 焦距（像素） */
  d: number      /* 相机距离（世界单位） */
}
const proj = (p: V3, cam: Cam): [number, number] => [
  cam.cx + (p[0] * cam.f) / (p[2] + cam.d),
  cam.cy - (p[1] * cam.f) / (p[2] + cam.d)
]

/* 视线方向（相机在 -Z 侧看向 +Z）；光照方向 */
const LIGHT: V3 = vNorm([-0.45, 0.85, -0.6])

interface Drawable {
  depth: number
  draw: () => void
}
function flush(ctx: any, list: Drawable[]) {
  list.sort((a, b) => b.depth - a.depth)
  for (const it of list) it.draw()
}

/* 面法线（顶点按从外看逆时针排列）→ 直接用 DICE_NORMALS，无需从角点求 */

/* ============================================================
 * 骰子：立方体六面 + 点数
 * ============================================================ */

const PIP_LAYOUT: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.26, 0.26], [0.74, 0.74]],
  3: [[0.24, 0.24], [0.5, 0.5], [0.76, 0.76]],
  4: [[0.26, 0.26], [0.74, 0.26], [0.26, 0.74], [0.74, 0.74]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.28, 0.22], [0.28, 0.5], [0.28, 0.78], [0.72, 0.22], [0.72, 0.5], [0.72, 0.78]]
}

/* 六面：值 → 外法线（1↔6 / 2↔5 / 3↔4） */
const DICE_NORMALS: Record<number, V3> = {
  1: [0, 0, 1],
  6: [0, 0, -1],
  2: [0, 1, 0],
  5: [0, -1, 0],
  3: [1, 0, 0],
  4: [-1, 0, 0]
}

/* 一个面的四个角（从外看逆时针；s 为半边长，u/v 为面内正交基） */
function faceCorners(n: V3, s: number): V3[] {
  const ref: V3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [0, 0, 1]
  const u = vScale(vNorm(vCross(ref, n)), s)
  const v = vScale(vNorm(vCross(n, u)), s)
  const c = vScale(n, s)
  return [vAdd(c, vAdd(u, v)), vAdd(c, vSub(v, u)), vAdd(c, vScale(vAdd(u, v), -1)), vAdd(c, vSub(u, v))]
}

export interface DieAnim {
  quat: Quat
  spinAxis: V3
  spinSpeed: number
  target: Quat
  fromQuat: Quat
  value: number
  xOff: number
  t: number           /* 阶段时间戳，秒 */
  phase: 'idle' | 'fly' | 'settle' | 'done'
}

const FLY_T = 1.0
const SETTLE_T = 0.5

export function makeDie(xOff: number): DieAnim {
  return {
    quat: qMul(qAxis([0.3, 1, 0.2], 0.5), qAxis([1, 0, 0], 0.35)),
    spinAxis: vNorm([1, 1, 0.4]),
    spinSpeed: 9,
    target: qId(),
    fromQuat: qId(),
    value: 1,
    xOff,
    t: 0,
    phase: 'idle'
  }
}

export function rollDie(d: DieAnim, value: number) {
  d.value = value
  d.phase = 'fly'
  d.t = 0
  d.spinAxis = vNorm([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5])
  d.spinSpeed = 10 + Math.random() * 6
  /* 目标姿态：该面法线转到 +Z（朝向观众），再带一个随机水平自转 */
  const base = qFromTo(DICE_NORMALS[value], [0, 0, 1])
  d.target = qMul(qAxis([0, 0, 1], Math.random() * Math.PI * 2), base)
}

export function advanceDie(d: DieAnim, dt: number) {
  d.t += dt
  if (d.phase === 'fly') {
    d.quat = qMul(qAxis(d.spinAxis, d.spinSpeed * dt), d.quat)
    if (d.t >= FLY_T) {
      d.phase = 'settle'
      d.t = 0
      d.fromQuat = d.quat
    }
  } else if (d.phase === 'settle') {
    const k = Math.min(1, d.t / SETTLE_T)
    d.quat = qNlerp(d.fromQuat, d.target, k * k * (3 - 2 * k))
    if (d.t >= SETTLE_T) {
      d.phase = 'done'
      d.t = 0
    }
  }
}

/* 高度弧线：fly 抛起落下；settle 两次小弹跳 */
function dieHeight(d: DieAnim): number {
  if (d.phase === 'fly') {
    const t = d.t / FLY_T
    return 1.55 * 4 * t * (1 - t)
  }
  if (d.phase === 'settle') {
    const t = d.t / SETTLE_T
    return 0.28 * Math.abs(Math.sin(t * Math.PI * 2.2)) * (1 - t) * (1 - t)
  }
  return 0
}

export function drawDice(ctx: any, w: number, h: number, dice: DieAnim[], time: number) {
  ctx.clearRect(0, 0, w, h)
  const cam: Cam = { cx: w / 2, cy: h / 2 - h * 0.06, f: w * 0.92, d: 6.2 }
  const unit = w / 750 /* 与 rpx 对齐的比例尺 */
  const s = dice.length > 2 ? 0.82 : 1.02
  const gap = dice.length * 78 * unit * s

  dice.forEach((d, di) => {
    const y = dieHeight(d)
    const pos: V3 = [(di - (dice.length - 1) / 2) * gap, y, 0]
    const sizePx = 300 * unit * s
    /* 世界坐标半边长：让投影后的立方体边长 ≈ sizePx */
    const half = sizePx * cam.d / (2 * cam.f)

    /* 桌面阴影 */
    const shR = sizePx * (0.72 + 0.5 * (1 - Math.min(1, y / 1.6)))
    const [shx, shy] = proj([pos[0], -half, pos[2] + 0.001], cam)
    ctx.save()
    ctx.globalAlpha = 0.16 + 0.1 * Math.min(1, y / 1.5)
    ctx.fillStyle = '#4A3B32'
    ctx.beginPath()
    ctx.ellipse(shx, shy + sizePx * 0.55, shR, shR * 0.32, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const list: Drawable[] = []
    for (let v = 1; v <= 6; v++) {
      const n = DICE_NORMALS[v]
      const rn = qRotate(d.quat, n)
      const corners = faceCorners(n, half)
      const world = corners.map(c0 => vAdd(pos, qRotate(d.quat, c0)))
      const ctr = world.reduce<V3>((a, p) => vAdd(a, vScale(p, 0.25)), [0, 0, 0])
      const viewVec = vSub(ctr, [pos[0], pos[1], pos[2] - cam.d])
      if (vDot(rn, viewVec) >= 0) continue
      const k = 0.55 + 0.45 * Math.max(0, vDot(rn, LIGHT))
      const pts = world.map(p => proj(p, cam))
      const c0 = pts[0]
      const c1 = pts[1]
      const c3 = pts[3]
      const depth = vDot(ctr, [0, 0, 1])
      const pipR = sizePx * 0.115
      list.push({
        depth,
        draw: () => {
          ctx.beginPath()
          ctx.moveTo(c0[0], c0[1])
          for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1])
          ctx.closePath()
          ctx.fillStyle = shade('#FFF6EC', k)
          ctx.fill()
          ctx.strokeStyle = shade('#E3D5C6', k)
          ctx.lineWidth = Math.max(1, unit * 2)
          ctx.stroke()
          for (const [pu, pv] of PIP_LAYOUT[v]) {
            const px = c0[0] + (c1[0] - c0[0]) * pu + (c3[0] - c0[0]) * pv
            const py = c0[1] + (c1[1] - c0[1]) * pu + (c3[1] - c0[1]) * pv
            ctx.beginPath()
            ctx.arc(px, py, pipR, 0, Math.PI * 2)
            ctx.fillStyle = shade('#C4523A', 0.8 + 0.3 * k)
            ctx.fill()
          }
        }
      })
    }
    flush(ctx, list)

    /* 结果光圈 */
    if (d.phase === 'done') {
      const pulse = 0.5 + 0.5 * Math.sin(time * 3.2)
      const [gx, gy] = proj([pos[0], pos[1], pos[2]], cam)
      ctx.save()
      ctx.globalAlpha = 0.25 + 0.2 * pulse
      ctx.strokeStyle = '#C9A063'
      ctx.lineWidth = unit * 4
      ctx.beginPath()
      ctx.arc(gx, gy, sizePx * 0.92 + unit * 6 * pulse, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  })
}

export const diceAllDone = (dice: DieAnim[]) => dice.every(d => d.phase === 'done' || d.phase === 'idle')

/* ============================================================
 * 硬币：薄圆柱（两面 + 侧带）
 * ============================================================ */

export interface CoinAnim {
  quat: Quat
  flipAngle: number
  flipSpeed: number
  target: Quat
  fromQuat: Quat
  result: 'heads' | 'tails'
  t: number
  phase: 'idle' | 'fly' | 'settle' | 'done'
}

export function makeCoin(): CoinAnim {
  return { quat: qAxis([0.2, 1, 0], 0.35), flipAngle: 0.5, flipSpeed: 0, target: qId(), fromQuat: qId(), result: 'heads', t: 0, phase: 'idle' }
}

export function flipCoin(c: CoinAnim, result: 'heads' | 'tails') {
  c.result = result
  c.phase = 'fly'
  c.t = 0
  c.flipAngle = 0
  c.flipSpeed = 15 + Math.random() * 7
  const base = result === 'heads' ? qId() : qAxis([1, 0, 0], Math.PI)
  c.target = qMul(qAxis([0, 0, 1], (Math.random() - 0.5) * 0.5), base)
}

const COIN_FLY = 1.05
const COIN_SETTLE = 0.45

export function advanceCoin(c: CoinAnim, dt: number) {
  c.t += dt
  if (c.phase === 'fly') {
    c.flipAngle += c.flipSpeed * dt
    c.quat = qMul(qAxis([1, 0, 0], c.flipAngle), qAxis([0, 1, 0], Math.sin(c.flipAngle * 0.13) * 0.35))
    if (c.t >= COIN_FLY) {
      c.phase = 'settle'
      c.t = 0
      c.fromQuat = c.quat
    }
  } else if (c.phase === 'settle') {
    const k = Math.min(1, c.t / COIN_SETTLE)
    c.quat = qNlerp(c.fromQuat, c.target, k * k * (3 - 2 * k))
    if (c.t >= COIN_SETTLE) {
      c.phase = 'done'
      c.t = 0
    }
  }
}

function coinHeight(c: CoinAnim): number {
  if (c.phase === 'fly') {
    const t = c.t / COIN_FLY
    return 1.7 * 4 * t * (1 - t)
  }
  if (c.phase === 'settle') {
    const t = c.t / COIN_SETTLE
    return 0.3 * Math.abs(Math.sin(t * Math.PI * 2)) * (1 - t) * (1 - t)
  }
  return 0
}

export function drawCoin(ctx: any, w: number, h: number, c: CoinAnim, time: number) {
  ctx.clearRect(0, 0, w, h)
  const cam: Cam = { cx: w / 2, cy: h / 2 - h * 0.05, f: w * 0.92, d: 6.2 }
  const unit = w / 750
  const R = 190 * unit
  const TH = 26 * unit /* 半厚 */
  const N = 40
  const pos: V3 = [0, coinHeight(c), 0]

  /* 阴影 */
  const [shx, shy] = proj([0, -R * 1.05, 0.001], cam)
  ctx.save()
  ctx.globalAlpha = 0.16 + 0.1 * Math.min(1, coinHeight(c) / 1.5)
  ctx.fillStyle = '#4A3B32'
  ctx.beginPath()
  ctx.ellipse(shx, shy + R * 0.45, R * (1.05 - 0.25 * Math.min(1, coinHeight(c) / 1.8)), R * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  /* 圆柱面点集 */
  const rimPts: V3[] = []
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    rimPts.push([Math.cos(a) * R, Math.sin(a) * R, 0])
  }
  const front: V3[] = rimPts.map(p => vAdd(pos, qRotate(c.quat, [...p, 0].slice(0, 2).concat([TH]) as V3)))
  const back: V3[] = rimPts.map(p => vAdd(pos, qRotate(c.quat, [...p.slice(0, 2), -TH] as V3)))

  const list: Drawable[] = []

  /* 正面（+Z，趣） */
  const frontCtr = vAdd(pos, qRotate(c.quat, [0, 0, TH]))
  /* 侧带（分段四边形，只留法线朝观众的） */
  for (let i = 0; i < N; i++) {
    const a0 = ((i + 0.5) / N) * Math.PI * 2
    const nrm = qRotate(c.quat, [Math.cos(a0), Math.sin(a0), 0])
    const ctr = vScale(vAdd(front[i], back[i]), 0.5)
    const viewVec = vSub(ctr, [pos[0], pos[1], pos[2] - cam.d])
    if (vDot(nrm, viewVec) >= 0) continue
    const k = 0.5 + 0.5 * Math.max(0, vDot(nrm, LIGHT))
    const p1 = proj(front[i], cam)
    const p2 = proj(front[(i + 1) % N], cam)
    const p3 = proj(back[(i + 1) % N], cam)
    const p4 = proj(back[i], cam)
    const isNotch = i % 5 === 0
    list.push({
      depth: vDot(ctr, [0, 0, 1]) + 0.001,
      draw: () => {
        ctx.beginPath()
        ctx.moveTo(p1[0], p1[1])
        ctx.lineTo(p2[0], p2[1])
        ctx.lineTo(p3[0], p3[1])
        ctx.lineTo(p4[0], p4[1])
        ctx.closePath()
        ctx.fillStyle = isNotch ? shade('#B98F52', k) : shade('#C9A063', k)
        ctx.fill()
      }
    })
  }

  /* 两面圆盖 */
  const caps: Array<{ n: V3; pts: V3[]; ctr: V3; label: string; sub: string; depthBias: number }> = [
    { n: [0, 0, 1], pts: front, ctr: frontCtr, label: '趣', sub: 'FUN', depthBias: 0 },
    { n: [0, 0, -1], pts: back, ctr: vAdd(pos, qRotate(c.quat, [0, 0, -TH])), label: '工', sub: 'PICK', depthBias: 0 }
  ]
  for (const cap of caps) {
    const rn = qRotate(c.quat, cap.n)
    const viewVec = vSub(cap.ctr, [pos[0], pos[1], pos[2] - cam.d])
    if (vDot(rn, viewVec) >= 0) continue
    const k = 0.6 + 0.4 * Math.max(0, vDot(rn, LIGHT))
    const pts2d = cap.pts.map(p => proj(p, cam))
    const cc = proj(cap.ctr, cam)
    /* 面内刻字用的局部基 */
    const axU = vScale(qRotate(c.quat, [1, 0, 0]), R)
    const axV = vScale(qRotate(c.quat, [0, 1, 0]), R)
    const pu = proj(vAdd(cap.ctr, axU), cam)
    const pv = proj(vAdd(cap.ctr, axV), cam)
    const ux: [number, number] = [pu[0] - cc[0], pu[1] - cc[1]]
    const uy: [number, number] = [pv[0] - cc[0], pv[1] - cc[1]]
    list.push({
      depth: vDot(cap.ctr, [0, 0, 1]),
      draw: () => {
        ctx.beginPath()
        ctx.moveTo(pts2d[0][0], pts2d[0][1])
        for (let i = 1; i < N; i++) ctx.lineTo(pts2d[i][0], pts2d[i][1])
        ctx.closePath()
        const grad = ctx.createLinearGradient(cc[0] - ux[0], cc[1] - ux[1], cc[0] + ux[0], cc[1] + ux[1])
        grad.addColorStop(0, shade('#F6E3C2', k))
        grad.addColorStop(1, shade('#E9CF9E', k))
        ctx.fillStyle = grad
        ctx.fill()
        ctx.strokeStyle = shade('#B98F52', k)
        ctx.lineWidth = Math.max(1, unit * 2.5)
        ctx.stroke()
        /* 内环 + 上下缘纹 */
        ctx.beginPath()
        for (let i = 0; i <= N; i++) {
          const t = i / N
          const ang = t * Math.PI * 2
          const rr = 0.82
          const x = cc[0] + (ux[0] * Math.cos(ang) + uy[0] * Math.sin(ang)) * rr
          const y = cc[1] + (ux[1] * Math.cos(ang) + uy[1] * Math.sin(ang)) * rr
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = shade('#C9A063', k * 0.95)
        ctx.lineWidth = Math.max(1, unit * 3)
        ctx.stroke()
        /* 中心大字 + 小字 */
        const at = (fx: number, fy: number): [number, number] => [cc[0] + ux[0] * fx + uy[0] * fy, cc[1] + ux[1] * fx + uy[1] * fy]
        const big = at(0, 0)
        ctx.save()
        ctx.fillStyle = shade('#8A6A33', k)
        ctx.font = `bold ${Math.round(R * 0.78)}px "Kaiti SC", "STKaiti", KaiTi, serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cap.label, big[0], big[1] + R * 0.02)
        ctx.font = `bold ${Math.round(R * 0.16)}px sans-serif`
        ctx.fillStyle = shade('#B98F52', k)
        const top = at(0, 0.58)
        const bot = at(0, -0.58)
        ctx.fillText(cap.sub, top[0], top[1])
        ctx.fillText('趣工局', bot[0], bot[1])
        ctx.restore()
      }
    })
  }

  flush(ctx, list)

  /* 结果光圈 */
  if (c.phase === 'done') {
    const pulse = 0.5 + 0.5 * Math.sin(time * 3.2)
    const [gx, gy] = proj(pos, cam)
    ctx.save()
    ctx.globalAlpha = 0.25 + 0.2 * pulse
    ctx.strokeStyle = '#C9A063'
    ctx.lineWidth = unit * 4
    ctx.beginPath()
    ctx.arc(gx, gy, R * 1.12 + unit * 6 * pulse, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

/* ============================================================
 * 摇签：签筒 + 一束签 + 跳出的一支
 * ============================================================ */

export interface TubeAnim {
  t: number
  phase: 'idle' | 'shake' | 'rise' | 'reveal'
  stickNo: number
  shakeAmp: number
}

const SHAKE_T = 1.5
const RISE_T = 0.7

export function makeTube(): TubeAnim {
  return { t: 0, phase: 'idle', stickNo: 1, shakeAmp: 0 }
}

export function shakeTube(tu: TubeAnim, stickNo: number) {
  tu.stickNo = stickNo
  tu.phase = 'shake'
  tu.t = 0
}

export function advanceTube(tu: TubeAnim, dt: number) {
  tu.t += dt
  if (tu.phase === 'shake') {
    tu.shakeAmp = Math.min(1, tu.t * 6) * (tu.t < SHAKE_T - 0.25 ? 1 : Math.max(0, (SHAKE_T - tu.t) / 0.25))
    if (tu.t >= SHAKE_T) {
      tu.phase = 'rise'
      tu.t = 0
    }
  } else if (tu.phase === 'rise' && tu.t >= RISE_T) {
    tu.phase = 'reveal'
    tu.t = 0
  } else if (tu.phase === 'reveal') {
    tu.shakeAmp = 0
  }
}

export const tubeDone = (tu: TubeAnim) => tu.phase === 'reveal'

export function drawTube(ctx: any, w: number, h: number, tu: TubeAnim, time: number) {
  ctx.clearRect(0, 0, w, h)
  const cam: Cam = { cx: w / 2, cy: h / 2 - h * 0.08, f: w * 0.92, d: 7.5 }
  const unit = w / 750
  const R = 175 * unit
  const TUBE_H = 300 * unit

  const shakeAng = tu.phase === 'shake' ? Math.sin(time * 26) * 0.14 * tu.shakeAmp : 0
  const jig = tu.phase === 'shake' ? tu.shakeAmp : 0
  const baseQ = qMul(qAxis([0, 0, 1], shakeAng), qMul(qAxis([0, 1, 0], -0.16), qAxis([1, 0, 0], 0.1)))
  const tubeBase: V3 = [0, -TUBE_H * 0.42, 0]

  /* 签束：沿筒口椭圆散布的细签 */
  const STICKS = 7
  const list: Drawable[] = []
  const N = 34
  const rimPts: V3[] = []
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    rimPts.push([Math.cos(a) * R, 0, Math.sin(a) * R])
  }

  const rotP = (p: V3): V3 => vAdd(tubeBase, qRotate(baseQ, p))

  /* 签（先画，位于筒身后半的会被筒身覆盖） */
  for (let i = 0; i < STICKS; i++) {
    const seedA = i * 2.399
    const rr = R * (0.18 + 0.62 * ((i * 37) % 11) / 11)
    const ang = seedA + (jig > 0 ? Math.sin(time * (17 + i * 2.3) + i) * 0.09 * jig : 0)
    const baseLocal: V3 = [Math.cos(ang) * rr, TUBE_H * 0.5, Math.sin(ang) * rr]
    const lean = 0.1 + 0.1 * ((i * 53) % 7) / 7
    const len = TUBE_H * (0.72 + 0.1 * ((i * 29) % 5) / 5)
    const tipLocal: V3 = [
      baseLocal[0] * (1 + lean),
      baseLocal[1] + len,
      baseLocal[2] * (1 + lean)
    ]
    const b3 = rotP(baseLocal)
    const t3 = rotP(tipLocal)
    const pb = proj(b3, cam)
    const pt = proj(t3, cam)
    const depth = (b3[2] + t3[2]) / 2
    const wd = unit * (16 - 3 * Math.max(-1, Math.min(1, depth / 160)))
    const redH = (pt[1] - pb[1]) * 0.18
    list.push({
      depth: depth + (i % 2) * 2 - 40,
      draw: () => {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#E8D2AC'
        ctx.lineWidth = wd
        ctx.beginPath()
        ctx.moveTo(pb[0], pb[1])
        ctx.lineTo(pt[0], pt[1])
        ctx.stroke()
        /* 签头红漆 */
        ctx.strokeStyle = '#C4523A'
        ctx.lineWidth = wd
        ctx.beginPath()
        ctx.moveTo(pt[0], pt[1] + redH)
        ctx.lineTo(pt[0], pt[1])
        ctx.stroke()
        ctx.restore()
      }
    })
  }

  /* 筒身（圆柱侧带 + 底缘 + 口沿椭圆） */
  const botPts: V3[] = rimPts.map(p => rotP([p[0], 0, p[2]]))
  const topPts: V3[] = rimPts.map(p => rotP([p[0], TUBE_H, p[2]]))
  for (let i = 0; i < N; i++) {
    const a0 = ((i + 0.5) / N) * Math.PI * 2
    const nrm = qRotate(baseQ, [Math.cos(a0), 0, Math.sin(a0)])
    const ctr = vScale(vAdd(botPts[i], topPts[i]), 0.5)
    const viewVec = vSub(ctr, [0, 0, -cam.d])
    if (vDot(nrm, viewVec) >= 0) continue
    const k = 0.52 + 0.48 * Math.max(0, vDot(nrm, LIGHT))
    const isStripe = i % 6 < 3
    const p1 = proj(botPts[i], cam)
    const p2 = proj(botPts[(i + 1) % N], cam)
    const p3 = proj(topPts[(i + 1) % N], cam)
    const p4 = proj(topPts[i], cam)
    list.push({
      depth: vDot(ctr, [0, 0, 1]),
      draw: () => {
        ctx.beginPath()
        ctx.moveTo(p1[0], p1[1])
        ctx.lineTo(p2[0], p2[1])
        ctx.lineTo(p3[0], p3[1])
        ctx.lineTo(p4[0], p4[1])
        ctx.closePath()
        ctx.fillStyle = isStripe ? shade('#B85C42', k) : shade('#A64E37', k)
        ctx.fill()
      }
    })
  }

  /* 筒口：椭圆环（内暗外亮）+ 黄铜箍 */
  const rimTop = rimPts.map(p => rotP([p[0], TUBE_H, p[2]]))
  const rim2d = rimTop.map(p => proj(p, cam))
  list.push({
    depth: vDot(rotP([0, TUBE_H, 0]), [0, 0, 1]) + 60,
    draw: () => {
      ctx.beginPath()
      ctx.moveTo(rim2d[0][0], rim2d[0][1])
      for (let i = 1; i < N; i++) ctx.lineTo(rim2d[i][0], rim2d[i][1])
      ctx.closePath()
      ctx.fillStyle = '#5E2F22'
      ctx.fill()
      ctx.strokeStyle = '#C9A063'
      ctx.lineWidth = unit * 8
      ctx.stroke()
      /* 筒底黄铜箍 */
      const bot2d = botPts.map(p => proj(p, cam))
      ctx.beginPath()
      ctx.moveTo(bot2d[0][0], bot2d[0][1])
      for (let i = 1; i < N; i++) ctx.lineTo(bot2d[i][0], bot2d[i][1])
      ctx.closePath()
      ctx.strokeStyle = '#C9A063'
      ctx.lineWidth = unit * 10
      ctx.stroke()
      /* 筒身「趣工局」竖排标 */
      const mid = proj(rotP([R * 0.99, TUBE_H * 0.55, 0]), cam)
      ctx.save()
      ctx.fillStyle = 'rgba(255,246,236,0.92)'
      ctx.font = `bold ${Math.round(unit * 34)}px "Kaiti SC", "STKaiti", KaiTi, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const chars = '趣工局签'
      chars.split('').forEach((ch, idx) => {
        ctx.fillText(ch, mid[0], mid[1] + idx * unit * 40)
      })
      ctx.restore()
    }
  })

  /* 地面阴影 */
  const shc = proj(rotP([0, 0, 0]), cam)
  ctx.save()
  ctx.globalAlpha = 0.14
  ctx.fillStyle = '#4A3B32'
  ctx.beginPath()
  ctx.ellipse(shc[0], shc[1] + R * 0.28, R * 1.15, R * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  /* 跳出的签 */
  if (tu.phase === 'rise' || tu.phase === 'reveal') {
    const u = tu.phase === 'rise' ? Math.min(1, tu.t / RISE_T) : 1
    const ease = u * u * (3 - 2 * u)
    const bob = tu.phase === 'reveal' ? Math.sin(time * 2.2) * unit * 6 : 0
    const startX = 0
    const startY = TUBE_H * 0.55
    const endY = TUBE_H * 1.72
    const p3b: V3 = [startX * (1 - ease), startY + (endY - startY) * ease, 0]
    const b = proj(rotP(p3b), cam)
    const tip = proj(rotP([p3b[0], p3b[1] + TUBE_H * 0.98, p3b[2]]), cam)
    const wd = unit * 26
    ctx.save()
    ctx.lineCap = 'round'
    ctx.globalAlpha = tu.phase === 'rise' ? 0.6 + 0.4 * ease : 1
    ctx.strokeStyle = '#F0DDBA'
    ctx.lineWidth = wd
    ctx.beginPath()
    ctx.moveTo(b[0], b[1] + bob)
    ctx.lineTo(tip[0], tip[1] + bob)
    ctx.stroke()
    ctx.strokeStyle = '#C4523A'
    ctx.lineWidth = wd
    ctx.beginPath()
    ctx.moveTo(tip[0], tip[1] + (b[1] - tip[1]) * 0.16 + bob)
    ctx.lineTo(tip[0], tip[1] + bob)
    ctx.stroke()
    /* 签号 */
    ctx.fillStyle = '#4A3B32'
    ctx.font = `bold ${Math.round(unit * 30)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`第${tu.stickNo}签`, (b[0] + tip[0]) / 2, (b[1] + tip[1]) / 2 + bob)
    ctx.restore()
    /* 高亮光 */
    if (tu.phase === 'reveal') {
      const pulse = 0.5 + 0.5 * Math.sin(time * 3)
      ctx.save()
      ctx.globalAlpha = 0.22 + 0.16 * pulse
      ctx.strokeStyle = '#C9A063'
      ctx.lineWidth = unit * 4
      ctx.beginPath()
      ctx.arc((b[0] + tip[0]) / 2, (b[1] + tip[1]) / 2, TUBE_H * 0.62, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }

  flush(ctx, list)
}
