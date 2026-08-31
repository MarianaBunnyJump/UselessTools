/* ===================== 功德成就定义（可配置）
 * threshold 支持 total（累计功德）/ daily（单日功德）/ streak（连续使用天数）
 */

export interface Achievement {
  id: string
  name: string
  icon: string
  desc: string
  threshold: { total?: number; daily?: number; streak?: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'beginner', name: '初心', icon: '🌱', desc: '累计功德达到 1', threshold: { total: 1 } },
  { id: 'diligent', name: '勤修', icon: '📿', desc: '累计功德达到 100', threshold: { total: 100 } },
  { id: 'hundred', name: '百日', icon: '🏮', desc: '累计功德达到 1,000', threshold: { total: 1000 } },
  { id: 'myriad', name: '万劫', icon: '🛕', desc: '累计功德达到 10,000', threshold: { total: 10000 } },
  { id: 'devoted', name: '心诚', icon: '🧧', desc: '累计功德达到 100,000', threshold: { total: 100000 } },
  { id: 'streak7', name: '连续', icon: '📅', desc: '连续 7 天使用', threshold: { streak: 7 } },
  { id: 'streak30', name: '全勤', icon: '🎯', desc: '连续 30 天使用', threshold: { streak: 30 } },
  { id: 'daily100', name: '日修', icon: '⚡', desc: '单日功德达到 100', threshold: { daily: 100 } },
  { id: 'daily1000', name: '千叶', icon: '🌸', desc: '单日功德达到 1,000', threshold: { daily: 1000 } }
]
