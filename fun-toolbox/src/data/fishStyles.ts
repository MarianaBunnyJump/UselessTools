/* ===================== 电子木鱼样式（可配置）
 * id 与 utils/audio.ts 中的音效合成分支对应
 * locked: 需达成成就解锁（unlockBy 对应 achievements.ts 的成就 id）
 * coming: 暗色占位，后续版本开放
 */

export interface FishStyle {
  id: string
  name: string
  icon: string
  desc: string
  locked?: boolean
  lockHint?: string
  unlockBy?: string
  coming?: boolean
}

export const FISH_STYLES: FishStyle[] = [
  { id: 'muyu', name: '木鱼', icon: '🪵', desc: '经典原味' },
  { id: 'bowl', name: '铜磬', icon: '🔔', desc: '余音袅袅' },
  { id: 'bell', name: '寺钟', icon: '🕰️', desc: '悠远绵长' },
  { id: 'drop', name: '水滴', icon: '💧', desc: '空灵通透' },
  { id: 'silent', name: '无声', icon: '🔇', desc: '静心默念' },
  {
    id: 'wind',
    name: '风铃',
    icon: '🎐',
    desc: '清脆摇曳',
    locked: true,
    lockHint: '累计功德 100',
    unlockBy: 'diligent'
  },
  {
    id: 'thunder',
    name: '雷鼓',
    icon: '🥁',
    desc: '气势磅礴',
    locked: true,
    lockHint: '累计功德 1,000',
    unlockBy: 'hundred'
  },
  {
    id: 'night',
    name: '夜钟',
    icon: '🌙',
    desc: '月下悠悠',
    locked: true,
    lockHint: '连续使用 7 天',
    unlockBy: 'streak7'
  },
  { id: 'qin', name: '古琴', icon: '🎹', desc: '敬请期待', coming: true },
  { id: 'chant', name: '诵经', icon: '📿', desc: '敬请期待', coming: true },
  { id: 'zen', name: '禅音', icon: '🕯️', desc: '敬请期待', coming: true }
]
