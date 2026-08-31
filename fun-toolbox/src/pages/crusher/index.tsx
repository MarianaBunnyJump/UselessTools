import { View, Text, Textarea } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { CRUSHER_QUOTES } from '../../data/crusherQuotes'
import { CRUSHER_PRESETS } from '../../data/crusherPresets'
import { getTheme } from '../../utils/theme'
import { get, set, getDailyCount } from '../../utils/storage'
import { randomOf } from '../../utils/format'
import NavBar from '../../components/NavBar'
import './index.scss'

const CRUSH_MODES = [
  { id: 'shred', name: '撕碎', icon: '✂️', desc: '碎片飞散' },
  { id: 'burn', name: '焚烧', icon: '🔥', desc: '化为灰烬' },
  { id: 'flush', name: '冲走', icon: '🌊', desc: '随水而去' }
]

const MAX_LEN = 200

export default function Crusher() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('')
  const [mode, setMode] = useState(get<string>('crusher_mode', 'shred'))
  const [showPresets, setShowPresets] = useState(false)
  const today = getDailyCount('crusher_today').count
  const [todayCount, setTodayCount] = useState(today)

  /* 每次进入随机 2 条入场文案 */
  const quotes = useMemo(() => {
    const first = randomOf(CRUSHER_QUOTES)
    let second = first
    while (second === first) {
      second = randomOf(CRUSHER_QUOTES)
    }
    return [first, second]
  }, [])

  useShareAppMessage(() => ({
    title: '我把烦心事粉碎了，你也来试试',
    path: '/pages/index/index'
  }))

  const pickMode = (id: string) => {
    setMode(id)
    set('crusher_mode', id)
  }

  const usePreset = (item: string) => {
    setText(prev => (prev.length > 0 && !prev.endsWith('、') ? `${prev}、${item}` : (prev + item)).slice(0, MAX_LEN))
    setShowPresets(false)
  }

  const crush = () => {
    if (!text.trim()) return
    const d = getDailyCount('crusher_today')
    const next = d.count + 1
    set('crusher_today', { date: d.date, count: next })
    set('crusher_total', get<number>('crusher_total', 0) + 1)
    setTodayCount(next)
    Taro.navigateTo({
      url: `/pages/crusher/animation?mode=${mode}&text=${encodeURIComponent(text)}`
    })
  }

  return (
    <View className='page-root crusher-root' style={{ background: theme.bg }}>
      <NavBar title='情绪粉碎机' />

      <View className='crusher-quotes'>
        {quotes.map((q, i) => (
          <View key={q} className='crusher-quote-line' style={{ animationDelay: `${i * 0.25}s` }}>
            {q}
          </View>
        ))}
      </View>

      <View className='crusher-input-card'>
        <Textarea
          className='crusher-textarea'
          value={text}
          maxlength={MAX_LEN}
          placeholder='把你的烦心事写在这里，比如：今天又被甲方改了八版'
          placeholderClass='crusher-placeholder'
          onInput={e => setText(e.detail.value)}
        />
        <View className='crusher-input-foot'>
          <Text className='crusher-preset-toggle' onClick={() => setShowPresets(v => !v)}>
            {showPresets ? '收起预设 ▲' : '没有头绪？点我选一个 ▼'}
          </Text>
          <Text className={`crusher-count ${text.length >= MAX_LEN ? 'crusher-count--max' : ''}`}>
            {text.length}/{MAX_LEN}
          </Text>
        </View>

        {showPresets && (
          <View className='crusher-presets'>
            {CRUSHER_PRESETS.map(g => (
              <View key={g.category} className='crusher-preset-group'>
                <View className='crusher-preset-cat'>
                  {g.icon} {g.category}
                </View>
                <View className='crusher-preset-items'>
                  {g.items.map(item => (
                    <Text key={item} className='crusher-preset-item' onClick={() => usePreset(item)}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className='crusher-section-label'>选择粉碎方式</View>
      <View className='crusher-modes'>
        {CRUSH_MODES.map(m => (
          <View
            key={m.id}
            className={`crusher-mode-card ${mode === m.id ? 'crusher-mode-card--active' : ''}`}
            onClick={() => pickMode(m.id)}
          >
            <Text className='crusher-mode-icon'>{m.icon}</Text>
            <Text className='crusher-mode-name'>{m.name}</Text>
            <Text className='crusher-mode-desc'>{m.desc}</Text>
          </View>
        ))}
      </View>

      <View className={`crusher-go btn-primary ${!text.trim() ? 'disabled' : ''}`} onClick={crush}>
        开始粉碎
      </View>

      <View className='crusher-stats'>
        今日已粉碎 {todayCount} 件 · 累计 {get<number>('crusher_total', 0)} 件
      </View>
    </View>
  )
}
