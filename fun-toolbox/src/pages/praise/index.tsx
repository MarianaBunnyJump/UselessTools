import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { PRAISE_SCENES, PRAISE_TONES, PraiseScene, PraiseTone } from '../../data/praises'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

type Stage = 'name' | 'scene' | 'tone' | 'ready'

interface ChatMsg {
  id: number
  from: 'bot' | 'user'
  text: string
}

const INTRO = ['嗨～我是彩虹屁大师 🌈', '今天想把彩虹屁送给谁呀？输个名字，或者跳过就夸你～']

export default function Praise() {
  const [theme] = useState(getTheme())
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [stage, setStage] = useState<Stage>('name')
  const [typing, setTyping] = useState(false)
  const [name, setName] = useState('')
  const [nameDraft, setNameDraft] = useState('')
  const [scene, setScene] = useState('')
  const [tone, setTone] = useState('')
  const [favCount] = useState(get<any[]>('praise_favorites', []).length)
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

  const confirmName = () => {
    if (stage !== 'name') return
    const finalName = nameDraft.trim().slice(0, 12)
    setName(finalName)
    push('user', finalName ? `夸 ${finalName}！` : '夸我自己！')
    setStage('scene')
    botSay('好嘞，包夸到位🌈 想夸哪种关系？', 600)
  }

  const pickScene = (s: PraiseScene) => {
    if (stage !== 'scene') return
    setScene(s.id)
    push('user', `${s.icon} ${s.name}`)
    setStage('tone')
    botSay('眼光不错，这个最好夸了😏 要什么口味的？', 600)
  }

  const pickTone = (t: PraiseTone) => {
    if (stage !== 'tone') return
    setTone(t.id)
    push('user', `${t.icon} ${t.name}风`)
    setStage('ready')
    botSay('包在我身上，保证夸到心坎里 ✨', 650)
  }

  const generate = () => {
    if (scene === '' || tone === '') return
    set('praise_last_choice', { scene, tone, name })
    Taro.navigateTo({
      url: `/pages/praise/result?scene=${scene}&tone=${tone}&name=${encodeURIComponent(name)}`
    })
  }

  const restart = () => {
    setMessages([])
    setScene('')
    setTone('')
    setName('')
    setNameDraft('')
    setStage('name')
    setTyping(false)
    playIntro()
  }

  const goFavorites = () => {
    Taro.navigateTo({ url: '/pages/praise/favorites' })
  }

  return (
    <View className='page-root praise-root' style={{ background: theme.bg }}>
      <NavBar
        title='彩虹屁夸夸机'
        right={
          <Text className='praise-fav-btn' onClick={goFavorites}>
            ⭐{favCount > 0 ? ` ${favCount}` : ''}
          </Text>
        }
      />

      <ScrollView className='praise-chat' scrollY scrollWithAnimation scrollIntoView={scrollId}>
        {messages.map(m => (
          <View
            key={m.id}
            id={`msg-${m.id}`}
            className={`praise-msg-row ${m.from === 'bot' ? 'praise-msg-row--bot' : 'praise-msg-row--user'}`}
          >
            {m.from === 'bot' && <Text className='praise-avatar'>🌈</Text>}
            <View className={`praise-bubble praise-bubble--${m.from}`}>
              <Text>{m.text}</Text>
            </View>
          </View>
        ))}
        {typing && (
          <View className='praise-msg-row praise-msg-row--bot' id='msg-typing'>
            <Text className='praise-avatar'>🌈</Text>
            <View className='praise-bubble praise-bubble--bot praise-typing'>
              <View className='praise-typing-dot' />
              <View className='praise-typing-dot praise-typing-dot--2' />
              <View className='praise-typing-dot praise-typing-dot--3' />
            </View>
          </View>
        )}
      </ScrollView>

      <View className='praise-dock safe-bottom'>
        {stage === 'name' && (
          <View className='praise-dock-panel'>
            <View className='praise-dock-label'>TA 叫什么（可不填）</View>
            <View className='praise-name-row'>
              <Input
                className='praise-name-input'
                value={nameDraft}
                maxlength={12}
                placeholder='输入名字，空着就夸你'
                placeholderClass='praise-name-placeholder'
                onInput={e => setNameDraft(e.detail.value)}
              />
              <View className='praise-name-go' onClick={confirmName}>
                就 TA 了
              </View>
            </View>
          </View>
        )}
        {stage === 'scene' && (
          <View className='praise-dock-panel'>
            <View className='praise-dock-label'>夸哪种关系</View>
            <View className='praise-option-grid'>
              {PRAISE_SCENES.map(s => (
                <View key={s.id} className='praise-option' onClick={() => pickScene(s)}>
                  <Text className='praise-option-icon'>{s.icon}</Text>
                  <Text className='praise-option-name'>{s.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {stage === 'tone' && (
          <View className='praise-dock-panel'>
            <View className='praise-dock-label'>换个口味</View>
            <View className='praise-option-row'>
              {PRAISE_TONES.map(t => (
                <View key={t.id} className='praise-option praise-option--tone' onClick={() => pickTone(t)}>
                  <Text className='praise-option-icon'>{t.icon}</Text>
                  <Text className='praise-option-name'>{t.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {stage === 'ready' && (
          <View className='praise-dock-ready'>
            <View className='praise-generate btn-primary' onClick={generate}>
              夸起来 🌈
            </View>
            <View className='praise-restart' onClick={restart}>
              重新选
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
