import { View, Text, ScrollView } from '@tarojs/components'
import type { ReactNode } from 'react'
import './sheet.scss'

interface SheetShellProps {
  title: string
  onClose: () => void
  children: ReactNode
  /* 底部按钮区（没有就不渲染） */
  footer?: ReactNode
}

/* 底部浮层外壳：遮罩 + 圆角面板 + 滚动内容 + 按钮区 */
export default function SheetShell({ title, onClose, children, footer }: SheetShellProps) {
  return (
    <View className='sheet-mask' onClick={onClose}>
      <View className='sheet-panel' catchMove onClick={e => e.stopPropagation()}>
        <View className='sheet-grip' />
        <View className='sheet-head'>
          <Text className='sheet-title'>{title}</Text>
          <Text className='sheet-x' onClick={onClose}>✕</Text>
        </View>
        <ScrollView className='sheet-scroll' scrollY>
          {children}
        </ScrollView>
        {footer ? <View className='sheet-acts'>{footer}</View> : null}
      </View>
    </View>
  )
}
