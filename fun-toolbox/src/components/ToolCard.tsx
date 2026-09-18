import { View, Text } from '@tarojs/components'
import type { ToolMeta } from '../data/tools'
import { DRAG_CONFIG } from '../data/dragConfig'
import GiftBox from './GiftBox'
import './tool-card.scss'

/* 卡片状态：pressing 阶段无视觉变化，不进入 */
export type CardState = 'idle' | 'grabbed' | 'dragging' | 'settling'

interface ToolCardProps {
  tool: ToolMeta
  opening: boolean
  state: CardState
  pressing: boolean          /* 长按计时中（仅 ⠿ 图标微反馈） */
  translate: { x: number; y: number }   /* 容器系左上角（真实 px） */
  z: number
  tiltDeg: number
  scale: number
  origin: { x: number; y: number } | null   /* 旋转中心：手指触点相对卡片 */
  pinnedTop: boolean
  pinPulse: boolean
  showHint: boolean
  onOpen: (tool: ToolMeta) => void
  onLongPressInfo: (tool: ToolMeta) => void
  onGrabTouchStart: (tool: ToolMeta, e: any) => void
  onGrabTouchMove: (e: any) => void
  onGrabTouchEnd: (e: any) => void
  onGrabTouchCancel: (e: any) => void
  onPinTop: (tool: ToolMeta) => void
}

export default function ToolCard(props: ToolCardProps) {
  const { tool, opening, state, pressing, translate, z, tiltDeg, scale, origin, pinnedTop, pinPulse, showHint } = props
  const lifted = state === 'grabbed' || state === 'dragging'

  return (
    <View
      id={`tc-${tool.id}`}
      className={`tool-card ${state === 'dragging' ? 'tool-card--dragging' : ''} ${state === 'settling' ? 'tool-card--settle' : ''}`}
      style={{ transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`, zIndex: z }}
    >
      {/* 位移（外层）与旋转/缩放（本层）分层：松手时位移与惯性回转可用不同时长曲线 */}
      <View
        className={`tc-tilt ${state === 'settling' ? 'tc-tilt--settle' : ''} ${lifted ? 'tc-tilt--lift' : ''} ${pinPulse ? 'tc-tilt--pulse' : ''}`}
        style={{
          transform: `rotate(${tiltDeg}deg) scale(${scale})`,
          transformOrigin: origin ? `${origin.x}px ${origin.y}px` : undefined
        }}
      >
        {/* 空中晃动（内层），与外层位移/旋转互不打架 */}
        <View className={`tc-sway ${state === 'dragging' ? 'tc-sway--active' : ''}`} style={{ animationDuration: `${DRAG_CONFIG.swayPeriodMs}ms` }}>
          <GiftBox tool={tool} opening={opening} onOpen={props.onOpen} onLongPress={props.onLongPressInfo} />
        </View>

        {/* 右上角长按热区：常驻 catch touchmove（拖动时阻止页面滚动）。
            动态切换 catchMove 会触发节点模板重挂载，恰好打断进行中的触摸流，故不动态切换 */}
        <View
          className='tc-grab'
          catchMove
          onTouchStart={e => props.onGrabTouchStart(tool, e)}
          onTouchMove={props.onGrabTouchMove}
          onTouchEnd={props.onGrabTouchEnd}
          onTouchCancel={props.onGrabTouchCancel}
        >
          <Text className={`tc-grab-icon ${lifted ? 'tc-grab-icon--on' : ''} ${pressing ? 'tc-grab-icon--pressing' : ''} ${showHint ? 'tc-grab-icon--hint' : ''}`}>⠿</Text>
        </View>

        {/* 底部置顶键（首位置灰） */}
        <View
          className={`tc-pin ${pinnedTop ? 'tc-pin--disabled' : ''}`}
          onClick={e => {
            e.stopPropagation()
            if (!pinnedTop) props.onPinTop(tool)
          }}
        >
          <Text className='tc-pin-icon'>⤒</Text>
        </View>
      </View>
    </View>
  )
}
