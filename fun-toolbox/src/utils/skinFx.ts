/* ===================== 皮肤粒子（雪花 / 星闪 / 彩屑） =====================
 * dt 步进保证跨设备速度一致。
 * 调度用 setTimeout 限帧而不是 60fps rAF：雪花 30fps / 星闪与彩屑 12fps 足够顺滑，
 * 否则常驻循环会一直占着 JS 线程（曾把后台页面的设置页卡到动不了）。
 * 静态场景（树/月亮/彩虹）随每帧重绘，避免被 clearRect 抹掉。
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
  color?: string
}

interface Star {
  x: number
  y: number
  r: number
  phase: number
  speed: number
}

/* 各类型的目标帧间隔 ms */
const STEP_MS: Record<'snow' | 'twinkle' | 'confetti', number> = { snow: 33, twinkle: 80, confetti: 80 }

/* 彩屑颜色（马卡龙） */
const CONFETTI_COLORS = ['#FF8A80', '#FFB74D', '#FFF176', '#A5D6A7', '#81D4FA', '#B39DDB', '#F48FB1']

export function startSkinFx(
  canvas: any,
  ctx: any,
  w: number,
  h: number,
  type: 'snow' | 'twinkle' | 'confetti',
  drawStatic?: () => void
): SkinFxHandle {
  let alive = true
  let timer: any = null
  const stepMs = STEP_MS[type]

  const flakes: Flake[] = Array.from({ length: type === 'confetti' ? 20 : 16 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1.6 + Math.random() * 2.8,
    vy: 0.35 + Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
    color: type === 'confetti' ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] : undefined
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
    const now = Date.now()
    const k = Math.min(50, now - last) / 16.67
    last = now
    ctx.clearRect(0, 0, w, h)
    if (drawStatic) drawStatic()

    if (type === 'twinkle') {
      stars.forEach(s => {
        s.phase += s.speed * 0.03 * k
        ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(s.phase))
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
    } else {
      /* 雪花（白）与彩屑（彩色，带旋转的方块） */
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
        if (type === 'confetti' && f.color) {
          ctx.globalAlpha = 0.85
          ctx.fillStyle = f.color
          ctx.save()
          ctx.translate(f.x, f.y)
          ctx.rotate(f.phase)
          ctx.fillRect(-f.r, -f.r * 0.7, f.r * 2, f.r * 1.4)
          ctx.restore()
        } else {
          ctx.globalAlpha = 0.78
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }
    ctx.globalAlpha = 1
    if (alive) timer = setTimeout(render, stepMs)
  }

  timer = setTimeout(render, stepMs)

  return {
    stop: () => {
      alive = false
      if (timer) clearTimeout(timer)
    }
  }
}

