import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { ACHIEVEMENTS, type Achievement } from '../../data/achievements'
import { getTheme } from '../../utils/theme'
import { get, getDailyCount } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './achievement.scss'

/* 各类成就的进度文案 */
function progressOf(
  a: Achievement,
  s: { total: number; daily: number; days: number; night: number; maxCombo: number }
): string {
  const t = a.threshold
  if (t.total !== undefined) {
    return `${Math.min(s.total, t.total).toLocaleString('en-US')} / ${t.total.toLocaleString('en-US')}`
  }
  if (t.daily !== undefined) {
    return `今日 ${Math.min(s.daily, t.daily)} / ${t.daily}`
  }
  if (t.days !== undefined) {
    return `累计 ${Math.min(s.days, t.days)} / ${t.days} 天`
  }
  if (t.night !== undefined) {
    return `深夜 ${Math.min(s.night, t.night)} / ${t.night}`
  }
  if (t.combo !== undefined) {
    return `最高 ${Math.min(s.maxCombo, t.combo)} / ${t.combo}`
  }
  return ''
}

export default function AchievementPage() {
  const [theme] = useState(getTheme())
  const [total] = useState(get<number>('merit_total', 0))
  const [daily] = useState(getDailyCount('merit_today').count)
  const [days] = useState(get<number>('merit_days_total', 0))
  const [night] = useState(getDailyCount('merit_night_today').count)
  const [maxCombo] = useState(get<number>('merit_max_combo', 0))
  const unlocked = get<string[]>('merit_achievements', [])
  const unlockedCount = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).length

  return (
    <View className='page-root ach-root' style={{ background: theme.bg }}>
      <NavBar title='功德成就' />

      <View className='ach-summary common-card'>
        <View className='ach-summary-num'>
          {unlockedCount}
          <Text className='ach-summary-slash'> / {ACHIEVEMENTS.length}</Text>
        </View>
        <View className='ach-summary-label'>已解锁成就</View>
        <View className='ach-summary-stats'>
          累计功德 {total.toLocaleString('en-US')} · 累计使用 {days} 天 · 最高连击 ×{maxCombo}
        </View>
      </View>

      <View className='ach-grid'>
        {ACHIEVEMENTS.map(a => {
          const done = unlocked.includes(a.id)
          return (
            <View key={a.id} className={`ach-card ${done ? 'ach-card--done' : ''}`}>
              <View className='ach-card-icon'>
                <Text>{done ? a.icon : '🔒'}</Text>
              </View>
              <View className='ach-card-name'>{a.name}</View>
              <View className='ach-card-desc'>{a.desc}</View>
              <View className='ach-card-progress'>{progressOf(a, { total, daily, days, night, maxCombo })}</View>
            </View>
          )
        })}
      </View>

      <View className='ach-tip'>继续敲木鱼，解锁更多成就</View>
    </View>
  )
}
