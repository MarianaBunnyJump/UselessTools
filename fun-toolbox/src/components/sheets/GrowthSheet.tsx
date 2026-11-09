import { useState } from 'react'
import { View, Text, Slider } from '@tarojs/components'
import SheetShell from './SheetShell'
import { LV_NAME, LV_NEED, LV_REWARD, MAX_LEVEL, getPoints, lvOf, lvProgress } from '../../utils/growth'
import './sheet.scss'
import './growth-sheet.scss'

interface GrowthSheetProps {
  onClose: () => void
  /* 跳完整等级页（保留旧页面入口，避免功能断链） */
  onOpenLevelPage: () => void
}

export default function GrowthSheet({ onClose, onOpenLevelPage }: GrowthSheetProps) {
  const points = getPoints()
  const myLv = lvOf(points)
  const [preview, setPreview] = useState(myLv)
  const reward = LV_REWARD[Math.max(0, Math.min(MAX_LEVEL, preview) - 1)]
  const previewNeed = LV_NEED[preview - 1] || 0

  let tag = ''
  let tagCls = 'gr-tag--wait'
  if (preview === myLv) {
    tag = '当前等级'
    tagCls = 'gr-tag--now'
  } else if (preview < myLv) {
    tag = '已解锁'
    tagCls = 'gr-tag--ok'
  } else {
    tag = `差 ${Math.max(0, previewNeed - points)}`
  }

  return (
    <SheetShell
      title='等级成长'
      onClose={onClose}
      footer={
        <>
          <View className='sheet-btn sheet-btn--ghost' onClick={onOpenLevelPage}>等级页</View>
          <View className='sheet-btn sheet-btn--main' onClick={onClose}>知道了</View>
        </>
      }
    >
      <View className='gr-now'>
        <Text className='gr-lv'>🏅 Lv.{myLv} {LV_NAME[myLv - 1]}</Text>
        <Text className='gr-pg'>
          {points} 工分{myLv >= MAX_LEVEL ? '' : ` · 下一级 ${LV_NEED[myLv]}`}
        </Text>
      </View>
      <View className='gr-track'>
        <View className='gr-fill' style={{ width: `${lvProgress(points)}%` }} />
      </View>

      <View className='gr-slider'>
        <Slider
          min={1}
          max={MAX_LEVEL}
          step={1}
          value={preview}
          activeColor='#FF9800'
          backgroundColor='rgba(74,59,50,0.14)'
          blockSize={22}
          blockColor='#FF9800'
          onChanging={e => setPreview(e.detail.value)}
          onChange={e => setPreview(e.detail.value)}
        />
      </View>
      <View className='gr-ticks'>
        {Array.from({ length: MAX_LEVEL }, (_, i) => (
          <Text
            key={i}
            className={`gr-tick ${i + 1 === preview ? 'gr-tick--on' : i + 1 < myLv ? 'gr-tick--done' : ''}`}
            onClick={() => setPreview(i + 1)}
          >
            Lv{i + 1}
          </Text>
        ))}
      </View>

      <View className='gr-pv'>
        <View className='gr-pv-ic'>
          <Text className='gr-pv-emoji'>{reward.icon}</Text>
        </View>
        <View className='gr-pv-mid'>
          <Text className='gr-pv-t'>Lv.{preview} {LV_NAME[preview - 1]}</Text>
          <Text className='gr-pv-d'>{reward.t} · {reward.d}</Text>
        </View>
        <Text className={`gr-tag ${tagCls}`}>{tag}</Text>
      </View>

      <View className='gr-sub'>拖动上面的滑杆，看每一级能拿到什么。</View>
      <View className='sheet-foot-space' />
    </SheetShell>
  )
}
