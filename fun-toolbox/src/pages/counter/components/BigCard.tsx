import { View, Text, Image } from '@tarojs/components'
import type { CounterTag } from '../../../utils/counterStore'
import { colorOf, PHOTO_COLOR_IDX } from '../../../utils/counterStore'
import { allSum, monthSum, lastEntry, forecast, fmtAmt, fmtCN, relDay } from '../../../utils/counterCalc'

const CUSTOM_COL = { name: '自定义', hex: '#4A3B32', deep: ['#4A3B32', '#2C211B'], soft: '#EFE6DA' }

export function tagColor(t: CounterTag) {
  return t.colorIdx === PHOTO_COLOR_IDX && (t.photo || t.photoUrl)
    ? CUSTOM_COL
    : colorOf(t.colorIdx)
}

export function photoSrc(t: CounterTag): string {
  return t.photo || t.photoUrl || ''
}

/* 大卡：累计 + 本月 + 目标进度/最近一条 + 记录/标记历史按钮 */
interface BigCardProps {
  tag: CounterTag
  calY: number
  calM: number
  cloud: boolean
  popKey: number
  onOpenAdd: () => void
  onOpenAnn: () => void
}

export default function BigCard({ tag, calY, calM, cloud, popKey, onOpenAdd, onOpenAnn }: BigCardProps) {
  const c = tagColor(tag)
  const last = lastEntry(tag)
  const fc = forecast(tag)
  const members = tag.members
  const photo = photoSrc(tag)

  return (
    <View className='main-block'>
      {photo ? (
        <>
          <Image className='mb-photo' src={photo} mode='aspectFill' />
          <View className='mb-photo-mask' />
        </>
      ) : (
        <View className='mb-bg' style={{ background: `linear-gradient(180deg, ${c.deep[0]}, ${c.deep[1]})` }} />
      )}

      <View className='mb-top'>
        <Text className='mb-title'>{tag.name}</Text>
        <View className='mb-pills'>
          {cloud && tag.synced ? (
            <Text className='mb-pill'>☁ 已同步</Text>
          ) : (
            <Text className='mb-pill'>仅本机</Text>
          )}
          {members.length ? (
            <View className='mb-pill'>
              <View className='m-members'>
                {members.slice(0, 3).map(m => (
                  <Text key={m.id} className='m-ava-mini' style={{ background: colorOf(m.colorIdx).hex }}>
                    {m.name.slice(0, 1)}
                  </Text>
                ))}
              </View>
              <Text>{members.length} 人</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className='mb-num'>
        <Text className='mb-num-lbl'>累计</Text>
        <Text className={`mb-num-val ${popKey ? 'pop' : ''}`} key={popKey}>
          {allSum(tag)}
        </Text>
        <Text className='mb-num-unit'>{tag.unit}</Text>
      </View>

      <View className='mb-line'>
        <Text>本月 {monthSum(tag, calY, calM)}</Text>
      </View>

      {fc ? (
        <View className='mb-goal'>
          <View className='g-bar'>
            <View
              className='g-bar-fill'
              style={{ width: `${Math.min(100, Math.round((fc.total / (tag.target || 1)) * 100))}%` }}
            />
          </View>
          <View className='g-txt'>
            {fc.done ? (
              <Text className='g-done'>🎉 已达成目标 {tag.target} {tag.unit}，立个纪念日吧</Text>
            ) : fc.stall ? (
              <Text className='g-line'>
                目标 {tag.target} {tag.unit} · 还差 <Text className='g-b'>{fc.remaining}</Text>，最近两周还没有进展
              </Text>
            ) : (
              <Text className='g-line'>
                <Text className='g-b'>{fc.total}</Text>/{tag.target} {tag.unit} · 预计 <Text className='g-b'>{fc.date ? `${Number(fc.date.split('-')[1])}月${Number(fc.date.split('-')[2])}日` : ''}</Text> 达成
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View className='mb-stamp'>
          <Text className='mb-stamp-text'>
            {last
              ? `最近一条 · ${fmtCN(last.date)}${relDay(last.date) ? `（${relDay(last.date)}）` : ''} ${last.time} · ${last.by} ${fmtAmt(last.amount)} ${tag.unit}`
              : '这一天还没记过，点「记录」开始'}
          </Text>
        </View>
      )}

      <View className='mb-actions2'>
        <View className='mb-add' onClick={onOpenAdd}>
          <Text className='mb-add-icon'>+</Text>
          <Text>记录</Text>
        </View>
        <View className='mb-ann' onClick={onOpenAnn}>
          <Text className='mb-ann-star'>★</Text>
          <Text>标记历史</Text>
        </View>
      </View>
    </View>
  )
}
