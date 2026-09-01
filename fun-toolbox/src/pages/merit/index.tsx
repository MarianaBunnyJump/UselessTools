import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { FISH_STYLES } from '../../data/fishStyles'
import { ACHIEVEMENTS } from '../../data/achievements'
import { MERIT_PHRASES } from '../../data/meritPhrases'
import { getTheme } from '../../utils/theme'
import { playMeritSound, isSupported } from '../../utils/audio'
import { get, set, getDailyCount, bumpStreak } from '../../utils/storage'
import { randomOf } from '../../utils/format'
import NavBar from '../../components/NavBar'
import './index.scss'

interface FloatText {
  key: number
  x: number
  y: number
}

let floatKey = 0

export default function Merit() {
  const [theme] = useState(getTheme())
  const daily = getDailyCount('merit_today')
  const [todayCount, setTodayCount] = useState(daily.count)
  const [totalCount, setTotalCount] = useState(get<number>('merit_total', 0))
  const [style, setStyle] = useState(get<string>('merit_style', 'fish'))
  const [tapKey, setTapKey] = useState(0)
  const [floats, setFloats] = useState<FloatText[]>([])
  const [banner, setBanner] = useState('')

  useShareAppMessage(() => ({
    title: randomOf(MERIT_PHRASES).replace('N', String(todayCount)),
    path: '/pages/index/index'
  }))

  const currentStyle = FISH_STYLES.find(s => s.id === style) || FISH_STYLES[0]

  const checkAchievements = useCallback((total: number, dailyCount: number, streak: number) => {
    const unlocked = get<string[]>('merit_achievements', [])
    const fresh = ACHIEVEMENTS.filter(a => {
      if (unlocked.includes(a.id)) return false
      if (a.threshold.total !== undefined && total >= a.threshold.total) return true
      if (a.threshold.daily !== undefined && dailyCount >= a.threshold.daily) return true
      if (a.threshold.streak !== undefined && streak >= a.threshold.streak) return true
      return false
    })
    if (fresh.length > 0) {
      fresh.forEach(a => unlocked.push(a.id))
      set('merit_achievements', unlocked)
      const name = fresh[fresh.length - 1]
      setBanner(`${name.icon} 成就解锁：${name.name}`)
      setTimeout(() => setBanner(''), 2600)
    }
  }, [])

  const handleTap = (e: any) => {
    const d = getDailyCount('merit_today')
    const nextDaily = d.count + 1
    set('merit_today', { date: d.date, count: nextDaily })
    const nextTotal = get<number>('merit_total', 0) + 1
    set('merit_total', nextTotal)

    const streak = bumpStreak('merit_last_date', 'merit_streak_days')

    setTodayCount(nextDaily)
    setTotalCount(nextTotal)
    setTapKey(k => k + 1)

    if (isSupported()) {
      playMeritSound(style)
    }

    let x = 375
    let y = 400
    try {
      const touch = e.changedTouches && e.changedTouches[0]
      if (touch) {
        x = touch.clientX
        y = touch.clientY
      }
    } catch (err) {
      /* 用默认位置 */
    }
    const key = ++floatKey
    setFloats(prev => [...prev, { key, x, y }])
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.key !== key))
    }, 1100)

    checkAchievements(nextTotal, nextDaily, streak)
  }

  const pickStyle = (id: string) => {
    setStyle(id)
    set('merit_style', id)
    playMeritSound(id)
  }

  const goAchievement = () => {
    Taro.navigateTo({ url: '/pages/merit/achievement' })
  }

  const rankPercent = Math.min(99, todayCount)

  return (
    <View className='page-root merit-root' style={{ background: theme.bg }}>
      <NavBar
        title='电子木鱼'
        right={
          <Text className='merit-ach-btn' onClick={goAchievement}>
            🏆
          </Text>
        }
      />

      <View className='merit-count-area'>
        <View className='merit-count-label'>今日功德</View>
        <View className='merit-today'>{todayCount}</View>
        <View className='merit-total'>累计 {totalCount.toLocaleString('en-US')}</View>
      </View>

      <View className='merit-tap-area'>
        {floats.map(f => (
          <Text key={f.key} className='merit-float' style={{ left: `${f.x}px`, top: `${f.y - 40}px` }}>
            功德 +1
          </Text>
        ))}

        <View key={`stick-${tapKey}`} className='merit-stick-wrap'>
          <View className='merit-stick' />
          <View className='merit-stick-ball' />
        </View>

        <View className='merit-fish-area' onClick={handleTap}>
          <View key={`fish-${tapKey}`} className='merit-fish-inner'>
            <Text className='merit-fish-icon'>{currentStyle.icon}</Text>
          </View>
        </View>
      </View>

      <View className='merit-styles'>
        {FISH_STYLES.map(s => (
          <View
            key={s.id}
            className={`merit-style-card ${style === s.id ? 'merit-style-card--active' : ''}`}
            onClick={() => pickStyle(s.id)}
          >
            <Text className='merit-style-icon'>{s.icon}</Text>
            <Text className='merit-style-name'>{s.name}</Text>
            <Text className='merit-style-desc'>{s.desc}</Text>
          </View>
        ))}
      </View>

      <View className='merit-rank'>
        {todayCount > 0 ? `今日已超过 ${rankPercent}% 的人` : '敲一下，功德 +1'}
      </View>

      {banner !== '' && (
        <View className='merit-banner'>
          <Text className='merit-banner-text'>{banner}</Text>
        </View>
      )}
    </View>
  )
}
