/* ===================== 苏教版文言文语料生成脚本 =====================
 * 用法：node scripts/gen-sujiao-classics.mjs
 * 输入：scripts/sujiao-data.md（按教材顺序的苏教版初高中文言文全集）
 * 输出：src/pages/study/data/classics-sujiao.ts（逐句拼音由 pinyin-pro 自动生成）
 * 校验门：册数/篇数/句数/拼音非空抽样，不过则拒绝写盘。
 */
import fs from 'node:fs'
import path from 'node:path'
import { pinyin } from 'pinyin-pro'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC_MD = path.join(import.meta.dirname, 'sujiao-data.md')
const OUT = path.join(ROOT, 'src/pages/study/data/classics-sujiao.ts')

const md = fs.readFileSync(SRC_MD, 'utf8')
const lines = md.split('\n')

/* 从「# 正文」之后、「# 附录」之前解析 */
let i = 0
while (i < lines.length && !lines[i].startsWith('# 正文')) i++
const start = i + 1
let end = lines.length
for (let j = start; j < lines.length; j++) {
  if (lines[j].startsWith('# 附录')) { end = j; break }
}

/* 解析标题：`## 3. 《三峡》〔郦道元《水经注·江水》〕` */
function parseCourse(line) {
  const m = line.match(/^##\s*(\d+)\.\s*《(.+?)》(?:〔(.*)〕)?/)
  if (!m) return null
  return { num: Number(m[1]), title: m[2], meta: m[3] || '' }
}
function parseSub(line) {
  const m = line.match(/^###\s*[（(][一二三四五六][)）]\s*(.+?)(?:〔(.*)〕)?\s*$/)
  if (!m) return null
  return { title: m[1], meta: m[2] || '' }
}

/* 段落 → 句子（按句末标点切分，保留标点） */
function splitSentences(par) {
  const out = []
  let buf = ''
  for (const ch of par) {
    buf += ch
    if ('。！？；'.includes(ch)) {
      out.push(buf)
      buf = ''
    }
  }
  if (buf.trim()) out.push(buf)
  return out.filter(s => /[一-龥]/.test(s)) /* 句子必须含汉字（滤掉段末残留引号等） */
}

const py = t => pinyin(t, { toneType: 'symbol', type: 'string', nonZh: 'consecutive' })

/* ---------- 解析 ---------- */
const volumes = []
let curVol = null
let curCourse = null      /* 当前课（可能直接含正文，也可能只有子篇） */
let curArticle = null     /* 正在收集正文的文章 */
let gradeCounter = {}

function ensureArticle(course, vol, meta, titleOverride) {
  const title = titleOverride || course.title
  const key = title
  gradeCounter[key] = (gradeCounter[key] || 0) + 1
  const id = 'sj-' + pinyin(title, { toneType: 'none', type: 'array', nonZh: 'consecutive' }).join('').replace(/[^a-z0-9]/gi, '') + (gradeCounter[key] > 1 ? '-' + gradeCounter[key] : '')
  const article = {
    id,
    title,
    author: meta || (course.meta || ''),
    dynasty: '苏教版',
    grade: vol.name,
    sentences: [],
    comment: ''
  }
  vol.articles.push(article)
  return article
}

for (let k = start; k < end; k++) {
  const line = lines[k]
  if (line.startsWith('# ')) {
    /* 册名 */
    const name = line.slice(2).trim()
    curVol = { id: 'sj-vol-' + (volumes.length + 1), name, articles: [] }
    volumes.push(curVol)
    curCourse = null
    curArticle = null
  } else if (line.startsWith('## ')) {
    curCourse = parseCourse(line)
    curArticle = null
  } else if (line.startsWith('### ')) {
    /* 子篇：独立成文 */
    const sub = parseSub(line)
    if (sub && curCourse && curVol) {
      curArticle = ensureArticle(curCourse, curVol, sub.meta, sub.title)
    }
  } else if (line.trim() && curCourse && curVol) {
    /* 正文段落：若课尚无文章则先建 */
    if (!curArticle) curArticle = ensureArticle(curCourse, curVol, '')
    const par = line.trim()
    if (/^[（(].*[)）]$/.test(par)) continue /* 跳过 (一) 这类残留行 */
    for (const s of splitSentences(par)) {
      curArticle.sentences.push({ text: s, pinyin: py(s) })
    }
  }
}

/* 学段分组：册名含「年级」→ 初中；含「必修」→ 高中 */
const junior = volumes.filter(v => v.name.includes('年级'))
const senior = volumes.filter(v => v.name.includes('必修'))
const stages = []
if (junior.length) stages.push({ id: 'sujiao-junior', name: '苏教·初中', volumes: junior })
if (senior.length) stages.push({ id: 'sujiao-senior', name: '苏教·高中', volumes: senior })

/* ---------- 校验门 ---------- */
const articleCount = stages.reduce((n, s) => n + s.volumes.reduce((m, v) => m + v.articles.length, 0), 0)
const sentCount = stages.reduce((n, s) => n + s.volumes.reduce((m, v) => m + v.articles.reduce((x, a) => x + a.sentences.length, 0), 0), 0)
const problems = []
if (junior.length !== 6) problems.push(`初中册数 ${junior.length} != 6`)
if (senior.length !== 5) problems.push(`高中册数 ${senior.length} != 5`)
if (articleCount < 50) problems.push(`篇数 ${articleCount} < 50`)
for (const s of stages) {
  for (const v of s.volumes) {
    for (const a of v.articles) {
      if (a.sentences.length === 0) problems.push(`${a.title} 无句子`)
      for (const sent of a.sentences) {
        if (!sent.pinyin || !/[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(sent.pinyin)) {
          problems.push(`${a.title} 拼音异常: ${sent.text.slice(0, 10)}`)
          break
        }
      }
    }
  }
}
if (problems.length) {
  console.error('校验失败：')
  problems.slice(0, 20).forEach(p => console.error(' -', p))
  process.exit(1)
}

/* ---------- 输出 ---------- */
const header = `/* ===================== 苏教版文言文语料（构建时生成，勿手改） =====================
 * 生成：node scripts/gen-sujiao-classics.mjs
 * 来源：scripts/sujiao-data.md（苏教版初高中文言文全集，按教材顺序）
 * 统计：${stages.length} 学段 / ${volumes.length} 册 / ${articleCount} 篇 / ${sentCount} 句
 * 拼音由 pinyin-pro 自动标注（多音字以词典常用音为准，未逐篇人工校对；
 * 「小学/初中/高中」精读 tab 仍为人工校对版语料）。
 */

import type { ClassicStage } from './classics'

`
const body = `export const SUJIAO_STAGES: ClassicStage[] = ${JSON.stringify(stages, null, 1)}
`
fs.writeFileSync(OUT, header + body, 'utf8')
console.log(`已生成 ${OUT}`)
console.log(`学段 ${stages.length} · 册 ${volumes.length} · 篇 ${articleCount} · 句 ${sentCount}`)
stages.forEach(s => {
  console.log(` ${s.name}: ${s.volumes.map(v => v.name + '(' + v.articles.length + ')').join(' ')}`)
})
