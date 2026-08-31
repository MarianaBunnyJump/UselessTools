import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './history.scss'

interface HistoryEntry {
  ts: number
  config: string
  result: string
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

export default function WheelHistory() {
  const [theme] = useState(getTheme())
  const [list, setList] = useState<HistoryEntry[]>(get<HistoryEntry[]>('wheel_history', []))

  const clear = () => {
    if (list.length === 0) return
    Taro.showModal({
      title: '清空历史',
      content: '所有转盘记录将被删除，确定吗？',
      confirmColor: '#EF5350',
      success: res => {
        if (!res.confirm) return
        setList([])
        set('wheel_history', [])
        Taro.showToast({ title: '已清空', icon: 'success' })
      }
    })
  }

  return (
    <View className='page-root wh-root' style={{ background: theme.bg }}>
      <NavBar
        title='转盘记录'
        right={
          <Text className='wh-clear-btn' onClick={clear}>
            🧹
          </Text>
        }
      />

      {list.length === 0 ? (
        <View className='wh-empty'>
          <Text className='wh-empty-icon'>🎡</Text>
          <View className='wh-empty-text'>还没有旋转记录</View>
          <View className='wh-empty-sub'>转一次，命运就多一条证据</View>
        </View>
      ) : (
        <View className='wh-list'>
          {list.map((h, i) => (
            <View key={h.ts + '-' + i} className='wh-item'>
              <View className='wh-item-main'>
                <Text className='wh-item-result'>{h.result}</Text>
                <Text className='wh-item-config'>来自「{h.config}」</Text>
              </View>
              <Text className='wh-item-time'>{formatTime(h.ts)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
