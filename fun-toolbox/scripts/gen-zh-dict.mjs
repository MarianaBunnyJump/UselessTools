/* ===================== 简繁互转字表生成脚本 =====================
 * 用法：node scripts/gen-zh-dict.mjs
 * 数据来源：OpenCC 官方 TSCharacters.txt / STCharacters.txt（UTF-8）
 * 下载到 scripts/zh-dict-data/，缺失时自动下载；生成后做抽样校验，
 * 校验不过则拒绝写盘（防止半截数据再次污染 dict-chars.ts）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA_DIR = path.join(import.meta.dirname, 'zh-dict-data')
const OUT = path.join(ROOT, 'src/pages/text/zh-convert/dict-chars.ts')

/* OpenCC 命名：ST = 简→繁（key 为简体），TS = 繁→简（key 为繁体） */
const SOURCES = [
  { name: 'STCharacters.txt', url: 'https://raw.githubusercontent.com/BYVoid/OpenCC/master/data/dictionary/STCharacters.txt', min: 3000 },
  { name: 'TSCharacters.txt', url: 'https://raw.githubusercontent.com/BYVoid/OpenCC/master/data/dictionary/TSCharacters.txt', min: 2000 }
]

function ensureData() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  for (const s of SOURCES) {
    const f = path.join(DATA_DIR, s.name)
    if (!fs.existsSync(f) || fs.statSync(f).size < 10000) {
      console.log(`下载 ${s.url}`)
      execSync(`curl -sSL --retry 3 -o "${f}" "${s.url}"`, { stdio: 'inherit' })
    }
    const text = fs.readFileSync(f, 'utf8')
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < s.min) throw new Error(`${s.name} 行数 ${lines.length} < ${s.min}，数据不完整，中止`)
    if (!text.includes('\t')) throw new Error(`${s.name} 缺少制表符分隔，格式异常，中止`)
    console.log(`${s.name}: ${lines.length} 行`)
  }
}

/* "簡\t繁1 繁2" → 取第一个映射；简繁相同的丢弃（无转换意义） */
function parse(name) {
  const lines = fs.readFileSync(path.join(DATA_DIR, name), 'utf8').split('\n')
  const map = {}
  for (const line of lines) {
    const [from, to] = line.split('\t')
    if (!from || !to) continue
    const first = to.trim().split(' ')[0]
    if (from === first) continue
    if (!map[from]) map[from] = first
  }
  return map
}

/* 抽样校验：无歧义常用字必须命中正确目标；歧义字（干/后等多映射）只要求存在映射 */
function verify(s2t, t2s) {
  const mustS2T = { '头': '頭', '万': '萬', '与': '與', '专': '專', '业': '業', '丰': '豐', '爱': '愛', '东': '東', '书': '書', '长': '長' }
  const mustT2S = { '頭': '头', '萬': '万', '與': '与', '愛': '爱', '東': '东', '書': '书', '長': '长', '豐': '丰' }
  const ambiguousS2T = ['干', '后', '里', '发']
  for (const [k, v] of Object.entries(mustS2T)) {
    if (s2t[k] !== v) throw new Error(`S2T 校验失败：${k} -> ${s2t[k]}（期望 ${v}）`)
  }
  for (const [k, v] of Object.entries(mustT2S)) {
    if (t2s[k] !== v) throw new Error(`T2S 校验失败：${k} -> ${t2s[k]}（期望 ${v}）`)
  }
  for (const k of ambiguousS2T) {
    if (!s2t[k]) throw new Error(`S2T 缺少常用字映射：${k}`)
  }
}

ensureData()
const s2t = parse('STCharacters.txt')
const t2s = parse('TSCharacters.txt')
verify(s2t, t2s)

const header = `/* OpenCC Characters 精简字级映射（构建时生成，勿手改）
 * 生成：node scripts/gen-zh-dict.mjs · S2T ${Object.keys(s2t).length} 字 / T2S ${Object.keys(t2s).length} 字
 */
`
const body = `export const S2T_CHARS: Record<string, string> = ${JSON.stringify(s2t)}

export const T2S_CHARS: Record<string, string> = ${JSON.stringify(t2s)}
`
fs.writeFileSync(OUT, header + body, 'utf8')
console.log(`已生成 ${OUT}（S2T ${Object.keys(s2t).length} / T2S ${Object.keys(t2s).length}）`)
