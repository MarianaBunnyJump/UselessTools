import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { EXCUSE_SCENES, EXCUSE_TONES, ExcuseScene, ExcuseTone } from '../../data/excuses'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

type Stage = 'scene' | 'tone' | 'ready'

interface ChatMsg {
  id: number
  from: 'bot' | 'user'
  text: string
}

const INTRO = ['嗨～我是借口大师 🎭', '今天遇到啥难题啦？选一个，我帮你圆过去～']

export default function Excuse() {
  const [theme] = useState(getTheme())
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [stage, setStage] = useState<Stage>('scene')
  const [typing, setTyping] = useState(false)
  const [scene, setScene] = useState('')
  const [tone, setTone] = useState('')
  const [favCount] = useState(get<any[]>('excuse_favorites', []).length)
  const [scrollId, setScrollId] = useState('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const nextId = useRef(0)

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  const push = (from: 'bot' | 'user', text: string) => {
    nextId.current += 1
    setMessages(prev => [...prev, { id: nextId.current, from, text }])
    setScrollId(`msg-${nextId.current}`)
  }

  const botSay = (text: string, ms: number) => {
    setTyping(true)
    setScrollId('msg-typing')
    later(() => {
      setTyping(false)
      push('bot', text)
    }, ms)
  }

  const playIntro = () => {
    botSay(INTRO[0], 450)
    later(() => botSay(INTRO[1], 550), 950)
  }

  useEffect(() => {
    playIntro()
    return () => {
      timers.current.forEach(t => clearTimeout(t))
      timers.current = []
    }
  }, [])

  const pickScene = (s: ExcuseScene) => {
    if (stage !== 'scene') return
    setScene(s.id)
    push('user', `${s.icon} ${s.name}`)
    setStage('tone')
    botSay('哦？这种局最难推了😏 想要什么味道的借口？', 600)
  }

  const pickTone = (t: ExcuseTone) => {
    if (stage !== 'tone') return
    setTone(t.id)
    push('user', `${t.icon} ${t.name}风`)
    setStage('ready')
    botSay('包在我身上，保证你全身而退 ✨', 650)
  }

  const generate = () => {
    if (scene === '' || tone === '') return
    set('excuse_last_choice', { scene, tone })
    Taro.navigateTo({ url: `/pages/excuse/result?scene=${scene}&tone=${tone}` })
  }

  const restart = () => {
    setMessages([])
    setScene('')
    setTone('')
    setStage('scene')
    setTyping(false)
    playIntro()
  }

  const goFavorites = () => {
    Taro.navigateTo({ url: '/pages/excuse/favorites' })
  }

  return (
    <View className='page-root excuse-root' style={{ background: theme.bg }}>
      <NavBar
        title='借口生成器'
        right={
          <Text className='excuse-fav-btn' onClick={goFavorites}>
            ⭐{favCount > 0 ? ` ${favCount}` : ''}
          </Text>
        }
      />

      <ScrollView className='excuse-chat' scrollY scrollWithAnimation scrollIntoView={scrollId}>
        <View className='excuse-chat-pad'>
          {messages.map(m => (
            <View
              key={m.id}
              id={`msg-${m.id}`}
              className={`excuse-msg-row ${m.from === 'bot' ? 'excuse-msg-row--bot' : 'excuse-msg-row--user'}`}
            >
              {m.from === 'bot' && <Text className='excuse-avatar'>🎭</Text>}
              <View className={`excuse-bubble excuse-bubble--${m.from}`}>
                <Text>{m.text}</Text>
              </View>
            </View>
          ))}
          {typing && (
            <View className='excuse-msg-row excuse-msg-row--bot' id='msg-typing'>
              <Text className='excuse-avatar'>🎭</Text>
              <View className='excuse-bubble excuse-bubble--bot excuse-typing'>
                <View className='excuse-typing-dot' />
                <View className='excuse-typing-dot excuse-typing-dot--2' />
                <View className='excuse-typing-dot excuse-typing-dot--3' />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className='excuse-dock safe-bottom'>
        {stage === 'scene' && (
          <View className='excuse-dock-panel'>
            <View className='excuse-dock-label'>选选你的难题</View>
            <View className='excuse-option-grid'>
              {EXCUSE_SCENES.map(s => (
                <View key={s.id} className='excuse-option' onClick={() => pickScene(s)}>
                  <Text className='excuse-option-icon'>{s.icon}</Text>
                  <Text className='excuse-option-name'>{s.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {stage === 'tone' && (
          <View className='excuse-dock-panel'>
            <View className='excuse-dock-label'>换个口味</View>
            <View className='excuse-option-row'>
              {EXCUSE_TONES.map(t => (
                <View
                  key={t.id}
                  className='excuse-option excuse-option--tone'
                  onClick={() => pickTone(t)}
                >
                  <Text className='excuse-option-icon'>{t.icon}</Text>
                  <Text className='excuse-option-name'>{t.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {stage === 'ready' && (
          <View className='excuse-dock-ready'>
            <View className='excuse-generate btn-primary' onClick={generate}>
              变一个 ✨
            </View>
            <View className='excuse-restart' onClick={restart}>
              重新选
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
