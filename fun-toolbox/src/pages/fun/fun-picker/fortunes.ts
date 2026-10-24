/* ===================== 摇签签文 =====================
 * 今日运势：按日期种子取签（当天固定，隔天换签）。
 * 自定义签：用户编辑的签文列表，随机抽取。
 */

export interface Fortune {
  no: number
  grade: '上上' | '上' | '中' | '中下' | '下'
  title: string
  poem: [string, string]
  read: string
}

export const FORTUNES: Fortune[] = [
  { no: 1, grade: '上上', title: '枯木逢春', poem: ['十年蛰伏无人问', '一朝风来满树花'], read: '等的事有转机了，本周适合主动开口，贵人在老朋友里。' },
  { no: 2, grade: '上上', title: '锦鲤跃门', poem: ['静水之下藏大鱼', '起竿只在瞬息间'], read: '机会来得突然，别犹豫，先答应再想怎么办。' },
  { no: 3, grade: '上', title: '小满即安', poem: ['麦穗初齐未全熟', '恰是人间好时节'], read: '不必事事圆满，现在这个"差不多"刚刚好，别再加了。' },
  { no: 4, grade: '上', title: '顺风行舟', poem: ['帆借东风不用桨', '轻舟已过两重山'], read: '手头的事会比预想顺利，省下的力气留着休息。' },
  { no: 5, grade: '上', title: '灯下故人', poem: ['久别重逢一盏茶', '旧事说完皆是笑'], read: '适合联系那个很久没说话的人，会有好消息。' },
  { no: 6, grade: '上', title: '种瓜得瓜', poem: ['春种一粒粟', '秋收万颗子'], read: '之前垫的底开始返利了，坚持到月底见分晓。' },
  { no: 7, grade: '中', title: '雾里看花', poem: ['雾重花影两朦胧', '走近原来是海棠'], read: '担心的事八成是脑补，先看清再下结论。' },
  { no: 8, grade: '中', title: '守株待兔', poem: ['兔子未来先补笼', '闲时正好打个盹'], read: '不是让你躺平，是让你把准备做完，等风来。' },
  { no: 9, grade: '中', title: '细水长流', poem: ['涓涓不塞将为江', '水到渠成不必急'], read: '进展慢但没停，日拱一卒，月底回头看会吓一跳。' },
  { no: 10, grade: '中', title: '多云转晴', poem: ['上午阴来下午晴', '出门何妨带把伞'], read: '先难后易的一天，上午别硬刚，下午再谈事。' },
  { no: 11, grade: '中', title: '塞翁失马', poem: ['失了芝麻捡绿豆', '账要拉长慢慢算'], read: '眼前的小亏里藏着让路，别急着骂街。' },
  { no: 12, grade: '中', title: '饭要一口口吃', poem: ['一锅好粥慢慢熬', '火候到了自然香'], read: '别想一步到位，拆成三步走，今天走第一步。' },
  { no: 13, grade: '中下', title: '过桥摸石', poem: ['水深不过膝', '摸着石头过'], read: '能过，但别抄近道，按最笨的办法来最稳。' },
  { no: 14, grade: '中下', title: '旧伞遮雨', poem: ['伞骨虽旧挡小雨', '大雨莫出行'], read: '老办法能应付小事，大事今天别决策，睡一觉再说。' },
  { no: 15, grade: '下', title: '退一步海阔', poem: ['眼前此路窄如缝', '退后三步是坦途'], read: '今天不占理也别争，先撤，明天局面对你更有利。' },
  { no: 16, grade: '下', title: '蛰伏守静', poem: ['龙潜深渊勿用事', '静待惊蛰第一雷'], read: '今天宜低调宜睡觉，不宜表白、不宜辞职、不宜下单。' }
]

export const GRADE_COLOR: Record<Fortune['grade'], string> = {
  '上上': '#C4523A',
  '上': '#D97B4A',
  '中': '#C9A063',
  '中下': '#5B7A9D',
  '下': '#8D7B70'
}

/* 日期种子 → 当日签（当天固定）：权重 上上1/上3/中5/中下3/下2 */
const WEIGHT: Record<Fortune['grade'], number> = { '上上': 1, '上': 3, '中': 5, '中下': 3, '下': 2 }

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

export function fortuneOfDay(date: Date): Fortune {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const pool: Fortune[] = []
  FORTUNES.forEach(f => {
    for (let i = 0; i < WEIGHT[f.grade]; i++) pool.push(f)
  })
  return pool[Math.floor(hashSeed(key) * pool.length)] || FORTUNES[0]
}

export function randomFortune(): Fortune {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
}
