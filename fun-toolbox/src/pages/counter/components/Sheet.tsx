import { View, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'

/* 浮层外壳：灰把手下拉关闭（跟手 translateY，>90px 松手关）。
 * 与手机测试版一致：点遮罩不关闭，只有 ✕ / 取消 / 下拉会关。 */
interface SheetProps {
  title: string
  onClose: () => void
  children?: React.ReactNode
}

export default function Sheet({ title, onClose, children }: SheetProps) {
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [entered, setEntered] = useState(false)
  const drag = useRef<{ y: number; dy: number } | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 20)
    return () => clearTimeout(t)
  }, [])

  const onTouchStart = (e: any) => {
    const t = e.touches && e.touches[0]
    if (!t) return
    drag.current = { y: t.clientY, dy: 0 }
    setDragging(true)
  }

  const onTouchMove = (e: any) => {
    const t = e.touches && e.touches[0]
    if (!drag.current || !t) return
    const next = Math.max(0, t.clientY - drag.current.y)
    drag.current.dy = next
    setDy(next)
  }

  const end = () => {
    if (!drag.current) return
    const moved = drag.current.dy
    drag.current = null
    setDragging(false)
    setDy(0)
    if (moved > 90) onClose()
  }

  return (
    <View className={`sheet ${entered ? 'open' : ''}`} catchMove>
      <View
        className={`sheet-inner ${dragging ? 'dragging' : ''}`}
        style={dy ? { transform: `translateY(${dy}px)` } : undefined}
      >
        <View
          className='sheet-grab'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={end}
          onTouchCancel={end}
        />
        <View className='sheet-head'>
          <Text className='sheet-title'>{title}</Text>
          <View className='sheet-x' onClick={onClose}>
            <Text>×</Text>
          </View>
        </View>
        {children}
      </View>
    </View>
  )
}
