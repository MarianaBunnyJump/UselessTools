import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { EXCUSE_SCENES, EXCUSE_TONES } from '../../data/excuses'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function Excuse() {
  const [theme] = useState(getTheme())
  const lastChoice = get<{ scene: string; tone: string }>('excuse_last_choice', {
    scene: 'no_meet',
    tone: 'humor'
  })
  const [scene, setScene] = useState(lastChoice.scene)
  const [tone, setTone] = useState(lastChoice.tone)
  const [favCount] = useState(get<any[]>('excuse_favorites', []).length)

  const pickScene = (id: string) => {
    setScene(id)
    set('excuse_last_choice', { scene: id, tone })
  }

  const pickTone = (id: string) => {
    setTone(id)
    set('excuse_last_choice', { scene, tone: id })
  }

  const generate = () => {
    Taro.navigateTo({ url: `/pages/excuse/result?scene=${scene}&tone=${tone}` })
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

      <View className='excuse-section-label'>选择场景</View>
      <View className='excuse-scene-grid'>
        {EXCUSE_SCENES.map(s => (
          <View
            key={s.id}
            className={`excuse-scene-card ${scene === s.id ? 'excuse-scene-card--active' : ''}`}
            onClick={() => pickScene(s.id)}
          >
            <Text className='excuse-scene-icon'>{s.icon}</Text>
            <Text className='excuse-scene-name'>{s.name}</Text>
          </View>
        ))}
      </View>

      <View className='excuse-section-label'>语气风格</View>
      <View className='excuse-tone-row'>
        {EXCUSE_TONES.map(t => (
          <View
            key={t.id}
            className={`excuse-tone-chip ${tone === t.id ? 'excuse-tone-chip--active' : ''}`}
            onClick={() => pickTone(t.id)}
          >
            <Text>{t.icon} {t.name}</Text>
          </View>
        ))}
      </View>

      <View className='excuse-actions'>
        <View className='excuse-generate btn-primary' onClick={generate}>
          生成借口
        </View>
        <View className='excuse-hint'>复制后直接粘贴到聊天框</View>
      </View>
    </View>
  )
}
