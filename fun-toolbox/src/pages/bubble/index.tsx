import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect, useCallback } from 'react'
import { getTheme } from '../../utils/theme'
import { playPopSound, isSupported } from '../../utils/audio'
import { get, getDailyCount, addDailyCount, addTotalCount } from '../../utils/storage'
import { track } from '../../utils/analytics'
import NavBar from '../../components/NavBar'
import './index.scss'

const COLS = 6
const ROWS = 8
const COUNT = COLS * ROWS

const blankSheet = () => Array<boolean>(COUNT).fill(false)

export default function Bubble() {
  const [theme] = useState(getTheme())
  const [sheetKey, setSheetKey] = useState(0)
  const [popped, setPopped] = useState<boolean[]>(blankSheet)
  const [today, setToday] = useState(getDailyCount('bubble_today').count)
  const [total, setTotal] = useState(get<number>('bubble_total', 0))
  const [gridH, setGridH] = useState(0)

  /* ref 镜像：滑动连爆时同一气泡在两次渲染间也要去重 */
  const poppedRef = useRef<boolean[]>(popped)
  const rectRef = useRef<{ left: number; top: number; cell: number } | null>(null)
  const lastPtRef = useRef<{ x: number; y: number } | null>(null)
  const lastVibRef = useRef(0)

  useShareAppMessage(() => ({
    title: '发现一张捏不完的气泡纸，解压神器',
    path: '/pages/index/index'
  }))

  const pop = useCallback((i: number) => {
    if (i < 0 || i >= COUNT || poppedRef.current[i]) return
    poppedRef.current[i] = true
    setPopped([...poppedRef.current])
    if (isSupported()) playPopSound()
    /* 滑动连爆时限频震动，避免手掌发麻 */
    const now = Date.now()
    if (now - lastVibRef.current > 90) {
      lastVibRef.current = now
      if (process.env.TARO_ENV === 'weapp') {
        try {
          const r = Taro.vibrateShort({ type: 'light' } as any)
          if (r && typeof r.catch === 'function') r.catch(() => {})
        } catch (err) {
          /* 低版本基础库忽略 */
        }
      }
    }
    setToday(addDailyCount('bubble_today'))
    setTotal(addTotalCount('bubble_total'))
  }, [])

  const newSheet = useCallback(() => {
    poppedRef.current = blankSheet()
    setPopped(blankSheet())
    setSheetKey(k => k + 1)
  }, [])

  /* 捏完整张 → 埋点 + 自动铺一张新的 */
  useEffect(() => {
    if (popped.every(Boolean)) {
      track('bubble_sheet_done')
      const timer = setTimeout(newSheet, 1100)
      return () => clearTimeout(timer)
    }
  }, [popped, newSheet])

  /* 首帧量格子：定高度 + 缓存触摸换算用的矩形 */
  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('.bubble-grid')
        .boundingClientRect()
        .exec(res => {
          if (!res || !res[0] || !(res[0].width > 0)) return
          const cell = res[0].width / COLS
          setGridH(cell * ROWS)
          rectRef.current = { left: res[0].left, top: res[0].top, cell }
        })
    }, 60)
    return () => clearTimeout(timer)
  }, [sheetKey])

  const popAt = (x: number, y: number) => {
    const rect = rectRef.current
    if (!rect) return
    const col = Math.floor((x - rect.left) / rect.cell)
    const row = Math.floor((y - rect.top) / rect.cell)
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return
    pop(row * COLS + col)
  }

  const onTouchStart = (e: any) => {
    /* 每次按下都重新量一次：页面滚动后 top 会变（异步就绪，滑动连爆即用） */
    Taro.createSelectorQuery()
      .select('.bubble-grid')
      .boundingClientRect()
      .exec(res => {
        if (res && res[0] && res[0].width > 0) {
          rectRef.current = { left: res[0].left, top: res[0].top, cell: res[0].width / COLS }
        }
      })
    const t = e.touches && e.touches[0]
    if (t) popAt(t.clientX, t.clientY)
  }

  const onTouchMove = (e: any) => {
    const t = e.touches && e.touches[0]
    if (!t) return
    const last = lastPtRef.current
    if (last) {
      const dist = Math.hypot(t.clientX - last.x, t.clientY - last.y)
      const cell = rectRef.current ? rectRef.current.cell : 24
      const steps = Math.max(1, Math.ceil(dist / (cell * 0.5)))
      for (let s = 1; s <= steps; s++) {
        popAt(last.x + ((t.clientX - last.x) * s) / steps, last.y + ((t.clientY - last.y) * s) / steps)
      }
    } else {
      popAt(t.clientX, t.clientY)
    }
    lastPtRef.current = { x: t.clientX, y: t.clientY }
  }

  const remain = popped.filter(p => !p).length

  return (
    <View className='page-root bubble-root' style={{ background: theme.bg }}>
      <NavBar title='无限气泡纸' />

      <View className='bubble-stats common-card'>
        <View className='bubble-stats-cell'>
          <Text className='bubble-stats-num'>{today}</Text>
          <Text className='bubble-stats-label'>今日捏爆</Text>
        </View>
        <View className='bubble-stats-divider' />
        <View className='bubble-stats-cell'>
          <Text className='bubble-stats-num'>{total}</Text>
          <Text className='bubble-stats-label'>累计捏爆</Text>
        </View>
      </View>

      <View className='bubble-sheet'>
        <View
          className='bubble-grid'
          key={sheetKey}
          catchMove
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => (lastPtRef.current = null)}
          onTouchCancel={() => (lastPtRef.current = null)}
          style={gridH ? { height: `${gridH}px` } : undefined}
        >
          {popped.map((p, i) => (
            <View key={i} className={`bubble-cell ${p ? 'bubble-cell--popped' : ''}`} onTouchStart={() => pop(i)}>
              <View className='bubble-dot' />
            </View>
          ))}
        </View>
      </View>

      <View className='bubble-tip'>
        {remain > 0 ? `还剩 ${remain} 个 · 点一下捏爆，按住划过去连着爆` : '这张捏完了！马上铺一张新的'}
      </View>

      <View className='bubble-refresh btn-ghost' onClick={newSheet}>
        换一张新的
      </View>
    </View>
  )
}
