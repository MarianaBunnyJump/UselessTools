import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { pinyin } from 'pinyin-pro'
import { getTheme } from '../../../utils/theme'
import { get, set } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import './index.scss'

interface CharCell {
  ch: string
  py: string
  isHan: boolean
}

export default function PinyinAnnotate() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('')
  const [pickIdx, setPickIdx] = useState(-1)
  /* 纠错后自增，驱动重算 */
  const [fixVer, setFixVer] = useState(0)

  useShareAppMessage(() => ({
    title: '任意中文文本，一键逐字注音',
    path: '/pages/index/index'
  }))

  const cells: CharCell[] = useMemo(() => {
    void fixVer
    const fixes = get<Record<string, string>>('pinyin_fixes', {})
    return Array.from(text.slice(0, 120)).map(ch => {
      const isHan = /[\u4e00-\u9fa5]/.test(ch)
      if (!isHan) return { ch, py: '', isHan: false }
      const py = fixes[ch] || pinyin(ch, { toneType: 'symbol' })
      return { ch, py, isHan: true }
    })
  }, [text, fixVer])

  const candidates = useMemo(() => {
    if (pickIdx < 0 || !cells[pickIdx] || !cells[pickIdx].isHan) return []
    const multi = pinyin(cells[pickIdx].ch, { toneType: 'symbol', multiple: true, type: 'array' }) as unknown as string[]
    return Array.from(new Set(multi))
  }, [pickIdx, cells])

  const applyFix = (py: string) => {
    if (pickIdx < 0) return
    const ch = cells[pickIdx].ch
    const fixes = get<Record<string, string>>('pinyin_fixes', {})
    fixes[ch] = py
    set('pinyin_fixes', fixes)
    setPickIdx(-1)
    setFixVer(v => v + 1)
    Taro.showToast({ title: `已记住：${ch} 读 ${py}`, icon: 'none', duration: 1200 })
  }

  const copyAll = () => {
    const plain = cells.map(c => (c.isHan ? `${c.py} ${c.ch}` : c.ch)).join(' ')
    Taro.setClipboardData({
      data: plain,
      success: () => Taro.showToast({ title: '已复制注音文', icon: 'success' })
    })
  }

  const clearFix = () => {
    set('pinyin_fixes', {})
    setFixVer(v => v + 1)
    Taro.showToast({ title: '已清空纠错记录', icon: 'none' })
  }

  return (
    <View className='page-root pya-root' style={{ background: theme.bg }}>
      <NavBar title='拼音注音器' />

      <ScrollView scrollY className='pya-scroll'>
        <View className='pya-scroll-pad'>
        <View className='pya-card'>
          <View className='pya-label'>写点什么，我来注音（最多 120 字）</View>
          <Textarea
            className='pya-input'
            value={text}
            maxlength={120}
            placeholder='输入中文，自动逐字标拼音'
            placeholderClass='pya-placeholder'
            autoHeight
            onInput={e => setText(e.detail.value)}
          />
          <View className='pya-count'>{text.length}/120</View>
        </View>

        {cells.length > 0 && (
          <View className='pya-card'>
            <View className='pya-label'>逐字注音 · 点字改多音</View>
            <View className='pya-grid'>
              {cells.map((c, i) => (
                <View key={i} className='pya-cell' onClick={() => c.isHan && setPickIdx(i)}>
                  <Text className='pya-cell-py'>{c.isHan ? c.py : ''}</Text>
                  <Text className='pya-cell-ch'>{c.ch}</Text>
                </View>
              ))}
            </View>
            <View className='pya-ops'>
              <View className='pya-op pya-op--main' onClick={copyAll}>复制注音文</View>
              <View className='pya-op' onClick={clearFix}>清空纠错</View>
            </View>
          </View>
        )}

        <View className='pya-tip'>多音字按常用读音标注，点字可选正确读音，选择会被记住</View>
      </View>
      </ScrollView>

      {pickIdx >= 0 && candidates.length > 0 && (
        <View className='pya-mask' onClick={() => setPickIdx(-1)}>
          <View className='pya-pop' onClick={e => e.stopPropagation()}>
            <Text className='pya-pop-ch'>{cells[pickIdx].ch}</Text>
            <View className='pya-pop-cands'>
              {candidates.map(c => (
                <View key={c} className='pya-pop-cand' onClick={() => applyFix(c)}>{c}</View>
              ))}
            </View>
            <View className='pya-pop-close' onClick={() => setPickIdx(-1)}>取消</View>
          </View>
        </View>
      )}
    </View>
  )
}
