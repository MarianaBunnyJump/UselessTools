import { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SheetShell from './SheetShell'
import { CHECK_BASE, CHECK_STEPS } from '../../utils/growth'
import { loadCheckin, doCheckin, signedToday } from '../../utils/checkin'
import './sheet.scss'
import './checkin-sheet.scss'

interface CheckinSheetProps {
  onClose: () => void
  /* 签到成功：通知首页刷新工分与等级条 */
  onChanged: () => void
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function CheckinSheet({ onClose, onChanged }: CheckinSheetProps) {
  const [tick, setTick] = useState(0)

  const view = useMemo(() => {
    const st = loadCheckin()
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = new Date(year, month, 1).getDay()
    const today = now.getDate()

    const cells: { n: number; cls: string }[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push({ n: 0, cls: 'nil' })
    for (let n = 1; n <= daysInMonth; n++) {
      const signed = st.days.indexOf(n) >= 0
      const cls = signed ? 'ci-day--on' : n === today ? 'ci-day--today' : n > today ? 'ci-day--future' : ''
      cells.push({ n, cls })
    }
    return { st, month, cells, signedCount: st.days.length }
  }, [tick])

  const done = signedToday()
  const streak = view.st.streak

  const sign = () => {
    const r = doCheckin()
    if (!r.ok) {
      Taro.showToast({ title: '今天已经签过了', icon: 'none' })
      return
    }
    setTick(t => t + 1)
    onChanged()
    const extra = r.stepBonus ? `（连签 ${r.streak} 天）` : ''
    Taro.showToast({ title: `签到成功 +${r.gain} 工分${extra}`, icon: 'none' })
  }

  return (
    <SheetShell
      title={`签到 · 连签 ${streak} 天`}
      onClose={onClose}
      footer={
        done ? (
          <View className='sheet-btn sheet-btn--ghost' onClick={onClose}>今天已签 · 明天再来</View>
        ) : (
          <View className='sheet-btn sheet-btn--main' onClick={sign}>签到领 {CHECK_BASE} 工分</View>
        )
      }
    >
      <View className='ci-meta'>
        {view.month + 1} 月 · 已签 {view.signedCount} 天
      </View>

      <View className='ci-grid'>
        {WEEKDAYS.map(w => (
          <View key={w} className='ci-cell'>
            <Text className='ci-wd'>{w}</Text>
          </View>
        ))}
        {view.cells.map((c, i) => (
          <View key={`${c.n}-${i}`} className='ci-cell'>
            <View className={`ci-day ${c.cls}`}>
              <Text className='ci-day-num'>{c.n || ''}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='ci-steps'>
        {CHECK_STEPS.map(s => (
          <View key={s.day} className={`ci-step ${streak >= s.day ? 'ci-step--hit' : ''}`}>
            <Text className='ci-step-day'>连 {s.day} 天</Text>
            <Text className='ci-step-bonus'>+{s.bonus} 工分</Text>
          </View>
        ))}
      </View>

      <View className='ci-sub'>每天签到 +{CHECK_BASE} 工分，连签天数越多，额外送的也越多。</View>
      <View className='sheet-foot-space' />
    </SheetShell>
  )
}
