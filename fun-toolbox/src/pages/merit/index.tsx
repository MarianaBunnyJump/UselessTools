import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useCallback, useRef } from 'react'
import { FISH_STYLES, type FishStyle } from '../../data/fishStyles'
import { ACHIEVEMENTS } from '../../data/achievements'
import { MERIT_PHRASES } from '../../data/meritPhrases'
import { getTheme } from '../../utils/theme'
import { playMeritSound, isSupported } from '../../utils/audio'
import { get, set, getDailyCount, bumpStreak } from '../../utils/storage'
import { randomOf } from '../../utils/format'
import Muyu from '../../components/Muyu'
import NavBar from '../../components/NavBar'
import SharePoster from '../../components/SharePoster'
import './index.scss'

interface FloatText {
  key: number
  x: number
  y: number
}

let floatKey = 0

/* 连击判定窗口：窗口内再敲算连击，超时归零 */
const COMBO_WINDOW = 1200
const COMBO_MIN = 3

/* 老数据里存过 'fish'（小鱼形象），迁移到木鱼 */
const LEGACY_STYLE_MAP: Record<string, string> = { fish: 'muyu' }

function loadStyle(): string {
  const saved = get<string>('merit_style', 'muyu')
  return LEGACY_STYLE_MAP[saved] || saved
}

export default function Merit() {
  const [theme] = useState(getTheme())
  const daily = getDailyCount('merit_today')
  const [todayCount, setTodayCount] = useState(daily.count)
  const [totalCount, setTotalCount] = useState(get<number>('merit_total', 0))
  const [style, setStyle] = useState(loadStyle())
  const [tapKey, setTapKey] = useState(0)
  const [floats, setFloats] = useState<FloatText[]>([])
  const [banner, setBanner] = useState('')
  const [unlockedIds, setUnlockedIds] = useState<string[]>(get<string[]>('merit_achievements', []))
  const [combo, setCombo] = useState(0)
  const comboRef = useRef(0)
  const lastTapRef = useRef(0)
  const comboTimerRef = useRef<any>(null)

  useShareAppMessage(() => ({
    title: randomOf(MERIT_PHRASES).replace('N', String(todayCount)),
    path: '/pages/index/index'
  }))

  const currentStyle = FISH_STYLES.find(s => s.id === style) || FISH_STYLES[0]

  const isStyleUnlocked = (s: FishStyle) => !s.unlockBy || unlockedIds.includes(s.unlockBy)

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
      setUnlockedIds([...unlocked])
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

    /* 连击：快速连敲时数字跳动 + 轻微震动，强化爽感 */
    const now = Date.now()
    const nextCombo = now - lastTapRef.current <= COMBO_WINDOW ? comboRef.current + 1 : 1
    lastTapRef.current = now
    comboRef.current = nextCombo
    setCombo(nextCombo)
    if (nextCombo >= COMBO_MIN) {
      try {
        Taro.vibrateShort({ type: 'light' })
      } catch (err) {
        /* H5 或低版本基础库不支持，忽略 */
      }
    }
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
    comboTimerRef.current = setTimeout(() => {
      comboRef.current = 0
      setCombo(0)
    }, COMBO_WINDOW)

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

  const pickStyle = (s: FishStyle) => {
    if (s.coming) {
      Taro.showToast({ title: '敬请期待后续版本', icon: 'none' })
      return
    }
    if (!isStyleUnlocked(s)) {
      Taro.showToast({ title: `解锁条件：${s.lockHint}`, icon: 'none', duration: 1800 })
      return
    }
    setStyle(s.id)
    set('merit_style', s.id)
    playMeritSound(s.id)
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
        {combo >= COMBO_MIN && (
          <View key={combo} className='merit-combo'>
            <Text className='merit-combo-num'>×{combo}</Text>
            <Text className='merit-combo-label'>连击</Text>
          </View>
        )}

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
            {currentStyle.id === 'muyu' ? (
              <Muyu size={330} />
            ) : (
              <Text className='merit-fish-icon'>{currentStyle.icon}</Text>
            )}
          </View>
        </View>
      </View>

      <View className='merit-styles'>
        {FISH_STYLES.map(s => {
          const unlocked = isStyleUnlocked(s)
          return (
            <View
              key={s.id}
              className={[
                'merit-style-card',
                style === s.id && unlocked ? 'merit-style-card--active' : '',
                s.coming ? 'merit-style-card--coming' : '',
                s.locked && !unlocked ? 'merit-style-card--locked' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => pickStyle(s)}
            >
              <View className='merit-style-icon-wrap'>
                {s.id === 'muyu' && !s.coming ? <Muyu size={46} /> : <Text className='merit-style-icon'>{s.icon}</Text>}
                {(s.locked && !unlocked) || s.coming ? (
                  <Text className='merit-style-lock'>{s.coming ? '🚧' : '🔒'}</Text>
                ) : null}
              </View>
              <Text className='merit-style-name'>{s.name}</Text>
            </View>
          )
        })}
      </View>

      <SharePoster
        canvasId='meritShareCanvas'
        toolName='电子木鱼'
        accent={theme.accent}
        hero={String(todayCount)}
        heroUnit='今日功德'
        lines={[`累计功德 ${totalCount.toLocaleString('en-US')}`]}
      />

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
