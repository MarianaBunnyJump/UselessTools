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

interface NavLayout {
  statusBarHeight: number
  barHeight: number
  capsuleGap: number
}

export default function NavBar({ title, showBack = true, right, onBack }: NavBarProps) {
  /* 小程序下与微信胶囊按钮对齐，避免右侧按钮被胶囊遮挡；H5 回退到固定高度 */
  const [layout, setLayout] = useState<NavLayout>({
    statusBarHeight: 20,
    barHeight: 44,
    capsuleGap: 0
  })

  useEffect(() => {
    try {
      const info = Taro.getSystemInfoSync()
      const statusBarHeight = info.statusBarHeight || 20
      let barHeight = 44
      let capsuleGap = 0
      if (process.env.TARO_ENV === 'weapp' && Taro.getMenuButtonBoundingClientRect) {
        const menu = Taro.getMenuButtonBoundingClientRect()
        if (menu && menu.top > 0 && menu.height > 0) {
          barHeight = (menu.top - statusBarHeight) * 2 + menu.height
          capsuleGap = info.windowWidth - menu.left + 8
        }
      }
      setLayout({ statusBarHeight, barHeight, capsuleGap })
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
    <View className='nav-bar' style={{ paddingTop: `${layout.statusBarHeight}px` }}>
      <View className='nav-bar-inner' style={{ height: `${layout.barHeight}px` }}>
        {showBack ? (
          <View className='nav-back' onClick={handleBack}>
            <Text className='nav-back-icon'>‹</Text>
          </View>
        ) : (
          <View className='nav-back nav-back-placeholder' />
        )}
        <Text className='nav-title'>{title}</Text>
        <View className='nav-right' style={{ paddingRight: `${layout.capsuleGap}px` }}>
          {right}
        </View>
      </View>
    </View>
  )
}
