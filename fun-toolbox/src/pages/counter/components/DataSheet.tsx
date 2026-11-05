import { View, Text } from '@tarojs/components'
import Sheet from './Sheet'
import { todayStr } from '../../../utils/counterCalc'

/* 导入导出 · CSV 文件 */
interface DataSheetProps {
  onExport: () => void
  onImport: () => void
  onClose: () => void
}

export default function DataSheet({ onExport, onImport, onClose }: DataSheetProps) {
  return (
    <Sheet title='导入导出 · CSV 文件' onClose={onClose}>
      <Text className='form-label'>导出</Text>
      <Text className='data-note'>一个 CSV 装下全部：每个标签的每条记录、每个历史标记。存成文件，不必再往剪贴板里塞长文本。</Text>
      <View className='data-big' onClick={onExport}>
        <Text className='data-big-icon'>⇩</Text>
        <Text>导出 CSV 文件</Text>
      </View>
      <View className='data-file'>
        <Text>文件名</Text>
        <Text className='data-file-name'>一起数数-{todayStr()}.csv</Text>
      </View>

      <Text className='form-label data-gap'>导入</Text>
      <View className='data-big ghost' onClick={onImport}>
        <Text className='data-big-icon'>⇧</Text>
        <Text>从聊天选择 CSV 文件</Text>
      </View>
      <Text className='data-note'>同名标签合并追加、其余新建；今天之后的日期会自动跳过。</Text>
      <Text className='data-note'>导出的文件先发送到聊天再收藏，或用文件管理器转存，都不会丢。</Text>
    </Sheet>
  )
}
