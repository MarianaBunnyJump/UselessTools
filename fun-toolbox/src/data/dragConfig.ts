/* ===================== 首页拖动手感参数 =====================
 * 方案：《首页升级方案设计》§4.3 / §4.4 定稿值
 * 调手感只改本文件，无需动页面逻辑
 */

export const DRAG_CONFIG = {
  /* ---- 长按激活（右上角 ⠿ 热区）---- */
  pressActivateMs: 350,      /* 满此时长激活拖动 */
  pressCancelDist: 10,       /* 激活前手指移动超此距离（px）即取消计时 */
  grabScale: 1.06,           /* 激活瞬间卡片放大 */
  grabVibrate: true,         /* 激活瞬间轻震动（weapp） */

  /* ---- 惯性倾斜 ---- */
  tiltGain: 8,               /* 速度 → 角度增益：目标角 = clamp(vx × tiltGain, ±tiltMaxDeg) */
  tiltMaxDeg: 12,            /* 最大倾斜角 */
  tiltSmooth: 0.22,          /* 逐帧平滑系数（0~1，越小越迟滞） */
  speedSamples: 3,           /* 取最近 N 次 touchmove 平均速度 */

  /* ---- 空中晃动（内层 sway 元素 CSS 动画）---- */
  swayDeg: 2.5,              /* 摆动幅度 */
  swayPeriodMs: 1600,        /* 摆动周期 */

  /* ---- 让位动画 ---- */
  yieldDurationMs: 240,
  yieldEasing: 'cubic-bezier(0.25, 0.8, 0.35, 1)',

  /* ---- 松手落位 ---- */
  settleDurationMs: 260,
  settleEasing: 'cubic-bezier(0.22, 0.9, 0.3, 1)',
  settleRotateMs: 420,       /* 惯性回转：过冲回弹 */
  settleRotateEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  /* ---- 槽位判定 ---- */
  slotInsetPx: 6,            /* 槽位矩形内缩（防边缘抖动） */
  clampOvershootPx: 8,       /* 拖动边界允许的越界量 */

  /* ---- 提示气泡 ---- */
  hintBubbleText: '长按卡片角上的 ⠿，拖到喜欢的位置',
  hintBubbleArrow: '知道了'
} as const

export type DragConfig = typeof DRAG_CONFIG
