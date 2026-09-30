import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { PRAISES, PRAISE_SCENES, PRAISE_TONES } from '../../data/praises'
import { getTheme } from '../../utils/theme'
import { get, set, addTotalCount } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import SharePoster from '../../components/SharePoster'
import './result.scss'

interface FavoriteItem {
  text: string
  scene: string
  tone: string
  ts: number
}

/* 排除最近 5 条，随机抽取一条 */
function pickPraise(pool: string[]): string {
  const recent = get<string[]>('praise_recent', [])
  let candidates = pool.filter(t => !recent.includes(t))
  if (candidates.length === 0) candidates = pool
  const text = candidates[Math.floor(Math.random() * candidates.length)]
  const nextRecent = [text, ...recent.filter(t => t !== text)].slice(0, 5)
  set('praise_recent', nextRecent)
  addTotalCount('praise_generated_total')
  return text
}

export default function PraiseResult() {
  const [theme] = useState(getTheme())
  const params = Taro.getCurrentInstance().router?.params || {}
  const sceneId = params.scene || 'me'
  const toneId = params.tone || 'soft'
  const name = decodeURIComponent(params.name || '').slice(0, 12)
  const displayName = name || '你'

  const pool = useMemo(() => PRAISES[sceneId]?.[toneId] || [], [sceneId, toneId])
  const [raw, setRaw] = useState(() => pickPraise(pool))
  const [cardKey, setCardKey] = useState(0)

  /* {name} 占位替换 */
  const text = raw.replace(/\{name\}/g, displayName)

  useShareAppMessage(() => ({
    title: `送${name || '你'}一朵彩虹屁：${text.slice(0, 24)}…`,
    path: '/pages/index/index'
  }))

  const scene = PRAISE_SCENES.find(s => s.id === sceneId)
  const tone = PRAISE_TONES.find(t => t.id === toneId)

  const [favState, setFavState] = useState(() => {
    const favs = get<FavoriteItem[]>('praise_favorites', [])
    return favs.some(f => f.text === text)
  })

  const refresh = () => {
    const next = pickPraise(pool)
    setRaw(next)
    setCardKey(k => k + 1)
    const favs = get<FavoriteItem[]>('praise_favorites', [])
    setFavState(favs.some(f => f.text === next.replace(/\{name\}/g, displayName)))
  }

  const copy = () => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({ title: '已复制，快去夸人吧', icon: 'success' })
      }
    })
  }

  const toggleFavorite = () => {
    const favs = get<FavoriteItem[]>('praise_favorites', [])
    const idx = favs.findIndex(f => f.text === text)
    if (idx >= 0) {
      favs.splice(idx, 1)
      set('praise_favorites', favs)
      setFavState(false)
      Taro.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favs.unshift({ text, scene: sceneId, tone: toneId, ts: Date.now() })
      set('praise_favorites', favs)
      setFavState(true)
      Taro.showToast({ title: '已收藏到常用', icon: 'success' })
    }
  }

  return (
    <View className='page-root praise-result-root' style={{ background: theme.bg }}>
      <NavBar title='彩虹屁夸夸机' />

      <View className='praise-stage'>
        <View key={cardKey} className='praise-share-card'>
          <View className='praise-card-topbar' />
          <View className='praise-card-head'>
            <View className='praise-card-tag'>
              {scene?.icon} 给{displayName}的 · {tone?.name}风彩虹屁
            </View>
            <View className='praise-card-tools'>
              <View className='praise-tool' onClick={refresh}>
                <Text className='praise-tool-icon'>🔄</Text>
              </View>
              <View className='praise-tool' onClick={copy}>
                <Text className='praise-tool-icon'>📋</Text>
              </View>
              <View
                className={`praise-tool ${favState ? 'praise-tool--on' : ''}`}
                onClick={toggleFavorite}
              >
                <Text className='praise-tool-icon'>{favState ? '❤️' : '🤍'}</Text>
              </View>
              <Button className='praise-tool praise-tool--btn' openType='share'>
                <Text className='praise-tool-icon'>📤</Text>
              </Button>
            </View>
          </View>
          <Text className='praise-card-quote'>“</Text>
          <View className='praise-card-text'>{text}</View>
          <View className='praise-card-foot'>
            <Text className='praise-card-brand'>— 趣工局 · 彩虹屁夸夸机 —</Text>
          </View>
        </View>
        <View className='praise-stage-hint'>右上角小图标：换一个 · 复制 · 收藏 · 分享</View>
      </View>

      <SharePoster
        canvasId='praiseShareCanvas'
        toolName='彩虹屁夸夸机'
        accent={theme.accent}
        longText={text}
        lines={[`${scene?.icon || ''} ${scene?.name || ''} · ${tone?.name || ''}风彩虹屁`]}
      />
    </View>
  )
}
