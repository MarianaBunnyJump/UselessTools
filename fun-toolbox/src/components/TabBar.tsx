import { View, Text } from '@tarojs/components'
import './tab-bar.scss'

export type TabId = 'home' | 'list' | 'mine'

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'list', label: '列表' },
  { id: 'mine', label: '我的' }
]

interface TabBarProps {
  active: TabId
  /* 皮肤 id：toy / starry / grid，决定底栏配色（设计稿 tab 跟随皮肤） */
  skinId: string
  onChange: (id: TabId) => void
}

/* 线性图标：纯 CSS 绘制（描边跟随 currentColor），与设计稿的 stroke 图标同风格 */
function TabIcon({ id }: { id: TabId }) {
  if (id === 'home') {
    return (
      <View className='tab-ic tab-ic--home'>
        <View className='ti-house-roof' />
        <View className='ti-house-body' />
      </View>
    )
  }
  if (id === 'list') {
    return (
      <View className='tab-ic tab-ic--list'>
        <View className='ti-list-row'><View className='ti-list-tick' /><View className='ti-list-line' /></View>
        <View className='ti-list-row'><View className='ti-list-tick' /><View className='ti-list-line' /></View>
        <View className='ti-list-row'><View className='ti-list-tick' /><View className='ti-list-line' /></View>
      </View>
    )
  }
  return (
    <View className='tab-ic tab-ic--mine'>
      <View className='ti-user-head' />
      <View className='ti-user-body' />
    </View>
  )
}

export default function TabBar({ active, skinId, onChange }: TabBarProps) {
  return (
    <View className={`tab-bar tab-bar--${skinId || 'toy'}`}>
      {TABS.map(t => (
        <View
          key={t.id}
          id={`tab-${t.id}`}
          className={`tab-item ${active === t.id ? 'tab-item--on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {active === t.id && <View className='tab-ind' />}
          <TabIcon id={t.id} />
          <Text className='tab-label'>{t.label}</Text>
        </View>
      ))}
    </View>
  )
}
