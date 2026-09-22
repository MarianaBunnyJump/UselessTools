/* ===================== 工具列表（可配置） =====================
 * 首页礼物盒的名称、描述、配色
 */

export interface ToolMeta {
  id: string
  name: string
  icon: string
  desc: string
  path: string
  boxColor: string
  boxColorDeep: string
  ribbonColor: string
  /* 自定义弹出形象（默认渲染 icon emoji） */
  iconType?: 'muyu'
}

export const TOOLS: ToolMeta[] = [
  {
    id: 'crusher',
    name: '情绪粉碎机',
    icon: '🗑️',
    desc: '把烦心事撕个粉碎',
    path: '/pages/crusher/index',
    boxColor: '#FFD3C8',
    boxColorDeep: '#FFB5A7',
    ribbonColor: '#FF7043'
  },
  {
    id: 'life',
    name: '人生倒计时',
    icon: '⏳',
    desc: '看看还剩多少个周日',
    path: '/pages/life/index',
    boxColor: '#DCCEF0',
    boxColorDeep: '#C5B0E3',
    ribbonColor: '#9575CD'
  },
  {
    id: 'mixer',
    name: '白噪音混音台',
    icon: '🎵',
    desc: '自己调一杯安静',
    path: '/pages/mixer/index',
    boxColor: '#C5EBCF',
    boxColorDeep: '#A8D9BB',
    ribbonColor: '#4CAF7D'
  },
  {
    id: 'merit',
    name: '电子木鱼',
    icon: '🪵',
    desc: '功德+1',
    path: '/pages/merit/index',
    boxColor: '#FFE5C4',
    boxColorDeep: '#FFD6A0',
    ribbonColor: '#FF9800',
    iconType: 'muyu'
  },
  {
    id: 'excuse',
    name: '借口生成器',
    icon: '💬',
    desc: '帮你说出那个不字',
    path: '/pages/excuse/index',
    boxColor: '#FFD6E0',
    boxColorDeep: '#FFBECF',
    ribbonColor: '#EC6F9C'
  },
  {
    id: 'wheel',
    name: '转盘选择器',
    icon: '🎡',
    desc: '让转盘替你做决定',
    path: '/pages/wheel/index',
    boxColor: '#FFE0CB',
    boxColorDeep: '#FFCFAF',
    ribbonColor: '#FF8A65'
  },
  {
    id: 'bubble',
    name: '无限气泡纸',
    icon: '🫧',
    desc: '把一整张捏个遍',
    path: '/pages/bubble/index',
    boxColor: '#C9EEFC',
    boxColorDeep: '#A5DEFA',
    ribbonColor: '#29B6F6'
  }
]
