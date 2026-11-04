import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { getWorkPoints, getWorkLevel } from '../../skins/workPoints'

export default function SimpleLevelPage() {
  const [points] = useState(getWorkPoints())
  const [current] = useState(getWorkLevel(getWorkPoints()))

  return (
    <View className='simple-level-page'>
      <View className='header'>
        <Text className='title'>工局等级</Text>
      </View>

      <View className='content'>
        <View className='level-info'>
          <Text className='level'>Lv.{current.level}</Text>
          <Text className='points'>{points} 工分</Text>
        </View>

        <View className='progress-bar'>
          <View className='progress-fill' />
        </View>

        <View className='message'>
          <Text>每打开一次工具 +10 工分，等级代表你在趣工局留下的足迹。</Text>
        </View>
      </View>

      <View className='footer'>
        <Button
          className='back-button'
          onClick={() => Taro.navigateBack()}
        >
          返回首页
        </Button>
      </View>
    </View>
  )
}
