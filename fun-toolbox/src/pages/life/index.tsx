import { View, Text, Picker } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useEffect, useMemo } from 'react'
import { HOLIDAYS, type HolidayRange } from '../../data/holidays'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import { formatNumber, daysBetween, countWeekdays, parseDate, todayStr } from '../../utils/format'
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
  const [expectancy, setExpectancy] = useState(get<number>('life_expectancy', LIFE_END_DEFAULT))
  const [now, setNow] = useState(Date.now())
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  useShareAppMessage(() => ({
    title: '看看你还剩多少个周五',
    path: '/pages/index/index'
  }))

  const stats = useMemo(() => {
    if (!birthdate) return null
    const birth = parseDate(birthdate)
    const today = new Date()
    const endDate = new Date(birth)
    endDate.setFullYear(birth.getFullYear() + expectancy)
    endDate.setHours(23, 59, 59, 999)

    const livedDays = daysBetween(birth, today)
    const totalDays = Math.round(expectancy * 365.25)
    const remainDays = daysBetween(today, endDate)
    const remainMs = endDate.getTime() - now
    const remainHours = Math.floor(remainMs / 3600000)
    const remainFridays = countWeekdays(today, endDate, 5)
    const remainWeeks = Math.floor(remainDays / 7)
    const remainMonths = Math.floor(remainDays / 30.44)
    const percent = Math.min(100, Math.max(0, (livedDays / totalDays) * 100))

    return { remainDays, remainHours, remainFridays, remainWeeks, remainMonths, percent, livedDays, totalDays }
  }, [birthdate, expectancy, now])

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

  const onExpectancyChange = e => {
    const val = Number(e.detail.value)
    setExpectancy(val)
    set('life_expectancy', val)
  }

  const goShare = () => {
    Taro.navigateTo({ url: '/pages/life/share' })
  }

  const ageList = Array.from({ length: 61 }, (_, i) => `${60 + i} 岁`)

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
        <View className='life-hero-num'>{formatNumber(stats!.remainFridays)}</View>
        <View className='life-hero-unit'>个周五</View>
      </View>

      <View className='life-card common-card'>
        <View className='life-row'>
          <Text className='life-row-label'>剩余天数</Text>
          <Text className='life-row-value'>{formatNumber(stats!.remainDays)} 天</Text>
        </View>
        <View className='life-row'>
          <Text className='life-row-label'>剩余月数</Text>
          <Text className='life-row-value'>{formatNumber(stats!.remainMonths)} 个月</Text>
        </View>
        <View className='life-row'>
          <Text className='life-row-label'>剩余周数</Text>
          <Text className='life-row-value'>{formatNumber(stats!.remainWeeks)} 周</Text>
        </View>
        <View className='life-row'>
          <Text className='life-row-label'>剩余小时</Text>
          <Text className='life-row-value'>{formatNumber(stats!.remainHours)} 小时</Text>
        </View>

        <View className='life-progress'>
          <View className='life-progress-head'>
            <Text>已度过 {formatNumber(stats!.livedDays)} / {formatNumber(stats!.totalDays)} 天</Text>
            <Text className='life-progress-pct'>{stats!.percent.toFixed(1)}%</Text>
          </View>
          <View className='life-progress-track'>
            <View className='life-progress-fill' style={{ width: `${stats!.percent}%` }} />
          </View>
        </View>

        <Picker mode='selector' range={ageList} value={expectancy - 60} onChange={onExpectancyChange}>
          <View className='life-expectancy'>
            <Text>预期寿命 {expectancy} 岁</Text>
            <Text className='life-setup-arrow'>▸</Text>
          </View>
        </Picker>
      </View>

      {holiday && (
        <View className='life-holiday'>
          距 {holiday.holiday.name}还有 {holiday.days} 天，先把这个假期过好
        </View>
      )}

      <View className='btn-primary life-share' onClick={goShare}>
        生成分享卡片
      </View>
    </View>
  )
}
