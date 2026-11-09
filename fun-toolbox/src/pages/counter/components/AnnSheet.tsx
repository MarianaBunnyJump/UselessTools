import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Sheet from './Sheet'
import type { CounterTag } from '../../../utils/counterStore'
import { pad, fmtCN, weekOf } from '../../../utils/counterCalc'

/* 标记历史浮层：时刻 + 固定高度（198px）内部滚动 + 两步删除 */
interface AnnSheetProps {
  tag: CounterTag
  selDate: string
  onMark: (time: string) => void
  onDelete: (markId: string) => void
  onClose: () => void
}

const CHIPS = ['08:00', '12:00', '18:00', '21:00']

export default function AnnSheet({ tag, selDate, onMark, onDelete, onClose }: AnnSheetProps) {
  const [h, setH] = useState(12)
  const [m, setM] = useState(0)
  const [confirmId, setConfirmId] = useState('')

  const cur = `${pad(h)}:${pad(m)}`
  const list = [...tag.anniversaries].sort((a, b) => (a.date < b.date ? -1 : 1))

  const stepTime = (k: 'h' | 'm', d: number) => {
    if (k === 'h') setH(((h + d) % 24 + 24) % 24)
    else setM(((m + d) % 60 + 60) % 60)
  }

  const handleDelete = (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id)
      Taro.showToast({ title: '再点一下确认删除', icon: 'none', duration: 1700 })
      return
    }
    onDelete(id)
  }

  return (
    <Sheet title={`「${tag.name}」的纪念日`} onClose={onClose} scroll={false}>
      <View className='ann-lead'>
        <Text>记到具体时刻：那天是几点完成的那一刻。</Text>
      </View>

      <View className='form-field'>
        <Text className='form-label'>时刻</Text>
        <View className='chip-row'>
          {CHIPS.map(ch => (
            <View key={ch} className={`qchip ${cur === ch ? 'on' : ''}`} onClick={() => { const [hh, mm] = ch.split(':').map(Number); setH(hh); setM(mm) }}>
              <Text>{ch}</Text>
            </View>
          ))}
        </View>
        <View className='tm-row'>
          <View className='tm-box'>
            <View className='tm-btn' onClick={() => stepTime('h', -1)}><Text>−</Text></View>
            <Text className='tm-v'>{pad(h)}</Text>
            <View className='tm-btn' onClick={() => stepTime('h', 1)}><Text>+</Text></View>
          </View>
          <Text className='tm-colon'>:</Text>
          <View className='tm-box'>
            <View className='tm-btn' onClick={() => stepTime('m', -5)}><Text>−</Text></View>
            <Text className='tm-v'>{pad(m)}</Text>
            <View className='tm-btn' onClick={() => stepTime('m', 5)}><Text>+</Text></View>
          </View>
        </View>
      </View>

      <View className='ann-mark-btn' onClick={() => onMark(cur)}>
        <Text className='ann-mark-star'>★</Text>
        <Text>把 {fmtCN(selDate)} {cur} 标记为历史</Text>
      </View>

      {list.length ? (
        <ScrollView className='ann-list' scrollY>
          {list.map(a => (
            <View className='ann-item' key={a.id}>
              <View className='a-star'><Text>★</Text></View>
              <View className='a-info'>
                <Text className='a-label'>{a.label}</Text>
                <Text className='a-sub'>{a.date} · 周{weekOf(a.date)} · {a.time || '12:00'} · 可删除</Text>
              </View>
              <Text className='a-val'>当天 {a.valueAtMark} {tag.unit}</Text>
              <View className={`a-del ${confirmId === a.id ? 'confirm' : ''}`} onClick={() => handleDelete(a.id)}>
                <Text>×</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className='ann-empty'>
          <Text>还没有纪念日。</Text>
          <Text>挑一个有意义的日子，比如坚持满一周的那天。</Text>
        </View>
      )}
    </Sheet>
  )
}
