import { View, Text } from '@tarojs/components'
import { memo } from 'react'
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
  slotScale: number          /* 槽位缩放（树挂 0.7）；抓起时由父级传 1 提到全尺寸 */
  origin: { x: number; y: number } | null   /* 旋转中心：手指触点相对卡片 */
  landEffect: boolean        /* 落地压扁回弹（设置「拖放反馈」） */
  settleMs: number           /* 松手回位时长（随皮肤变化，树挂摆回更慢） */
  hangingString: boolean     /* 顶部挂绳（树皮肤） */
  idleSway: boolean          /* 静置缓慢摆动（树皮肤） */
  swayDelayMs: number        /* 摆动相位错开 */
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

/* memo：触摸移动只更新被拖卡片，其余卡片 props 引用稳定即跳过重渲染 */
function ToolCard(props: ToolCardProps) {
  const {
    tool, opening, state, pressing, translate, z, tiltDeg, slotScale, origin,
    landEffect, settleMs, hangingString, idleSway, swayDelayMs, pinnedTop, pinPulse, showHint
  } = props
  const lifted = state === 'grabbed' || state === 'dragging'
  const settling = state === 'settling'

  const swayClass = state === 'dragging'
    ? 'tc-sway--active'
    : settling && landEffect
      ? 'tc-sway--land'
      : idleSway && state === 'idle'
        ? 'tc-sway--idle'
        : ''
  const swayDuration = state === 'dragging'
    ? DRAG_CONFIG.swayPeriodMs
    : settling && landEffect
      ? DRAG_CONFIG.landDurationMs
      : 4000

  return (
    <View
      id={`tc-${tool.id}`}
      className={`tool-card ${state === 'dragging' ? 'tool-card--dragging' : ''} ${settling ? 'tool-card--settle' : ''}`}
      style={{
        transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${slotScale})`,
        zIndex: z,
        /* 松手回位时长随皮肤变化（树挂摆回更慢） */
        transitionDuration: settling ? `${settleMs}ms` : undefined
      }}
    >
      {/* 位移+缩放（外层）与旋转（本层）分层：松手时位移与惯性回转可用不同时长曲线 */}
      <View
        className={`tc-tilt ${settling ? 'tc-tilt--settle' : ''} ${lifted ? 'tc-tilt--lift' : ''} ${pinPulse ? 'tc-tilt--pulse' : ''}`}
        style={{
          transform: `rotate(${tiltDeg}deg)`,
          transformOrigin: origin ? `${origin.x}px ${origin.y}px` : undefined,
          transitionDuration: settling ? `${settleMs}ms` : undefined
        }}
      >
        {/* 空中晃动/落地回弹/静置摆动都挂内层，与外层位移互不打架 */}
        <View
          className={`tc-sway ${swayClass}`}
          style={{
            animationDuration: `${swayDuration}ms`,
            animationDelay: swayClass === 'tc-sway--idle' ? `${swayDelayMs}ms` : undefined
          }}
        >
          {hangingString && !lifted && <View className='tc-string' />}
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

export default memo(ToolCard)
