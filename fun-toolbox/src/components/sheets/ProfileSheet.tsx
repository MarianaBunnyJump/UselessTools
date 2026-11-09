import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SheetShell from './SheetShell'
import {
  AVA_COLORS,
  NICK_MAX,
  getColorIdx,
  getNick,
  initialOf,
  setColorIdx,
  setNick
} from '../../utils/profile'
import './sheet.scss'
import './profile-sheet.scss'

interface ProfileSheetProps {
  onClose: () => void
  /* 昵称/头像色保存后通知首页与「我的」刷新 */
  onSaved: () => void
}

export default function ProfileSheet({ onClose, onSaved }: ProfileSheetProps) {
  const [nick, setNickDraft] = useState(() => getNick())
  const [colorIdx, setIdx] = useState(() => getColorIdx())

  const save = () => {
    if (!setNick(nick)) {
      Taro.showToast({ title: '先写个昵称，1 到 16 个字', icon: 'none' })
      return
    }
    setColorIdx(colorIdx)
    onSaved()
    onClose()
    Taro.showToast({ title: '昵称已存到这台设备', icon: 'none' })
  }

  const shown = nick.trim()

  return (
    <SheetShell
      title='改昵称和头像色'
      onClose={onClose}
      footer={
        <>
          <View className='sheet-btn sheet-btn--ghost' onClick={onClose}>取消</View>
          <View className='sheet-btn sheet-btn--main' onClick={save}>保存</View>
        </>
      }
    >
      <View className='sheet-label sheet-label--first'>昵称</View>
      <Input
        className='pf-input'
        value={nick}
        maxlength={NICK_MAX}
        placeholder='比如：豆豆'
        onInput={e => setNickDraft(e.detail.value)}
      />

      <View className='sheet-label'>头像色</View>
      <View className='pf-swatches'>
        {AVA_COLORS.map((c, i) => (
          <View
            key={c}
            className={`pf-sw ${i === colorIdx ? 'pf-sw--on' : ''}`}
            style={{ background: c }}
            onClick={() => setIdx(i)}
          />
        ))}
      </View>

      <View className='sheet-label'>效果</View>
      <View className='pf-preview'>
        <View className='pf-ava' style={{ background: AVA_COLORS[colorIdx] }}>
          <Text className='pf-ava-txt'>{shown ? initialOf(shown) : '?'}</Text>
        </View>
        <View className='pf-pv-mid'>
          <Text className='pf-pv-name'>{shown || '趣工局访客'}</Text>
          <Text className='pf-pv-sub'>一起数数里会显示这个名字</Text>
        </View>
      </View>

      <View className='pf-note'>
        头像用「颜色 + 昵称首字」拼出来，不用上传图片、不占空间。清掉小程序数据后昵称会没。
      </View>
      <View className='sheet-foot-space' />
    </SheetShell>
  )
}
