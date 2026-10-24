/* ===================== scroll-view padding 兼容性修复 codemod v2 =====================
 * v1 插入闭合标签时定位差 12 字符，本版先精确撤销 v1 的插入，再按
 * 平衡匹配正确重做。幂等：已正确包裹且无损伤的文件自动跳过。
 */
import fs from 'node:fs'
import path from 'node:path'

const PAGES = [
  ['calc/index', 'calcix'],
  ['calc/run', 'calcrun'],
  ['create/marquee', 'mq'],
  ['create/perler', 'prl'],
  ['create/photo-toolbox', 'ptb'],
  ['create/text-replace', 'trp'],
  ['create/text-to-image', 'tti'],
  ['fun/device', 'dev'],
  ['fun/fake-call', 'fc'],
  ['study/classics', 'cl'],
  ['study/classics-reader', 'cr'],
  ['study/copybook', 'cpb'],
  ['study/stroke-card', 'stc'],
  ['text/pinyin-annotate', 'pya'],
  ['text/zh-convert', 'zhc']
]

const SRC = path.resolve(import.meta.dirname, '../src/pages')

/* 外层 </ScrollView> 的起始下标（平衡匹配，忽略自闭合） */
function balancedClose(text, from) {
  let i = from
  let depth = 1
  for (;;) {
    const no = text.indexOf('<ScrollView', i)
    const nc = text.indexOf('</ScrollView>', i)
    if (nc < 0) throw new Error('闭合标签缺失')
    if (no >= 0 && no < nc) {
      depth++
      i = no + '<ScrollView'.length
    } else {
      depth--
      if (depth === 0) return nc
      i = nc + '</ScrollView>'.length
    }
  }
}

function transform(file, p) {
  const fp = path.join(SRC, file, 'index.tsx')
  let cur = fs.readFileSync(fp, 'utf8')
  const open = `<ScrollView scrollY className='${p}-scroll'>`
  const padOpen = `\n        <View className='${p}-scroll-pad'>`
  const CLOSE = `</View>\n      `
  const openIdx = cur.indexOf(open)
  if (openIdx < 0) throw new Error(`${file}: 找不到 ${open}`)
  const after = openIdx + open.length

  /* 撤销 v1：padOpen 在 after 处，CLOSE 被插到了真正闭合前 12 字符的位置 */
  if (cur.startsWith(padOpen, after)) {
    const closeCur = balancedClose(cur, after + padOpen.length)
    const closeIns = closeCur - CLOSE.length - 12
    if (cur.startsWith(CLOSE, closeIns)) {
      cur = cur.slice(0, closeIns) + cur.slice(closeIns + CLOSE.length)
      cur = cur.slice(0, after) + cur.slice(after + padOpen.length)
      console.log(`${file}: 已撤销 v1 损伤`)
    } else {
      throw new Error(`${file}: v1 损伤模式不符，人工处理`)
    }
  }

  /* 正确包裹 */
  const close = balancedClose(cur, after)
  const inner = cur.slice(after, close)
  if (inner.includes(`${p}-scroll-pad`)) return `${file}: 已正确包裹，跳过`
  cur = cur.slice(0, after) + padOpen + inner + CLOSE + cur.slice(close)
  fs.writeFileSync(fp, cur, 'utf8')
  return `${file}: 已包裹`
}

for (const [file, p] of PAGES) console.log(transform(file, p))
