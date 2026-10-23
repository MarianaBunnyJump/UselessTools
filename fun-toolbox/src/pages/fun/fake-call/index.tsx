import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set, addTotalCount } from '../../../utils/storage'
import { playTap, isSupported } from '../../../utils/audio'
import { speak, ttsAvailable } from '../../../utils/tts'
import NavBar from '../../../components/NavBar'
import './index.scss'

/* 三套剧本预设 */
const SCRIPTS: Record<string, { icon: string; person: string; lines: string[] }> = {
  mom: { icon: '🌙', person: '妈妈', lines: ['十点前必须到家，听到没呀', '汤都给你留好了'] },
  boss: { icon: '👔', person: '王老板', lines: ['那个方案现在就要，回来一趟', '客户在等，快点'] },
  courier: { icon: '📦', person: '快递小哥', lines: ['你的件到了，下楼拿一下', '就放在门口了啊'] }
}

const DELAYS = [
  { label: '10 秒', ms: 10000 },
  { label: '30 秒', ms: 30000 },
  { label: '1 分钟', ms: 60000 },
  { label: '3 分钟', ms: 180000 }
]

type Stage = 'config' | 'waiting' | 'ringing' | 'talking' | 'done'

export default function FakeCall() {
  const [theme] = useState(getTheme())
  const [stage, setStage] = useState<Stage>('config')
  const [scriptId, setScriptId] = useState('mom')
  const [person, setPerson] = useState(SCRIPTS.mom.person)
  const [icon, setIcon] = useState(SCRIPTS.mom.icon)
  const [linesText, setLinesText] = useState(SCRIPTS.mom.lines.join('\n'))
  const [delayIdx, setDelayIdx] = useState(1)
  const [lineIdx, setLineIdx] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const vibTimer = useRef<any>(null)
  const [totalEscapes] = useState(get<number>('fakecall_total', 0))

  useShareAppMessage(() => ({
    title: '饭局救星：定时「来电」帮你体面撤退',
    path: '/pages/index/index'
  }))

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (vibTimer.current) clearInterval(vibTimer.current)
  }

  useEffect(() => () => clearAll(), [])

  const applyScript = (id: string) => {
    setScriptId(id)
    setPerson(SCRIPTS[id].person)
    setIcon(SCRIPTS[id].icon)
    setLinesText(SCRIPTS[id].lines.join('\n'))
  }

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  /* 启动演练：倒计时后来电 */
  const start = () => {
    clearAll()
    const ms = DELAYS[delayIdx].ms
    setCountdown(Math.round(ms / 1000))
    setStage('waiting')
    for (let s = Math.round(ms / 1000); s > 0; s--) {
      later(() => setCountdown(s - 1 > 0 ? s - 1 : 0), ms - s * 1000)
    }
    later(() => ring(), ms)
  }

  /* 来电：铃声渐强（合成短音重复）+ 震动节奏 */
  const ring = () => {
    setStage('ringing')
    if (isSupported()) playTap()
    /* 震动节奏：响 1s 停 2s */
    if (process.env.TARO_ENV === 'weapp') {
      vibTimer.current = setInterval(() => {
        Taro.vibrateShort({ type: 'heavy' } as any).catch?.(() => {})
        setTimeout(() => Taro.vibrateShort({ type: 'heavy' } as any).catch?.(() => {}), 350)
      }, 3000)
      Taro.vibrateShort({ type: 'heavy' } as any).catch?.(() => {})
    }
    /* 45 秒未接自动挂断 */
    later(() => {
      if (stage === 'ringing') hangup(false)
    }, 45000)
  }

  const answer = () => {
    clearAll()
    setLineIdx(0)
    setStage('talking')
    const lines = linesText.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) {
      finish()
      return
    }
    speakLine(lines, 0)
  }

  const speakLine = (lines: string[], i: number) => {
    setLineIdx(i)
    if (!ttsAvailable()) {
      /* 无插件：台词按 2.6s 一句展示 */
      later(() => (i + 1 < lines.length ? speakLine(lines, i + 1) : finish()), 2600)
      return
    }
    speak(lines[i], {
      speed: 1.0,
      done: () => later(() => (i + 1 < lines.length ? speakLine(lines, i + 1) : finish()), 700),
      fail: () => later(() => finish(), 1500)
    })
  }

  const hangup = (countIt: boolean) => {
    clearAll()
    finish(countIt)
  }

  const finish = (countIt = true) => {
    clearAll()
    if (countIt) addTotalCount('fakecall_total')
    setStage('done')
  }

  const reset = () => {
    clearAll()
    setStage('config')
  }

  /* ---------- 来电页 ---------- */
  if (stage === 'ringing') {
    return (
      <View className='fc-call'>
        <View className='fc-drill-badge'>模拟来电演练</View>
        <View className='fc-avatar'><Text className='fc-avatar-icon'>{icon}</Text></View>
        <Text className='fc-person'>{person}</Text>
        <Text className='fc-sub'>模拟来电 · 仅供演练</Text>
        <View className='fc-actions'>
          <View className='fc-btn fc-btn--decline' onClick={() => hangup(false)}>
            <Text className='fc-btn-icon'>✕</Text>
            <Text className='fc-btn-label'>挂断</Text>
          </View>
          <View className='fc-btn fc-btn--answer' onClick={answer}>
            <Text className='fc-btn-icon'>📞</Text>
            <Text className='fc-btn-label'>接听</Text>
          </View>
        </View>
        <Text className='fc-hint'>铃声与震动为模拟效果，不接入真实通话</Text>
      </View>
    )
  }

  /* ---------- 通话页 ---------- */
  if (stage === 'talking') {
    const lines = linesText.split('\n').map(l => l.trim()).filter(Boolean)
    return (
      <View className='fc-call fc-call--talking'>
        <View className='fc-drill-badge'>模拟通话演练</View>
        <View className='fc-avatar fc-avatar--sm'><Text className='fc-avatar-icon'>{icon}</Text></View>
        <Text className='fc-person'>{person}</Text>
        <View className='fc-lines'>
          {lines.map((l, i) => (
            <Text key={i} className={`fc-line ${i === lineIdx ? 'fc-line--now' : ''} ${i < lineIdx ? 'fc-line--past' : ''}`}>
              {l}
            </Text>
          ))}
        </View>
        <View className='fc-endcall' onClick={() => hangup(true)}>结束通话</View>
      </View>
    )
  }

  /* ---------- 等待页 ---------- */
  if (stage === 'waiting') {
    return (
      <View className='fc-call'>
        <View className='fc-drill-badge'>演练就绪</View>
        <Text className='fc-countdown'>{countdown}</Text>
        <Text className='fc-sub'>{countdown > 0 ? `秒后来电（${person}）` : '来电中…'}</Text>
        <View className='fc-cancel' onClick={reset}>取消演练</View>
      </View>
    )
  }

  /* ---------- 完成页 ---------- */
  if (stage === 'done') {
    return (
      <View className='fc-call'>
        <Text className='fc-done-icon'>🎉</Text>
        <Text className='fc-done-text'>成功撤退</Text>
        <Text className='fc-sub'>本周第 {get<number>('fakecall_total', 0)} 次体面离场</Text>
        <View className='fc-again' onClick={reset}>再来一次</View>
      </View>
    )
  }

  /* ---------- 配置页 ---------- */
  return (
    <View className='page-root fc-root' style={{ background: theme.bg }}>
      <NavBar title='假装来电' />
      <ScrollView scrollY className='fc-scroll'>
        <View className='fc-label'>选个剧本</View>
        <View className='fc-scripts'>
          {Object.entries(SCRIPTS).map(([id, s]) => (
            <View key={id} className={`fc-script ${scriptId === id ? 'fc-script--on' : ''}`} style={scriptId === id ? { background: theme.accent } : undefined} onClick={() => applyScript(id)}>
              <Text className='fc-script-icon'>{s.icon}</Text>
              <Text className='fc-script-name'>{s.person}</Text>
            </View>
          ))}
        </View>

        <View className='fc-card'>
          <View className='fc-field-label'>来电显示</View>
          <View className='fc-person-row'>
            <Text className='fc-person-emoji'>{icon}</Text>
            <View className='fc-person-input-wrap'>
              <Textarea
                className='fc-person-input'
                value={person}
                maxlength={10}
                autoHeight
                onInput={e => setPerson(e.detail.value)}
              />
            </View>
          </View>

          <View className='fc-field-label'>多久后来电</View>
          <View className='fc-seg'>
            {DELAYS.map((d, i) => (
              <View key={d.label} className={`fc-seg-item ${delayIdx === i ? 'fc-seg-item--on' : ''}`} style={delayIdx === i ? { background: theme.accent } : undefined} onClick={() => setDelayIdx(i)}>
                {d.label}
              </View>
            ))}
          </View>

          <View className='fc-field-label'>接通后台词（一句一行，自动朗读）</View>
          <Textarea
            className='fc-lines-input'
            value={linesText}
            maxlength={200}
            autoHeight
            placeholderClass='fc-placeholder'
            placeholder={'一句一行\n如：在哪呢，快来'}
            onInput={e => setLinesText(e.detail.value)}
          />
        </View>

        <View className='fc-start' onClick={start}>启动演练 · {DELAYS[delayIdx].label}后来电</View>

        <View className='fc-disclaimer'>
          仅本机模拟演练 · 不接入真实通话 · 朗读需首次授权插件 · 本周已撤退 {totalEscapes} 次
        </View>
      </ScrollView>
    </View>
  )
}
