import Taro from '@tarojs/taro'
import type { CounterTag } from './counterStore'
import {
  newId,
  nextColorIdx,
  loadTags,
  saveTag,
  saveTags,
  saveActiveId,
  enqueue,
  enqueueEntries,
  enqueueMarks
} from './counterStore'
import { daySum, todayStr } from './counterCalc'

/* ===================== CSV 导入导出（一个文件装全量） =====================
 * 与手机版同一套格式与解析器：表头 tag,unit,type,date,time,amount,note,by,value
 * 含引号转义、BOM 清理、未来日期跳过。
 */

export const CSV_HEAD = ['tag', 'unit', 'type', 'date', 'time', 'amount', 'note', 'by', 'value']

function csvCell(v: any): string {
  const s = String(v == null ? '' : v)
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export function buildCsv(tags: CounterTag[]): string {
  const rows = [CSV_HEAD.join(',')]
  tags.forEach(t => {
    t.entries
      .slice()
      .sort((a, b) => ((a.date + a.time) < (b.date + b.time) ? -1 : 1))
      .forEach(e => {
        rows.push([t.name, t.unit, 'entry', e.date, e.time, e.amount, e.note, e.by, ''].map(csvCell).join(','))
      })
    t.anniversaries
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .forEach(a => {
        rows.push([t.name, t.unit, 'anniversary', a.date, a.time || '12:00', '', a.label, '', a.valueAtMark].map(csvCell).join(','))
      })
  })
  return rows.join('\r\n')
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      cell = ''
      if (row.some(c => String(c).trim() !== '')) rows.push(row)
      row = []
    } else cell += ch
  }
  row.push(cell)
  if (row.some(c => String(c).trim() !== '')) rows.push(row)
  return rows
}

export interface ImportResult {
  nE: number
  nA: number
  nSkip: number
}

export function importCsv(text: string): ImportResult {
  text = String(text || '').replace(/^\ufeff/, '')
  const rows = parseCsv(text)
  const result: ImportResult = { nE: 0, nA: 0, nSkip: 0 }
  if (!rows.length) return result

  const head = rows[0].map(c => String(c).trim().toLowerCase())
  const hasHead = head.includes('tag')
  const order = hasHead ? head : CSV_HEAD.slice()
  const cellOf = (r: string[], n: string) => {
    const i = order.indexOf(n)
    return i >= 0 && r[i] != null ? String(r[i]).trim() : ''
  }
  const data = hasHead ? rows.slice(1) : rows
  const today = todayStr()

  const tags = loadTags()
  let changed = false

  data.forEach(r => {
    const name = (cellOf(r, 'tag') || '导入标签').slice(0, 12)
    const unit = (cellOf(r, 'unit') || '次').slice(0, 4)
    const type = (cellOf(r, 'type') || 'entry').toLowerCase()
    const date = cellOf(r, 'date')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today) {
      result.nSkip += 1
      return
    }
    let t = tags.find(x => x.name === name)
    if (!t) {
      t = {
        id: newId('t'),
        name,
        unit,
        colorIdx: nextColorIdx(),
        synced: false,
        members: [],
        version: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        entries: [],
        anniversaries: []
      }
      tags.push(t)
      changed = true
      enqueue({ key: 'c' + t.id, type: 'createTag', tagId: t.id })
    }
    if (type === 'anniversary') {
      if (t.anniversaries.some(a => a.date === date)) {
        result.nSkip += 1
        return
      }
      const mark = {
        id: newId('a'),
        date,
        time: cellOf(r, 'time') || '12:00',
        label: cellOf(r, 'note') || '纪念日',
        valueAtMark: Number(cellOf(r, 'value')) || daySum(t, date)
      }
      t.anniversaries.push(mark)
      enqueueMarks(t.id, [mark])
      result.nA += 1
    } else {
      const time = cellOf(r, 'time')
      const amt = Number(cellOf(r, 'amount'))
      if (!/^\d{1,2}:\d{2}$/.test(time) || !isFinite(amt) || amt === 0) {
        result.nSkip += 1
        return
      }
      const entry = {
        id: newId('e'),
        date,
        time: time.padStart(5, '0'),
        amount: amt,
        note: cellOf(r, 'note'),
        by: cellOf(r, 'by') || '导入'
      }
      t.entries.push(entry)
      enqueueEntries(t.id, [entry])
      result.nE += 1
    }
    saveTag(t)
  })

  if (changed) saveTags(tags)
  if (tags.length) saveActiveId(tags[0].id)
  return result
}

/* ---------------- 微信侧文件化 ---------------- */

/* 导出：写文件到 USER_DATA_PATH → shareFileMessage 发送到聊天。
 * 低版本（<2.11.0 无 shareFileMessage）降级为复制文本。 */
export async function exportCsvFile(tags: CounterTag[]): Promise<'shared' | 'copied'> {
  const csv = '\ufeff' + buildCsv(tags)
  const fileName = `一起数数-${todayStr()}.csv`
  const fs = Taro.getFileSystemManager()
  const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}`
  fs.writeFileSync(filePath, csv, 'utf8')

  if (Taro.shareFileMessage) {
    try {
      await Taro.shareFileMessage({ filePath, fileName } as any)
      return 'shared'
    } catch (e: any) {
      /* 用户取消分享不算失败 */
      if (e && /cancel/i.test(String(e.errMsg || e.message || ''))) return 'shared'
    }
  }
  /* 降级：复制文本并明确提示可能截断 */
  await Taro.setClipboardData({ data: csv })
  return 'copied'
}

/* 导入：从聊天选 CSV 文件 → 读文本 → 复用同一套解析器 */
export async function pickAndImportCsv(): Promise<ImportResult | null> {
  const res = await Taro.chooseMessageFile({ count: 1, type: 'file', extension: ['csv'] } as any)
  const file = res.tempFiles && res.tempFiles[0]
  if (!file) return null
  const fs = Taro.getFileSystemManager()
  const text = fs.readFileSync(file.path, 'utf8') as unknown as string
  return importCsv(String(text))
}
