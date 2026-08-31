import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { BACKGROUNDS, getTheme, setTheme, type BackgroundPreset } from '../../utils/theme'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function Settings() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())

  useEffect(() => {
    return () => {
      /* 页面返回时主题已通过事件广播 */
    }
  }, [])

  const handlePick = (id: string) => {
    const next = setTheme(id)
    setTh(next)
    Taro.showToast({ title: `已切换为${next.name}`, icon: 'none', duration: 1200 })
  }

  const goAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='设置' />

      <View className='settings-section-title'>全局背景（应用到整个工具盒）</View>
      <View className='settings-bg-list'>
        {BACKGROUNDS.map(bg => (
          <View
            key={bg.id}
            className={`settings-bg-card ${theme.id === bg.id ? 'settings-bg-card--active' : ''}`}
            style={{ background: bg.bg }}
            onClick={() => handlePick(bg.id)}
          >
            <Text className='settings-bg-accent' style={{ background: bg.accent }} />
            <Text className='settings-bg-name'>{bg.name}</Text>
            {theme.id === bg.id && <Text className='settings-bg-check'>✓</Text>}
          </View>
        ))}
      </View>

      <View className='settings-tip'>转盘配色会跟随全局背景自动搭配</View>

      <View className='settings-about-entry' onClick={goAbout}>
        关于有点意思工具盒 ›
      </View>
    </View>
  )
}
