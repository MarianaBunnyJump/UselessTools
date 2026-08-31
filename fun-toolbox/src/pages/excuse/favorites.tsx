import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { EXCUSE_SCENES, EXCUSE_TONES } from '../../data/excuses'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './favorites.scss'

interface FavoriteItem {
  text: string
  scene: string
  tone: string
  ts: number
}

export default function ExcuseFavorites() {
  const [theme] = useState(getTheme())
  const [list, setList] = useState<FavoriteItem[]>(get<FavoriteItem[]>('excuse_favorites', []))

  useShareAppMessage(() => ({
    title: list.length > 0 ? list[0].text : '我的常用借口合集',
    path: '/pages/index/index'
  }))

  const persist = useCallback((next: FavoriteItem[]) => {
    setList(next)
    set('excuse_favorites', next)
  }, [])

  const copy = (text: string) => {
    Taro.setClipboardData({
      data: text,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    })
  }

  const remove = (item: FavoriteItem) => {
    Taro.showModal({
      title: '删除这条借口？',
      content: item.text,
      confirmText: '删除',
      confirmColor: '#EF5350',
      success: res => {
        if (res.confirm) {
          persist(list.filter(f => f.ts !== item.ts))
        }
      }
    })
  }

  const sceneName = (id: string) => EXCUSE_SCENES.find(s => s.id === id)?.name || ''
  const toneName = (id: string) => EXCUSE_TONES.find(t => t.id === id)?.name || ''

  return (
    <View className='page-root fav-root' style={{ background: theme.bg }}>
      <NavBar title='常用借口' />

      {list.length === 0 ? (
        <View className='fav-empty'>
          <Text className='fav-empty-icon'>🤍</Text>
          <View className='fav-empty-text'>还没有收藏任何借口</View>
          <View className='fav-empty-sub'>生成借口后点击"收藏到常用"</View>
        </View>
      ) : (
        <View className='fav-list'>
          {list.map(item => (
            <View key={item.ts} className='fav-item'>
              <View className='fav-item-head'>
                <View className='fav-item-tag'>{sceneName(item.scene)} · {toneName(item.tone)}风</View>
                <View className='fav-item-remove' onClick={() => remove(item)}>
                  <Text>✕</Text>
                </View>
              </View>
              <View className='fav-item-text'>"{item.text}"</View>
              <View className='fav-item-ops'>
                <View className='fav-item-copy' onClick={() => copy(item.text)}>
                  📋 复制
                </View>
                <Button className='fav-item-share' openType='share'>
                  📤 分享
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
