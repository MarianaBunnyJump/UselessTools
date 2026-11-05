import { View, Text, ScrollView, Image } from '@tarojs/components'
import type { CounterTag } from '../../../utils/counterStore'
import { colorOf } from '../../../utils/counterStore'

/* 标签切换行：横向滚动 + 新建入口 */
interface TagRowProps {
  tags: CounterTag[]
  activeId: string
  onPick: (id: string) => void
  onNew: () => void
}

export default function TagRow({ tags, activeId, onPick, onNew }: TagRowProps) {
  return (
    <ScrollView className='tag-row' scrollX enhanced showScrollbar={false}>
      {tags.map(t => {
        const c = colorOf(t.colorIdx)
        const on = t.id === activeId
        return (
          <View
            key={t.id}
            className={`tag-chip ${on ? 'on' : ''}`}
            style={{ '--c': c.hex } as any}
            onClick={() => onPick(t.id)}
          >
            {t.photo || t.photoUrl ? (
              <Image className='tag-dot-photo' src={t.photo || t.photoUrl} mode='aspectFill' />
            ) : (
              <View className='tag-dot' style={{ background: c.hex }} />
            )}
            <Text className='tag-chip-name'>{t.name}</Text>
          </View>
        )
      })}
      <View className='tag-chip add' onClick={onNew}>
        <Text className='tag-chip-plus'>+</Text>
        <Text className='tag-chip-name'>新建标签</Text>
      </View>
    </ScrollView>
  )
}
