import { View, Text, Textarea, Canvas, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import './index.scss'

type Layout = 'note' | 'long'

const PAPER_COLORS: [string, string][] = [
  ['#FFF3C4', '#4A3B32'],
  ['#C9EEFC', '#37474F'],
  ['#FFD6E0', '#4A3B32'],
  ['#DCCEF0', '#37474F'],
  ['#D7E8D4', '#37474F']
]

/* 逻辑画布：便签 690×690 / 长图 690×按行自适应 */
export default function TextToImage() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('')
  const [layout, setLayout] = useState<Layout>('note')
  const [paperIdx, setPaperIdx] = useState(0)
  const [canvasH, setCanvasH] = useState(690)
  const canvasRef = useRef<any>(null)
  const [paper, ink] = PAPER_COLORS[paperIdx]

  useShareAppMessage(() => ({
    title: '一句话变成好看的图片，直接发出去',
    path: '/pages/index/index'
  }))

  const lines = text.split('\n').flatMap(l => wrap(l, layout === 'note' ? 12 : 16)).slice(0, 40)

  function wrap(line: string, max: number): string[] {
    const out: string[] = []
    let cur = ''
    for (const ch of line) {
      if (cur.length >= max) {
        out.push(cur)
        cur = ch
      } else {
        cur += ch
      }
    }
    if (cur || out.length === 0) out.push(cur)
    return out
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const lineH = 64
    const padTop = layout === 'note' ? 180 : 100
    const h = Math.max(layout === 'note' ? 690 : 400, padTop + lines.length * lineH + 120)
    setCanvasH(h)
    const w = 690
    const dpr = 2
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    /* 纸底 + 胶带 */
    ctx.fillStyle = paper
    ctx.fillRect(0, 0, w, h)
    if (layout === 'note') {
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillRect(0, 0, w, 60)
    }
    ctx.fillStyle = 'rgba(74,59,50,0.12)'
    ctx.beginPath()
    ctx.moveTo(w / 2 - 70, 0)
    ctx.lineTo(w / 2 + 70, 0)
    ctx.lineTo(w / 2 + 46, 52)
    ctx.lineTo(w / 2 - 46, 52)
    ctx.closePath()
    ctx.fill()

    /* 正文 */
    ctx.fillStyle = ink
    ctx.font = '600 46px sans-serif'
    ctx.textAlign = 'center'
    lines.forEach((l, i) => {
      ctx.fillText(l, w / 2, padTop + i * lineH)
    })

    /* 落款 */
    ctx.font = '28px sans-serif'
    ctx.fillStyle = 'rgba(74,59,50,0.45)'
    ctx.fillText('— 趣工局 —', w / 2, h - 56)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#ttiCanvas')
        .fields({ node: true })
        .exec(res => {
          if (res && res[0] && res[0].node) {
            canvasRef.current = res[0].node
            draw()
          }
        })
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    draw()
  }, [text, layout, paperIdx])

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas || lines.length === 0) return
    Taro.canvasToTempFilePath({
      canvas,
      success: (res: any) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => Taro.showToast({ title: '已存相册', icon: 'success' }),
          fail: () => Taro.showModal({
            title: '保存失败',
            content: '需要授权「保存到相册」',
            confirmText: '去设置',
            success: r => {
              if (r.confirm) Taro.openSetting()
            }
          })
        })
      }
    } as any)
  }

  return (
    <View className='page-root tti-root' style={{ background: theme.bg }}>
      <NavBar title='文字转图片' />
      <ScrollView scrollY className='tti-scroll'>
        <View className='tti-scroll-pad'>
        <View className='tti-card'>
          <Textarea
            className='tti-input'
            value={text}
            maxlength={400}
            placeholder='写一句话，生成图片发出去'
            placeholderClass='tti-placeholder'
            autoHeight
            onInput={e => setText(e.detail.value)}
          />
        </View>

        <View className='tti-chips'>
          <View className={`tti-chip ${layout === 'note' ? 'tti-chip--on' : ''}`} style={layout === 'note' ? { background: theme.accent } : undefined} onClick={() => setLayout('note')}>便签</View>
          <View className={`tti-chip ${layout === 'long' ? 'tti-chip--on' : ''}`} style={layout === 'long' ? { background: theme.accent } : undefined} onClick={() => setLayout('long')}>长图</View>
          {PAPER_COLORS.map(([p], i) => (
            <View key={i} className={`tti-paper ${i === paperIdx ? 'tti-paper--on' : ''}`} style={{ background: p }} onClick={() => setPaperIdx(i)} />
          ))}
        </View>

        <View className='tti-preview'>
          <Canvas type='2d' id='ttiCanvas' className='tti-canvas' style={{ height: `${canvasH}rpx` }} />
          {lines.length === 0 && <View className='tti-empty'>先写点什么～</View>}
        </View>

        <View className='tti-save' hoverClass='press-down' onClick={save}>保存 / 发给朋友</View>
        <View className='tti-tip'>便签适合一句话 · 长图适合朋友圈文案（自动换行排班）</View>
      </View>
      </ScrollView>
    </View>
  )
}
