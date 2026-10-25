import { View, Text, Input, Slider, ScrollView } from '@tarojs/components'
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

/* 无级调节范围：速度滑块 1~30（右=快），实际滚动时长 = 31-值 秒/屏 */
const SPEED_MAX = 30
const FONT_MIN = 60
const FONT_MAX = 300

interface MarqueePrefs {
  speedVal: number
  fontSize: number
  paletteIdx: number
  mirror: boolean
}

function loadPrefs(): MarqueePrefs {
  const p = get<Partial<MarqueePrefs>>('marquee_prefs', {})
  return {
    speedVal: Math.min(SPEED_MAX, Math.max(1, p.speedVal ?? 18)),
    fontSize: Math.min(FONT_MAX, Math.max(FONT_MIN, p.fontSize ?? 120)),
    paletteIdx: p.paletteIdx ?? 0,
    mirror: p.mirror ?? false
  }
}

export default function Marquee() {
  const [theme] = useState(getTheme())
  const [draft, setDraft] = useState('')
  const [playing, setPlaying] = useState('')
  const [landscape, setLandscape] = useState(false)
  const prefs0 = useRef(loadPrefs()).current
  const [speedVal, setSpeedVal] = useState(prefs0.speedVal)
  const [fontSize, setFontSize] = useState(prefs0.fontSize)
  const [paletteIdx, setPaletteIdx] = useState(prefs0.paletteIdx)
  const [mirror, setMirror] = useState(prefs0.mirror)
  const [history, setHistory] = useState<string[]>(get<string[]>('marquee_history', []))
  const lastShake = useRef(0)
  const [fg, bg] = PALETTES[paletteIdx]
  const duration = 31 - speedVal /* 秒/屏，速度值越大越快 */

  const savePrefs = useCallback((patch: Partial<MarqueePrefs>) => {
    set('marquee_prefs', { speedVal, fontSize, paletteIdx, mirror, ...patch })
  }, [speedVal, fontSize, paletteIdx, mirror])

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
    setLandscape(false)
    setPlaying(t)
  }, [])

  const exitLandscape = () => {
    setLandscape(false)
    Taro.vibrateShort({ type: 'light' } as any).catch?.(() => {})
  }

  /* 摇一摇换配色（播放页监听加速度） */
  useEffect(() => {
    if (!playing) return
    const handler = (res: any) => {
      const { x, y, z } = res
      const mag = Math.sqrt(x * x + y * y + z * z)
      if (mag > 18 && Date.now() - lastShake.current > 800) {
        lastShake.current = Date.now()
        setPaletteIdx(i => {
          const next = (i + 1) % PALETTES.length
          set('marquee_prefs', { speedVal, fontSize, paletteIdx: next, mirror })
          return next
        })
        Taro.vibrateShort({ type: 'light' } as any).catch?.(() => {})
      }
    }
    Taro.onAccelerometerChange(handler as any)
    Taro.startAccelerometer({ interval: 'normal' }).catch?.(() => {})
    return () => {
      Taro.offAccelerometerChange(handler as any)
      Taro.stopAccelerometer().catch?.(() => {})
    }
  }, [playing, speedVal, fontSize, mirror])

  const textStyle = {
    color: fg,
    fontSize: `${fontSize}rpx`,
    animationDuration: `${duration}s`
  }

  /* ---------- 播放页 ---------- */
  if (playing) {
    return (
      <View
        className={`mq-play ${landscape ? 'mq-play--landscape' : ''}`}
        style={{ background: bg }}
        onClick={() => (landscape ? exitLandscape() : setPlaying(''))}
      >
        {/* 旋转舞台：横屏时整体转 90°、宽高互换，动画用百分比定位不受旋转影响 */}
        <View className='mq-stage-rot'>
          <View className='mq-track'>
            <Text className='mq-text' style={textStyle}>{playing}</Text>
            {mirror && (
              <Text className='mq-text mq-text--mirror' style={textStyle}>{playing}</Text>
            )}
          </View>
        </View>

        {/* 横屏 = 无 UI 纯弹幕；竖屏保留轻控制条 */}
        {!landscape && (
          <>
            <View className='mq-ctrl' onClick={e => e.stopPropagation()}>
              <Text className='mq-ctrl-btn' onClick={() => {
                setLandscape(true)
                Taro.showToast({ title: '横屏模式 · 点屏幕返回', icon: 'none', duration: 1600 })
              }}>⟳ 横屏</Text>
              <Text className='mq-ctrl-btn' onClick={() => { setMirror(v => { const n = !v; savePrefs({ mirror: n }); return n }) }}>
                {mirror ? '镜像 开' : '镜像 关'}
              </Text>
              <Text className='mq-ctrl-btn mq-ctrl-btn--exit' onClick={() => setPlaying('')}>退出</Text>
            </View>
            <View className='mq-hint'>点屏幕返回编辑 · 摇一摇换配色 · 横屏更震撼</View>
          </>
        )}
      </View>
    )
  }

  /* ---------- 编辑页 ---------- */
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

        {/* 无级调节：速度 / 字号 */}
        <View className='mq-tune-card'>
          <View className='mq-tune-row'>
            <Text className='mq-tune-label'>速度</Text>
            <Slider
              className='mq-tune-slider'
              min={1}
              max={SPEED_MAX}
              step={1}
              value={speedVal}
              activeColor='#E4674A'
              backgroundColor='rgba(74,59,50,0.12)'
              blockColor='#FFF9F2'
              blockSize={22}
              onChange={e => { setSpeedVal(e.detail.value); savePrefs({ speedVal: e.detail.value }) }}
            />
            <Text className='mq-tune-value'>{duration}s/屏</Text>
          </View>
          <View className='mq-tune-row'>
            <Text className='mq-tune-label'>大小</Text>
            <Slider
              className='mq-tune-slider'
              min={FONT_MIN}
              max={FONT_MAX}
              step={5}
              value={fontSize}
              activeColor='#E4674A'
              backgroundColor='rgba(74,59,50,0.12)'
              blockColor='#FFF9F2'
              blockSize={22}
              onChange={e => { setFontSize(e.detail.value); savePrefs({ fontSize: e.detail.value }) }}
            />
            <Text className='mq-tune-value'>{fontSize}rpx</Text>
          </View>

          {/* 配色 */}
          <View className='mq-tune-row'>
            <Text className='mq-tune-label'>配色</Text>
            <View className='mq-palette-row'>
              {PALETTES.map(([c1, c2], i) => (
                <View
                  key={c1}
                  className={`mq-palette ${i === paletteIdx ? 'mq-palette--on' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${c2} 40%, ${c1} 40%)` }}
                  onClick={() => { setPaletteIdx(i); savePrefs({ paletteIdx: i }) }}
                />
              ))}
            </View>
          </View>
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

        <View className='mq-tip'>播放时：点屏幕返回 · 摇一摇换配色 · 「横屏」后纯弹幕无界面 · 镜像上下对称（接机举过头顶对面也能读正字）</View>
      </View>
      </ScrollView>
    </View>
  )
}
