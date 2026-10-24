import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import { S2T_CHARS, T2S_CHARS } from './dict-chars'
import './index.scss'

/* 高频词汇修正：先按词替换，再字级转换（词表小而精，覆盖最容易转错的词） */
const S2T_PHRASES: [string, string][] = [
  ['头发', '頭髮'], ['干净', '乾淨'], ['干燥', '乾燥'], ['饼干', '餅乾'],
  ['软件', '軟體'], ['硬件', '硬體'], ['信息', '資訊'], ['网络', '網路'],
  ['打印机', '印表機'], ['出租车', '計程車'], ['地铁', '捷運'], ['公交', '公車'],
  ['视频', '影片'], ['屏幕', '螢幕'], ['鼠标', '滑鼠'], ['程序员', '工程師'],
  ['方便面', '泡麵'], ['西红柿', '番茄'], ['猕猴桃', '奇異果'], ['菠萝', '鳳梨'],
  ['回合', '回合'], ['皇后', '皇后'], ['后来', '後來'], ['背后', '背後'],
  ['里面', '裡面'], ['这里', '這裡'], ['哪里', '哪裡'], ['头发', '頭髮'],
  ['发展', '發展'], ['出发', '出發'], ['发现', '發現'], ['干活', '幹活'],
  ['才能', '才能'], ['刚刚', '剛剛'], ['说道', '說道'], ['台面', '檯面']
]

const T2S_PHRASES: [string, string][] = S2T_PHRASES.map(([s, t]) => [t, s])

function convert(text: string, dir: 's2t' | 't2s'): string {
  const phrases = dir === 's2t' ? S2T_PHRASES : T2S_PHRASES
  const chars = dir === 's2t' ? S2T_CHARS : T2S_CHARS
  let out = text
  phrases.forEach(([from, to]) => {
    out = out.split(from).join(to)
  })
  return Array.from(out).map(ch => chars[ch] || ch).join('')
}

export default function ZhConvert() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('')
  const [dir, setDir] = useState<'s2t' | 't2s'>('s2t')

  useShareAppMessage(() => ({
    title: '简繁互转，高频词自动修正更地道',
    path: '/pages/index/index'
  }))

  const out = convert(text, dir)

  const copy = () => {
    if (!out) return
    Taro.setClipboardData({
      data: out,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    })
  }

  return (
    <View className='page-root zhc-root' style={{ background: theme.bg }}>
      <NavBar title='简繁互转' />

      <ScrollView scrollY className='zhc-scroll'>
        <View className='zhc-scroll-pad'>
        {/* 方向切换 */}
        <View className='zhc-dir'>
          <View
            className={`zhc-dir-btn ${dir === 's2t' ? 'zhc-dir-btn--on' : ''}`}
            style={dir === 's2t' ? { background: theme.accent } : undefined}
            onClick={() => setDir('s2t')}
          >
            简 → 繁
          </View>
          <View
            className={`zhc-dir-btn ${dir === 't2s' ? 'zhc-dir-btn--on' : ''}`}
            style={dir === 't2s' ? { background: theme.accent } : undefined}
            onClick={() => setDir('t2s')}
          >
            繁 → 简
          </View>
        </View>

        <View className='zhc-card'>
          <View className='zhc-label'>输入</View>
          <Textarea
            className='zhc-input'
            value={text}
            maxlength={500}
            placeholder={dir === 's2t' ? '粘贴简体文本' : '粘贴繁体文本'}
            placeholderClass='zhc-placeholder'
            autoHeight
            onInput={e => setText(e.detail.value)}
          />
        </View>

        {out && (
          <View className='zhc-card zhc-card--out'>
            <View className='zhc-label'>结果</View>
            <View className='zhc-output'>{out}</View>
            <View className='zhc-ops'>
              <View className='zhc-op zhc-op--main' hoverClass='press-down' onClick={copy}>复制结果</View>
              <View className='zhc-op' onClick={() => { setText(out); setDir(d => (d === 's2t' ? 't2s' : 's2t')) }}>转回去</View>
            </View>
          </View>
        )}

        <View className='zhc-tip'>
          词汇修正示例：头发→頭髮 · 干净→乾淨 · 软件→軟體 · 视频→影片
        </View>
      </View>
      </ScrollView>
    </View>
  )
}
