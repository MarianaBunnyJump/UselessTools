/* ===================== 工具列表（可配置） =====================
 * 首页礼物盒的名称、描述、配色；category 为简洁模式默认分类。
 * 新增工具：此处加一项 + app.config.ts 注册页面路径。
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
  /* 简洁模式默认分类（用户可在编辑模式改归属） */
  category?: string
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
    ribbonColor: '#FF7043',
    category: 'fun'
  },
  {
    id: 'life',
    name: '人生倒计时',
    icon: '⏳',
    desc: '看看还剩多少个周日',
    path: '/pages/life/index',
    boxColor: '#DCCEF0',
    boxColorDeep: '#C5B0E3',
    ribbonColor: '#9575CD',
    category: 'fun'
  },
  {
    id: 'mixer',
    name: '白噪音混音台',
    icon: '🎵',
    desc: '自己调一杯安静',
    path: '/pages/mixer/index',
    boxColor: '#C5EBCF',
    boxColorDeep: '#A8D9BB',
    ribbonColor: '#4CAF7D',
    category: 'fun'
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
    category: 'fun',
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
    ribbonColor: '#EC6F9C',
    category: 'fun'
  },
  {
    id: 'wheel',
    name: '转盘选择器',
    icon: '🎡',
    desc: '让转盘替你做决定',
    path: '/pages/wheel/index',
    boxColor: '#FFE0CB',
    boxColorDeep: '#FFCFAF',
    ribbonColor: '#FF8A65',
    category: 'fun'
  },
  {
    id: 'bubble',
    name: '无限气泡纸',
    icon: '🫧',
    desc: '把一整张捏个遍',
    path: '/pages/bubble/index',
    boxColor: '#C9EEFC',
    boxColorDeep: '#A5DEFA',
    ribbonColor: '#29B6F6',
    category: 'fun'
  },
  {
    id: 'praise',
    name: '彩虹屁夸夸机',
    icon: '🌈',
    desc: '把人夸得明明白白',
    path: '/pages/praise/index',
    boxColor: '#FFF3C4',
    boxColorDeep: '#FFE58A',
    ribbonColor: '#FFA000',
    category: 'fun'
  },
  /* ---------- 学习 · 校园（study 分包） ---------- */
  {
    id: 'classics',
    name: '文言文陪读',
    icon: '📖',
    desc: '逐句拼音 跟读背诵',
    path: '/pages/study/classics/index',
    boxColor: '#FFF3C4',
    boxColorDeep: '#FFE58A',
    ribbonColor: '#C9A063',
    category: 'study'
  },
  {
    id: 'stroke',
    name: '汉字练字卡',
    icon: '✍️',
    desc: '查字 · 田字格描红',
    path: '/pages/study/stroke-card/index',
    boxColor: '#FFE8D6',
    boxColorDeep: '#FFD6B8',
    ribbonColor: '#E07856',
    category: 'study'
  },
  {
    id: 'copybook',
    name: '字帖生成器',
    icon: '✒️',
    desc: '姓名课文 一键成帖',
    path: '/pages/study/copybook/index',
    boxColor: '#DCCEF0',
    boxColorDeep: '#C5B0E3',
    ribbonColor: '#7E57C2',
    category: 'study'
  },
  {
    id: 'pinyin',
    name: '拼音注音器',
    icon: '🔤',
    desc: '任意文本 逐字注音',
    path: '/pages/study/pinyin-annotate/index',
    boxColor: '#C9EEFC',
    boxColorDeep: '#A5DEFA',
    ribbonColor: '#29B6F6',
    category: 'study'
  },
  {
    id: 'zhconvert',
    name: '简繁互转',
    icon: '字',
    desc: '词汇级转换 更地道',
    path: '/pages/study/zh-convert/index',
    boxColor: '#C5EBCF',
    boxColorDeep: '#A8D9BB',
    ribbonColor: '#4CAF7D',
    category: 'study'
  },
  /* ---------- 创作 · 图片（create 分包） ---------- */
  {
    id: 'perler',
    name: '拼豆图纸生成',
    icon: '🧩',
    desc: '图片转图纸 带清单',
    path: '/pages/create/perler/index',
    boxColor: '#FFE0CB',
    boxColorDeep: '#FFCFAF',
    ribbonColor: '#FF8A65',
    category: 'create'
  },
  {
    id: 'marquee',
    name: '手持弹幕',
    icon: '📱',
    desc: '全屏大字 接机应援',
    path: '/pages/create/marquee/index',
    boxColor: '#37474F',
    boxColorDeep: '#263238',
    ribbonColor: '#39FF88',
    category: 'create'
  },
  {
    id: 'textimage',
    name: '文字转图片',
    icon: '🖼️',
    desc: '便签 长图 九宫格',
    path: '/pages/create/text-to-image/index',
    boxColor: '#FFF3C4',
    boxColorDeep: '#FFE58A',
    ribbonColor: '#FFA000',
    category: 'create'
  },
  {
    id: 'photo',
    name: '图片小工具箱',
    icon: '📷',
    desc: '裁剪调色 隐私清理',
    path: '/pages/create/photo-toolbox/index',
    boxColor: '#C9EEFC',
    boxColorDeep: '#A5DEFA',
    ribbonColor: '#5B7A9D',
    category: 'create'
  },
  {
    id: 'textreplace',
    name: '文本批量替换',
    icon: '🔁',
    desc: '多组规则 一键处理',
    path: '/pages/create/text-replace/index',
    boxColor: '#DCCEF0',
    boxColorDeep: '#C5B0E3',
    ribbonColor: '#9575CD',
    category: 'create'
  },
  /* ---------- 生活计算（calc 分包） ---------- */
  {
    id: 'calc',
    name: '生活计算器',
    icon: '🧮',
    desc: '房贷个税 单位健康',
    path: '/pages/calc/index/index',
    boxColor: '#D7E8D4',
    boxColorDeep: '#C3DCC0',
    ribbonColor: '#5B7A9D',
    category: 'calc'
  },
  /* ---------- 趣味（fun 分包） ---------- */
  {
    id: 'fakecall',
    name: '假装来电',
    icon: '☎️',
    desc: '体面撤退 模拟演练',
    path: '/pages/fun/fake-call/index',
    boxColor: '#FFD6E0',
    boxColorDeep: '#FFBECF',
    ribbonColor: '#EC6F9C',
    category: 'fun'
  }
]
