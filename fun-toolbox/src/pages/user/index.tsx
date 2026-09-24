import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function UserPage() {
  const [theme] = useState(getTheme())
  const [nickname, setNickname] = useState(() => get<string>('user_nickname', ''))
  const [draft, setDraft] = useState(nickname)

  const saveProfile = () => {
    const name = draft.trim()
    if (!name) {
      Taro.showToast({ title: '请输入访客昵称', icon: 'none' })
      return
    }
    set('user_nickname', name)
    setNickname(name)
    setDraft(name)
    Taro.showToast({ title: '本机访客昵称已保存', icon: 'success' })
  }

  return (
    <View className='page-root user-page' style={{ background: theme.bg }}>
      <NavBar title='本机访客资料' />
      <View className='user-hero'>
        <View className='user-avatar'>{nickname ? nickname.slice(0, 1) : '👤'}</View>
        <Text className='user-name'>{nickname || '趣工局访客'}</Text>
        <Text className='user-sub'>仅保存在这台设备上的访客资料</Text>
      </View>
      <View className='user-card'>
        <Text className='user-card-title'>访客昵称</Text>
        <Input className='user-input' value={draft} onInput={e => setDraft(e.detail.value)} placeholder='输入本机访客昵称' maxlength={16} />
        <View className='btn-primary user-btn' onClick={saveProfile}>保存本机昵称</View>
        <View className='user-row'><Text>资料保存位置</Text><Text className='user-muted'>本机</Text></View>
        <View className='user-row'><Text>账号状态</Text><Text className='user-muted'>未登录</Text></View>
      </View>
      <Text className='user-note'>昵称只保存在本机，不会同步到其他设备。清空小程序数据后将无法恢复。当前未接入后端，不提供手机号或微信登录，也不提供 VIP 领取。</Text>
    </View>
  )
}
