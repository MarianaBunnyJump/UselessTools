import { View, Text, Input, Canvas } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow, useDidHide } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set } from '../../../utils/storage'
import { playTap, playPopSound } from '../../../utils/audio'
import NavBar from '../../../components/NavBar'
import {
  makeDie, makeCoin, makeTube,
  rollDie, flipCoin, shakeTube,
  advanceDie, advanceCoin, advanceTube,
  drawDice, drawCoin, drawTube,
  diceAllDone, tubeDone,
  type DieAnim, type CoinAnim, type TubeAnim
} from './engine'
import { FORTUNES, GRADE_COLOR, fortuneOfDay, randomFortune, type Fortune } from './fortunes'
import './index.scss'

type Tab = 'dice' | 'coin' | 'fortune'
type FortuneMode = 'daily' | 'custom'

const CUSTOM_KEY = 'funpicker_custom_sticks'
const DICE_COUNTS = [1, 2, 3]

export default function FunPicker() {
  const [theme] = useState(getTheme())
  const [tab, setTab] = useState<Tab>('dice')
  const [canvasCss, setCanvasCss] = useState(340)

  /* 骰子 */
  const diceRef = useRef<DieAnim[]>([makeDie(0)])
  const [diceCount, setDiceCount] = useState(1)
  const [diceResult, setDiceResult] = useState<number | null>(null)

  /* 硬币 */
  const coinRef = useRef<CoinAnim>(makeCoin())
  const [coinResult, setCoinResult] = useState<'' | 'heads' | 'tails'>('')
  const [coinStats, setCoinStats] = useState({ heads: 0, tails: 0 })

  /* 摇签 */
  const tubeRef = useRef<TubeAnim>(makeTube())
  const [fortuneMode, setFortuneMode] = useState<FortuneMode>('daily')
  const [fortune, setFortune] = useState<Fortune | null>(null)
  const [customText, setCustomText] = useState('')
  const [customSticks, setCustomSticks] = useState<string[]>(get<string[]>(CUSTOM_KEY, []))

  const canvasRef = useRef<any>(null)
  const rafRef = useRef<any>(null)
  const runningRef = useRef(false)
  const timeRef = useRef(0)
  const lastRef = useRef(0)
  const shakeCoolRef = useRef(0)

  useShareAppMessage(() => ({
    title: '3D 骰子·硬币·摇签，一个工具全包了',
    path: '/pages/index/index'
  }))

  /* 揭签：今日运势当天固定；自定义从用户签文里抽 */
  const revealFortune = (stickNo: number) => {
    if (fortuneMode === 'daily') {
      setFortune(fortuneOfDay(new Date()))
    } else if (customSticks.length === 0) {
      setFortune(randomFortune())
    } else {
      const text = customSticks[stickNo % customSticks.length]
      setFortune({ ...FORTUNES[stickNo % FORTUNES.length], title: '自定义签', poem: [text, ''], read: '心诚则灵，签随心转。' })
    }
    playPopSound()
  }

  /* ---------- 循环 ----------
   * stepRef 每次渲染都指向最新闭包，RAF 链只绑定稳定的 step，
   * 避免链上捕获过期状态（结算判断失效）。页面隐藏即停链。 */
  const stepRef = useRef<(ts: number, dt: number) => void>(() => {})
  const schedule = (canvas: any) => {
    rafRef.current = canvas.requestAnimationFrame
      ? canvas.requestAnimationFrame(step)
      : setTimeout(() => step(Date.now()), 16)
  }
  const step = (ts: number) => {
    if (!runningRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const dt = Math.min(0.05, lastRef.current ? (ts - lastRef.current) / 1000 : 0.016)
    lastRef.current = ts
    timeRef.current += dt
    stepRef.current(ts, dt)
    schedule(canvas)
  }
  stepRef.current = (ts: number, dt: number) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width / 2
    const h = canvas.height / 2
    ctx.setTransform(2, 0, 0, 2, 0, 0)
    if (tab === 'dice') {
      diceRef.current.forEach(d => advanceDie(d, dt))
      drawDice(ctx, w, h, diceRef.current, timeRef.current)
      if (diceResult === null && diceRef.current.length && diceRef.current[0].phase === 'done' && diceAllDone(diceRef.current)) {
        setDiceResult(diceRef.current.reduce((s, d) => s + d.value, 0))
        playPopSound()
      }
    } else if (tab === 'coin') {
      advanceCoin(coinRef.current, dt)
      drawCoin(ctx, w, h, coinRef.current, timeRef.current)
      if (coinResult === '' && coinRef.current.phase === 'done') {
        setCoinResult(coinRef.current.result)
        setCoinStats(s => ({ ...s, [coinRef.current.result]: s[coinRef.current.result] + 1 }))
        playPopSound()
      }
    } else {
      advanceTube(tubeRef.current, dt)
      drawTube(ctx, w, h, tubeRef.current, timeRef.current)
      if (!fortune && tubeDone(tubeRef.current)) revealFortune(tubeRef.current.stickNo)
    }
    void ts
  }

  const stopLoop = () => {
    runningRef.current = false
    if (rafRef.current && canvasRef.current && canvasRef.current.cancelAnimationFrame) {
      canvasRef.current.cancelAnimationFrame(rafRef.current)
    }
    clearTimeout(rafRef.current)
    rafRef.current = null
  }

  useEffect(() => {
    runningRef.current = true
    return stopLoop
  }, [])

  useDidShow(() => {
    if (!runningRef.current || rafRef.current) return
    runningRef.current = true
    lastRef.current = 0
    if (canvasRef.current) schedule(canvasRef.current)
  })
  useDidHide(stopLoop)

  /* 画布绑定 + 尺寸（常驻挂载，一次性查询带重试） */
  useEffect(() => {
    const sys = Taro.getSystemInfoSync()
    const css = Math.min(sys.windowWidth - 32, 460)
    setCanvasCss(css)
    let tries = 0
    const bind = () => {
      Taro.createSelectorQuery()
        .select('#fpCanvas')
        .fields({ node: true })
        .exec(res => {
          if (res && res[0] && res[0].node) {
            const canvas = res[0].node
            canvas.width = css * 2
            canvas.height = css * 2
            canvasRef.current = canvas
            lastRef.current = 0
            if (runningRef.current && !rafRef.current) schedule(canvas)
          } else if (tries++ < 8) {
            setTimeout(bind, 60)
          }
        })
    }
    const t = setTimeout(bind, 80)
    return () => clearTimeout(t)
  }, [])

  /* 切页签：重置结果态 */
  useEffect(() => {
    setDiceResult(null)
    setCoinResult('')
    setFortune(null)
    diceRef.current = [makeDie(0)]
    coinRef.current = makeCoin()
    tubeRef.current = makeTube()
  }, [tab])

  /* ---------- 交互 ---------- */
  const throwDice = () => {
    const dice: DieAnim[] = []
    for (let i = 0; i < diceCount; i++) {
      const d = makeDie(i - (diceCount - 1) / 2)
      rollDie(d, 1 + Math.floor(Math.random() * 6))
      dice.push(d)
    }
    diceRef.current = dice
    setDiceResult(null)
    playTap()
  }

  const tossCoin = () => {
    const r: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails'
    flipCoin(coinRef.current, r)
    setCoinResult('')
    playTap()
  }

  const doShake = () => {
    shakeTube(tubeRef.current, 1 + Math.floor(Math.random() * FORTUNES.length))
    setFortune(null)
    playTap()
  }

  /* 摇一摇（仅摇签页签生效） */
  useEffect(() => {
    if (tab !== 'fortune') return
    const cb = (res: { x: number; y: number; z: number }) => {
      const mag = Math.abs(res.x) + Math.abs(res.y) + Math.abs(res.z)
      if (mag > 2.6 && Date.now() - shakeCoolRef.current > 1800) {
        shakeCoolRef.current = Date.now()
        if (tubeRef.current.phase === 'idle' || tubeRef.current.phase === 'reveal') doShake()
      }
    }
    Taro.onAccelerometerChange(cb)
    return () => {
      Taro.offAccelerometerChange(cb)
    }
  }, [tab])

  const addCustomStick = () => {
    const text = customText.trim().slice(0, 30)
    if (!text) return
    const next = [...customSticks, text]
    setCustomSticks(next)
    set(CUSTOM_KEY, next)
    setCustomText('')
  }
  const removeCustomStick = (i: number) => {
    const next = customSticks.filter((_, idx) => idx !== i)
    setCustomSticks(next)
    set(CUSTOM_KEY, next)
  }

  const tabMeta: Array<[Tab, string, string]> = [
    ['dice', '🎲', '骰子'],
    ['coin', '🪙', '硬币'],
    ['fortune', '🎋', '摇签']
  ]

  return (
    <View className='page-root fp-root' style={{ background: theme.bg }}>
      <NavBar title='趣味选择器' />

      {/* 页签 */}
      <View className='fp-tabs'>
        {tabMeta.map(([id, icon, name]) => (
          <View
            key={id}
            className={`fp-tab ${tab === id ? 'fp-tab--on' : ''}`}
            style={tab === id ? { background: theme.accent } : undefined}
            onClick={() => setTab(id)}
          >
            <Text className='fp-tab-icon'>{icon}</Text>
            <Text>{name}</Text>
          </View>
        ))}
      </View>

      {/* 3D 舞台（常驻画布） */}
      <View className='fp-stage'>
        <Canvas type='2d' id='fpCanvas' className='fp-canvas' style={{ width: `${canvasCss}px`, height: `${canvasCss}px` }} />
      </View>

      {/* ---------- 骰子 ---------- */}
      {tab === 'dice' && (
        <View className='fp-panel'>
          <View className='fp-chip-row'>
            <Text className='fp-chip-label'>个数</Text>
            {DICE_COUNTS.map(n => (
              <View
                key={n}
                className={`fp-chip ${diceCount === n ? 'fp-chip--on' : ''}`}
                style={diceCount === n ? { background: theme.accent } : undefined}
                onClick={() => {
                  setDiceCount(n)
                  setDiceResult(null)
                  diceRef.current = Array.from({ length: n }, (_, i) => makeDie(i - (n - 1) / 2))
                }}
              >
                {n} 个
              </View>
            ))}
          </View>
          <View className='fp-result-row'>
            {diceResult !== null ? (
              <>
                <Text className='fp-result-big'>Σ {diceResult}</Text>
                <Text className='fp-result-sub'>{diceRef.current.map(d => d.value).join(' + ')}{diceCount === 1 ? ' · 就这一把' : ''}</Text>
              </>
            ) : (
              <Text className='fp-result-idle'>掷个骰子，让运气替你选</Text>
            )}
          </View>
          <View className='fp-cta' hoverClass='press-down' onClick={throwDice}>掷出去</View>
          <View className='fp-tip'>3D 实时渲染 · 总点数即时结算</View>
        </View>
      )}

      {/* ---------- 硬币 ---------- */}
      {tab === 'coin' && (
        <View className='fp-panel'>
          <View className='fp-result-row'>
            {coinResult !== '' ? (
              <>
                <Text className='fp-result-big' style={{ color: coinResult === 'heads' ? '#C9A063' : '#C4523A' }}>
                  {coinResult === 'heads' ? '趣 · 正面' : '工 · 反面'}
                </Text>
                <Text className='fp-result-sub'>正面 {coinStats.heads} · 反面 {coinStats.tails}</Text>
              </>
            ) : (
              <Text className='fp-result-idle'>正面「趣」反面「工」，看天意</Text>
            )}
          </View>
          <View className='fp-cta' hoverClass='press-down' onClick={tossCoin}>抛起来</View>
          <View className='fp-tip'>黄铜通宝 · 连抛十次检验手感</View>
        </View>
      )}

      {/* ---------- 摇签 ---------- */}
      {tab === 'fortune' && (
        <View className='fp-panel'>
          <View className='fp-chip-row'>
            <View
              className={`fp-chip ${fortuneMode === 'daily' ? 'fp-chip--on' : ''}`}
              style={fortuneMode === 'daily' ? { background: theme.accent } : undefined}
              onClick={() => setFortuneMode('daily')}
            >
              今日运势
            </View>
            <View
              className={`fp-chip ${fortuneMode === 'custom' ? 'fp-chip--on' : ''}`}
              style={fortuneMode === 'custom' ? { background: theme.accent } : undefined}
              onClick={() => setFortuneMode('custom')}
            >
              自定义签 {customSticks.length > 0 ? `(${customSticks.length})` : ''}
            </View>
          </View>

          {fortune && (
            <View className='fp-fortune-card'>
              <View className='fp-fortune-head'>
                <Text className='fp-fortune-grade' style={{ background: GRADE_COLOR[fortune.grade] }}>{fortune.grade}签</Text>
                <Text className='fp-fortune-title'>{fortune.title}</Text>
                <Text className='fp-fortune-no'>第 {fortune.no} 签</Text>
              </View>
              {fortune.poem[0] !== '' && (
                <View className='fp-fortune-poem'>
                  <Text>{fortune.poem[0]}</Text>
                  <Text>{fortune.poem[1]}</Text>
                </View>
              )}
              <View className='fp-fortune-read'>
                <Text className='fp-fortune-read-label'>解</Text>
                <Text className='fp-fortune-read-text'>{fortune.read}</Text>
              </View>
            </View>
          )}
          {!fortune && (
            <View className='fp-result-row'>
              <Text className='fp-result-idle'>
                {fortuneMode === 'daily' ? '今日一签，抽完全天定心' : (customSticks.length > 0 ? '摇一摇，从你的签里抽' : '先在下面加几条自定义签')}
              </Text>
            </View>
          )}

          <View className='fp-cta' hoverClass='press-down' onClick={doShake}>摇一摇 · 抽签</View>

          {fortuneMode === 'custom' && (
            <View className='fp-custom'>
              <View className='fp-custom-add'>
                <Input
                  className='fp-custom-input'
                  value={customText}
                  maxlength={30}
                  placeholder='写一条签文，如「今晚吃火锅」'
                  placeholderClass='fp-placeholder'
                  onInput={e => setCustomText(e.detail.value)}
                  onConfirm={addCustomStick}
                />
                <View className='fp-custom-btn' onClick={addCustomStick}>添加</View>
              </View>
              {customSticks.map((s, i) => (
                <View key={`${i}-${s}`} className='fp-custom-item'>
                  <Text className='fp-custom-item-text'>{i + 1}. {s}</Text>
                  <Text className='fp-custom-del' onClick={() => removeCustomStick(i)}>×</Text>
                </View>
              ))}
            </View>
          )}
          <View className='fp-tip'>{fortuneMode === 'daily' ? '同一支签陪你一整天 · 也能摇手机抽' : '自定义签随机抽 · 支持摇手机'}</View>
        </View>
      )}
    </View>
  )
}
