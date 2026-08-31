import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { EXCUSES, EXCUSE_SCENES, EXCUSE_TONES } from '../../data/excuses'
import { getTheme } from '../../utils/theme'
import { get, set, addTotalCount } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './result.scss'

interface FavoriteItem {
  text: string
  scene: string
  tone: string
  ts: number
}

/* 排除最近 5 条，随机抽取一条 */
function pickExcuse(pool: string[]): string {
  const recent = get<string[]>('excuse_recent', [])
  let candidates = pool.filter(t => !recent.includes(t))
  if (candidates.length === 0) candidates = pool
  const text = candidates[Math.floor(Math.random() * candidates.length)]
  const nextRecent = [text, ...recent.filter(t => t !== text)].slice(0, 5)
  set('excuse_recent', nextRecent)
  addTotalCount('excuse_generated_total')
  return text
}

export default function ExcuseResult() {
  const [theme] = useState(getTheme())
  const params = Taro.getCurrentInstance().router?.params || {}
  const sceneId = params.scene || 'no_meet'
  const toneId = params.tone || 'humor'

  const pool = useMemo(() => EXCUSES[sceneId]?.[toneId] || [], [sceneId, toneId])
  const [text, setText] = useState(() => pickExcuse(pool))
  const [cardKey, setCardKey] = useState(0)

  useShareAppMessage(() => ({
    title: text,
    path: '/pages/index/index'
  }))

  const scene = EXCUSE_SCENES.find(s => s.id === sceneId)
  const tone = EXCUSE_TONES.find(t => t.id === toneId)

  const isFavorited = () => {
    const favs = get<FavoriteItem[]>('excuse_favorites', [])
    return favs.some(f => f.text === text)
  }
  const [favState, setFavState] = useState(isFavorited)

  const refresh = () => {
    setText(pickExcuse(pool))
    setCardKey(k => k + 1)
    setFavState(isFavorited())
  }

  const copy = () => {
    Taro.setClipboardData({
      data: text,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    })
  }

  const toggleFavorite = () => {
    const favs = get<FavoriteItem[]>(('excuse_favorites'), [])
    const idx = favs.findIndex(f => f.text === text)
    if (idx >= 0) {
      favs.splice(idx, 1)
      set('excuse_favorites', favs)
      setFavState(false)
      Taro.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favs.unshift({ text, scene: sceneId, tone: toneId, ts: Date.now() })
      set('excuse_favorites', favs)
      setFavState(true)
      Taro.showToast({ title: '已收藏到常用', icon: 'success' })
    }
  }

  return (
    <View className='page-root excuse-result-root' style={{ background: theme.bg }}>
      <NavBar title='借口生成器' />

      <View className='excuse-result-tag'>
        {scene?.icon} {scene?.name} · {tone?.name}风
      </View>

      <View className='excuse-result-card'>
        <View key={cardKey} className='excuse-result-text'>
          "{text}"
        </View>
      </View>

      <View className='excuse-result-ops'>
        <View className='excuse-op-btn' onClick={refresh}>
          <Text className='excuse-op-icon'>🔄</Text>
          <Text>换一个</Text>
        </View>
        <View className='excuse-op-btn' onClick={copy}>
          <Text className='excuse-op-icon'>📋</Text>
          <Text>复制</Text>
        </View>
        <Button
          className='excuse-op-btn excuse-op-share'
          openType='share'
        >
          <Text className='excuse-op-icon'>📤</Text>
          <Text>分享</Text>
        </Button>
      </View>

      <View
        className={`excuse-fav-bar ${favState ? 'excuse-fav-bar--done' : ''}`}
        onClick={toggleFavorite}
      >
        {favState ? '❤️ 已收藏，点击取消' : '🤍 收藏到常用'}
      </View>

      <View className='excuse-result-tip'>点击右上角菜单也可以转发给朋友</View>
    </View>
  )
}
