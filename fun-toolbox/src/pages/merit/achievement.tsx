import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { ACHIEVEMENTS, type Achievement } from '../../data/achievements'
import { getTheme } from '../../utils/theme'
import { get, getDailyCount } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './achievement.scss'

function progressOf(a: Achievement, total: number, daily: number, streak: number): string {
  if (a.threshold.total !== undefined) {
    return `${Math.min(total, a.threshold.total).toLocaleString('en-US')} / ${a.threshold.total.toLocaleString('en-US')}`
  }
  if (a.threshold.daily !== undefined) {
    return `今日 ${Math.min(daily, a.threshold.daily)} / ${a.threshold.daily}`
  }
  return `连续 ${Math.min(streak, a.threshold.streak!)} / ${a.threshold.streak} 天`
}

export default function AchievementPage() {
  const [theme] = useState(getTheme())
  const [total] = useState(get<number>('merit_total', 0))
  const [daily] = useState(getDailyCount('merit_today').count)
  const [streak] = useState(get<number>('merit_streak_days', 0))
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
          累计功德 {total.toLocaleString('en-US')} · 连续 {streak} 天
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
              <View className='ach-card-progress'>{progressOf(a, total, daily, streak)}</View>
            </View>
          )
        })}
      </View>

      <View className='ach-tip'>继续敲木鱼，解锁更多成就</View>
    </View>
  )
}
