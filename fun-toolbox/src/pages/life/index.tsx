import { View, Text, Picker } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { HOLIDAYS, type HolidayRange } from '../../data/holidays'
import { LIFE_CARD_BACKS } from '../../data/lifeCardBacks'
import { pickOpeners } from '../../data/lifeOpeners'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import { formatNumber, daysBetween, parseDate, todayStr } from '../../utils/format'
import { computeLifeStats, lifeMetrics } from '../../utils/lifeStats'
import NavBar from '../../components/NavBar'
import './index.scss'

const LIFE_END_DEFAULT = 77

/* 一年中的第几天（当天内固定，卡片背面文案按此轮换） */
const DAY_OF_YEAR = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
)

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
  const [editing, setEditing] = useState(false)
  /* 卡片翻转：支持多张同时翻开，再逐张点回 */
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  /* 分享勾选弹层 */
  const [shareOpen, setShareOpen] = useState(false)
  const [picks, setPicks] = useState<string[]>(['sundays'])

  /* 数字配色跟随全局背景主题（同色系强调色） */
  const numGrad = `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`

  /* 从设置页改完预期寿命回来后刷新 */
  useDidShow(() => {
    setExpectancy(get<number>('life_expectancy', LIFE_END_DEFAULT))
    setBirthdate(get<string>('life_birthdate', ''))
  })

  useShareAppMessage(() => ({
    title: '看看你还剩多少个周日',
    path: '/pages/index/index'
  }))

  const stats = useMemo(
    () => (birthdate ? computeLifeStats(birthdate, expectancy) : null),
    [birthdate, expectancy]
  )
  const metrics = useMemo(() => (stats ? lifeMetrics(stats) : []), [stats])

  const holiday = useMemo(() => nextHoliday(), [])
  /* 开场冲击文案：当天内固定，跨天轮换 */
  const openers = useMemo(() => pickOpeners(3, DAY_OF_YEAR), [])

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

  /* ---------- 卡片翻转（多张互不影响，点一下翻面、再点翻回） ---------- */
  const flip = (id: string) => {
    setFlippedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  /* ---------- 分享勾选 ---------- */
  const openShare = () => {
    setPicks(['sundays'])
    setShareOpen(true)
  }

  const togglePick = (id: string) => {
    setPicks(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) {
          Taro.showToast({ title: '至少勾选一项', icon: 'none' })
          return prev
        }
        return prev.filter(x => x !== id)
      }
      return [...prev, id]
    })
  }

  const confirmShare = () => {
    if (picks.length === 0) return
    setShareOpen(false)
    Taro.navigateTo({ url: `/pages/life/share?metric=${picks[0]}` })
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

      <View className='life-openers'>
        {openers.map((line, i) => (
          <View key={line} className='life-opener-line' style={{ animationDelay: `${i * 0.22}s` }}>
            {line}
          </View>
        ))}
      </View>

      <View className='life-hero'>
        <View className='life-hero-label'>你的人生还剩</View>
        <View className='life-hero-num' style={{ backgroundImage: numGrad }}>
          {formatNumber(stats!.remainDays)}
        </View>
        <View className='life-hero-unit'>天 ≈ {formatNumber(stats!.remainHours)} 小时</View>
      </View>

      <View className='life-progress common-card'>
        <View className='life-progress-head'>
          <Text>已度过 {formatNumber(stats!.livedDays)} / {formatNumber(stats!.totalDays)} 天</Text>
          <Text className='life-progress-pct'>{stats!.percent.toFixed(1)}%</Text>
        </View>
        <View className='life-progress-track' style={{ background: `${theme.accent}24` }}>
          <View
            className='life-progress-fill'
            style={{
              width: `${stats!.percent}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDeep})`,
              boxShadow: `0 0 12px ${theme.accent}77`
            }}
          />
        </View>
      </View>

      <View className='life-grid'>
        {metrics.map((m, i) => (
          <View
            key={m.id}
            className={`life-flip ${i === metrics.length - 1 && metrics.length % 2 === 1 ? 'life-flip--wide' : ''}`}
            onClick={() => flip(m.id)}
          >
            <View className={`life-flip-inner ${flippedIds.includes(m.id) ? 'life-flip-inner--on' : ''}`}>
              <View className='life-metric-card life-flip-front'>
                <View className='life-metric-value' style={{ backgroundImage: numGrad }}>
                  {formatNumber(m.value)}
                </View>
                <View className='life-metric-unit' style={{ color: theme.accentDeep }}>
                  {m.unit}
                </View>
                <View className='life-metric-label'>{m.label}</View>
                <View className='life-metric-hint'>轻点翻面 ✨</View>
              </View>
              <View
                className='life-metric-card life-flip-back'
                style={{ background: `linear-gradient(150deg, #ffffff 0%, ${theme.accent}2b 100%)` }}
              >
                <Text className='life-back-text'>{LIFE_CARD_BACKS[(DAY_OF_YEAR + i) % LIFE_CARD_BACKS.length]}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {holiday && (
        <View className='life-holiday'>
          距 {holiday.holiday.name}还有 {holiday.days} 天，先把这个假期过好
        </View>
      )}

      <View className='life-footnote'>按预期寿命 {expectancy} 岁（可在设置中修改）· 仅供一乐</View>

      {/* 右下角小分享按钮 */}
      <View
        className='life-share-fab'
        style={{ borderColor: `${theme.accent}55`, boxShadow: `0 12px 26px -10px ${theme.accent}88` }}
        onClick={openShare}
      >
        <Text className='life-share-fab-icon'>💌</Text>
      </View>

      {shareOpen && (
        <View className='life-share-mask' onClick={() => setShareOpen(false)}>
          <View className='life-share-panel' onClick={e => e.stopPropagation()}>
            <View className='life-share-panel-title'>想分享哪些项目？</View>
            <View className='life-share-pick-grid'>
              {metrics.map(m => {
                const on = picks.includes(m.id)
                return (
                  <View
                    key={m.id}
                    className={`life-share-pick ${on ? 'life-share-pick--on' : ''}`}
                    style={
                      on
                        ? {
                            borderColor: theme.accent,
                            background: `${theme.accent}24`,
                            color: theme.accentDeep
                          }
                        : undefined
                    }
                    onClick={() => togglePick(m.id)}
                  >
                    <Text
                      className='life-share-pick-check'
                      style={{ background: on ? theme.accent : 'rgba(74,59,50,0.14)' }}
                    >
                      {on ? '✓' : ''}
                    </Text>
                    <Text>{m.label}</Text>
                  </View>
                )
              })}
            </View>
            <View className='life-share-panel-tip'>第一项会作为卡片主数字</View>
            <View
              className='life-share-confirm'
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})` }}
              onClick={confirmShare}
            >
              生成分享卡片
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
