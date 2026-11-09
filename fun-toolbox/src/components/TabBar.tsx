import { View, Text } from '@tarojs/components'
import './tab-bar.scss'

export type TabId = 'home' | 'list' | 'mine'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'list', label: '列表', icon: '☰' },
  { id: 'mine', label: '我的', icon: '👤' }
]

interface TabBarProps {
  active: TabId
  /* 皮肤 id：toy / starry / grid，决定底栏配色（设计稿 tab 跟随皮肤） */
  skinId: string
  onChange: (id: TabId) => void
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
          <Text className='tab-icon'>{t.icon}</Text>
          <Text className='tab-label'>{t.label}</Text>
        </View>
      ))}
    </View>
  )
}
