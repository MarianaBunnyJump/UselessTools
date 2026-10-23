/* ===================== 拼豆色板与取色算法 =====================
 * 48 色近似 mard/漫Vis 通用拼豆色系（常见套装主色），LAB 色差最近色匹配。
 */

export interface BeadColor {
  code: string
  name: string
  hex: string
}

export const BEAD_COLORS: BeadColor[] = [
  { code: 'H01', name: '奶白', hex: '#FFF6E9' }, { code: 'W01', name: '纯白', hex: '#FFFFFF' },
  { code: 'K01', name: '炭黑', hex: '#2B2B2B' }, { code: 'K02', name: '深灰', hex: '#555555' },
  { code: 'K03', name: '浅灰', hex: '#9E9E9E' }, { code: 'R01', name: '大红', hex: '#E53935' },
  { code: 'R02', name: '酒红', hex: '#8E2430' }, { code: 'R03', name: '浅粉红', hex: '#F48FB1' },
  { code: 'R04', name: '珊瑚', hex: '#FF7043' }, { code: 'R05', name: '橘红', hex: '#F4511E' },
  { code: 'O01', name: '亮橙', hex: '#FB8C00' }, { code: 'O02', name: '浅橙', hex: '#FFB74D' },
  { code: 'Y01', name: '柠檬黄', hex: '#FDD835' }, { code: 'Y02', name: '蛋黄', hex: '#F9A825' },
  { code: 'Y03', name: '奶黄', hex: '#FFF59D' }, { code: 'Y04', name: '芥末', hex: '#C0CA33' },
  { code: 'G01', name: '草绿', hex: '#43A047' }, { code: 'G02', name: '深绿', hex: '#1B5E20' },
  { code: 'G03', name: '浅绿', hex: '#A5D6A7' }, { code: 'G04', name: '豆绿', hex: '#7CB342' },
  { code: 'G05', name: '墨绿', hex: '#004D40' }, { code: 'G06', name: '薄荷', hex: '#80CBC4' },
  { code: 'B01', name: '天蓝', hex: '#1E88E5' }, { code: 'B02', name: '深蓝', hex: '#0D47A1' },
  { code: 'B03', name: '浅蓝', hex: '#90CAF9' }, { code: 'B04', name: '湖蓝', hex: '#00ACC1' },
  { code: 'B05', name: '藏蓝', hex: '#1A237E' }, { code: 'P01', name: '紫罗兰', hex: '#8E24AA' },
  { code: 'P02', name: '浅紫', hex: '#CE93D8' }, { code: 'P03', name: '深紫', hex: '#4A148C' },
  { code: 'P04', name: '丁香', hex: '#D1C4E9' }, { code: 'M01', name: '玫红', hex: '#EC407A' },
  { code: 'M02', name: '深玫', hex: '#AD1457' }, { code: 'M03', name: '樱花', hex: '#F8BBD0' },
  { code: 'N01', name: '肉色', hex: '#FFCCBC' }, { code: 'N02', name: '浅棕', hex: '#A1887F' },
  { code: 'N03', name: '深棕', hex: '#5D4037' }, { code: 'N04', name: '咖啡', hex: '#6D4C41' },
  { code: 'N05', name: '驼色', hex: '#D7CCC8' }, { code: 'C01', name: '金色', hex: '#FFD54F' },
  { code: 'C02', name: '银灰', hex: '#CFD8DC' }, { code: 'C03', name: '铜色', hex: '#BF8F63' },
  { code: 'C04', name: '橄榄', hex: '#827717' }, { code: 'C05', name: '青柠', hex: '#C6FF00' },
  { code: 'C06', name: '湖水', hex: '#26C6DA' }, { code: 'C07', name: '雾蓝', hex: '#B3E5FC' },
  { code: 'C08', name: '雾粉', hex: '#FCE4EC' }, { code: 'C09', name: '夜灰', hex: '#37474F' }
]

/* sRGB → LAB（D65） */
function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '')
  return [parseInt(v.slice(0, 2), 16) / 255, parseInt(v.slice(2, 4), 16) / 255, parseInt(v.slice(4, 6), 16) / 255]
}

function srgbToLab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(v => (v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92))
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
  const [fx, fy, fz] = [f(x), f(y), f(z)]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

const LAB_CACHE = BEAD_COLORS.map(c => ({ ...c, lab: srgbToLab(c.hex) }))

/* 最近色匹配（CIE76 色差，够用且快） */
export function nearestBead(hex: string): BeadColor {
  const [l1, a1, b1] = srgbToLab(hex)
  let best = LAB_CACHE[0]
  let bestD = Infinity
  for (const c of LAB_CACHE) {
    const d = (l1 - c.lab[0]) ** 2 + (a1 - c.lab[1]) ** 2 + (b1 - c.lab[2]) ** 2
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best
}

/* 内置像素模板（16×16，字符映射色板 code；. = 空） */
export interface PerlerTemplate {
  id: string
  name: string
  rows: string[]
}

const LEGEND: Record<string, string> = {
  '.': '', W: 'W01', K: 'K01', R: 'R01', P: 'R03', Y: 'Y01', O: 'O02',
  G: 'G04', D: 'G02', B: 'B01', L: 'B03', N: 'N04', C: 'C01', M: 'M01'
}

export const TEMPLATES: PerlerTemplate[] = [
  {
    id: 'gift',
    name: '礼盒',
    rows: [
      '................', '......RRRR......', '.....RRRRRR.....', '......RRRR......',
      '....YYYYYYYY....', '...YYYYCYYYCYY..', '.RRRRRRRRRRRRRR.', '.RRRRRRRRRRRRRR.',
      '.RRRRRRRRRRRRRR.', '.RRRRRRRRRRRRRR.', '..RRRRRRRRRRRR..', '...RRRRRRRRRR...',
      '....RRRRRRRR....', '.....RRRRRR.....', '......RRRR......', '................'
    ]
  },
  {
    id: 'muyu',
    name: '木鱼',
    rows: [
      '................', '.....KKKKKK.....', '....KKKKKKKK....', '...KKNNNNNNKK...',
      '..KNNNNNNNNNNK..', '..KNNNNNNNNNNK..', '..KNNKKKKNNNNK..', '..KNKKKKKKNNNK..',
      '..KKKKKKKKKKKK..', '...KKKKKKKKKK...', '....KKK..KKK....', '...NNN....NNN...',
      '..NNN......NNN..', '................', '................', '................'
    ]
  },
  {
    id: 'star',
    name: '星星',
    rows: [
      '................', '.......CC.......', '.......CC.......', '......CCCC......',
      'CCCCCCCCCCCCCCCC', '.CCCCCCCCCCCCCC.', '..CCCCCCCCCCCC..', '...CCCCCCCCCC...',
      '....CCCCCCCC....', '....CCCCCCCC....', '...CCCC..CCCC...', '...CCC....CCC...',
      '..CC........CC..', '..C..........C..', '................', '................'
    ]
  },
  {
    id: 'heart',
    name: '爱心',
    rows: [
      '................', '..RRR....RRR....', '.RRRRR..RRRRR...', 'RRRRRRRRRRRRRR..',
      'RRRRRRRRRRRRRR..', 'RRRRRRRRRRRRRR..', '.RRRRRRRRRRRR...', '..RRRRRRRRRR....',
      '...RRRRRRRR.....', '....RRRRRR......', '.....RRRR.......', '......RR........',
      '................', '................', '................', '................'
    ]
  }
]

export function templateGrid(t: PerlerTemplate): (string | null)[] {
  const cells: (string | null)[] = []
  t.rows.forEach(row => {
    for (const ch of row) cells.push(LEGEND[ch] || null)
  })
  return cells
}
