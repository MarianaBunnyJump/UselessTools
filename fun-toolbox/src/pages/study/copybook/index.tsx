import { View, Text, Input, Canvas, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import { STROKE_TABLE } from '../data/strokes'
import NavBar from '../../../components/NavBar'
import './index.scss'

/* A4 比例导出画布（逻辑 750×1060） */
const SHEET_W = 750
const SHEET_H = 1060

export default function Copybook() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('王小明')
  const [style, setStyle] = useState<'tian' | 'mi'>('tian')
  const [saved, setSaved] = useState(false)
  const canvasRef = useRef<any>(null)

  useShareAppMessage(() => ({
    title: '输入名字，一键生成田字格字帖',
    path: '/pages/index/index'
  }))

  const chars = Array.from(text.replace(/\s/g, '')).slice(0, 12)

  /* 绘制字帖：每字一行（描红 3 格 + 空 2 格），底部拼音 */
  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || chars.length === 0) return
    const dpr = 2
    canvas.width = SHEET_W * dpr
    canvas.height = SHEET_H * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    /* 纸底 */
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, SHEET_W, SHEET_H)
    ctx.fillStyle = '#8D7B70'
    ctx.font = '600 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${text.replace(/\s/g, '').slice(0, 12)} · 练字帖 · 趣工局`, SHEET_W / 2, 64)

    const cell = 140
    const gap = 24
    const perRow = Math.min(4, chars.length)
    const startX = (SHEET_W - perRow * cell - (perRow - 1) * gap) / 2
    let y = 130

    chars.forEach((ch, ci) => {
      const row = Math.floor(ci / 4)
      const col = ci % 4
      if (col === 0 && ci > 0) y += cell + 90
      const x = startX + col * (cell + gap)

      /* 5 格：3 描红（浅字）+ 2 空格 */
      for (let g = 0; g < 5; g++) {
        const gx = x + g * (cell + gap)
        if (gx + cell > SHEET_W - startX) break
        /* 格子 */
        ctx.strokeStyle = 'rgba(201,160,99,0.7)'
        ctx.lineWidth = 2
        ctx.strokeRect(gx, y, cell, cell)
        if (style === 'tian') {
          ctx.strokeStyle = 'rgba(201,160,99,0.4)'
          ctx.beginPath()
          ctx.moveTo(gx + cell / 2, y)
          ctx.lineTo(gx + cell / 2, y + cell)
          ctx.moveTo(gx, y + cell / 2)
          ctx.lineTo(gx + cell, y + cell / 2)
          ctx.stroke()
        } else {
          ctx.strokeStyle = 'rgba(201,160,99,0.35)'
          ctx.beginPath()
          ctx.moveTo(gx + cell / 2, y)
          ctx.lineTo(gx, y + cell / 2)
          ctx.lineTo(gx + cell / 2, y + cell)
          ctx.lineTo(gx + cell, y + cell / 2)
          ctx.closePath()
          ctx.stroke()
        }
        /* 描红浅字（前三格） */
        if (g < 3) {
          ctx.fillStyle = 'rgba(74,59,50,0.16)'
          ctx.font = '600 96px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(ch, gx + cell / 2, y + cell / 2 + 6)
        }
      }
      /* 拼音 */
      const py = STROKE_TABLE[ch] ? STROKE_TABLE[ch].py : ''
      if (py) {
        ctx.fillStyle = '#8D7B70'
        ctx.font = '26px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(py, x + cell / 2, y + cell + 34)
      }
      void row
    })

    ctx.fillStyle = '#C9BDB4'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('前三格描红 · 后两格临写 · 趣工局字帖生成器', SHEET_W / 2, SHEET_H - 40)
    setSaved(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#copybookCanvas')
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
  }, [text, style])

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    Taro.canvasToTempFilePath({
      canvas,
      success: (res: any) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            setSaved(true)
            Taro.showToast({ title: '已保存，可打印', icon: 'success' })
          },
          fail: () => {
            Taro.showModal({
              title: '保存失败',
              content: '需要在设置中授权「保存到相册」',
              confirmText: '去设置',
              success: r => {
                if (r.confirm) Taro.openSetting()
              }
            })
          }
        })
      }
    } as any)
  }

  return (
    <View className='page-root cpb-root' style={{ background: theme.bg }}>
      <NavBar title='字帖生成器' />

      <ScrollView scrollY className='cpb-scroll'>
        <View className='cpb-input-card'>
          <Input
            className='cpb-input'
            value={text}
            maxlength={12}
            placeholder='输入名字或词语（最多 12 字）'
            placeholderClass='cpb-placeholder'
            onInput={e => setText(e.detail.value)}
          />
          <View className='cpb-style-row'>
            <View className={`cpb-style ${style === 'tian' ? 'cpb-style--on' : ''}`} style={style === 'tian' ? { background: theme.accent } : undefined} onClick={() => setStyle('tian')}>田字格</View>
            <View className={`cpb-style ${style === 'mi' ? 'cpb-style--on' : ''}`} style={style === 'mi' ? { background: theme.accent } : undefined} onClick={() => setStyle('mi')}>米字格</View>
          </View>
        </View>

        {/* 预览（等比缩小显示） */}
        <View className='cpb-preview-wrap'>
          <Canvas type='2d' id='copybookCanvas' className='cpb-canvas' />
          {chars.length === 0 && <View className='cpb-empty'>先输入内容</View>}
        </View>

        <View className='cpb-save' onClick={save}>{saved ? '已保存 ✓ 再存一张' : '保存图片（可打印）'}</View>
        <View className='cpb-tip'>每字一行：3 格描红 + 2 格临写 · 附拼音 · 白底适合打印</View>
      </ScrollView>
    </View>
  )
}
