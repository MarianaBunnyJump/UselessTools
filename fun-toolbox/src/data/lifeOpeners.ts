/* ===================== 人生倒计时开场冲击文案（可配置） =====================
 * 每次进入页面按「当日 + 间隔」轮换 3 行，制造「心头一紧」的开场。
 * 基调：清醒但不贩卖焦虑，温柔但不回避事实。增删行即可，页面自适应行数（最多取 3 行）。
 */

export const LIFE_OPENERS: string[] = [
  '时间不会停下来等你',
  '此刻，是你余生中最年轻的一天',
  '你已经悄悄度过了人生的相当一部分',
  '往后的日子，正在一天天变少',
  '很多「改天」，其实没有那天',
  '人生没有彩排，每一天都是正片',
  '别把一年过成一个月的 12 次复制',
  '你打算把剩下的日子用来做什么？',
  '倒计时不是为了让你焦虑，是为了让你记得',
  '想见的人，想做的事，别都留给「以后」'
]

/* 按当天日期确定性取 3 行（当天内固定、跨天轮换；间隔取质数避免成组重复） */
export function pickOpeners(count = 3, dayOfYear: number): string[] {
  const picked: string[] = []
  let idx = dayOfYear % LIFE_OPENERS.length
  while (picked.length < Math.min(count, LIFE_OPENERS.length)) {
    const line = LIFE_OPENERS[idx]
    if (!picked.includes(line)) picked.push(line)
    idx = (idx + 7) % LIFE_OPENERS.length
  }
  return picked
}
