/* ===================== 白噪音音轨（可配置）
 * id 与 utils/audio.ts 中的合成参数对应
 */

export interface MixerTrack {
  id: string
  icon: string
  name: string
  desc: string
}

export const MIXER_TRACKS: MixerTrack[] = [
  { id: 'rain', icon: '🌧️', name: '雨声', desc: '淅淅沥沥' },
  { id: 'fire', icon: '🔥', name: '篝火', desc: '噼啪温暖' },
  { id: 'keyboard', icon: '⌨️', name: '键盘', desc: '敲击节奏' },
  { id: 'cat', icon: '🐱', name: '猫呼噜', desc: '毛茸茸的' },
  { id: 'waves', icon: '🌊', name: '海浪', desc: '潮起潮落' },
  { id: 'cafe', icon: '☕', name: '咖啡馆', desc: '背景人声' },
  { id: 'leaves', icon: '🍃', name: '树叶', desc: '沙沙作响' },
  { id: 'insects', icon: '🌙', name: '虫鸣', desc: '夏夜' }
]

/* ===================== 内置混音预设（可配置） ===================== */

export interface MixerPreset {
  id: string
  name: string
  volumes: number[]
}

export const MIXER_PRESETS: MixerPreset[] = [
  { id: 'coder', name: '程序员专注', volumes: [50, 0, 70, 0, 0, 30, 0, 0] },
  { id: 'sleep', name: '哄睡模式', volumes: [40, 30, 0, 50, 0, 0, 0, 20] },
  { id: 'cafe', name: '咖啡馆模式', volumes: [0, 0, 0, 0, 0, 60, 20, 0] }
]
