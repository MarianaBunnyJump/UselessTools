import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import './index.scss'

const PRESETS = ['接 ~ 机 ~', '求带走', '前方高能', '生日快乐！', '这里！我在这！', '打钱！']

/* 荧光配色对（前景/背景） */
const PALETTES: [string, string][] = [
  ['#39FF88', '#101418'],
  ['#FF4081', '#FFFFFF'],
  ['#FFD54F', '#0D2547'],
  ['#4FC3F7', '#1A1A2E'],
  ['#FFFFFF', '#E91E63']
]

export default function Marquee() {
  const [theme] = useState(getTheme())
  const [draft, setDraft] = useState('')
  const [playing, setPlaying] = useState('')
  const [mirror, setMirror] = useState(false)
  const [speed, setSpeed] = useState(12) /* 秒/屏 */
  const [fontSize, setFontSize] = useState(120)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [history, setHistory] = useState<string[]>(get<string[]>('marquee_history', []))
  const lastShake = useRef(0)
  const [fg, bg] = PALETTES[paletteIdx]

  useShareAppMessage(() => ({
    title: '手持弹幕：接机、应援、表白都能用',
    path: '/pages/index/index'
  }))

  const start = useCallback((text: string) => {
    const t = text.trim().slice(0, 24)
    if (!t) {
      Taro.showToast({ title: '先写点什么', icon: 'none' })
      return
    }
    const next = [t, ...get<string[]>('marquee_history', []).filter(x => x !== t)].slice(0, 8)
    set('marquee_history', next)
    setHistory(next)
    setPlaying(t)
  }, [])

  /* 摇一摇换配色（播放页监听加速度） */
  useEffect(() => {
    if (!playing) return
    const handler = (res: any) => {
      const { x, y, z } = res
      const mag = Math.sqrt(x * x + y * y + z * z)
      if (mag > 18 && Date.now() - lastShake.current > 800) {
        lastShake.current = Date.now()
        setPaletteIdx(i => (i + 1) % PALETTES.length)
        Taro.vibrateShort({ type: 'light' } as any).catch?.(() => {})
      }
    }
    Taro.onAccelerometerChange(handler as any)
    Taro.startAccelerometer({ interval: 'normal' }).catch?.(() => {})
    return () => {
      Taro.offAccelerometerChange(handler as any)
      Taro.stopAccelerometer().catch?.(() => {})
    }
  }, [playing])

  /* 播放页 */
  if (playing) {
    return (
      <View className='mq-play' style={{ background: bg }} onClick={() => setPlaying('')}>
        <View className='mq-track'>
          <Text
            className='mq-text'
            style={{ color: fg, fontSize: `${fontSize}rpx`, animationDuration: `${speed}s` }}
          >
            {playing}
          </Text>
          {mirror && (
            <Text
              className='mq-text mq-text--mirror'
              style={{ color: fg, fontSize: `${fontSize}rpx`, animationDuration: `${speed}s` }}
            >
              {playing}
            </Text>
          )}
        </View>

        {/* 控制条（点卡片本体暂停；点按钮不冒泡） */}
        <View className='mq-ctrl' onClick={e => e.stopPropagation()}>
          <Text className='mq-ctrl-btn' onClick={() => setSpeed(s => (s <= 3 ? 12 : s - 3))}>
            {speed < 6 ? '慢' : speed < 12 ? '中' : '快'}
          </Text>
          <Text className='mq-ctrl-btn' onClick={() => setFontSize(f => (f >= 160 ? 80 : f + 40))}>
            {fontSize >= 160 ? '特大' : fontSize >= 120 ? '大' : '中'}
          </Text>
          <Text className='mq-ctrl-btn' onClick={() => setMirror(v => !v)}>{mirror ? '镜像 开' : '镜像 关'}</Text>
          <Text className='mq-ctrl-btn mq-ctrl-btn--exit' onClick={() => setPlaying('')}>退出</Text>
        </View>
        <View className='mq-hint'>点屏幕任意处返回编辑 · 摇一摇换配色</View>
      </View>
    )
  }

  return (
    <View className='page-root mq-root' style={{ background: theme.bg }}>
      <NavBar title='手持弹幕' />
      <ScrollView scrollY className='mq-scroll'>
        <View className='mq-scroll-pad'>
        <View className='mq-input-card'>
          <Input
            className='mq-input'
            value={draft}
            maxlength={24}
            placeholder='写一句要举的话（24 字内）'
            placeholderClass='mq-placeholder'
            onInput={e => setDraft(e.detail.value)}
          />
          <View className='mq-go' hoverClass='press-down' onClick={() => start(draft)}>全屏播放</View>
        </View>

        <View className='mq-presets'>
          {PRESETS.map(p => (
            <View key={p} className='mq-preset' onClick={() => start(p)}>{p}</View>
          ))}
        </View>

        {history.length > 0 && (
          <View className='mq-history'>
            <View className='mq-history-label'>最近用过</View>
            {history.map(h => (
              <View key={h} className='mq-preset' onClick={() => start(h)}>{h}</View>
            ))}
          </View>
        )}

        <View className='mq-tip'>播放时：点屏幕返回 · 摇一摇换配色 · 镜像模式上下两行对称（接机举过头顶对面也能读正字）</View>
      </View>
      </ScrollView>
    </View>
  )
}
