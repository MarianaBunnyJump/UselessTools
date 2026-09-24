import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../utils/theme'
import { getWorkPoints, getWorkLevel, getLevelThreshold, MAX_LEVEL, getLevelTitle, getLevelBenefit, getAvailableTitlePrefixes, getSelectedTitlePrefix, saveTitlePrefix, TITLE_PREFIX_EVENT } from '../../skins/workPoints'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function LevelPage() {
  const [theme] = useState(getTheme())
  const [points, setPoints] = useState(getWorkPoints())
  const current = getWorkLevel(points)
  const [selectedPrefix, setSelectedPrefix] = useState(() => getSelectedTitlePrefix(current.level))
  const bars = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1)
  const pct = current.nextAt > current.curBase
    ? Math.min(100, Math.round(((points - current.curBase) / (current.nextAt - current.curBase)) * 100))
    : 100

  useDidShow(() => {
    const latest = getWorkPoints()
    setPoints(latest)
    setSelectedPrefix(getSelectedTitlePrefix(getWorkLevel(latest).level))
  })

  const choosePrefix = (prefix: string) => {
    if (prefix === selectedPrefix) return
    if (!saveTitlePrefix(prefix, current.level)) {
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }
    setSelectedPrefix(prefix)
    Taro.eventCenter.trigger(TITLE_PREFIX_EVENT, prefix)
  }

  return (
    <View className='page-root level-page' style={{ background: theme.bg }}>
      <NavBar title='工局等级' />
      <View className='level-hero'>
        <Text className='level-medal'>🏅</Text>
        <Text className='level-number'>Lv.{current.level}</Text>
        <Text className='level-title'>{getLevelTitle(current.level)}</Text>
        <Text className='level-points'>当前 {points} 工分</Text>
      </View>
      <View className='level-card'>
        <View className='level-card-head'>
          <Text>工局成长图</Text>
          <Text className='level-next'>{current.level >= MAX_LEVEL ? '已满级' : `下级 ${current.nextAt} 工分 · 还差 ${current.nextAt - points}`}</Text>
        </View>
        <Text className='level-chart-note'>柱高代表各等级门槛 · 当前 {points} 工分</Text>
        <View className='level-bars'>
          {bars.map(level => {
            const threshold = getLevelThreshold(level)
            const reached = points >= threshold
            return (
              <View className='level-bar-item' key={level}>
                <Text className={`level-bar-value ${level === current.level ? 'level-bar-value--current' : ''}`}>{threshold}</Text>
                <View className='level-bar-column'>
                  <View className={`level-bar ${reached ? 'level-bar--active' : ''} ${level === current.level ? 'level-bar--current' : ''}`} style={{ height: `${Math.max(3, threshold / getLevelThreshold(MAX_LEVEL) * 100)}%` }} />
                </View>
                <Text className={`level-bar-label ${level === current.level ? 'level-bar-label--current' : ''}`}>Lv.{level}</Text>
              </View>
            )
          })}
        </View>
        <View className='level-progress-track'><View className='level-progress-fill' style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentDeep})` }} /></View>
        <Text className='level-progress-copy'>{current.level >= MAX_LEVEL ? '已达到最高等级门槛' : `Lv.${current.level} → Lv.${current.level + 1}：${points} / ${current.nextAt} 工分（本级 ${pct}%）`}</Text>
      </View>
      <View className='level-card'>
        <Text className='level-section-title'>首页称号前缀</Text>
        <Text className='level-prefix-hint'>{current.level >= 3 ? '三个前缀可随时切换，选择会保存在本机。' : '达到 Lv.3 后解锁「快乐的」「有趣的」「好玩的」三个前缀。'}</Text>
        <View className='level-prefix-options'>
          {getAvailableTitlePrefixes(current.level).map(prefix => (
            <View key={prefix} className={`level-prefix-option ${prefix === selectedPrefix ? 'level-prefix-option--selected' : ''}`} onClick={() => choosePrefix(prefix)}>
              <Text>{prefix}趣工局</Text>
              {prefix === selectedPrefix && <Text className='level-prefix-check'>已选</Text>}
            </View>
          ))}
        </View>
      </View>
      {current.level >= 5 && (
        <View className='level-card level-ribbon-card'>
          <Text className='level-section-title'>专属彩带已解锁</Text>
          <Text className='level-ribbon-copy'>回到首页，点击「趣工局」标题即可放出彩带。</Text>
        </View>
      )}
      <View className='level-card level-benefit-card'>
        <Text className='level-section-title'>等级福利</Text>
        {bars.map(level => {
          const benefit = getLevelBenefit(level)
          return (
            <View className={`level-benefit-row ${level === current.level ? 'level-benefit-row--current' : ''}`} key={level}>
              <Text className='level-benefit-level'>Lv.{level}</Text>
              <Text className='level-benefit-copy'>{benefit.text}</Text>
              <Text className={`level-benefit-status ${level <= current.level && benefit.implemented ? 'level-benefit-status--ready' : ''}`}>
                {benefit.implemented ? (level <= current.level ? '已解锁' : '未解锁') : '未上线'}
              </Text>
            </View>
          )
        })}
      </View>
      <View className='level-tip'>每打开一次工具 +10 工分，等级只代表你在趣工局留下的足迹。</View>
    </View>
  )
}
