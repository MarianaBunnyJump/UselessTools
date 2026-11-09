import { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SheetShell from './SheetShell'
import { TOOLS, type ToolMeta } from '../../data/tools'
import { getCategories, getToolCategory, type ToolCategory } from '../../data/categories'
import { MAX_HOME_SLOTS, getMine, slotCap, toggleMine } from '../../utils/homePick'
import './sheet.scss'
import './pick-sheet.scss'

interface PickSheetProps {
  onClose: () => void
  /* 选择变化：首页网格立刻跟着变 */
  onChanged: (mine: string[]) => void
}

interface Group {
  cat: ToolCategory
  tools: ToolMeta[]
}

export default function PickSheet({ onClose, onChanged }: PickSheetProps) {
  const cap = slotCap()
  const [mine, setMine] = useState<string[]>(() => getMine())

  const groups: Group[] = useMemo(() => {
    const cats = getCategories()
    return cats
      .map(cat => ({ cat, tools: TOOLS.filter(t => getToolCategory(t, cats).id === cat.id) }))
      .filter(g => g.tools.length > 0)
  }, [])

  const pick = (id: string) => {
    const res = toggleMine(id)
    if (!res.ok) {
      if (res.reason === 'full') {
        Taro.showToast({ title: `当前等级最多 ${cap} 个，先收起一个`, icon: 'none' })
      }
      return
    }
    setMine(res.mine)
    onChanged(res.mine)
  }

  return (
    <SheetShell
      title={`首页工具 · ${mine.length}/${cap}`}
      onClose={onClose}
      footer={<View className='sheet-btn sheet-btn--main' onClick={onClose}>完成</View>}
    >
      {groups.map(g => (
        <View key={g.cat.id}>
          <View className='pk-sec'>
            <Text className='pk-sec-icon'>{g.cat.icon}</Text>
            <Text className='pk-sec-name'>{g.cat.name}</Text>
          </View>
          <View className='pk-list'>
            {g.tools.map(t => {
              const on = mine.indexOf(t.id) >= 0
              return (
                <View key={t.id} className={`pk ${on ? 'pk--on' : ''}`} onClick={() => pick(t.id)}>
                  <View className='pk-dot'>
                    <Text className='pk-dot-icon'>{t.icon}</Text>
                  </View>
                  <View className='pk-mid'>
                    <Text className='pk-name'>{t.name}</Text>
                    <Text className='pk-desc'>{t.desc}</Text>
                  </View>
                  <View className={`pk-mark ${on ? 'pk-mark--on' : ''}`}>
                    <Text className='pk-mark-txt'>{on ? '✓' : ''}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      ))}
      <View className='pk-note'>
        选中的工具会按顺序摆在首页的礼盒格里；没选中的全部留在「列表」。当前等级最多 {cap} 个（上限 {MAX_HOME_SLOTS} 个）。
      </View>
      <View className='sheet-foot-space' />
    </SheetShell>
  )
}
