import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'

/* 浮层外壳：灰把手下拉关闭（跟手 translateY，>90px 松手关）。
 * 与手机测试版一致：点遮罩不关闭，只有 ✕ / 取消 / 下拉会关。
 * 顶部要留出状态栏 + 胶囊的高度，否则浮层会顶到屏幕最上沿、几乎占满全屏。
 *
 * 注意两个坑：
 * 1) 根节点不能加 catchMove —— 它会吞掉 touchmove，内部 scroll-view 就拖不动了；
 * 2) 内容区必须用 scroll-view（普通 view 的 overflow-y:auto 在小程序里不滚动）。 */
interface SheetProps {
  title: string
  onClose: () => void
  children?: React.ReactNode
  /* 内容已自带 scroll-view 时可关掉外层滚动（目前默认都走外层） */
  scroll?: boolean
}

/* 基线在手机模型内部留了 54px 顶部空隙；真机等价物是状态栏 + 胶囊区域 */
function topGapPx(): number {
  try {
    const info: any = typeof (Taro as any).getWindowInfo === 'function'
      ? (Taro as any).getWindowInfo()
      : Taro.getSystemInfoSync()
    const sb = Number(info.statusBarHeight) || 20
    return sb + 34
  } catch (e) {
    return 64
  }
}

export default function Sheet({ title, onClose, children, scroll = true }: SheetProps) {
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [entered, setEntered] = useState(false)
  const gapRef = useRef<number>(0)
  const drag = useRef<{ y: number; dy: number } | null>(null)

  if (!gapRef.current) gapRef.current = topGapPx()

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

  /* 把手和标题栏都能拖着关（把手本身只有 10px，太难点中） */
  const dragProps = {
    onTouchStart,
    onTouchMove,
    onTouchEnd: end,
    onTouchCancel: end
  }

  const body = scroll
    ? <ScrollView className='sheet-body' scrollY>{children}</ScrollView>
    : children

  return (
    <View className={`sheet ${entered ? 'open' : ''}`} style={{ top: `${gapRef.current}px` }}>
      <View
        className={`sheet-inner ${dragging ? 'dragging' : ''}`}
        style={dy ? { transform: `translateY(${dy}px)` } : undefined}
      >
        <View className='sheet-grab-zone' {...dragProps}>
          <View className='sheet-grab' />
        </View>
        <View className='sheet-head' {...dragProps}>
          <Text className='sheet-title'>{title}</Text>
          <View className='sheet-x' onClick={onClose}>
            <Text>×</Text>
          </View>
        </View>
        {body}
      </View>
    </View>
  )
}
