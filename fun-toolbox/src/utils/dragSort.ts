/* ===================== 拖动排序纯函数 =====================
 * 全部真实 px 运算；槽位设计 px（750 基准）由调用方换算后传入
 */

export interface GridSlot {
  x: number      /* 卡片左上角 x（真实 px） */
  y: number      /* 卡片左上角 y（真实 px） */
  scale: number
  rotate: number
  z: number
}

/* 两列网格槽位（默认皮肤）：列间距由容器宽与卡片实测宽反推（与 flex space-between 行为一致） */
export function computeGridSlots(
  count: number,
  containerW: number,
  cardW: number,
  cardH: number,
  gapY: number
): GridSlot[] {
  const slots: GridSlot[] = []
  const colGap = containerW - cardW * 2
  for (let i = 0; i < count; i++) {
    const col = i % 2
    const row = Math.floor(i / 2)
    slots.push({
      x: col === 0 ? 0 : cardW + colGap,
      y: row * (cardH + gapY),
      scale: 1,
      rotate: 0,
      z: row      /* 下一行压上一行，与 DOM 顺序一致 */
    })
  }
  return slots
}

/* 拖动卡中心进入某槽位矩形（内缩 inset 去抖）→ 让位到该槽
 * 返回目标索引；未命中返回 -1 */
export function hitSlot(
  dragCenter: { x: number; y: number },
  slots: GridSlot[],
  cardW: number,
  cardH: number,
  currentIndex: number,
  inset = 6
): number {
  for (let i = 0; i < slots.length; i++) {
    if (i === currentIndex) continue
    const s = slots[i]
    if (
      dragCenter.x > s.x + inset &&
      dragCenter.x < s.x + cardW - inset &&
      dragCenter.y > s.y + inset &&
      dragCenter.y < s.y + cardH - inset
    ) {
      return i
    }
  }
  return -1
}

/* 把 from 位置的元素移动到 to 位置（数组级别重排） */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list
  }
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/* ---- 速度估计：取最近 N 个样本的平均水平速度（px/ms）---- */
export class VxTracker {
  private samples: { t: number; x: number }[] = []
  private maxSamples: number

  constructor(maxSamples = 3) {
    this.maxSamples = maxSamples
  }

  push(t: number, x: number) {
    this.samples.push({ t, x })
    if (this.samples.length > this.maxSamples) this.samples.shift()
  }

  get(): number {
    if (this.samples.length < 2) return 0
    const first = this.samples[0]
    const last = this.samples[this.samples.length - 1]
    const dt = last.t - first.t
    if (dt <= 0) return 0
    return (last.x - first.x) / dt
  }

  reset() {
    this.samples = []
  }
}

/* 惯性倾斜：水平速度 → 目标角（deg），再做逐帧平滑 */
export function tiltTowards(currentDeg: number, vx: number, cfg: { tiltGain: number; tiltMaxDeg: number; tiltSmooth: number }): number {
  const target = Math.max(-cfg.tiltMaxDeg, Math.min(cfg.tiltMaxDeg, vx * cfg.tiltGain))
  return currentDeg + (target - currentDeg) * cfg.tiltSmooth
}
