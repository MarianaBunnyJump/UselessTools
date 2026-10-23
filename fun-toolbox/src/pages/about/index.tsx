import { View, Text, Button } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { TOOLS } from '../../data/tools'
import { getTheme } from '../../utils/theme'
import { set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function About() {
  const [theme] = useState(getTheme())

  useShareAppMessage(() => ({
    title: '我在趣工局发现了一堆好玩的，来看看',
    path: '/pages/index/index'
  }))

  const handleFeedback = () => {
    Taro.setClipboardData({
      data: 'nikangd5300@163.com',
      success: () => {
        Taro.showModal({
          title: '意见反馈',
          content: '反馈邮箱 nikangd5300@163.com 已复制到剪贴板，欢迎告诉我们你想加的新工具～',
          showCancel: false
        })
      }
    })
  }

  /* 回首页重放开场导引：写一次性旗标，首页 useDidShow 消费（不写完成标记） */
  const handleReplayOnboarding = () => {
    set('onboarding_replay', true)
    const pages = Taro.getCurrentPages()
    const prev = pages.length > 1 ? pages[pages.length - 2] : null
    if (prev && prev.route === 'pages/index/index') {
      Taro.navigateBack()
    } else {
      Taro.reLaunch({ url: '/pages/index/index' })
    }
  }

  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='关于' />

      <View className='about-hero'>
        <Text className='about-logo'>🎁</Text>
        <Text className='about-name'>趣工局</Text>
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
        {process.env.TARO_ENV === 'weapp' && (
          <Button className='btn-primary about-btn about-contact-btn' openType='contact'>
            💬 联系客服
          </Button>
        )}
        <View className='btn-primary about-btn' onClick={handleFeedback}>
          意见反馈
        </View>
        <View className='about-device' onClick={() => Taro.navigateTo({ url: '/pages/fun/device/index' })}>
          设备信息（排查问题用） ›
        </View>
        <View className='btn-primary about-btn about-replay-btn' onClick={handleReplayOnboarding}>
          再看一遍开场导引
        </View>
        <View className='about-tip'>
          所有数据仅保存在你的手机本地，无账号、无联网、无广告
          {process.env.TARO_ENV === 'weapp' ? '' : '，反馈请发邮件 nikangd5300@163.com'}
        </View>
      </View>
    </View>
  )
}
