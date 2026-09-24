import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function RegistrationPage() {
  const [theme] = useState(getTheme())
  const [nickname, setNickname] = useState(() => get<string>('user_nickname', ''))
  const [draftNickname, setDraftNickname] = useState(nickname)
  const [registrationCode, setRegistrationCode] = useState('')
  const [isRegistered, setIsRegistered] = useState(() => get<boolean>('user_registered', false))
  const [registrationDate, setRegistrationDate] = useState(() => get<string>('user_registration_date', ''))
  const [showSuccess, setShowSuccess] = useState(false)

  const saveNickname = () => {
    const name = draftNickname.trim()
    if (!name) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    set('user_nickname', name)
    setNickname(name)
    Taro.showToast({ title: '昵称已保存', icon: 'success' })
  }

  const handleRegister = () => {
    if (!draftNickname.trim()) {
      Taro.showToast({ title: '请先输入昵称', icon: 'none' })
      return
    }
    
    if (!registrationCode.trim()) {
      Taro.showToast({ title: '请输入登记码', icon: 'none' })
      return
    }

    // 模拟登记验证逻辑
    const validCodes = ['FUN2024', 'TOOLBOX', 'REGISTER001']
    if (!validCodes.includes(registrationCode.toUpperCase())) {
      Taro.showToast({ title: '登记码无效', icon: 'none' })
      return
    }

    // 保存登记信息
    const now = new Date().toISOString()
    set('user_registered', true)
    set('user_registration_date', now)
    set('user_registration_code', registrationCode)
    setIsRegistered(true)
    setRegistrationDate(now)
    setShowSuccess(true)
    
    Taro.showToast({ title: '登记成功！', icon: 'success' })
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const resetRegistration = () => {
    Taro.showModal({
      title: '重新登记',
      content: '将清除当前登记信息，可以重新输入登记码进行登记。',
      confirmText: '重新登记',
      confirmColor: '#EF5350',
      success: res => {
        if (res.confirm) {
          set('user_registered', false)
          set('user_registration_date', '')
          set('user_registration_code', '')
          setIsRegistered(false)
          setRegistrationCode('')
          setShowSuccess(false)
          Taro.showToast({ title: '已清除登记信息', icon: 'success' })
        }
      }
    })
  }

  const formatRegistrationDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <View className='page-root registration-page' style={{ background: theme.bg }}>
      <NavBar title='登记系统' />
      
      {/* 成功提示 */}
      {showSuccess && (
        <View className='registration-success'>
          <Text className='registration-success-icon'>✅</Text>
          <Text className='registration-success-text'>登记成功！欢迎加入趣工局</Text>
        </View>
      )}

      <View className='registration-container'>
        {/* 昵称设置 */}
        <View className='registration-card'>
          <Text className='registration-title'>👤 设置昵称</Text>
          <Text className='registration-subtitle'>为你的趣工局身份起个名字</Text>
          
          <View className='nickname-input-group'>
            <Input 
              className='nickname-input' 
              value={draftNickname} 
              onInput={e => setDraftNickname(e.detail.value)} 
              placeholder='请输入昵称（2-16个字符）'
              maxlength={16}
            />
            <Button className='nickname-save-btn' onClick={saveNickname}>
              保存
            </Button>
          </View>
          
          {nickname && (
            <View className='nickname-current'>
              <Text className='nickname-current-label'>当前昵称：</Text>
              <Text className='nickname-current-value'>{nickname}</Text>
            </View>
          )}
        </View>

        {/* 登记表单 */}
        {!isRegistered ? (
          <View className='registration-card'>
            <Text className='registration-title'>📝 完成登记</Text>
            <Text className='registration-subtitle'>输入登记码加入趣工局大家庭</Text>
            
            <View className='registration-code-group'>
              <Input 
                className='registration-code-input' 
                value={registrationCode} 
                onInput={e => setRegistrationCode(e.detail.value)} 
                placeholder='请输入登记码'
                maxlength={20}
              />
              <Button 
                className='registration-submit-btn' 
                onClick={handleRegister}
              >
                立即登记
              </Button>
            </View>
            
            <View className='registration-tips'>
              <Text className='registration-tips-title'>💡 登记码提示：</Text>
              <Text className='registration-tips-text'>请联系管理员获取有效登记码</Text>
              <Text className='registration-tips-text'>常见登记码：FUN2024、TOOLBOX、REGISTER001</Text>
            </View>
          </View>
        ) : (
          <View className='registration-card'>
            <Text className='registration-title'>✅ 登记完成</Text>
            <Text className='registration-subtitle'>你已经成功加入趣工局</Text>
            
            <View className='registration-info'>
              <View className='registration-info-item'>
                <Text className='registration-info-label'>登记昵称：</Text>
                <Text className='registration-info-value'>{nickname}</Text>
              </View>
              <View className='registration-info-item'>
                <Text className='registration-info-label'>登记时间：</Text>
                <Text className='registration-info-value'>{formatRegistrationDate(registrationDate)}</Text>
              </View>
              <View className='registration-info-item'>
                <Text className='registration-info-label'>登记码：</Text>
                <Text className='registration-info-value'>{registrationCode}</Text>
              </View>
            </View>
            
            <Button className='registration-reset-btn' onClick={resetRegistration}>
              重新登记
            </Button>
          </View>
        )}

        {/* 登记说明 */}
        <View className='registration-guide'>
          <Text className='registration-guide-title'>🎯 登记说明</Text>
          <View className='registration-guide-content'>
            <Text className='registration-guide-item'>• 登记后可以参与更多互动功能</Text>
            <Text className='registration-guide-item'>• 登记信息仅保存在本机</Text>
            <Text className='registration-guide-item'>• 可以随时修改昵称</Text>
            <Text className='registration-guide-item'>• 支持重新登记（会清除原记录）</Text>
            <Text className='registration-guide-item'>• 当前为本地登记，未来将支持云端同步</Text>
          </View>
        </View>
      </View>
    </View>
  )
}