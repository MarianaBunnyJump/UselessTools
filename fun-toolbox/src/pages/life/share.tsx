import { View, Text, Button, Canvas } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect, useMemo } from 'react'
import { LIFE_PHRASES } from '../../data/lifePhrases'
import { getTheme } from '../../utils/theme'
import { get } from '../../utils/storage'
import { formatNumber } from '../../utils/format'
import { computeLifeStats, lifeMetrics, type LifeMetric } from '../../utils/lifeStats'
import NavBar from '../../components/NavBar'
import './share.scss'

/* 导出画布的逻辑尺寸（实际像素 = 逻辑 x 2） */
const CANVAS_W = 750
const CANVAS_H = 1150

function roundRectPath(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function LifeShare() {
  const [theme] = useState(getTheme())
  const birthdate = get<string>('life_birthdate', '')
  const expectancy = get<number>('life_expectancy', 77)
  const params = Taro.getCurrentInstance().router?.params || {}

  const allMetrics = useMemo(
    () => (birthdate ? lifeMetrics(computeLifeStats(birthdate, expectancy)) : []),
    [birthdate, expectancy]
  )

  /* 自选要分享的指标：顺序即主次 */
  const [selected, setSelected] = useState<string[]>(() => {
    const m = params.metric as string
    if (m && ['days', 'sundays', 'birthdays', 'meals', 'holidays'].includes(m)) return [m]
    return ['sundays']
  })

  const phrase = useMemo(() => {
    const idx = new Date().getDate() % LIFE_PHRASES.length
    return LIFE_PHRASES[idx]
  }, [])

  const canvasRef = useRef<any>(null)

  const picked: LifeMetric[] = selected
    .map(id => allMetrics.find(m => m.id === id))
    .filter((m): m is LifeMetric => Boolean(m))

  const primary = picked[0] || allMetrics[1] || allMetrics[0]
  const secondary = picked.slice(1)

  useShareAppMessage(() => ({
    title: primary ? `我的人生还剩 ${formatNumber(primary.value)} ${primary.unit}` : '看看你还剩多少个周五',
    path: '/pages/index/index'
  }))

  /* ---------- 导出画布绘制 ---------- */
  const drawExportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !primary) return
    const dpr = 2
    canvas.width = CANVAS_W * dpr
    canvas.height = CANVAS_H * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    const grad = ctx.createLinearGradient(0, 0, CANVAS_W * 0.25, CANVAS_H)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(1, '#f5efff')
    ctx.fillStyle = grad
    roundRectPath(ctx, 0, 0, CANVAS_W, CANVAS_H, 0)
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    const deco = ctx.createRadialGradient(CANVAS_W - 70, 80, 10, CANVAS_W - 70, 80, 200)
    deco.addColorStop(0, 'rgba(179,157,219,0.25)')
    deco.addColorStop(1, 'rgba(179,157,219,0)')
    ctx.fillStyle = deco
    ctx.fillRect(CANVAS_W - 280, -130, 420, 420)

    ctx.textAlign = 'center'

    ctx.fillStyle = '#b39ddb'
    ctx.font = '600 30px sans-serif'
    ctx.fillText('趣 工 局', CANVAS_W / 2, 120)

    ctx.fillStyle = '#8d7b70'
    ctx.font = '500 46px sans-serif'
    ctx.fillText('你的人生还剩', CANVAS_W / 2, 250)

    const numGrad = ctx.createLinearGradient(0, 0, CANVAS_W, 0)
    numGrad.addColorStop(0, '#9575cd')
    numGrad.addColorStop(1, '#b39ddb')
    ctx.fillStyle = numGrad
    ctx.font = '800 168px sans-serif'
    ctx.fillText(formatNumber(primary.value), CANVAS_W / 2, 420)

    ctx.fillStyle = '#4a3b32'
    ctx.font = '600 52px sans-serif'
    ctx.fillText(primary.unit, CANVAS_W / 2, 495)

    ctx.fillStyle = '#8d7b70'
    ctx.font = '500 38px sans-serif'
    ctx.fillText(primary.label, CANVAS_W / 2, 570)

    /* 虚线分隔 */
    ctx.save()
    ctx.setLineDash([14, 14])
    ctx.strokeStyle = 'rgba(179,157,219,0.45)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(90, 630)
    ctx.lineTo(CANVAS_W - 90, 630)
    ctx.stroke()
    ctx.restore()

    /* 其余自选指标 */
    let y = 710
    secondary.forEach(m => {
      ctx.fillStyle = '#8d7b70'
      ctx.font = '500 36px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(m.label, 120, y)
      ctx.fillStyle = '#4a3b32'
      ctx.font = '700 40px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${formatNumber(m.value)} ${m.unit}`, CANVAS_W - 120, y)
      y += 78
    })

    ctx.textAlign = 'center'
    ctx.fillStyle = '#6d5f56'
    ctx.font = '500 36px sans-serif'
    ctx.fillText(`“${phrase}”`, CANVAS_W / 2, y + 60)

    ctx.fillStyle = '#c9bdb4'
    ctx.font = '400 28px sans-serif'
    ctx.fillText('趣工局 · 人生倒计时', CANVAS_W / 2, CANVAS_H - 70)
  }

  const saveImage = () => {
    if (!canvasRef.current) {
      Taro.showToast({ title: '卡片还没准备好，再试一次', icon: 'none' })
      return
    }
    drawExportCanvas()
    const opts: any = {
      canvas: canvasRef.current,
      success: (res: any) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => Taro.showToast({ title: '已保存到相册', icon: 'success' }),
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
      },
      fail: () => {
        Taro.showToast({ title: '生成图片失败', icon: 'none' })
      }
    }
    Taro.canvasToTempFilePath(opts)
  }

  useEffect(() => {
    const query = Taro.createSelectorQuery()
    query
      .select('#shareCanvas')
      .fields({ node: true })
      .exec(res => {
        if (res && res[0] && res[0].node) {
          canvasRef.current = res[0].node
          drawExportCanvas()
        }
      })
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const toggleMetric = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) {
          Taro.showToast({ title: '至少保留一项', icon: 'none' })
          return prev
        }
        return prev.filter(x => x !== id)
      }
      return [...prev, id]
    })
  }

  return (
    <View className='page-root life-share-root' style={{ background: theme.bg }}>
      <NavBar title='分享卡片' />

      <View className='share-chip-row'>
        {allMetrics.map(m => (
          <View
            key={m.id}
            className={`share-chip ${selected.includes(m.id) ? 'share-chip--on' : ''}`}
            onClick={() => toggleMetric(m.id)}
          >
            {m.label}
          </View>
        ))}
      </View>

      <View className='share-card'>
        <View className='share-card-brand'>趣工局</View>

        <View className='share-card-title'>你的人生还剩</View>
        <View className='share-card-num'>{formatNumber(primary ? primary.value : 0)}</View>
        <View className='share-card-unit'>{primary ? primary.unit : ''}</View>
        <View className='share-card-label'>{primary ? primary.label : ''}</View>

        <View className='share-card-divider' />

        {secondary.length > 0 && (
          <View className='share-card-metrics'>
            {secondary.map(m => (
              <View key={m.id} className='share-card-metric-row'>
                <Text className='share-card-metric-label'>{m.label}</Text>
                <Text className='share-card-metric-value'>
                  {formatNumber(m.value)} {m.unit}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View className='share-card-phrase'>“{phrase}”</View>

        <View className='share-card-foot'>
          <View className='share-card-foot-line'>人生倒计时</View>
          <View className='share-card-tip'>数据仅存于本机 · 仅供一乐</View>
        </View>
      </View>

      <View className='share-btn-row'>
        <Button className='share-save-btn' onClick={saveImage}>
          保存图片
        </Button>
        <Button className='share-btn btn-primary' openType='share'>
          分享给朋友
        </Button>
      </View>

      <Canvas type='2d' id='shareCanvas' className='share-export-canvas' />
    </View>
  )
}
