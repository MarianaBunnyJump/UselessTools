import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { LIFE_PHRASES } from '../../data/lifePhrases'
import { getTheme } from '../../utils/theme'
import { get } from '../../utils/storage'
import { formatNumber, daysBetween, countWeekdays, parseDate } from '../../utils/format'
import NavBar from '../../components/NavBar'
import './share.scss'

export default function LifeShare() {
  const [theme] = useState(getTheme())
  const birthdate = get<string>('life_birthdate', '')
  const expectancy = get<number>('life_expectancy', 77)

  const phrase = useMemo(() => {
    const idx = new Date().getDate() % LIFE_PHRASES.length
    return LIFE_PHRASES[idx]
  }, [])

  const fridays = useMemo(() => {
    if (!birthdate) return 0
    const birth = parseDate(birthdate)
    const endDate = new Date(birth)
    endDate.setFullYear(birth.getFullYear() + expectancy)
    return countWeekdays(new Date(), endDate, 5)
  }, [birthdate, expectancy])

  const remainDays = useMemo(() => {
    if (!birthdate) return 0
    const birth = parseDate(birthdate)
    const endDate = new Date(birth)
    endDate.setFullYear(birth.getFullYear() + expectancy)
    return daysBetween(new Date(), endDate)
  }, [birthdate, expectancy])

  useShareAppMessage(() => ({
    title: `我的人生还剩 ${formatNumber(fridays)} 个周五`,
    path: '/pages/index/index'
  }))

  const refresh = () => {
    Taro.showToast({ title: '分享文案每天不同', icon: 'none' })
  }

  return (
    <View className='page-root life-share-root' style={{ background: theme.bg }}>
      <NavBar title='分享卡片' />

      <View className='share-card' onClick={refresh}>
        <View className='share-card-brand'>有点意思工具盒</View>

        <View className='share-card-title'>你的人生还剩</View>
        <View className='share-card-num'>{formatNumber(fridays)}</View>
        <View className='share-card-unit'>个周五</View>

        <View className='share-card-divider' />

        <View className='share-card-phrase'>"{phrase}"</View>

        <View className='share-card-foot'>
          <View className='share-card-foot-line'>剩余 {formatNumber(remainDays)} 天 · 人生倒计时钟</View>
          <View className='share-card-tip'>点右上角 · 转发给朋友</View>
        </View>
      </View>

      <Button className='share-btn btn-primary' openType='share'>
        分享给朋友
      </Button>
    </View>
  )
}
