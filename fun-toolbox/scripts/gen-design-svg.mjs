/* ===================== V4.1 全套页面设计稿 SVG 生成器 =====================
 * 产出：Docs/原型参考/V4.1-全套页面设计稿SVG/*.svg
 * 特点：统一设计令牌（陶土工牌系）；所有 <g> 带语义 id，
 * Figma 导入后图层名可读，方便用户自行微调。
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT_DIR = path.resolve(import.meta.dirname, '../../Docs/原型参考/V4.1-全套页面设计稿SVG')
fs.mkdirSync(OUT_DIR, { recursive: true })

/* ---------- 设计令牌 ---------- */
const T = {
  paper: '#FFF9F2',
  paperBand: '#F7E8D4',
  ink: '#4A3B32',
  sub: '#8D7B70',
  light: '#B8A99E',
  terra: '#E4674A',
  terraDeep: '#C4523A',
  terraEdge: '#BE4E33',
  brass: '#C9A063',
  blue: '#5B7A9D',
  card: '#FFFFFF',
  cardBorder: 'rgba(74,59,50,0.08)',
  green: '#7FAF7A',
  pink: '#F2A6B0',
  lavender: '#B39DDB',
  cream: '#FFF6EC'
}
const W = 375
const H = 812
const FONT = `font-family="'PingFang SC','Yuanti SC','Microsoft YaHei',sans-serif"`

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ---------- 基础组件 ---------- */
function svgOpen(title) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>${esc(title)}</title>`
}
const svgClose = () => '</svg>'

function g(id, inner, extra = '') {
  return `  <g id="${id}"${extra ? ' ' + extra : ''}>\n${inner}\n  </g>`
}
function rect(x, y, w, h, fill, r = 0, extra = '') {
  return `    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${extra ? ' ' + extra : ''}/>`
}
function text(x, y, s, { size = 14, fill = T.ink, weight = 400, anchor = 'start', spacing = 0 } = {}) {
  return `    <text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''} ${FONT}>${esc(s)}</text>`
}
function circle(cx, cy, r, fill, extra = '') {
  return `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra ? ' ' + extra : ''}/>`
}
function ellipse(cx, cy, rx, ry, fill, extra = '') {
  return `    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${extra ? ' ' + extra : ''}/>`
}
function line(x1, y1, x2, y2, stroke, sw = 1, extra = '') {
  return `    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${extra ? ' ' + extra : ''}/>`
}

/* 页面底：纸底渐变 + 顶部状态栏 + 胶囊 */
function pageBase(title, { band = true } = {}) {
  const parts = []
  parts.push(`    <defs>
    <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFDF9"/><stop offset="0.5" stop-color="#FFF6EC"/><stop offset="1" stop-color="${T.paperBand}"/>
    </linearGradient>
  </defs>`)
  parts.push(rect(0, 0, W, H, 'url(#paperGrad)'))
  if (band) {
    parts.push(`    <rect x="0" y="${H - 96}" width="${W}" height="96" fill="${T.cream}" opacity="0.6"/>`)
  }
  /* 状态栏 */
  parts.push(g('statusbar',
    text(28, 34, '9:41', { size: 15, weight: 600 }) +
    line(150, 22, 158, 30, T.ink, 2.5) + line(158, 30, 170, 18, T.ink, 2.5) +
    rect(300, 24, 22, 11, 'none', 5.5, 'stroke="' + T.ink + '" stroke-width="1.4"') +
    rect(302, 26, 15, 7, T.ink, 2) +
    rect(326, 27.5, 2.5, 7, T.ink, 1) + circle(322, 31, 5.5, 'none', 'stroke="' + T.ink + '" stroke-width="1.6" fill-opacity="0"') +
    rect(319.5, 24.5, 5, 5, 'none', 0, 'fill="none"')
  ))
  /* 微信胶囊 */
  parts.push(g('capsule',
    rect(278, 48, 87, 32, 'rgba(0,0,0,0.06)', 16) +
    circle(305, 64, 2.2, T.sub) + circle(305, 64, 5.5, 'none', 'stroke="' + T.sub + '" stroke-width="1.4" fill="none"') +
    line(330, 59, 344, 59, T.sub, 2.4) + line(330, 65, 344, 65, T.sub, 2.4)
  ))
  return parts.join('\n')
}

/* 自定义导航：返回箭头 + 标题 */
function navBar(title) {
  return g('navbar',
    circle(30, 64, 17, 'rgba(255,255,255,0.9)') +
    `    <path d="M 35 56 L 25 64 L 35 72" fill="none" stroke="${T.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` +
    text(187, 70, title, { size: 17, weight: 700, anchor: 'middle' })
  )
}

/* 北欧装饰带（简洁模式分区用） */
function decoBand(x, y, w, hue) {
  const rows = 5
  let s = ''
  for (let i = 0; i < rows; i++) {
    s += `    <path d="M ${x} ${y + i * 7} q ${w / 4} ${i % 2 ? -5 : 5} ${w / 2} 0 t ${w / 2} 0" fill="none" stroke="${hue}" stroke-width="2.2" opacity="${0.85 - i * 0.13}" stroke-linecap="round"/>`
  }
  return g('deco-band', s)
}

/* 卡片 */
function card(x, y, w, h, { r = 16, fill = T.card, id = 'card', shadow = true } = {}) {
  return g(id,
    (shadow ? `    <rect x="${x}" y="${y + 3}" width="${w}" height="${h}" rx="${r}" fill="rgba(74,59,50,0.10)" blur="8" opacity="0.35"/>\n` : '') +
    rect(x, y, w, h, fill, r, `stroke="${T.cardBorder}" stroke-width="1"`)
  )
}

/* 主 CTA（陶土工牌按钮） */
function cta(x, y, w, label, { h = 48, id = 'cta', fill1 = '#EF8A66', fill2 = '#E06244' } = {}) {
  return g(id,
    `    <defs><linearGradient id="${id}-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fill1}"/><stop offset="1" stop-color="${fill2}"/></linearGradient></defs>` +
    rect(x, y + 5, w, h, T.terraEdge, h / 2, 'opacity="0.9"') +
    rect(x, y, w, h, `url(#${id}-grad)`, h / 2) +
    text(x + w / 2, y + h / 2 + 5.5, label, { size: 16, fill: '#FFF9F2', weight: 700, anchor: 'middle', spacing: 2 })
  )
}

/* 输入框 */
function input(x, y, w, h, placeholder, { id = 'input' } = {}) {
  return g(id,
    rect(x, y, w, h, '#FFF9F2', h / 2, `stroke="rgba(74,59,50,0.10)" stroke-width="1"`) +
    text(x + 18, y + h / 2 + 5, placeholder, { size: 14, fill: T.light })
  )
}

/* chips 一行 */
function chips(x, y, items, { gap = 10, id = 'chips', active = 0, size = 13 } = {}) {
  let cx = x
  let s = ''
  items.forEach((it, i) => {
    const w = it.length * size + 26
    s += rect(cx, y, w, 30, i === active ? T.terra : 'rgba(255,255,255,0.9)', 15, i === active ? '' : `stroke="rgba(74,59,50,0.08)"`) +
      (i === active
        ? text(cx + w / 2, y + 20, it, { size, fill: '#FFF9F2', weight: 600, anchor: 'middle' })
        : text(cx + w / 2, y + 20, it, { size, fill: T.ink, anchor: 'middle' }))
    cx += w + gap
  })
  return g(id, s)
}

/* tab 段控件 */
function seg(x, y, w, items, active = 0, { id = 'segment', h = 40 } = {}) {
  const iw = w / items.length
  let s = rect(x, y, w, h, 'rgba(74,59,50,0.05)', h / 2)
  items.forEach((it, i) => {
    if (i === active) s += rect(x + 4 + i * iw, y + 4, iw - 8, h - 8, T.terra, (h - 8) / 2)
    s += text(x + iw * (i + 0.5), y + h / 2 + 5, it, { size: 14, fill: i === active ? '#FFF9F2' : T.sub, weight: i === active ? 700 : 400, anchor: 'middle' })
  })
  return g(id, s)
}

/* 底部提示行 */
function tip(y, s) {
  return g('footnote', text(187, y, s, { size: 11, fill: T.light, anchor: 'middle' }))
}

/* ---------- 页面注册表 ---------- */
const pages = {}

pages['00-设计系统'] = () => {
  const parts = [pageBase('设计系统')]
  let y = 96
  parts.push(g('title', text(28, y + 18, '趣工局 · 设计系统 V4.1', { size: 22, weight: 800 }) + text(28, y + 42, '陶土工牌 · 北欧暖纸 · 楷体描红', { size: 12, fill: T.sub })))
  y += 70
  /* 色板 */
  const swatches = [['paper', T.paper], ['band', T.paperBand], ['ink', T.ink], ['sub', T.sub], ['terra', T.terra], ['terraDeep', T.terraDeep], ['brass', T.brass], ['blue', T.blue], ['green', T.green], ['pink', T.pink]]
  let s = ''
  swatches.forEach(([n, c], i) => {
    const x = 28 + (i % 5) * 65
    const yy = y + Math.floor(i / 5) * 62
    s += rect(x, yy, 54, 38, c, 10, `stroke="rgba(74,59,50,0.08)"`) + text(x + 2, yy + 52, n, { size: 8.5, fill: T.sub })
  })
  parts.push(g('色板', s))
  y += 140
  /* 字阶 */
  parts.push(g('字阶',
    text(28, y, '工局标题 22/800', { size: 22, weight: 800 }) +
    text(28, y + 30, '卡片标题 16/700', { size: 16, weight: 700 }) +
    text(28, y + 54, '正文 14/400 · 手感圆润的默认字号', { size: 14 }) +
    text(28, y + 74, '辅助 12 · 副标题说明', { size: 12, fill: T.sub }) +
    text(28, y + 92, '脚注 11 · 灰字提示', { size: 11, fill: T.light })
  ))
  y += 118
  /* 按钮 */
  parts.push(g('按钮', cta(28, y, 319, '主按钮 Primary', { id: 'btn-primary' })))
  parts.push(g('按钮-次级',
    rect(28, y + 64, 319, 44, 'rgba(255,252,247,0.95)', 22, `stroke="rgba(74,59,50,0.15)" stroke-width="1.5"`) +
    rect(28, y + 68, 319, 44, 'rgba(74,59,50,0.10)', 22) +
    text(187, y + 92, '次级按钮 Ghost', { size: 15, weight: 600, anchor: 'middle' })
  ))
  y += 132
  /* 卡片+chips+输入 */
  parts.push(g('示例卡片', card(28, y, 319, 96, { id: 'card-demo' }) +
    text(46, y + 32, '玻璃卡片 28px 圆角 · 1px 墨褐描边', { size: 14, weight: 600 }) +
    text(46, y + 56, '软阴影向下 3px，像放在桌上的纸片', { size: 12, fill: T.sub })))
  parts.push(g('chips', chips(28, y + 116, ['选中的', '未选', '标签三'])))
  parts.push(g('输入框', input(28, y + 160, 319, 44, '输入框 · 圆 22px · 奶油底')))
  parts.push(tip(H - 40, 'Design by Mariana · 趣工局设计系统'))
  return svgOpen('设计系统') + parts.join('\n') + svgClose()
}

pages['01-首页-礼盒模式'] = () => {
  const parts = [pageBase('首页 · 礼盒模式')]
  parts.push(navBar('趣工局'))
  /* 工分等级条 */
  parts.push(g('工分等级条',
    rect(24, 100, 260, 34, 'rgba(255,255,255,0.9)', 17) +
    circle(44, 117, 11, T.brass) +
    text(62, 122, 'Lv.3 快乐工友', { size: 13, weight: 700 }) +
    rect(160, 112, 100, 8, 'rgba(74,59,50,0.08)', 4) +
    rect(160, 112, 64, 8, T.terra, 4) +
    circle(304, 117, 17, 'rgba(74,59,50,0.05)', '', '') +
    text(304, 123, '☰', { size: 15, anchor: 'middle', fill: T.sub })
  ))
  /* 礼盒卡片网格 2×3 */
  const tools = [['粉碎机', '👿', T.terra], ['人生倒计时', '⏳', T.lavender], ['功德小本', '🔔', T.brass], ['借口生成器', '🎭', T.pink], ['幸运大转盘', '🎯', '#E8A87C'], ['混音台', '🎚️', T.blue]]
  let s = ''
  tools.forEach(([name, icon, hue], i) => {
    const x = 24 + (i % 2) * 170
    const y = 156 + Math.floor(i / 2) * 148
    s += g(`工具卡-${name}`,
      rect(x, y + 3, 156, 132, 'rgba(74,59,50,0.08)', 20, 'opacity="0.4"') +
      rect(x, y, 156, 132, T.card, 20, `stroke="${T.cardBorder}"`) +
      rect(x + 14, y + 14, 52, 52, hue, 14, 'opacity="0.16"') +
      text(x + 40, y + 50, icon, { size: 24, anchor: 'middle' }) +
      text(x + 76, y + 40, name, { size: 14.5, weight: 700 }) +
      text(x + 76, y + 58, '打开 ' + (12 + i * 7) + ' 次', { size: 10.5, fill: T.light })
    )
  })
  parts.push(g('工具卡网格', s))
  parts.push(g('署名', text(187, H - 30, 'design by Mariana', { size: 11, fill: T.light, anchor: 'middle', spacing: 1 })))
  return svgOpen('首页礼盒模式') + parts.join('\n') + svgClose()
}

pages['02-首页-简洁模式'] = () => {
  const parts = [pageBase('首页 · 简洁模式')]
  parts.push(navBar('趣工局'))
  const gs = [
    ['学海拾贝', T.brass, [['文言文陪读', '已读 6 篇'], ['汉字练字卡', '今日「永」'], ['字帖生成器', '']]],
    ['文字工坊', T.terra, [['拼音注音', ''], ['简繁互转', ''], ['手持弹幕', ''], ['文字转图片', '']]],
    ['生活计算', T.blue, [['生活计算器合集', '11 个']]],
    ['奇趣角落', T.pink, [['假装来电', ''], ['设备信息', '']]]
  ]
  let y = 100
  gs.forEach(([name, hue, items]) => {
    parts.push(decoBand(28, y + 8, 90, hue))
    parts.push(text(132, y + 16, name, { size: 16, weight: 800 }))
    y += 34
    items.forEach(([n, sub]) => {
      parts.push(g(`行-${n}`,
        rect(24, y, 327, 52, T.card, 14, `stroke="${T.cardBorder}"`) +
        rect(24, y + 3, 327, 52, 'rgba(74,59,50,0.06)', 14, 'opacity="0.3"') +
        circle(52, y + 26, 15, hue, '', 'opacity="0.15"') +
        text(52, y + 31, '·', { size: 20, anchor: 'middle', fill: hue, weight: 800 }) +
        text(78, y + 31, n, { size: 14.5, weight: 600 }) +
        (sub ? text(330, y + 31, sub, { size: 11, fill: T.light, anchor: 'end' }) : '') +
        text(342, y + 31, '›', { size: 16, fill: T.light, anchor: 'end' })
      ))
      y += 62
    })
    y += 14
  })
  return svgOpen('首页简洁模式') + parts.join('\n') + svgClose()
}

pages['03-设置'] = () => {
  const parts = [pageBase('设置')]
  parts.push(navBar('设置'))
  const rows = [
    ['🎨', '工局皮肤', '奶油陶土'],
    ['🌗', '背景主题', '奶油陶土'],
    ['📳', '落地动效', '已开启'],
    ['🔊', '音效', '已开启'],
    ['🗂', '编辑首页卡片', ''],
    ['📋', '使用说明', ''],
    ['ℹ️', '关于趣工局', '']
  ]
  let y = 104
  parts.push(g('设置组-外观', card(24, y, 327, rows.length * 56 + 8, { id: 'settings-card' })))
  rows.forEach(([icon, name, val], i) => {
    parts.push(g(`设置行-${name}`,
      text(48, y + 38 + i * 56, icon, { size: 16 }) +
      text(76, y + 37 + i * 56, name, { size: 14.5 }) +
      (val ? text(330, y + 37 + i * 56, val, { size: 12.5, fill: T.light, anchor: 'end' }) : '') +
      text(344, y + 37 + i * 56, '›', { size: 15, fill: T.light, anchor: 'end' }) +
      (i < rows.length - 1 ? line(48, y + 52 + i * 56, 330, y + 52 + i * 56, 'rgba(74,59,50,0.06)') : '')
    ))
  })
  parts.push(tip(H - 60, 'V4.1 · 本机数据不联网 · design by Mariana'))
  return svgOpen('设置') + parts.join('\n') + svgClose()
}

pages['04-工分等级'] = () => {
  const parts = [pageBase('工分等级')]
  parts.push(navBar('工分等级'))
  parts.push(g('等级卡',
    rect(24, 104, 327, 170, T.card, 22, `stroke="${T.cardBorder}"`) +
    circle(96, 170, 34, T.brass, '', 'opacity="0.18"') +
    text(96, 180, 'Lv.3', { size: 26, weight: 800, anchor: 'middle', fill: T.brass }) +
    text(146, 158, '快乐工友', { size: 20, weight: 800 }) +
    text(146, 182, '620 / 800 工分', { size: 12.5, fill: T.sub }) +
    rect(146, 196, 180, 10, 'rgba(74,59,50,0.08)', 5) +
    rect(146, 196, 139, 10, T.brass, 5)
  ))
  const lv = [['Lv.1', '初来乍到', true], ['Lv.2', '熟门略路', true], ['Lv.3', '快乐工友 · 前', true], ['Lv.4', '趣味达人', false], ['Lv.5', '好玩行家', false]]
  let y = 300
  lv.forEach(([l, n, got], i) => {
    parts.push(g(`等级-${l}`,
      rect(24, y + i * 62, 327, 52, got ? T.card : 'rgba(255,255,255,0.55)', 14, `stroke="${T.cardBorder}"`) +
      circle(50, y + 26 + i * 62, 13, got ? T.brass : 'rgba(74,59,50,0.08)', '', got ? '' : 'opacity="1"') +
      text(50, y + 31 + i * 62, got ? '✓' : '', { size: 12, anchor: 'middle', fill: '#fff' }) +
      text(74, y + 31 + i * 62, l + ' · ' + n, { size: 14, weight: got ? 700 : 400, fill: got ? T.ink : T.light })
    ))
  })
  return svgOpen('工分等级') + parts.join('\n') + svgClose()
}

/* ---------- 旧工具页 ---------- */
pages['10-情绪粉碎机'] = () => {
  const parts = [pageBase('情绪粉碎机')]
  parts.push(navBar('情绪粉碎机'))
  parts.push(g('输入卡', card(24, 104, 327, 132, {}) +
    text(44, 136, '今天什么情绪压着你？', { size: 15, weight: 700 }) +
    text(44, 168, '写下来，扔进粉碎机…', { size: 14, fill: T.light })))
  parts.push(g('碎纸机',
    rect(87, 268, 200, 240, 'rgba(255,255,255,0.92)', 24, `stroke="${T.cardBorder}"`) +
    rect(107, 292, 160, 60, T.terra, 12, 'opacity="0.9"') +
    text(187, 328, '投料口', { size: 15, fill: '#FFF9F2', weight: 700, anchor: 'middle' }) +
    [0, 1, 2, 3, 4, 5].map(i => line(112, 386 + i * 16, 262, 386 + i * 16, T.terra, 3, 'opacity="0.35" stroke-linecap="round"')).join('\n') +
    text(187, 496, '三档粉碎力度', { size: 11.5, fill: T.sub, anchor: 'middle' })
  ))
  parts.push(g('cta', cta(24, 556, 327, '粉碎它！')))
  parts.push(tip(650, '粉碎记录只留在本机 · 副本不联网'))
  return svgOpen('情绪粉碎机') + parts.join('\n') + svgClose()
}

pages['11-人生倒计时'] = () => {
  const parts = [pageBase('人生倒计时')]
  parts.push(navBar('人生倒计时'))
  parts.push(g('出生设置', card(24, 104, 327, 74) +
    text(44, 134, '生日', { size: 14, weight: 700 }) +
    text(330, 134, '1998-06-15 ›', { size: 13.5, fill: T.terra, anchor: 'end', weight: 600 })))
  const grid = [['≈ 10000', '个周末还剩'], ['≈ 2600', '个周五'], ['3.2 亿', '秒心跳'], ['10417', '天日出']]
  grid.forEach(([num, lab], i) => {
    const x = 24 + (i % 2) * 170
    const y = 200 + Math.floor(i / 2) * 118
    parts.push(g(`数-${lab}`, card(x, y, 156, 102) +
      text(x + 78, y + 46, num, { size: 24, weight: 800, anchor: 'middle', fill: i === 0 ? T.terra : T.ink }) +
      text(x + 78, y + 72, lab, { size: 12, fill: T.sub, anchor: 'middle' })))
  })
  parts.push(g('冲击句', text(187, 478, '「今天是你余下人生的第一天」', { size: 15, weight: 700, anchor: 'middle', fill: T.terraDeep })))
  parts.push(g('卡片墙提示', card(24, 508, 327, 84) +
    text(44, 540, '第 7 张 · 这个周五', { size: 14, weight: 700 }) +
    text(44, 566, '点击翻面看一句「人生小票」', { size: 12, fill: T.sub })))
  return svgOpen('人生倒计时') + parts.join('\n') + svgClose()
}

pages['12-功德小本'] = () => {
  const parts = [pageBase('功德小本')]
  parts.push(navBar('功德小本'))
  parts.push(g('木鱼',
    circle(187, 260, 96, T.brass, '', 'opacity="0.15"') +
    circle(187, 260, 78, '#D9B87F') +
    ellipse(187, 274, 64, 40, '#C9A063') +
    text(187, 240, '功德', { size: 22, weight: 800, anchor: 'middle', fill: '#8A6A33' })
  ))
  parts.push(g('计数', text(187, 400, '128', { size: 44, weight: 800, anchor: 'middle' }) +
    text(187, 428, '今日功德 · 连敲 12 下最爽', { size: 12.5, fill: T.sub, anchor: 'middle' })))
  parts.push(g('成就条', card(24, 470, 327, 70) +
    text(44, 500, '🔔 初次开光 · 已解锁', { size: 13.5, weight: 600 }) +
    text(44, 524, '累计 500 功德解锁「心静如水」', { size: 12, fill: T.sub })))
  parts.push(g('cta', cta(24, 576, 327, '敲一下 +1')))
  return svgOpen('功德小本') + parts.join('\n') + svgClose()
}

pages['13-借口生成器'] = () => {
  const parts = [pageBase('借口生成器')]
  parts.push(navBar('借口生成器'))
  const bub = (y, txt, mine) => g(`气泡${mine ? '-我' : ''}`,
    rect(mine ? 150 : 44, y, mine ? 181 : 220, 44, mine ? T.terra : T.card, 16, mine ? '' : `stroke="${T.cardBorder}"`) +
    text(mine ? 240 : 154, y + 27, txt, { size: 13, fill: mine ? '#FFF9F2' : T.ink, anchor: 'middle' }) +
    (mine ? '' : circle(24, y + 22, 14, T.pink, '', 'opacity="0.8"') + text(24, y + 27, '🎭', { size: 12, anchor: 'middle' })))
  parts.push(bub(110, '嗨～我是借口大师 🎭', false))
  parts.push(bub(170, '今天遇到啥难题啦？', false))
  parts.push(bub(230, '🐶 遛狗忘了', true))
  parts.push(bub(290, '哦？这种局最难推了😏', false))
  parts.push(g('选项面板',
    rect(0, 620, W, 192, T.card, 0, '') +
    line(0, 620, W, 620, T.cardBorder, 1) +
    text(32, 654, '换个口味', { size: 13, weight: 700, fill: T.sub }) +
    chips(32, 672, ['😅 可怜', '😂 搞笑', '🧊 高冷', '🤝 诚恳', '🎭 戏精'])))
  parts.push(g('cta', cta(32, 730, 311, '变一个 ✨', { h: 44 })))
  return svgOpen('借口生成器') + parts.join('\n') + svgClose()
}

pages['14-幸运大转盘'] = () => {
  const parts = [pageBase('幸运大转盘')]
  parts.push(navBar('幸运大转盘'))
  const cx = 187, cy = 300, R = 130
  const cols = ['#F9D9CC', '#F9E6D9', '#F5CDBB', '#F8DFD0', '#F7D6C6', '#FAE8DE']
  let wheel = circle(cx, cy, R + 10, T.card, `stroke="${T.cardBorder}"`)
  for (let i = 0; i < 6; i++) {
    const a0 = (i * 60 - 90) * Math.PI / 180
    const a1 = ((i + 1) * 60 - 90) * Math.PI / 180
    wheel += `    <path d="M ${cx} ${cy} L ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z" fill="${cols[i]}" stroke="#FFF9F2" stroke-width="2"/>`
    const am = (i * 60 - 60) * Math.PI / 180
    wheel += text(cx + 82 * Math.cos(am), cy + 82 * Math.sin(am) + 4, ['火锅', '烧烤', '日料', '面馆', '随便', '再来'][i], { size: 14, weight: 700, anchor: 'middle', fill: T.ink })
  }
  wheel += circle(cx, cy, 26, T.terra) + text(cx, cy + 6, 'GO', { size: 16, weight: 800, fill: '#FFF9F2', anchor: 'middle' })
  parts.push(g('转盘', wheel))
  parts.push(g('指针', `    <path d="M ${cx} ${cy - R - 26} l -10 18 l 20 0 Z" fill="${T.terraDeep}"/>`))
  parts.push(g('场景chips', chips(24, 470, ['今晚吃啥', '谁洗碗', '点将', '惩罚'], { active: 0 })))
  parts.push(g('历史', card(24, 530, 327, 92) +
    text(44, 560, '最近一次：烧烤', { size: 13.5, weight: 600 }) +
    text(44, 584, '历史记录 8 条 ›', { size: 12, fill: T.sub })))
  parts.push(g('cta', cta(24, 656, 327, '转！', { h: 52 })))
  return svgOpen('幸运大转盘') + parts.join('\n') + svgClose()
}

pages['15-解压混音台'] = () => {
  const parts = [pageBase('解压混音台')]
  parts.push(navBar('解压混音台'))
  parts.push(g('预设', chips(24, 104, ['雨夜', '篝火', '咖啡馆', '键盘'])))
  const tracks = [['🌧 雨声', 0.7], ['🔥 篝火', 0.4], ['🎹 键盘', 0.55], ['🐦 鸟鸣', 0]]
  tracks.forEach(([n, v], i) => {
    const y = 160 + i * 84
    parts.push(g(`轨道-${n}`,
      card(24, y, 327, 66) +
      text(44, y + 40, n, { size: 15, weight: 700 }) +
      (v > 0 ? circle(44 + 279 * v, y + 40, 14, T.terra) : circle(44, y + 40, 14, 'rgba(74,59,50,0.12)')) +
      line(44, y + 40, 303, y + 40, 'rgba(74,59,50,0.10)', 4, 'stroke-linecap="round"') +
      line(44, y + 40, 44 + 279 * v, y + 40, T.terra, 4, 'stroke-linecap="round" opacity="0.35"') +
      circle(44 + 279 * v, y + 40, 11, T.card, '', '') +
      circle(44 + 279 * v, y + 40, 11, 'none', `stroke="${T.terra}" stroke-width="2.5" fill="none"`)
    ))
  })
  parts.push(g('cta', cta(24, 540, 327, '▶ 播放混合')))
  parts.push(tip(620, '本地合成 · 不联网 · 戴耳机更爽'))
  return svgOpen('解压混音台') + parts.join('\n') + svgClose()
}

pages['16-夸夸生成器'] = () => {
  const parts = [pageBase('夸夸生成器')]
  parts.push(navBar('夸夸生成器'))
  parts.push(g('chips', chips(24, 104, ['夸自己', '夸朋友', '夸同事', '彩虹屁'])))
  parts.push(g('结果卡', card(24, 160, 327, 210) +
    text(44, 200, '「你随手一做的排版，', { size: 17, weight: 700 }) +
    text(44, 232, '是别人练三年的审美。」', { size: 17, weight: 700 }) +
    line(44, 262, 120, 262, T.brass, 3, 'stroke-linecap="round"') +
    text(44, 292, '第 3 句 · 肉麻指数 ★★★★', { size: 12, fill: T.sub })))
  parts.push(g('cta', cta(24, 402, 327, '再来一句')))
  parts.push(g('次级', rect(24, 470, 327, 44, 'rgba(255,252,247,0.95)', 22, `stroke="rgba(74,59,50,0.15)"`) +
    text(187, 497, '复制去夸人', { size: 14, weight: 600, anchor: 'middle' })))
  return svgOpen('夸夸生成器') + parts.join('\n') + svgClose()
}

pages['17-气泡庄园'] = () => {
  const parts = [pageBase('气泡庄园')]
  parts.push(navBar('气泡庄园'))
  const bs = [[80, 160, 26, '#F9D9CC'], [290, 210, 18, '#DDF0E3'], [150, 260, 14, '#F5CDBB'], [250, 330, 30, '#E8DFF6'], [90, 380, 16, '#DCF0FA']]
  let s = ''
  bs.forEach(([x, y, r, c], i) => { s += circle(x, y, r, c) + circle(x - r * 0.3, y - r * 0.3, r * 0.25, 'rgba(255,255,255,0.7)') })
  parts.push(g('气泡', s))
  parts.push(g('说明卡', card(24, 460, 327, 120) +
    text(44, 496, '点气泡 +1 庄园币', { size: 16, weight: 800 }) +
    text(44, 524, '攒币解锁新气泡皮肤 · 纯解压', { size: 12.5, fill: T.sub })))
  parts.push(g('计数', text(187, 640, '今日 36 泡', { size: 13, fill: T.sub, anchor: 'middle' })))
  return svgOpen('气泡庄园') + parts.join('\n') + svgClose()
}

/* ---------- 学习分包 ---------- */
pages['20-文言文陪读'] = () => {
  const parts = [pageBase('文言文陪读')]
  parts.push(navBar('文言文陪读'))
  parts.push(g('进度', text(28, 112, '已读 6 · 背熟 2', { size: 13, weight: 700 }) +
    rect(160, 102, 150, 8, 'rgba(74,59,50,0.08)', 4) + rect(160, 102, 46, 8, T.terra, 4) +
    text(322, 112, '/ 22', { size: 12, fill: T.light })))
  parts.push(g('学段tabs', chips(24, 132, ['小学', '初中', '高中'], { active: 0 })))
  parts.push(g('册row', chips(24, 178, ['三年级上', '五年级上', '七年级下'], { active: 0, size: 12 })))
  const arts = [['司马光', '宋 · 司马光', '✦'], ['守株待兔', '先秦 · 韩非子', ''], ['精卫填海', '先秦 · 山海经', '⭐⭐'], ['王戎不取道旁李', '南朝 · 世说新语', '']]
  arts.forEach(([t, m, b], i) => {
    const y = 232 + i * 82
    parts.push(g(`篇目-${t}`, card(24, y, 327, 70) +
      rect(24, y + 14, 5, 42, T.terra, 3) +
      text(44, y + 30, t, { size: 15.5, weight: 700 }) +
      text(44, y + 54, m + ' · 4 句', { size: 11.5, fill: T.sub }) +
      (b ? text(336, y + 42, b, { size: 13, anchor: 'end' }) : '')))
  })
  parts.push(tip(H - 44, '收录常见课本篇目 · 持续扩充'))
  return svgOpen('文言文陪读') + parts.join('\n') + svgClose()
}

pages['21-课文跟读'] = () => {
  const parts = [pageBase('课文跟读')]
  parts.push(navBar('守株待兔'))
  parts.push(g('模式', seg(24, 100, 327, ['朗读', '背诵'], 0)))
  parts.push(g('首句',
    text(28, 168, '宋人', { size: 20, weight: 800 }) +
    text(28, 194, 'sòng rén', { size: 11, fill: T.brass, spacing: 1 }) +
    text(96, 168, '有', { size: 20, weight: 800 }) +
    text(96, 194, 'yǒu', { size: 11, fill: T.brass }) +
    text(136, 168, '耕者', { size: 20, weight: 800 }) +
    text(136, 194, 'gēng zhě', { size: 11, fill: T.brass })))
  parts.push(g('朗读中高亮',
    rect(24, 226, 327, 62, T.terra, 14, 'opacity="0.10"') +
    text(40, 252, '田中有株', { size: 19, weight: 800, fill: T.terraDeep }) +
    text(40, 276, 'tián zhōng yǒu zhū', { size: 11, fill: T.terraDeep })))
  parts.push(g('挖空句',
    text(28, 330, '兔走', { size: 20, weight: 800 }) +
    rect(88, 312, 22, 24, 'rgba(74,59,50,0.08)', 5) +
    text(122, 330, '株', { size: 20, weight: 800 }) +
    text(28, 356, 'tù zǒu chù zhū · 点击方块揭晓', { size: 11, fill: T.brass })))
  parts.push(g('批注', card(24, 386, 327, 64) +
    text(44, 414, '局长批注：「走」是跑的意思，不是走路的走', { size: 12.5, fill: T.sub })))
  parts.push(g('控制条', card(24, 480, 327, 84) +
    circle(70, 522, 22, T.terra, '', 'opacity="0.12"') + text(70, 529, '▶', { size: 16, anchor: 'middle', fill: T.terraDeep, weight: 700 }) +
    text(104, 516, '逐句跟读 · 节拍 中', { size: 13, weight: 600 }) +
    text(104, 540, '自评：熟了 / 再来', { size: 12, fill: T.sub })))
  return svgOpen('课文跟读') + parts.join('\n') + svgClose()
}

pages['22-汉字练字卡'] = () => {
  const parts = [pageBase('汉字练字卡')]
  parts.push(navBar('汉字练字卡'))
  parts.push(g('大字卡', card(67, 110, 240, 300) +
    rect(127, 150, 120, 120, 'none', 8, `stroke="${T.brass}" stroke-width="2" opacity="0.6"`) +
    line(187, 150, 187, 270, T.brass, 1, 'opacity="0.4"') + line(127, 210, 247, 210, T.brass, 1, 'opacity="0.4"') +
    text(187, 242, '永', { size: 74, weight: 700, anchor: 'middle', fill: T.ink, 'font-family': 'inherit' }) +
    text(187, 302, 'yǒng · 5 画', { size: 14, fill: T.sub, anchor: 'middle' }) +
    text(187, 330, '横折钩 · 结构：独体', { size: 12, fill: T.brass, anchor: 'middle' })))
  parts.push(g('田字格row', [0, 1, 2, 3].map(i => {
    const x = 87 + i * 56
    return rect(x, 440, 48, 48, 'none', 6, `stroke="${T.brass}" stroke-width="1.5" opacity="0.55"`) +
      line(x + 24, 440, x + 24, 488, T.brass, 0.8, 'opacity="0.35"') + line(x, 464, x + 48, 464, T.brass, 0.8, 'opacity="0.35"') +
      (i < 2 ? text(x + 24, 476, '永', { size: 30, anchor: 'middle', fill: 'rgba(74,59,50,0.18)' }) : '')
  }).join('\n')))
  parts.push(g('cta', cta(24, 530, 327, '换一个字')))
  parts.push(g('chips', chips(24, 608, ['一年级', '二年级', '高频字'], { active: 2, size: 12 })))
  return svgOpen('汉字练字卡') + parts.join('\n') + svgClose()
}

pages['23-字帖生成器'] = () => {
  const parts = [pageBase('字帖生成器')]
  parts.push(navBar('字帖生成器'))
  parts.push(g('输入卡', card(24, 104, 327, 106) +
    rect(44, 124, 200, 40, '#FFF9F2', 20, `stroke="rgba(74,59,50,0.10)"`) +
    text(60, 149, '王小明', { size: 15 }) +
    text(256, 149, '×', { size: 16, fill: T.light }) +
    rect(260, 124, 72, 40, T.terra, 20) +
    text(296, 149, '田字格', { size: 12.5, fill: '#FFF9F2', weight: 700, anchor: 'middle' })))
  /* 字帖预览（楷体描红） */
  let sheet = rect(47, 232, 281, 330, '#FFFFFF', 10, `stroke="${T.cardBorder}"`) + text(187, 260, '王小明 · 练字帖 · 趣工局', { size: 11, fill: T.sub, anchor: 'middle' })
  const chars = ['王', '小', '明']
  chars.forEach((ch, r) => {
    for (let c = 0; c < 5; c++) {
      const x = 63 + c * 52
      const y = 282 + r * 84
      sheet += rect(x, y, 46, 46, 'none', 0, `stroke="rgba(201,160,99,0.7)" stroke-width="1.5"`) +
        line(x + 23, y, x + 23, y + 46, 'rgba(201,160,99,0.35)', 1) + line(x, y + 23, x + 46, y + 23, 'rgba(201,160,99,0.35)', 1) +
        (c < 3 ? text(x + 23, y + 36, ch, { size: 32, anchor: 'middle', fill: 'rgba(74,59,50,0.20)' }) : '')
    }
  })
  /* 拼音行 */
  ;['wáng', 'xiǎo', 'míng'].forEach((py, r) => { sheet += text(86, 340 + r * 84, py, { size: 10, fill: T.sub, anchor: 'middle' }) })
  parts.push(g('字帖预览', sheet))
  parts.push(g('cta', cta(24, 592, 327, '保存图片（可打印）')))
  parts.push(tip(672, '楷体描红 · 3 格描 + 2 格临 · 附拼音'))
  return svgOpen('字帖生成器') + parts.join('\n') + svgClose()
}

pages['24-拼音注音'] = () => {
  const parts = [pageBase('拼音注音')]
  parts.push(navBar('拼音注音'))
  parts.push(g('输入卡', card(24, 104, 327, 110) +
    text(44, 136, '输入汉字', { size: 13.5, weight: 700, fill: T.sub }) +
    text(44, 172, '我想吃火锅了', { size: 17 }) +
    text(44, 200, '|', { size: 17, fill: T.terra, weight: 700 })))
  parts.push(g('结果卡', card(24, 234, 327, 130) +
    text(44, 268, 'wǒ', { size: 12, fill: T.brass, anchor: 'middle' }) + text(44, 298, '我', { size: 22, weight: 700, anchor: 'middle' }) +
    text(94, 268, 'xiǎng', { size: 12, fill: T.brass, anchor: 'middle' }) + text(94, 298, '想', { size: 22, weight: 700, anchor: 'middle' }) +
    text(144, 268, 'chī', { size: 12, fill: T.brass, anchor: 'middle' }) + text(144, 298, '吃', { size: 22, weight: 700, anchor: 'middle' }) +
    text(194, 268, 'huǒ', { size: 12, fill: T.brass, anchor: 'middle' }) + text(194, 298, '火', { size: 22, weight: 700, anchor: 'middle' }) +
    text(244, 268, 'guō', { size: 12, fill: T.brass, anchor: 'middle' }) + text(244, 298, '锅', { size: 22, weight: 700, anchor: 'middle' }) +
    text(294, 268, 'le', { size: 12, fill: T.brass, anchor: 'middle' }) + text(294, 298, '了', { size: 22, weight: 700, anchor: 'middle' })))
  parts.push(g('模式', seg(24, 394, 327, ['逐字注音', '整句拼音'], 0)))
  parts.push(g('cta', cta(24, 466, 327, '复制结果')))
  parts.push(tip(546, 'pinyin-pro 本地引擎 · 生僻字也可'))
  return svgOpen('拼音注音') + parts.join('\n') + svgClose()
}

pages['25-简繁互转'] = () => {
  const parts = [pageBase('简繁互转')]
  parts.push(navBar('简繁互转'))
  parts.push(g('方向', seg(24, 104, 327, ['简 → 繁', '繁 → 简'], 0)))
  parts.push(g('输入卡', card(24, 168, 327, 116) +
    text(44, 200, '输入', { size: 13, weight: 700, fill: T.sub }) +
    text(44, 238, '今天天气很好，我们去玩吧', { size: 16 })))
  parts.push(g('结果卡', card(24, 304, 327, 140) +
    text(44, 336, '结果', { size: 13, weight: 700, fill: T.sub }) +
    text(44, 374, '今天天氣很好，我們去玩吧', { size: 16, weight: 600, fill: T.terraDeep }) +
    line(44, 396, 331, 396, 'rgba(74,59,50,0.06)') +
    rect(44, 406, 120, 32, T.terra, 16) + text(104, 427, '复制结果', { size: 12.5, fill: '#FFF9F2', weight: 700, anchor: 'middle' }) +
    rect(176, 406, 88, 32, 'rgba(74,59,50,0.06)', 16) + text(220, 427, '转回去', { size: 12.5, fill: T.sub, anchor: 'middle' })))
  parts.push(g('词表卡', card(24, 472, 327, 96) +
    text(44, 504, '词汇修正', { size: 13.5, weight: 700 }) +
    text(44, 530, '头发→頭髮 · 软件→軟體 · 视频→影片', { size: 12, fill: T.sub })))
  parts.push(tip(604, 'OpenCC 字表 · 3882 字覆盖'))
  return svgOpen('简繁互转') + parts.join('\n') + svgClose()
}

/* ---------- 创意分包 ---------- */
pages['30-拼豆图纸'] = () => {
  const parts = [pageBase('拼豆图纸生成')]
  parts.push(navBar('拼豆图纸生成'))
  parts.push(g('cta选图', cta(24, 104, 327, '📷 选一张照片', { h: 48 })))
  parts.push(g('模板row', text(28, 186, '直接用模板', { size: 12.5, fill: T.sub }) +
    chips(120, 168, ['爱心', '星星', '小熊'], { size: 12 })))
  /* 29x29 空棋盘预览 */
  let board = rect(24, 210, 327, 327, T.card, 18, `stroke="${T.cardBorder}"`)
  const n = 12
  const cs = 327 / n
  const dots = [[3, 3, '#E4674A'], [4, 3, '#E4674A'], [5, 3, '#F5CDBB'], [3, 4, '#E4674A'], [5, 4, '#F5CDBB'], [4, 5, '#C9A063']]
  dots.forEach(([gx, gy, c]) => { board += circle(24 + (gx + 0.5) * cs, 210 + (gy + 0.5) * cs, cs * 0.42, c) })
  for (let i = 1; i < n; i++) {
    board += line(24 + i * cs, 210, 24 + i * cs, 537, 'rgba(74,59,50,0.10)', 0.6) + line(24, 210 + i * cs, 351, 210 + i * cs, 'rgba(74,59,50,0.10)', 0.6)
  }
  parts.push(g('棋盘预览', board))
  parts.push(g('meta', text(187, 566, '29×29（15cm 板） · 共 841 颗 · 10 色', { size: 12.5, fill: T.sub, anchor: 'middle' })))
  parts.push(g('清单', card(24, 588, 327, 120) +
    text(44, 618, '颗粒清单', { size: 13.5, weight: 700 }) +
    rect(44, 634, 16, 16, '#E4674A', 4) + text(68, 647, 'H01 · 貂红 ×213', { size: 12 }) +
    rect(200, 634, 16, 16, '#F5CDBB', 4) + text(224, 647, 'H05 · 杏仁 ×186', { size: 12 }) +
    rect(44, 662, 16, 16, '#C9A063', 4) + text(68, 675, 'H12 · 芥末 ×154', { size: 12 })))
  parts.push(g('cta导出', cta(24, 726, 327, '导出图纸大图', { h: 44 })))
  return svgOpen('拼豆图纸生成') + parts.join('\n') + svgClose()
}

pages['31-手持弹幕'] = () => {
  const parts = [pageBase('手持弹幕')]
  parts.push(navBar('手持弹幕'))
  parts.push(g('输入卡', card(24, 104, 327, 128) +
    rect(44, 126, 287, 44, '#FFF9F2', 22, `stroke="rgba(74,59,50,0.10)"`) +
    text(62, 153, '写一句要举的话（24 字内）', { size: 13, fill: T.light }) +
    rect(0, 0, 0, 0, 'none')))
  parts.push(g('播放按钮', cta(44, 188, 287, '全屏播放', { h: 44 })))
  /* 全屏效果预览 */
  parts.push(g('全屏预览',
    rect(24, 258, 327, 200, '#1D1613', 18) +
    text(187, 356, '前方高能', { size: 34, weight: 800, fill: '#7FD8A4', anchor: 'middle', spacing: 4 }) +
    rect(24, 258, 327, 8, T.terra, 0, 'opacity="0.6"')))
  parts.push(g('预设', text(28, 492, '最近', { size: 12.5, fill: T.sub }) + chips(70, 474, ['前方高能', '接我', '生日快乐'], { size: 12 })))
  parts.push(g('样式', chips(24, 530, ['荧光绿', '暖白', '跑马灯', '镜像'], { active: 0, size: 12 })))
  parts.push(g('摇一摇提示', card(24, 590, 327, 56) +
    text(44, 622, '摇晃手机切换配色 · 横屏更震撼', { size: 12.5, fill: T.sub })))
  return svgOpen('手持弹幕') + parts.join('\n') + svgClose()
}

pages['32-文字转图片'] = () => {
  const parts = [pageBase('文字转图片')]
  parts.push(navBar('文字转图片'))
  parts.push(g('输入卡', card(24, 104, 327, 104) +
    rect(44, 124, 287, 64, '#FFF9F2', 12, `stroke="rgba(74,59,50,0.10)"`) +
    text(60, 150, '今天也是想躺平的一天', { size: 14 }) +
    text(60, 172, '|', { size: 14, fill: T.terra, weight: 700 })))
  parts.push(g('版式chips', chips(24, 228, ['便签', '长图'], { active: 0 }) +
    [0, 1, 2].map(i => rect(160 + i * 30, 230, 22, 22, ['#FFF9F2', '#F7E8D4', '#E8DFF6'][i], 8, `stroke="rgba(74,59,50,0.10)"${i === 1 ? ' stroke-width="2"' : ''}`)).join('')))
  /* 便签预览 */
  parts.push(g('便签预览',
    rect(59, 282, 257, 240, '#FFF9F2', 16, `stroke="${T.cardBorder}"`) +
    rect(59, 282, 257, 10, T.terra, 0, 'opacity="0.8" rx="5"') +
    text(187, 360, '今天也是', { size: 20, weight: 700, anchor: 'middle', spacing: 2 }) +
    text(187, 394, '想躺平的一天', { size: 20, weight: 700, anchor: 'middle', spacing: 2 }) +
    text(187, 494, '— 趣工局 —', { size: 10.5, fill: T.light, anchor: 'middle' })))
  parts.push(g('cta', cta(24, 552, 327, '保存 / 发给朋友', { h: 46 })))
  parts.push(tip(636, '便签适合一句话 · 长图自动换行排班'))
  return svgOpen('文字转图片') + parts.join('\n') + svgClose()
}

pages['33-图片工具箱'] = () => {
  const parts = [pageBase('图片小工具箱')]
  parts.push(navBar('图片小工具箱'))
  parts.push(g('画布区', rect(24, 104, 327, 300, T.card, 18, `stroke="${T.cardBorder}"`) +
    rect(120, 160, 135, 180, '#F7E8D4', 12) +
    text(187, 250, '🌄', { size: 44, anchor: 'middle' }) +
    text(187, 290, '所选图片', { size: 12.5, fill: T.sub, anchor: 'middle' })))
  parts.push(g('操作chips', chips(24, 428, ['🔄 旋转', '🔁 镜像', '🎨 滤镜', '😀 贴字'], { size: 12 })))
  parts.push(g('滤镜chips', chips(24, 474, ['原片', '暖阳', '胶片', '黑白'], { active: 1, size: 12 })))
  parts.push(g('隐私说明', card(24, 528, 327, 64) +
    text(44, 556, '所有处理在本机完成 · 不上传', { size: 13, weight: 600 }) +
    text(44, 580, '导出自动抹除位置信息', { size: 12, fill: T.sub })))
  parts.push(g('cta', cta(24, 620, 327, '保存到相册')))
  return svgOpen('图片小工具箱') + parts.join('\n') + svgClose()
}

pages['34-批量替换'] = () => {
  const parts = [pageBase('文本批量替换')]
  parts.push(navBar('文本批量替换'))
  parts.push(g('规则', card(24, 104, 327, 100) +
    rect(44, 126, 130, 36, '#FFF9F2', 10, `stroke="rgba(74,59,50,0.10)"`) + text(56, 149, '查找…', { size: 13, fill: T.light }) +
    text(184, 150, '→', { size: 14, fill: T.light, anchor: 'middle' }) +
    rect(198, 126, 133, 36, '#FFF9F2', 10, `stroke="rgba(74,59,50,0.10)"`) + text(210, 149, '替换为…', { size: 13, fill: T.light }) +
    rect(44, 172, 90, 24, 'rgba(228,103,74,0.12)', 12) + text(89, 189, '区分大小写', { size: 10.5, fill: T.terraDeep, anchor: 'middle' })))
  parts.push(g('文本区', card(24, 222, 327, 200) +
    text(44, 252, '粘贴你的文本', { size: 13, weight: 700, fill: T.sub }) +
    [0, 1, 2, 3, 4].map(i => line(44, 286 + i * 26, 331, 286 + i * 26, 'rgba(74,59,50,0.08)', 6, 'stroke-linecap="round"')).join('\n')))
  parts.push(g('cta', cta(24, 448, 327, '全部替换')))
  parts.push(g('结果', text(187, 540, '替换 12 处 · 已复制', { size: 13, fill: T.sub, anchor: 'middle' })))
  return svgOpen('文本批量替换') + parts.join('\n') + svgClose()
}

/* ---------- 计算分包 ---------- */
pages['40-生活计算器合集'] = () => {
  const parts = [pageBase('生活计算器合集')]
  parts.push(navBar('生活计算器'))
  parts.push(g('搜索', input(24, 104, 327, 40, '🔍 搜计算器，如「房贷」')))
  const items = [['🏠', '房贷计算', '等额本息/本金'], ['⚖️', 'BMI', '身体质量指数'], ['📏', '单位换算', '长度/重量/温度'], ['💰', '复利计算', '存钱党必备'], ['🧾', '个税', '税后一目了然'], ['⛽', '油耗', '百公里几个油']]
  items.forEach(([ic, n, d], i) => {
    const y = 164 + i * 74
    parts.push(g(`项-${n}`, card(24, y, 327, 62) +
      text(46, y + 39, ic, { size: 18 }) +
      text(80, y + 30, n, { size: 15, weight: 700 }) +
      text(80, y + 50, d, { size: 11.5, fill: T.sub }) +
      text(336, y + 38, '›', { size: 16, fill: T.light, anchor: 'end' })))
  })
  parts.push(tip(H - 40, '每个结果都附一句局长碎碎念'))
  return svgOpen('生活计算器合集') + parts.join('\n') + svgClose()
}

pages['41-计算器运行'] = () => {
  const parts = [pageBase('房贷计算')]
  parts.push(navBar('房贷计算'))
  parts.push(g('参数卡', card(24, 104, 327, 190) +
    text(44, 138, '贷款总额（万）', { size: 13, fill: T.sub }) + text(331, 138, '120', { size: 16, weight: 800, anchor: 'end' }) +
    line(44, 152, 331, 152, 'rgba(74,59,50,0.08)', 6, 'stroke-linecap="round"') +
    text(44, 184, '年限', { size: 13, fill: T.sub }) + chips(90, 166, ['20年', '25年', '30年'], { active: 2, size: 11 }) +
    text(44, 226, '利率', { size: 13, fill: T.sub }) + chips(90, 208, ['3.6', '3.85', '4.2'], { active: 1, size: 11 })))
  parts.push(g('结果', card(24, 314, 327, 170) +
    text(44, 352, '月供', { size: 13, fill: T.sub }) +
    text(44, 396, '¥ 5,718', { size: 34, weight: 800, fill: T.terra }) +
    line(44, 420, 331, 420, 'rgba(74,59,50,0.06)') +
    text(44, 450, '总利息 ¥ 45.5 万 · 还款总额 ¥ 205.8 万', { size: 12, fill: T.sub })))
  parts.push(g('碎碎念', card(24, 504, 327, 64) +
    text(44, 532, '💬 局长：利息够买辆代步车了，能早还就早还', { size: 12.5, fill: T.sub })))
  parts.push(g('cta', cta(24, 596, 327, '计算 / 重置', { h: 44 })))
  return svgOpen('房贷计算') + parts.join('\n') + svgClose()
}

/* ---------- 趣味分包 ---------- */
pages['50-假装来电'] = () => {
  const parts = [pageBase('假装来电', { band: false })]
  parts.push(g('来电界面',
    rect(0, 0, W, H, '#1D1613') +
    text(187, 250, '妈妈', { size: 34, weight: 700, fill: '#FFF9F2', anchor: 'middle' }) +
    text(187, 288, '来电…', { size: 15, fill: 'rgba(255,249,242,0.55)', anchor: 'middle' }) +
    circle(187, 400, 64, 'rgba(255,249,242,0.12)') +
    text(187, 424, '👩', { size: 44, anchor: 'middle' }) +
    circle(110, 640, 44, '#4CAF7D') + text(110, 649, '接听', { size: 14, fill: '#fff', anchor: 'middle' }) +
    circle(264, 640, 44, '#EF5350') + text(264, 649, '挂断', { size: 14, fill: '#fff', anchor: 'middle' })
  ))
  parts.push(g('脚本提示', rect(24, 726, 327, 46, 'rgba(255,249,242,0.10)', 12) +
    text(187, 754, '剧本「妈妈来电」· 15 秒后自动接通', { size: 12, fill: 'rgba(255,249,242,0.8)', anchor: 'middle' })))
  return svgOpen('假装来电') + parts.join('\n') + svgClose()
}

pages['51-设备信息'] = () => {
  const parts = [pageBase('设备信息')]
  parts.push(navBar('设备信息'))
  const rows = [['机型', 'iPhone 14 Pro'], ['系统', 'iOS 17.5'], ['屏幕', '393 × 852'], ['像素比', '3x'], ['语言', 'zh-CN'], ['网络', 'Wi-Fi']]
  parts.push(g('设备卡', card(24, 104, 327, rows.length * 52 + 16)))
  rows.forEach(([k, v], i) => {
    parts.push(g(`行-${k}`,
      text(44, 140 + i * 52, k, { size: 13.5, fill: T.sub }) +
      text(331, 140 + i * 52, v, { size: 14, weight: 600, anchor: 'end' }) +
      (i < rows.length - 1 ? line(44, 156 + i * 52, 331, 156 + i * 52, 'rgba(74,59,50,0.06)') : '')))
  })
  parts.push(g('电池', card(24, 440, 327, 76) +
    text(44, 472, '电量', { size: 13.5, fill: T.sub }) +
    text(331, 476, '82%', { size: 20, weight: 800, anchor: 'end', fill: T.green })))
  parts.push(tip(570, '写小程序调试用 · 信息全部本机读取'))
  return svgOpen('设备信息') + parts.join('\n') + svgClose()
}

pages['60-关于'] = () => {
  const parts = [pageBase('关于趣工局')]
  parts.push(navBar('关于'))
  parts.push(g('logo', circle(187, 200, 52, T.terra, '', 'opacity="0.12"') +
    text(187, 214, '趣', { size: 40, weight: 800, anchor: 'middle', fill: T.terra })))
  parts.push(g('名', text(187, 296, '趣工局', { size: 24, weight: 800, anchor: 'middle' }) +
    text(187, 324, '解压 × 实用的小工具合集', { size: 13, fill: T.sub, anchor: 'middle' })))
  const rows = [['版本', 'V4.1'], ['工具数', '20 个'], ['数据', '全部本机存储'], ['联系', 'design by Mariana']]
  parts.push(g('信息卡', card(24, 370, 327, rows.length * 52 + 16)))
  rows.forEach(([k, v], i) => {
    parts.push(g(`行-${k}`, text(44, 406 + i * 52, k, { size: 13.5, fill: T.sub }) +
      text(331, 406 + i * 52, v, { size: 14, weight: 600, anchor: 'end' }) +
      (i < rows.length - 1 ? line(44, 422 + i * 52, 331, 422 + i * 52, 'rgba(74,59,50,0.06)') : '')))
  })
  return svgOpen('关于') + parts.join('\n') + svgClose()
}

pages['52-趣味选择器'] = () => {
  const parts = [pageBase('趣味选择器')]
  parts.push(navBar('趣味选择器'))
  /* 页签 */
  parts.push(g('页签',
    rect(24, 100, 327, 60, 'rgba(255,255,255,0.62)', 30, `stroke="rgba(74,59,50,0.06)"`) +
    rect(28, 104, 106, 52, T.terra, 26) +
    text(81, 137, '🎲 骰子', { size: 14, fill: '#FFF9F2', weight: 700, anchor: 'middle' }) +
    text(187, 137, '🪙 硬币', { size: 14, fill: T.sub, anchor: 'middle' }) +
    text(293, 137, '🎋 摇签', { size: 14, fill: T.sub, anchor: 'middle' })
  ))
  /* 3D 骰子（等轴测示意） */
  parts.push(g('3D骰子',
    `    <ellipse cx="187" cy="380" rx="86" ry="22" fill="rgba(74,59,50,0.14)"/>` +
    `    <path d="M 127 240 L 247 240 L 267 258 L 267 330 L 147 330 L 127 312 Z" fill="#FFF6EC" stroke="#E3D5C6" stroke-width="1.5"/>` +
    `    <path d="M 127 240 L 147 222 L 267 222 L 247 240 Z" fill="#FFFBF4" stroke="#E3D5C6" stroke-width="1.5"/>` +
    `    <path d="M 247 240 L 267 222 L 267 294 L 247 312 Z" fill="#F4E7D8" stroke="#E3D5C6" stroke-width="1.5"/>` +
    circle(167, 282, 9, '#C4523A') + circle(207, 282, 9, '#C4523A') +
    circle(167, 258, 6, '#C4523A') + circle(207, 258, 6, '#C4523A') +
    circle(167, 306, 6, '#C4523A') + circle(207, 306, 6, '#C4523A') +
    circle(237, 240, 5, '#C4523A') + circle(253, 228, 5, '#C4523A')
  ))
  parts.push(g('面板',
    rect(24, 420, 327, 250, 'rgba(255,255,255,0.78)', 26, `stroke="rgba(74,59,50,0.06)"`) +
    text(52, 462, '个数', { size: 12, fill: T.sub }) +
    rect(96, 444, 52, 30, 'rgba(74,59,50,0.05)', 15) + text(122, 464, '1 个', { size: 12, anchor: 'middle', fill: T.sub }) +
    rect(156, 444, 52, 30, T.terra, 15) + text(182, 464, '2 个', { size: 12, fill: '#FFF9F2', weight: 700, anchor: 'middle' }) +
    rect(216, 444, 52, 30, 'rgba(74,59,50,0.05)', 15) + text(242, 464, '3 个', { size: 12, anchor: 'middle', fill: T.sub }) +
    text(187, 522, 'Σ 9', { size: 30, weight: 800, anchor: 'middle' }) +
    text(187, 548, '5 + 4 · 就这一把', { size: 12, fill: T.sub, anchor: 'middle' })
  ))
  parts.push(g('cta', cta(24, 596, 327, '掷出去', { h: 46 })))
  parts.push(g('硬币缩略', circle(60, 200, 22, '#E9CF9E', '', 'stroke="#B98F52" stroke-width="1.5"') + text(60, 206, '趣', { size: 15, anchor: 'middle', fill: '#8A6A33', weight: 700 })))
  parts.push(g('签筒缩略', rect(298, 178, 26, 46, '#B85C42', 6) + line(306, 168, 316, 178, '#C4523A', 4, 'stroke-linecap="round"') + line(312, 164, 320, 176, '#C4523A', 4, 'stroke-linecap="round"')))
  parts.push(tip(H - 42, '3D 实时渲染 · 骰子/硬币/摇签三页签'))
  return svgOpen('趣味选择器') + parts.join('\n') + svgClose()
}

/* ---------- 生成 ---------- */
let n = 0
for (const [name, fn] of Object.entries(pages)) {
  const svg = fn()
  fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), svg, 'utf8')
  n++
  console.log(`✓ ${name}.svg`)
}
console.log(`共生成 ${n} 张 → ${OUT_DIR}`)
