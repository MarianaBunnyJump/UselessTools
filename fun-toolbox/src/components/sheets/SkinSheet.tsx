import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SheetShell from './SheetShell'
import {
  SKIN_EVENT,
  SKINS,
  activateSkin,
  claimSkin,
  getActiveSkinId,
  getOwnedSkins,
  skinLock,
  skinNeedLevel,
  type SkinDefinition
} from '../../skins/registry'
import './sheet.scss'
import './skin-sheet.scss'

interface SkinSheetProps {
  onClose: () => void
  /* 换肤成功：通知首页刷新底栏 / 背景 */
  onChanged: () => void
}

export default function SkinSheet({ onClose, onChanged }: SkinSheetProps) {
  const [activeId, setActiveId] = useState(() => getActiveSkinId())
  /* 领取后 owned 变化，靠这个计数重算锁定态 */
  const [owned, setOwned] = useState<string[]>(() => getOwnedSkins())

  const pick = (skin: SkinDefinition) => {
    if (activeId === skin.id) return
    const lock = skinLock(skin)
    if (lock.locked) {
      if (lock.offSeason) {
        Taro.showToast({ title: '圣诞工局只在 12 月开放', icon: 'none' })
      } else {
        Taro.showToast({ title: `升到 Lv.${skinNeedLevel(skin)} 解锁`, icon: 'none' })
      }
      return
    }
    /* 未拥有但已达标：先领取再启用（等级解锁即永久） */
    if (owned.indexOf(skin.id) < 0) {
      if (!claimSkin(skin.id)) {
        Taro.showToast({ title: '还没达到解锁条件', icon: 'none' })
        return
      }
      setOwned(getOwnedSkins())
    }
    if (!activateSkin(skin.id)) return
    setActiveId(skin.id)
    Taro.eventCenter.trigger(SKIN_EVENT, skin.id)
    onChanged()
    Taro.showToast({ title: `已换成「${skin.name}」`, icon: 'none' })
  }

  return (
    <SheetShell
      title='小程序皮肤'
      onClose={onClose}
      footer={<View className='sheet-btn sheet-btn--main' onClick={onClose}>完成</View>}
    >
      <View className='sk-list'>
        {SKINS.map(skin => {
          const lock = skinLock(skin)
          const isActive = activeId === skin.id
          const ownedSkin = owned.indexOf(skin.id) >= 0
          let tag = ''
          if (isActive) tag = '使用中'
          else if (lock.locked) tag = lock.offSeason ? '12 月开放' : `Lv.${skinNeedLevel(skin)} 解锁`
          else if (!ownedSkin) tag = '可领取'
          return (
            <View
              key={skin.id}
              className={`sk ${isActive ? 'sk--on' : ''}`}
              onClick={() => pick(skin)}
            >
              <View className='sk-prev' style={{ background: skin.preview }} />
              <View className='sk-mid'>
                <Text className='sk-name'>{skin.name}</Text>
                <Text className='sk-desc'>{skin.desc}</Text>
              </View>
              <Text className={`sk-tag ${isActive ? 'sk-tag--on' : lock.locked ? 'sk-tag--lock' : ''}`}>
                {tag}
              </Text>
            </View>
          )
        })}
      </View>
      <View className='sk-note'>
        皮肤是整套换：首页背景、列表底色、我的页和底部栏会一起换。等级解锁的皮肤达到等级即永久可用。
      </View>
      <View className='sheet-foot-space' />
    </SheetShell>
  )
}
