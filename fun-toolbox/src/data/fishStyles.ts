/* ===================== 电子木鱼样式（可配置）
 * id 与 utils/audio.ts 中的音效合成分支对应
 */

export interface FishStyle {
  id: string
  name: string
  icon: string
  desc: string
}

export const FISH_STYLES: FishStyle[] = [
  { id: 'fish', name: '木鱼', icon: '🪵', desc: '清脆一击' },
  { id: 'bowl', name: '铜磬', icon: '🔔', desc: '余音袅袅' },
  { id: 'bell', name: '寺钟', icon: '🕰️', desc: '悠远绵长' },
  { id: 'drop', name: '水滴', icon: '💧', desc: '空灵通透' },
  { id: 'silent', name: '无声', icon: '🔇', desc: '静心默念' }
]
