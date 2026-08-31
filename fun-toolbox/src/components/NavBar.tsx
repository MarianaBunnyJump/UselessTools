import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './nav-bar.scss'

interface NavBarProps {
  title: string
  showBack?: boolean
  right?: React.ReactNode
  onBack?: () => void
}

export default function NavBar({ title, showBack = true, right, onBack }: NavBarProps) {
  const [statusBarHeight, setStatusBarHeight] = useState(20)

  useEffect(() => {
    try {
      const info = Taro.getSystemInfoSync()
      setStatusBarHeight(info.statusBarHeight || 20)
    } catch (e) {
      /* 默认值兜底 */
    }
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack()
    }
  }

  return (
    <View className='nav-bar' style={{ paddingTop: `${statusBarHeight}px` }}>
      <View className='nav-bar-inner'>
        {showBack ? (
          <View className='nav-back' onClick={handleBack}>
            <Text className='nav-back-icon'>‹</Text>
          </View>
        ) : (
          <View className='nav-back nav-back-placeholder' />
        )}
        <Text className='nav-title'>{title}</Text>
        <View className='nav-right'>{right}</View>
      </View>
    </View>
  )
}
