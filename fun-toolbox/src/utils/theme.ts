import Taro from '@tarojs/taro'
import { get, set } from './storage'

/* ===================== 全局背景主题 ===================== */

export interface BackgroundPreset {
  id: string
  name: string
  bg: string
  accent: string
  accentDeep: string
  /* 转盘扇形配色（全局配色，转盘不再单独设置） */
  wheelColors: string[]
}

export const BACKGROUNDS: BackgroundPreset[] = [
  {
    id: 'cream',
    name: '奶油陶土',
    bg: 'linear-gradient(172deg, #FFFDF9 0%, #FFF6EC 42%, #F7E8D4 100%)',
    accent: '#E4674A',
    accentDeep: '#C4523A',
    wheelColors: ['#F9D9CC', '#F9E6D9', '#F5CDBB', '#F8DFD0', '#F7D6C6', '#FAE8DE']
  },
  {
    id: 'sakura',
    name: '樱花粉',
    bg: 'linear-gradient(172deg, #FFFBFD 0%, #FFF0F4 42%, #FFDEE8 100%)',
    accent: '#F48FB1',
    accentDeep: '#EC6F9C',
    wheelColors: ['#FFD6E0', '#FFC2D1', '#FFB3C6', '#FFDCE3', '#FFC8D4', '#FFE3E9']
  },
  {
    id: 'matcha',
    name: '抹茶绿',
    bg: 'linear-gradient(172deg, #FBFFFA 0%, #F0F9F1 42%, #DDF0E3 100%)',
    accent: '#66BB8A',
    accentDeep: '#4CAF7D',
    wheelColors: ['#C8E6C9', '#A5D6A7', '#B9E4C0', '#D5EFDA', '#CDEBCF', '#B2DFDB']
  },
  {
    id: 'sky',
    name: '天空蓝',
    bg: 'linear-gradient(172deg, #FBFDFF 0%, #EFF7FD 42%, #DCF0FA 100%)',
    accent: '#64B5F6',
    accentDeep: '#4A9FE5',
    wheelColors: ['#B3E5FC', '#B4E0F5', '#A8D8F0', '#C5E9FA', '#BBDEFB', '#CFEBFB']
  },
  {
    id: 'lavender',
    name: '薰衣草',
    bg: 'linear-gradient(172deg, #FCFBFF 0%, #F5F0FB 42%, #E8DFF6 100%)',
    accent: '#A98BD4',
    accentDeep: '#9575CD',
    wheelColors: ['#E1BEE7', '#D1B3E8', '#DCCEF0', '#E8D4F3', '#D5C0EA', '#EDDFF5']
  }
]

const THEME_KEY = 'theme_bg'

export function getTheme(): BackgroundPreset {
  const id = get<string>(THEME_KEY, 'cream')
  return BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0]
}

export function setTheme(id: string): BackgroundPreset {
  const bg = BACKGROUNDS.find(b => b.id === id)
  if (bg) {
    set(THEME_KEY, id)
    Taro.eventCenter.trigger('theme-changed', bg)
  }
  return getTheme()
}
