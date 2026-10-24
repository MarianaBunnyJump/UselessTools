import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set, addTotalCount } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import { STROKE_TABLE, todayChar } from '../data/strokes'
import './index.scss'

export default function StrokeCard() {
  const [theme] = useState(getTheme())
  const [draft, setDraft] = useState('')
  const [current, setCurrent] = useState(todayChar())

  useShareAppMessage(() => ({
    title: '田字格练字卡，练字启蒙小帮手',
    path: '/pages/index/index'
  }))

  const info = useMemo(() => {
    const known = STROKE_TABLE[current]
    return {
      py: known ? known.py : '待补充',
      strokes: known ? String(known.strokes) : '待补充',
      radical: known ? known.radical : '待补充',
      structure: known ? known.structure : ''
    }
  }, [current])

  const confirm = () => {
    const ch = draft.trim().slice(0, 1)
    if (!ch) return
    setCurrent(ch)
    setDraft('')
  }

  const markPracticed = () => {
    addTotalCount('stroke_total')
    set('stroke_last_day', new Date().toDateString())
    Taro.showToast({ title: '练完一个！继续保持', icon: 'none', duration: 1200 })
  }

  return (
    <View className='page-root stc-root' style={{ background: theme.bg }}>
      <NavBar title='汉字练字卡' />

      <ScrollView scrollY className='stc-scroll'>
        <View className='stc-scroll-pad'>
        {/* 查字 */}
        <View className='stc-search'>
          <Input
            className='stc-search-input'
            value={draft}
            placeholder='输入一个字，如「永」'
            placeholderClass='stc-placeholder'
            onInput={e => setDraft(e.detail.value)}
            onConfirm={confirm}
          />
          <View className='stc-search-btn' style={{ background: theme.accent }} onClick={confirm}>查</View>
        </View>

        {/* 田字格大卡 */}
        <View className='stc-grid-card'>
          <View className='stc-tian'>
            <View className='stc-tian-cross' />
            <Text className='stc-char'>{current}</Text>
          </View>
        </View>

        <View className='stc-info'>
          {info.py} · {info.strokes} 画 · {info.radical}部 {info.structure ? `· ${info.structure}` : ''}
        </View>

        {/* 描红行 */}
        <View className='stc-sheet'>
          <View className='stc-sheet-label'>描红 · 照着浅色写</View>
          <View className='stc-row'>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} className='stc-cell'>
                <View className='stc-cell-cross' />
                <Text className='stc-cell-char'>{current}</Text>
              </View>
            ))}
          </View>
          <View className='stc-row'>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} className='stc-cell stc-cell--empty'>
                <View className='stc-cell-cross' />
              </View>
            ))}
          </View>
        </View>

        <View className='stc-op' onClick={markPracticed}>练完这个字 ✓</View>

        {/* 成就提示 */}
        <View className='stc-streak' style={{ background: `${theme.accent}16` }}>
          累计已练 {get<number>('stroke_total', 0)} 字 · 累计 100 字解锁「笔顺之神」🏅
        </View>

        <View className='stc-tip'>首批收录 95 个高频字速查；未收录的字自动注音，笔画部首持续补充</View>
      </View>
      </ScrollView>
    </View>
  )
}
