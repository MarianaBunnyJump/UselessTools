import { View, Text, Canvas, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import { BEAD_COLORS, nearestBead, TEMPLATES, templateGrid, type BeadColor } from './data'
import './index.scss'

const GRID = 29 /* 15cm 板 ≈ 29×29 */

interface BeadCell {
  code: string
  hex: string
}

export default function Perler() {
  const [theme] = useState(getTheme())
  const [grid, setGrid] = useState<BeadCell[]>([])
  const [owned, setOwned] = useState<string[]>(get<string[]>('perler_owned', []))
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef<any>(null)

  useShareAppMessage(() => ({
    title: '照片转拼豆图纸，连要买几颗豆都算好了',
    path: '/pages/index/index'
  }))

  /* 图片 → 拼豆网格：缩到 GRID×GRID 逐格最近色 */
  const processImage = async (src: string) => {
    setBusy(true)
    try {
      const node: any = await new Promise(resolve => {
        Taro.createSelectorQuery()
          .select('#perlerWork')
          .fields({ node: true })
          .exec(r => resolve(r && r[0] && r[0].node))
      })
      if (!node) throw new Error('canvas')
      const canvas = node as any
      canvas.width = GRID
      canvas.height = GRID
      const ctx = canvas.getContext('2d')
      const img = canvas.createImage()
      await new Promise((res, rej) => {
        img.onload = res as any
        img.onerror = rej
        img.src = src
      })
      /* 居中裁方再缩放 */
      const s = Math.min(img.width, img.height)
      ctx.clearRect(0, 0, GRID, GRID)
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, GRID, GRID)
      const data = ctx.getImageData(0, 0, GRID, GRID).data
      const cells: BeadCell[] = []
      for (let i = 0; i < GRID * GRID; i++) {
        const r = data[i * 4]
        const g = data[i * 4 + 1]
        const b = data[i * 4 + 2]
        const hex = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
        const bead = nearestBead(hex)
        cells.push({ code: bead.code, hex: bead.hex })
      }
      setGrid(cells)
      renderGrid(cells)
    } catch (e) {
      Taro.showToast({ title: '图片处理失败，换一张试试', icon: 'none' })
    }
    setBusy(false)
  }

  const pickImage = () => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: res => {
        if (res.tempFiles && res.tempFiles[0]) processImage(res.tempFiles[0].tempFilePath)
      }
    })
  }

  const useTemplate = (tplId: string) => {
    const tpl = TEMPLATES.find(t => t.id === tplId)
    if (!tpl) return
    const cells = templateGrid(tpl).map(code =>
      code ? { code, hex: (BEAD_COLORS.find(c => c.code === code) as BeadColor).hex } : { code: '', hex: '' }
    )
    setGrid(cells)
    renderGrid(cells)
  }

  /* 渲染到预览画布（屏宽 686px 内） */
  const renderGrid = (cells: BeadCell[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = 2
    const size = 686
    const cell = size / GRID
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)
    cells.forEach((c, i) => {
      const x = (i % GRID) * cell
      const y = Math.floor(i / GRID) * cell
      ctx.fillStyle = c.hex || '#F5F0EA'
      ctx.beginPath()
      ctx.arc(x + cell / 2, y + cell / 2, cell * 0.42, 0, Math.PI * 2)
      ctx.fill()
    })
    /* 网格线 */
    ctx.strokeStyle = 'rgba(74,59,50,0.12)'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cell, 0)
      ctx.lineTo(i * cell, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cell)
      ctx.lineTo(size, i * cell)
      ctx.stroke()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#perlerGrid')
        .fields({ node: true })
        .exec(res => {
          if (res && res[0] && res[0].node) {
            canvasRef.current = res[0].node
            /* 空棋盘也先画出来：画布必须常驻挂载，否则条件渲染会导致
               绑定时机错过、后续 renderGrid 全部落空（V4.1 修复） */
            renderGrid(grid)
          }
        })
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  /* 颗粒清单 */
  const counts = grid.reduce<Record<string, number>>((m, c) => {
    if (c.code) m[c.code] = (m[c.code] || 0) + 1
    return m
  }, {})
  const list = Object.entries(counts)
    .map(([code, n]) => ({ bead: BEAD_COLORS.find(c => c.code === code), n }))
    .filter(x => x.bead)
    .sort((a, b) => b.n - a.n)
  const totalBeads = list.reduce((s, x) => s + x.n, 0)

    /* 导出图纸大图（顶部标题带 + 网格） */
  const exportSheet = () => {
    if (grid.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const headH = 90
    const size = 1430
    const cell = size / GRID
    canvas.width = size
    canvas.height = size + headH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size + headH)
    ctx.fillStyle = '#4A3B32'
    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`趣工局 · 拼豆图纸 29×29 · 共 ${totalBeads} 颗`, size / 2, 56)
    grid.forEach((c, i) => {
      const x = (i % GRID) * cell
      const y = headH + Math.floor(i / GRID) * cell
      ctx.fillStyle = c.hex || '#F5F0EA'
      ctx.fillRect(x, y, cell, cell)
    })
    ctx.strokeStyle = 'rgba(74,59,50,0.5)'
    ctx.lineWidth = 1.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cell, headH)
      ctx.lineTo(i * cell, size + headH)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, headH + i * cell)
      ctx.lineTo(size, headH + i * cell)
      ctx.stroke()
    }
    Taro.canvasToTempFilePath({
      canvas,
      success: (res: any) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => Taro.showToast({ title: '图纸已存相册', icon: 'success' }),
          fail: () => Taro.showModal({
            title: '保存失败',
            content: '需要授权「保存到相册」',
            confirmText: '去设置',
            success: r => {
              if (r.confirm) Taro.openSetting()
            }
          })
        })
      },
      complete: () => renderGrid(grid)
    } as any)
  }

  const toggleOwned = (code: string) => {
    const next = owned.includes(code) ? owned.filter(c => c !== code) : [...owned, code]
    setOwned(next)
    set('perler_owned', next)
  }

  return (
    <View className='page-root prl-root' style={{ background: theme.bg }}>
      <NavBar title='拼豆图纸生成' />
      {/* 隐藏工作画布 */}
      <Canvas type='2d' id='perlerWork' className='prl-hidden' />

      <ScrollView scrollY className='prl-scroll'>
        <View className='prl-scroll-pad'>
        <View className='prl-actions'>
          <View className='prl-pick' hoverClass='press-down' onClick={pickImage}>{busy ? '生成中…' : '📷 选一张照片'}</View>
        </View>

        {/* 模板库 */}
        <View className='prl-tpl-row'>
          <Text className='prl-tpl-label'>直接用模板</Text>
          {TEMPLATES.map(t => (
            <View key={t.id} className='prl-tpl' onClick={() => useTemplate(t.id)}>{t.name}</View>
          ))}
        </View>

        {/* 预览画布：常驻挂载（无条件渲染），空态画空棋盘 */}
        <View className='prl-preview'>
          <Canvas type='2d' id='perlerGrid' className='prl-canvas' canvasId='perlerGrid' />
        </View>

        {grid.length > 0 ? (
          <>
            <View className='prl-meta'>29×29（15cm 板） · 共 {totalBeads} 颗 · {list.length} 种颜色</View>

            {/* 颗粒清单 */}
            <View className='prl-list-card'>
              <View className='prl-list-title'>颗粒清单 <Text className='prl-list-sub'>（点色条勾「已有」）</Text></View>
              {list.map(({ bead, n }) => (
                <View key={bead!.code} className={`prl-row ${owned.includes(bead!.code) ? 'prl-row--owned' : ''}`} onClick={() => toggleOwned(bead!.code)}>
                  <View className='prl-swatch' style={{ background: bead!.hex }} />
                  <Text className='prl-code'>{bead!.code}</Text>
                  <Text className='prl-name'>{bead!.name}</Text>
                  <Text className='prl-count'>×{n}</Text>
                  <Text className='prl-check'>{owned.includes(bead!.code) ? '✓ 已有' : ''}</Text>
                </View>
              ))}
            </View>

            <View className='prl-export' hoverClass='press-down' onClick={exportSheet}>导出图纸大图（网格+色号）</View>
          </>
        ) : (
          <View className='prl-empty'>
            <Text className='prl-empty-icon'>🧩</Text>
            <View className='prl-empty-text'>选照片自动转 29×29 图纸</View>
            <View className='prl-empty-sub'>48 色拼豆色板取色 · 附每种颜色的购买颗数</View>
          </View>
        )}

        <View className='prl-tip'>取色为通用 48 色系近似匹配，不同品牌色号略有差异</View>
      </View>
      </ScrollView>
    </View>
  )
}
