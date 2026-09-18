/* ===================== 皮肤粒子（雪花 / 星闪） =====================
 * 与彩带同一套时基：dt 步进保证跨设备速度一致，H5 无节点 rAF 时退化为定时器。
 * 静态场景（树/月亮）随每帧重绘，避免被 clearRect 抹掉。
 */

export interface SkinFxHandle {
  stop: () => void
}

interface Flake {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  phase: number
}

interface Star {
  x: number
  y: number
  r: number
  phase: number
  speed: number
}

export function startSkinFx(
  canvas: any,
  ctx: any,
  w: number,
  h: number,
  type: 'snow' | 'twinkle',
  drawStatic?: () => void
): SkinFxHandle {
  let alive = true

  const raf = (fn: () => void) => {
    if (typeof canvas.requestAnimationFrame === 'function') {
      canvas.requestAnimationFrame(fn)
    } else {
      setTimeout(fn, 16)
    }
  }

  const flakes: Flake[] = Array.from({ length: 16 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1.6 + Math.random() * 2.8,
    vy: 0.35 + Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2
  }))

  /* 星子位置固定：黄金角散布，确定性不跳变 */
  const stars: Star[] = Array.from({ length: 42 }, (_, i) => {
    const golden = i * 2.39996
    return {
      x: w * (0.5 + 0.48 * Math.cos(golden) * ((i % 7 + 3) / 10)),
      y: h * ((0.08 + 0.84 * ((i * 0.618) % 1))),
      r: 0.9 + ((i * 37) % 17) / 10,
      phase: (i * 1.3) % (Math.PI * 2),
      speed: 0.5 + ((i * 13) % 10) / 10
    }
  })

  let last = Date.now()

  const render = () => {
    if (!alive) return
    const k = Math.min(50, Date.now() - last) / 16.67
    last = Date.now()
    ctx.clearRect(0, 0, w, h)
    if (drawStatic) drawStatic()

    if (type === 'snow') {
      flakes.forEach(f => {
        f.phase += 0.02 * k
        f.x += (f.vx + Math.sin(f.phase) * 0.35) * k
        f.y += f.vy * k
        if (f.y > h + 6) {
          f.y = -6
          f.x = Math.random() * w
        }
        if (f.x < -6) f.x = w + 6
        else if (f.x > w + 6) f.x = -6
        ctx.globalAlpha = 0.78
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
      })
    } else {
      stars.forEach(s => {
        s.phase += s.speed * 0.03 * k
        ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(s.phase))
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    ctx.globalAlpha = 1
    raf(render)
  }
  raf(render)

  return {
    stop: () => {
      alive = false
    }
  }
}
