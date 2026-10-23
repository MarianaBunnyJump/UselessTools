import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function SimpleLevelPage() {
  const [points] = useState(0)
  const [level] = useState(1)

  return (
    <View className='simple-level-page'>
      <View className='header'>
        <Text className='title'>工局等级</Text>
      </View>
      
      <View className='content'>
        <View className='level-info'>
          <Text className='level'>Lv.{level}</Text>
          <Text className='points'>{points} 工分</Text>
        </View>
        
        <View className='progress-bar'>
          <View className='progress-fill' />
        </View>
        
        <View className='message'>
          <Text>等级页面加载中...</Text>
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