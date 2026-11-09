import { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { LV_NAME, getPoints, lvOf, lvProgress } from '../utils/growth'
import { getMine, slotCap } from '../utils/homePick'
import { avaColor, getNick, initialOf } from '../utils/profile'
import './mine-tab.scss'

export type MineSheet = 'profile' | 'growth' | 'pick' | 'skin'

interface MineTabProps {
  /* 顶栏留白（真实 px，与首页按钮同一基线） */
  topPad: number
  skinId: string
  skinName: string
  /* 浮层里改过昵称/工具/等级后自增，触发重读 */
  refreshKey: number
  onOpenSheet: (name: MineSheet) => void
  onOpenSettings: () => void
  onOpenAbout: () => void
}

export default function MineTab(props: MineTabProps) {
  const { topPad, skinId, skinName, refreshKey, onOpenSheet, onOpenSettings, onOpenAbout } = props

  const data = useMemo(() => {
    const points = getPoints()
    const mine = getMine()
    return {
      nick: getNick(),
      points,
      level: lvOf(points),
      mineCount: mine.length,
      cap: slotCap()
    }
  }, [refreshKey])

  const nick = data.nick
  const pct = lvProgress(data.points)

  return (
    <View className={`mine-tab mine-tab--${skinId || 'toy'}`} style={{ paddingTop: `${topPad}px` }}>
      <View className='me-hero'>
        {nick ? (
          <View className='me-ava' style={{ background: avaColor() }}>
            <Text className='me-ava-txt'>{initialOf(nick)}</Text>
          </View>
        ) : (
          <View className='me-ava me-ava--guest'>
            <Text className='me-ava-guest-icon'>👤</Text>
          </View>
        )}
        <Text className={`me-name ${nick ? '' : 'me-name--muted'}`}>{nick || '趣工局访客'}</Text>
        <View className='me-edit' id='me-edit' onClick={() => onOpenSheet('profile')}>
          <Text className='me-edit-txt'>✏️ {nick ? '改昵称和头像色' : '起个昵称'}</Text>
        </View>

        <View className='me-lv' id='me-level' onClick={() => onOpenSheet('growth')}>
          <Text className='me-lv-i'>🏅</Text>
          <View className='me-lv-mid'>
            <View className='me-lv-row'>
              <Text className='me-lv-t'>Lv.{data.level} {LV_NAME[data.level - 1]}</Text>
              <Text className='me-lv-p'>{data.points} 工分</Text>
            </View>
            <View className='me-lv-track'>
              <View className='me-lv-fill' style={{ width: `${pct}%` }} />
            </View>
          </View>
          <Text className='me-lv-go'>看奖励 ›</Text>
        </View>
      </View>

      <View className='me-list'>
        <View className='me-row' id='me-pick' onClick={() => onOpenSheet('pick')}>
          <View className='me-ic'><Text className='me-ic-txt'>🧰</Text></View>
          <View className='me-rt'>
            <Text className='me-rt-b'>首页工具</Text>
            <Text className='me-rt-s'>从全部工具里挑 1~9 个放到首页</Text>
          </View>
          <Text className='me-val'>{data.mineCount}/{data.cap} ›</Text>
        </View>

        <View className='me-row' id='me-skin' onClick={() => onOpenSheet('skin')}>
          <View className='me-ic'><Text className='me-ic-txt'>🎨</Text></View>
          <View className='me-rt'>
            <Text className='me-rt-b'>小程序皮肤</Text>
            <Text className='me-rt-s'>首页 / 列表 / 我的 整套一起换</Text>
          </View>
          <Text className='me-val'>{skinName} ›</Text>
        </View>

        <View className='me-row' id='me-settings' onClick={onOpenSettings}>
          <View className='me-ic'><Text className='me-ic-txt'>⚙️</Text></View>
          <View className='me-rt'>
            <Text className='me-rt-b'>更多设置</Text>
            <Text className='me-rt-s'>背景印花、拖放反馈、重看导引</Text>
          </View>
          <Text className='me-val'>›</Text>
        </View>

        <View className='me-row' id='me-about' onClick={onOpenAbout}>
          <View className='me-ic'><Text className='me-ic-txt'>💡</Text></View>
          <View className='me-rt'>
            <Text className='me-rt-b'>关于趣工局</Text>
            <Text className='me-rt-s'>点一下就有乐子</Text>
          </View>
          <Text className='me-val'>›</Text>
        </View>
      </View>

      <View className='me-foot'>design by Mariana</View>
    </View>
  )
}
