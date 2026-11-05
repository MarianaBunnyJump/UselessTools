import { View, Text, Canvas, Slider } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import Sheet from './Sheet'

/* 照片裁剪（方形取景 · 拖动 + 缩放）：canvas 2d 实现，
 * 输出 512×512 jpg（与手机版一致：好友端看到的就是这一张）。 */
interface CropSheetProps {
  imgPath: string
  onConfirm: (tempPath: string) => void
  onCancel: () => void
}

interface Geom {
  sx: number
  sy: number
  sw: number
  sh: number
  ox: number
  oy: number
  ox0: number
  oy0: number
}

export default function CropSheet({ imgPath, onConfirm, onCancel }: CropSheetProps) {
  const canvasRef = useRef<any>(null)
  const ctxRef = useRef<any>(null)
  const imgRef = useRef<any>(null)
  const crop = useRef({ x: 0, y: 0, scale: 1 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const sizeRef = useRef(300)
  const dprRef = useRef(2)
  const [scaleVal, setScaleVal] = useState(1)

  useEffect(() => {
    const query = Taro.createSelectorQuery()
    query
      .select('#cropCanvas')
      .fields({ node: true, size: true })
      .exec((res: any[]) => {
        const item = res && res[0]
        if (!item || !item.node) return
        const node = item.node
        canvasRef.current = node
        const dpr = Math.min(2, (Taro.getSystemInfoSync() as any).pixelRatio || 2)
        dprRef.current = dpr
        const B = Math.round(item.width || 300)
        sizeRef.current = B
        node.width = Math.round(B * dpr)
        node.height = Math.round(B * dpr)
        const ctx = node.getContext('2d')
        ctxRef.current = ctx
        const img = node.createImage()
        imgRef.current = img
        img.onload = () => draw()
        img.onerror = () => Taro.showToast({ title: '这张图读不出来，换一张试试', icon: 'none', duration: 1700 })
        img.src = imgPath
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgPath])

  const geom = (): Geom => {
    const img = imgRef.current
    const B = sizeRef.current
    const cover = Math.max(B / img.width, B / img.height)
    const scale = cover * crop.current.scale
    const dw = img.width * scale
    const dh = img.height * scale
    const ox0 = (B - dw) / 2
    const oy0 = (B - dh) / 2
    const ox = Math.min(0, Math.max(B - dw, ox0 + crop.current.x))
    const oy = Math.min(0, Math.max(B - dh, oy0 + crop.current.y))
    return { sx: -ox / scale, sy: -oy / scale, sw: B / scale, sh: B / scale, ox, oy, ox0, oy0 }
  }

  const draw = () => {
    const ctx = ctxRef.current
    const img = imgRef.current
    if (!ctx || !img || !img.width) return
    const B = sizeRef.current
    const dpr = dprRef.current
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#EFE6DA'
    ctx.fillRect(0, 0, B, B)
    const g = geom()
    ctx.drawImage(img, g.sx, g.sy, g.sw, g.sh, 0, 0, B, B)
  }

  const clamp = () => {
    const g = geom()
    crop.current.x = g.ox - g.ox0
    crop.current.y = g.oy - g.oy0
  }

  const onTouchStart = (e: any) => {
    const t = e.touches && e.touches[0]
    if (!t) return
    drag.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchMove = (e: any) => {
    const t = e.touches && e.touches[0]
    if (!drag.current || !t) return
    crop.current.x += t.clientX - drag.current.x
    crop.current.y += t.clientY - drag.current.y
    drag.current = { x: t.clientX, y: t.clientY }
    draw()
  }

  const onTouchEnd = () => {
    if (!drag.current) return
    drag.current = null
    clamp()
    draw()
  }

  const onZoom = (e: any) => {
    const v = Number(e.detail.value) || 1
    crop.current.scale = v
    setScaleVal(v)
    clamp()
    draw()
  }

  const confirm = () => {
    const node = canvasRef.current
    if (!node || !imgRef.current) {
      onCancel()
      return
    }
    Taro.canvasToTempFilePath({
      canvas: node,
      fileType: 'jpg',
      quality: 0.86,
      destWidth: 512,
      destHeight: 512,
      success: (r: any) => onConfirm(r.tempFilePath),
      fail: () => Taro.showToast({ title: '裁剪失败，再试一次', icon: 'none', duration: 1700 })
    } as any)
  }

  return (
    <Sheet title='裁剪照片 · 拖动调整位置' onClose={onCancel}>
      <View className='crop-wrap'>
        <Canvas
          type='2d'
          id='cropCanvas'
          className='crop-canvas'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        />
      </View>
      <View className='crop-zoom'>
        <Text className='crop-zoom-ico'>⌕</Text>
        <Slider
          className='crop-slider'
          min={1}
          max={3}
          step={0.01}
          value={scaleVal}
          activeColor='#4A3B32'
          backgroundColor='#EFE6DA'
          blockSize={24}
          onChanging={onZoom}
          onChange={onZoom}
        />
        <Text className='crop-zoom-ico big'>⌕+</Text>
      </View>
      <Text className='cdot-hint crop-hint'>拖动照片选位置、滑块缩放；方框里看到的，就是好友看到的那一张。</Text>
      <View className='add-actions'>
        <View className='add-cancel' onClick={onCancel}><Text>换一张</Text></View>
        <View className='add-ok' onClick={confirm}><Text>用这张</Text></View>
      </View>
    </Sheet>
  )
}
