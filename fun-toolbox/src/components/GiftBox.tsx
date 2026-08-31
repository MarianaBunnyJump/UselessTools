import { View, Text } from '@tarojs/components'
import type { ToolMeta } from '../data/tools'
import './gift-box.scss'

interface GiftBoxProps {
  tool: ToolMeta
  opening: boolean
  onOpen: (tool: ToolMeta) => void
  onLongPress?: (tool: ToolMeta) => void
}

export default function GiftBox({ tool, opening, onOpen, onLongPress }: GiftBoxProps) {
  return (
    <View
      className={`gift-box ${opening ? 'gift-box--opening' : ''}`}
      onClick={() => onOpen(tool)}
      onLongPress={() => onLongPress && onLongPress(tool)}
    >
      <View className='gb-stage'>
        <View className='gb-pop'>
          <Text className='gb-pop-icon'>{tool.icon}</Text>
        </View>
        <View className='gb-lid' style={{ background: tool.boxColorDeep }}>
          <View className='gb-lid-ribbon' style={{ background: tool.ribbonColor }} />
        </View>
        <View className='gb-body' style={{ background: tool.boxColor }}>
          <View className='gb-ribbon-v' style={{ background: tool.ribbonColor }} />
          <View className='gb-ribbon-h' style={{ background: tool.ribbonColor }} />
          <View className='gb-bow'>
            <View className='gb-bow-loop gb-bow-l' style={{ borderColor: tool.ribbonColor }} />
            <View className='gb-bow-loop gb-bow-r' style={{ borderColor: tool.ribbonColor }} />
            <View className='gb-bow-knot' style={{ background: tool.ribbonColor }} />
          </View>
        </View>
      </View>
      <View className='gb-name'>{tool.name}</View>
      <View className='gb-desc'>{tool.desc}</View>
    </View>
  )
}
