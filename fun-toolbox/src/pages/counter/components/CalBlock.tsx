import { View, Text, Image } from '@tarojs/components'
import type { CounterTag } from '../../../utils/counterStore'
import { colorOf } from '../../../utils/counterStore'
import {
  buildMonthCells,
  dayEntries,
  fmtAmt,
  fmtCN,
  weekOf,
  relDay,
  type Forecast
} from '../../../utils/counterCalc'
import { tagColor, photoSrc } from './BigCard'

/* 月历 + 当日明细（并入同一张卡） */
interface CalBlockProps {
  tag: CounterTag
  calY: number
  calM: number
  selDate: string
  fc: Forecast | null
  onPickDay: (ds: string) => void
  onCalNav: (dir: -1 | 1) => void
  onOpenEdit: (entryId: string) => void
  onOpenAdd: () => void
}

export default function CalBlock({ tag, calY, calM, selDate, fc, onPickDay, onCalNav, onOpenEdit, onOpenAdd }: CalBlockProps) {
  const c = tagColor(tag)
  const photo = photoSrc(tag)
  const etaDate = fc && !fc.done && !fc.stall ? fc.date : undefined
  const cells = buildMonthCells(tag, calY, calM, etaDate)
  const entries = dayEntries(tag, selDate)
  const sum = entries.reduce((s, e) => s + e.amount, 0)
  const rel = relDay(selDate)

  /* 头像颜色：按署名查成员，自己固定灰棕 */
  const avaColor = (name: string) => {
    if (name === '我') return '#8D7B70'
    const m = tag.members.find(x => x.name === name)
    return m ? colorOf(m.colorIdx).hex : '#8D7B70'
  }

  return (
    <View className={`cal ${photo ? 'has-photo' : ''}`}>
      {photo ? (
        <>
          <Image className='cal-photo' src={photo} mode='aspectFill' />
          <View className='cal-photo-mask' />
        </>
      ) : null}

      <View className='cal-head'>
        <Text className='cal-head-title'>{calY}年{calM}月</Text>
        <View className='cal-nav'>
          <View className='cal-nav-btn' onClick={() => onCalNav(-1)}>
            <Text>‹</Text>
          </View>
          <View className='cal-nav-btn' onClick={() => onCalNav(1)}>
            <Text>›</Text>
          </View>
        </View>
      </View>

      <View className='cal-weekrow'>
        {['一', '二', '三', '四', '五', '六', '日'].map(w => (
          <Text key={w}>{w}</Text>
        ))}
      </View>

      <View className='cal-grid'>
        {cells.map((cell, i) =>
          cell.blank ? (
            <View key={`b${i}`} className='cal-cell blank' />
          ) : (
            <View
              key={cell.ds}
              className={`cal-cell${cell.isToday ? ' today' : ''}${cell.ds === selDate ? ' sel' : ''}${cell.isEta ? ' eta' : ''}${cell.isFuture ? ' future' : ''}`}
              style={cell.ds === selDate ? { background: c.hex } : undefined}
              onClick={() => onPickDay(cell.ds)}
            >
              {cell.hasStar ? <Text className='cal-star'>★</Text> : null}
              <Text className='cal-d'>{cell.day}</Text>
              <Text className={`cal-s ${cell.has ? 'has' : ''}`}>{cell.has ? cell.sum : ''}</Text>
            </View>
          )
        )}
      </View>

      {/* ---- 当日明细 ---- */}
      <View className='day-block'>
        <View className='day-sep' />
        <View className='day-head'>
          <Text className='day-head-title'>
            {fmtCN(selDate)} · 周{weekOf(selDate)}{rel ? ` · ${rel}` : ''}
          </Text>
          <Text className='day-sum'>
            合计 <Text className='day-sum-num' style={{ color: c.hex }}>{sum}</Text> {tag.unit}
          </Text>
        </View>

        <View className='entry-list'>
          {entries.length ? (
            entries.map(e => (
              <View key={e.id} className='entry' onClick={() => onOpenEdit(e.id)}>
                <Text className='e-time'>{e.time}</Text>
                <View className='e-main'>
                  <Text className={`e-amt ${e.amount < 0 ? 'neg' : ''}`}>{fmtAmt(e.amount)}</Text>
                  {e.note ? <Text className='e-note'>{e.note}</Text> : null}
                </View>
                <Text className='e-by' style={{ background: avaColor(e.by) }}>{(e.by || '我').slice(0, 1)}</Text>
                <Text className='e-chev'>›</Text>
              </View>
            ))
          ) : (
            <View className='day-empty'>
              <Text>这天还没记过，点下面记录。</Text>
            </View>
          )}
        </View>

        <View className='add-card' onClick={onOpenAdd}>
          <Text className='add-card-icon'>+</Text>
          <Text>再记录一下</Text>
        </View>
      </View>
    </View>
  )
}
