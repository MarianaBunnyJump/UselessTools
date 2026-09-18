/* ===================== 功德成就定义（可配置）
 * threshold 类型（五种，互不重叠，避免「一天同时达成两组」）：
 *   total  累计功德（长线：万级起步，一天刷不满）
 *   daily  单日功德（当日可达：100 / 1,000 / 5,000）
 *   days   累计使用天数（不要求连续，来过就算：3/5/7/14/21/30）
 *   night  单日深夜功德（23:00~05:00 之间敲）
 *   combo  单次连击（一次不停手连敲）
 */

export interface Achievement {
  id: string
  name: string
  icon: string
  desc: string
  threshold: { total?: number; daily?: number; days?: number; night?: number; combo?: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  /* ---- 累计功德（长线） ---- */
  { id: 'beginner', name: '初心', icon: '🌱', desc: '累计功德达到 1', threshold: { total: 1 } },
  { id: 'myriad', name: '万劫', icon: '🛕', desc: '累计功德达到 10,000', threshold: { total: 10000 } },
  { id: 'devoted', name: '心诚', icon: '🧧', desc: '累计功德达到 100,000', threshold: { total: 100000 } },
  { id: 'complete', name: '圆满', icon: '🪷', desc: '累计功德达到 1,000,000', threshold: { total: 1000000 } },

  /* ---- 单日功德（当日挑战） ---- */
  { id: 'daily100', name: '日修', icon: '⚡', desc: '单日功德达到 100', threshold: { daily: 100 } },
  { id: 'daily1000', name: '千叶', icon: '🌸', desc: '单日功德达到 1,000', threshold: { daily: 1000 } },
  { id: 'daily5000', name: '一日千里', icon: '🚀', desc: '单日功德达到 5,000', threshold: { daily: 5000 } },

  /* ---- 累计使用天数（来了就+1，不要求连续） ---- */
  { id: 'days3', name: '三顾', icon: '🚪', desc: '累计使用 3 天', threshold: { days: 3 } },
  { id: 'days5', name: '常客', icon: '🍵', desc: '累计使用 5 天', threshold: { days: 5 } },
  { id: 'days7', name: '七日之约', icon: '📅', desc: '累计使用 7 天', threshold: { days: 7 } },
  { id: 'days14', name: '半月之交', icon: '🌙', desc: '累计使用 14 天', threshold: { days: 14 } },
  { id: 'days21', name: '习惯成自然', icon: '🌿', desc: '累计使用 21 天', threshold: { days: 21 } },
  { id: 'days30', name: '月度之约', icon: '🏆', desc: '累计使用 30 天', threshold: { days: 30 } },

  /* ---- 深夜与连击（趣味向） ---- */
  { id: 'night50', name: '子夜木鱼', icon: '🌌', desc: '深夜（23点后）单日功德达到 50', threshold: { night: 50 } },
  { id: 'combo108', name: '百八连击', icon: '🧘', desc: '单次连击达到 108', threshold: { combo: 108 } }
]
