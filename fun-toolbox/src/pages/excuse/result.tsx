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

  const [favState, setFavState] = useState(() => {
    const favs = get<FavoriteItem[]>('excuse_favorites', [])
    return favs.some(f => f.text === text)
  })

  const refresh = () => {
    const next = pickExcuse(pool)
    setText(next)
    setCardKey(k => k + 1)
    const favs = get<FavoriteItem[]>('excuse_favorites', [])
    setFavState(favs.some(f => f.text === next))
  }

  const copy = () => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({ title: '已复制，去粘贴吧', icon: 'success' })
      }
    })
  }

  const toggleFavorite = () => {
    const favs = get<FavoriteItem[]>('excuse_favorites', [])
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

      <View className='excuse-stage'>
        <View key={cardKey} className='excuse-share-card'>
          <View className='excuse-card-topbar' />
          <View className='excuse-card-head'>
            <View className='excuse-card-tag'>
              {scene?.icon} {scene?.name} · {tone?.name}风
            </View>
            <View className='excuse-card-tools'>
              <View className='excuse-tool' onClick={refresh}>
                <Text className='excuse-tool-icon'>🔄</Text>
              </View>
              <View className='excuse-tool' onClick={copy}>
                <Text className='excuse-tool-icon'>📋</Text>
              </View>
              <View
                className={`excuse-tool ${favState ? 'excuse-tool--on' : ''}`}
                onClick={toggleFavorite}
              >
                <Text className='excuse-tool-icon'>{favState ? '❤️' : '🤍'}</Text>
              </View>
              <Button className='excuse-tool excuse-tool--btn' openType='share'>
                <Text className='excuse-tool-icon'>📤</Text>
              </Button>
            </View>
          </View>
          <Text className='excuse-card-quote'>“</Text>
          <View className='excuse-card-text'>{text}</View>
          <View className='excuse-card-foot'>
            <Text className='excuse-card-brand'>— 趣工局 · 借口生成器 —</Text>
          </View>
        </View>
        <View className='excuse-stage-hint'>右上角小图标：换一个 · 复制 · 收藏 · 分享</View>
      </View>
    </View>
  )
}
