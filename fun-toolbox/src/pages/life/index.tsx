import { View, Text, Picker } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { HOLIDAYS, type HolidayRange } from '../../data/holidays'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import { formatNumber, daysBetween, parseDate, todayStr } from '../../utils/format'
import { computeLifeStats, lifeMetrics } from '../../utils/lifeStats'
import NavBar from '../../components/NavBar'
import './index.scss'

const LIFE_END_DEFAULT = 77

function nextHoliday(): { holiday: HolidayRange; days: number } | null {
  const today = new Date()
  for (const h of HOLIDAYS) {
    const start = parseDate(h.start)
    const days = daysBetween(today, start)
    if (days >= 0) return { holiday: h, days }
  }
  return null
}

export default function Life() {
  const [theme] = useState(getTheme())
  const [birthdate, setBirthdate] = useState(get<string>('life_birthdate', ''))
  const expectancy = get<number>('life_expectancy', LIFE_END_DEFAULT)
  const [editing, setEditing] = useState(false)

  useShareAppMessage(() => ({
    title: '看看你还剩多少个周五',
    path: '/pages/index/index'
  }))

  const stats = useMemo(
    () => (birthdate ? computeLifeStats(birthdate, expectancy) : null),
    [birthdate, expectancy]
  )
  const metrics = useMemo(() => (stats ? lifeMetrics(stats) : []), [stats])

  const holiday = useMemo(() => nextHoliday(), [])

  const onBirthdateChange = e => {
    const val = e.detail.value as string
    if (parseDate(val).getTime() > Date.now()) {
      Taro.showToast({ title: '生日不能在未来', icon: 'none' })
      return
    }
    setBirthdate(val)
    set('life_birthdate', val)
    setEditing(false)
  }

  const goShare = (metric: string) => {
    Taro.navigateTo({ url: `/pages/life/share?metric=${metric}` })
  }

  /* ---------- 首次引导 ---------- */
  if (!birthdate || editing) {
    return (
      <View className='page-root life-root' style={{ background: theme.bg }}>
        <NavBar title='人生倒计时' />
        <View className='life-setup'>
          <Text className='life-setup-icon'>⏳</Text>
          <View className='life-setup-title'>先告诉我你的生日</View>
          <View className='life-setup-sub'>数据只存在你的手机里，不会上传</View>

          <Picker mode='date' value={birthdate || '1998-01-01'} end={todayStr()} onChange={onBirthdateChange}>
            <View className='life-setup-picker'>
              <Text>{birthdate || '选择生日日期'}</Text>
              <Text className='life-setup-arrow'>▸</Text>
            </View>
          </Picker>
        </View>
      </View>
    )
  }

  return (
    <View className='page-root life-root' style={{ background: theme.bg }}>
      <NavBar
        title='人生倒计时'
        right={
          <Text className='life-edit-btn' onClick={() => setEditing(true)}>
            ✏️
          </Text>
        }
      />

      <View className='life-hero'>
        <View className='life-hero-label'>你的人生还剩</View>
        <View className='life-hero-num'>{formatNumber(stats!.remainDays)}</View>
        <View className='life-hero-unit'>天 ≈ {formatNumber(stats!.remainHours)} 小时</View>
      </View>

      <View className='life-progress common-card'>
        <View className='life-progress-head'>
          <Text>已度过 {formatNumber(stats!.livedDays)} / {formatNumber(stats!.totalDays)} 天</Text>
          <Text className='life-progress-pct'>{stats!.percent.toFixed(1)}%</Text>
        </View>
        <View className='life-progress-track'>
          <View className='life-progress-fill' style={{ width: `${stats!.percent}%` }} />
        </View>
      </View>

      <View className='life-grid'>
        {metrics.map((m, i) => (
          <View
            key={m.id}
            className={`life-metric-card ${i === metrics.length - 1 && metrics.length % 2 === 1 ? 'life-metric-card--wide' : ''}`}
          >
            <View className='life-metric-value'>{formatNumber(m.value)}</View>
            <View className='life-metric-unit'>{m.unit}</View>
            <View className='life-metric-label'>{m.label}</View>
            <View className='life-metric-share' onClick={() => goShare(m.id)}>
              分享 ↗
            </View>
          </View>
        ))}
      </View>

      {holiday && (
        <View className='life-holiday'>
          距 {holiday.holiday.name}还有 {holiday.days} 天，先把这个假期过好
        </View>
      )}

      <View className='life-footnote'>按预期寿命 {expectancy} 岁估算 · 仅供一乐</View>
    </View>
  )
}
