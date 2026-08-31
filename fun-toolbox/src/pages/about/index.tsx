import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { TOOLS } from '../../data/tools'
import { getTheme } from '../../utils/theme'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function About() {
  const [theme] = useState(getTheme())

  useShareAppMessage(() => ({
    title: '我在有点意思工具盒发现了一堆好玩的，来看看',
    path: '/pages/index/index'
  }))

  const handleFeedback = () => {
    Taro.setClipboardData({
      data: 'funtoolbox@example.com',
      success: () => {
        Taro.showModal({
          title: '意见反馈',
          content: '反馈邮箱已复制到剪贴板，欢迎告诉我们你想加的新工具～',
          showCancel: false
        })
      }
    })
  }

  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='关于' />

      <View className='about-hero'>
        <Text className='about-logo'>🎁</Text>
        <Text className='about-name'>有点意思工具盒</Text>
        <Text className='about-version'>v1.0.0</Text>
        <Text className='about-slogan'>收录了一些有点意思的东西</Text>
      </View>

      <View className='about-card'>
        <View className='about-card-title'>工具列表</View>
        {TOOLS.map(tool => (
          <View className='about-tool-row' key={tool.id}>
            <Text className='about-tool-icon'>{tool.icon}</Text>
            <Text className='about-tool-name'>{tool.name}</Text>
            <Text className='about-tool-desc'>{tool.desc}</Text>
          </View>
        ))}
      </View>

      <View className='about-actions'>
        <View className='btn-primary about-btn' onClick={handleFeedback}>
          意见反馈
        </View>
        <View className='about-tip'>
          所有数据仅保存在你的手机本地，无账号、无联网、无广告
        </View>
      </View>
    </View>
  )
}
