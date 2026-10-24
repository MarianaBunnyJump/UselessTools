import { View, Text, Canvas, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import './index.scss'

type Filter = 'none' | 'warm' | 'cool' | 'vintage' | 'bw'

const FILTERS: { id: Filter; name: string }[] = [
  { id: 'none', name: '原片' },
  { id: 'warm', name: '暖阳' },
  { id: 'cool', name: '冷调' },
  { id: 'vintage', name: '复古' },
  { id: 'bw', name: '黑白' }
]

/* 滤镜实现：ctx.filter（低版本不支持时自动忽略） */
function filterCss(f: Filter): string {
  switch (f) {
    case 'warm':
      return 'sepia(0.25) saturate(1.2) brightness(1.05)'
    case 'cool':
      return 'hue-rotate(-12deg) saturate(1.1) brightness(1.02)'
    case 'vintage':
      return 'sepia(0.45) contrast(0.92) saturate(0.85)'
    case 'bw':
      return 'grayscale(1) contrast(1.05)'
    default:
      return 'none'
  }
}

export default function PhotoToolbox() {
  const [theme] = useState(getTheme())
  const [src, setSrc] = useState('')
  const [rotate, setRotate] = useState(0)
  const [flip, setFlip] = useState(false)
  const [filter, setFilter] = useState<Filter>('none')
  const [sticker, setSticker] = useState('')
  const [canvasSize, setCanvasSize] = useState({ w: 343, h: 343 })
  const canvasRef = useRef<any>(null)
  const imgRef = useRef<any>(null)

  useShareAppMessage(() => ({
    title: '修图小工具箱，导出还能抹掉定位信息',
    path: '/pages/index/index'
  }))

  const pick = () => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        if (res.tempFiles && res.tempFiles[0]) setSrc(res.tempFiles[0].tempFilePath)
      }
    })
  }

  /* 载入图片并首次绘制 */
  useEffect(() => {
    if (!src) return
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#photoCanvas')
        .fields({ node: true })
        .exec(res => {
          if (!res || !res[0] || !res[0].node) return
          const canvas = res[0].node
          canvasRef.current = canvas
          const img = canvas.createImage()
          img.onload = () => {
            imgRef.current = img
            render()
          }
          img.src = src
        })
    }, 80)
    return () => clearTimeout(timer)
  }, [src])

  useEffect(() => {
    render()
  }, [rotate, flip, filter, sticker])

  const render = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    /* 预览尺寸：最大 660 逻辑px，按旋转取横竖 */
    const rotated = rotate % 180 !== 0
    const long = 660
    const ratio = img.width / img.height
    let w: number, h: number
    if (ratio >= 1) {
      w = long
      h = Math.round(long / ratio)
    } else {
      h = long
      w = Math.round(long * ratio)
    }
    const cw = rotated ? h : w
    const ch = rotated ? w : h
    const dpr = 2
    canvas.width = cw * dpr
    canvas.height = ch * dpr
    setCanvasSize({ w: cw, h: ch })
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cw, ch)
    ctx.save()
    ctx.translate(cw / 2, ch / 2)
    if (rotate % 360 !== 0) ctx.rotate((rotate % 360) * Math.PI / 180)
    if (flip) ctx.scale(-1, 1)
    try {
      ctx.filter = filterCss(filter)
    } catch (e) {
      /* 不支持滤镜则原图 */
    }
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()
    if (sticker) {
      ctx.font = '600 56px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'
      ctx.lineWidth = 4
      ctx.strokeText(sticker, cw - 24, ch - 30)
      ctx.fillText(sticker, cw - 24, ch - 30)
    }
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    Taro.canvasToTempFilePath({
      canvas,
      /* 重编码导出 = 不携带原 EXIF（定位/机型） */
      fileType: 'jpg',
      quality: 0.92,
      success: (res: any) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => Taro.showToast({ title: '已保存（无定位信息）', icon: 'success' }),
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
    <View className='page-root ptb-root' style={{ background: theme.bg }}>
      <NavBar title='图片小工具箱' />
      <ScrollView scrollY className='ptb-scroll'>
        <View className='ptb-scroll-pad'>
        {!src ? (
          <View className='ptb-pick' onClick={pick}>
            <Text className='ptb-pick-icon'>📷</Text>
            <View className='ptb-pick-text'>选一张图片</View>
            <View className='ptb-pick-sub'>裁旋转 · 滤镜 · 贴字 · 隐私导出</View>
          </View>
        ) : (
          <>
            <View className='ptb-frame'>
              <Canvas
                type='2d'
                id='photoCanvas'
                className='ptb-canvas'
                style={{ width: `${canvasSize.w}px`, height: `${canvasSize.h}px` }}
              />
            </View>

            {/* 操作 chips */}
            <View className='ptb-row'>
              <View className='ptb-btn' onClick={() => setRotate(r => (r + 90) % 360)}>🔄 旋转</View>
              <View className='ptb-btn' onClick={() => setFlip(f => !f)}>🔁 镜像</View>
              <View
                className='ptb-btn'
                onClick={() => {
                  Taro.showModal({
                    title: '贴一句话',
                    editable: true,
                    placeholderText: '如：摄于秋天',
                    success: res => {
                      if (res.confirm) setSticker((res.content || '').slice(0, 20))
                    }
                  } as any)
                }}
              >
                🔤 贴字
              </View>
              <View className='ptb-btn' onClick={pick}>↺ 换图</View>
            </View>

            {/* 滤镜 */}
            <View className='ptb-row'>
              {FILTERS.map(f => (
                <View
                  key={f.id}
                  className={`ptb-btn ${filter === f.id ? 'ptb-btn--on' : ''}`}
                  style={filter === f.id ? { background: theme.accent, color: '#fff' } : undefined}
                  onClick={() => setFilter(f.id)}
                >
                  {f.name}
                </View>
              ))}
            </View>

            <View className='ptb-save' onClick={save}>保存（重编码，抹掉拍摄定位）</View>
            <View className='ptb-tip'>导出走画布重编码：不带原图的定位、机型等隐私信息</View>
          </>
        )}
      </View>
      </ScrollView>
    </View>
  )
}
