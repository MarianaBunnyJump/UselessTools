import { View, Text } from '@tarojs/components'
import { useState, useEffect, useRef } from 'react'
import { ONBOARDING_LINES, ONBOARDING_BTN_TEXT, ONBOARDING_BTN_DELAY, ONBOARDING_SKIP_TEXT } from '../../data/onboardingLines'
import type { BackgroundPreset } from '../../utils/theme'
import './onboarding.scss'

interface OnboardingProps {
  theme: BackgroundPreset
  /* by=finish 点了开工 | by=skip 点了跳过；由父组件负责写 flag 与埋点 */
  onFinish: (by: 'finish' | 'skip') => void
}

/* #RRGGBB → rgba 字符串（底部光晕用） */
function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function Onboarding(props: OnboardingProps) {
  const [shownLines, setShownLines] = useState(0)
  const [btnShown, setBtnShown] = useState(false)
  const timersRef = useRef<any[]>([])
  const doneRef = useRef(false)

  useEffect(() => {
    ONBOARDING_LINES.forEach((line, i) => {
      timersRef.current.push(setTimeout(() => setShownLines(i + 1), line.delay))
    })
    timersRef.current.push(setTimeout(() => setBtnShown(true), ONBOARDING_BTN_DELAY))
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  /* 点击任意处 = 快进：所有行同时渐显、按钮立即浮出 */
  const fastForward = () => {
    if (btnShown) return
    timersRef.current.forEach(clearTimeout)
    setShownLines(ONBOARDING_LINES.length)
    setBtnShown(true)
  }

  const finish = (by: 'finish' | 'skip') => {
    if (doneRef.current) return
    doneRef.current = true
    timersRef.current.forEach(clearTimeout)
    props.onFinish(by)
  }

  return (
    <View
      className='ob-overlay'
      catchMove
      style={{ background: props.theme.bg }}
      onClick={fastForward}
    >
      {/* 轻微暗化 + 底部品牌色光晕 */}
      <View className='ob-tint' />
      <View
        className='ob-glow'
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${rgba(props.theme.accent, 0.26)} 0%, ${rgba(props.theme.accent, 0.1)} 46%, rgba(255, 255, 255, 0) 76%)` }}
      />

      <View className='ob-lines'>
        {ONBOARDING_LINES.map((line, i) => (
          <View
            key={i}
            className={`ob-line ${i === 0 ? 'ob-line--hero' : ''} ${i < shownLines ? 'ob-line--in' : ''}`}
          >
            {line.text}
          </View>
        ))}

        {btnShown && (
          <View
            className='ob-btn'
            style={{ background: `linear-gradient(135deg, ${props.theme.accent}, ${props.theme.accentDeep})` }}
            onClick={e => {
              e.stopPropagation()
              finish('finish')
            }}
          >
            {ONBOARDING_BTN_TEXT}
          </View>
        )}
      </View>

      <View
        className='ob-skip'
        onClick={e => {
          e.stopPropagation()
          finish('skip')
        }}
      >
        {ONBOARDING_SKIP_TEXT} ›
      </View>
    </View>
  )
}
