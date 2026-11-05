import { View, Text, Input } from '@tarojs/components'
import { useState } from 'react'
import Sheet from './Sheet'
import { COUNTER_COLORS, peekColorIdx } from '../../../utils/counterStore'

/* 新建标签浮层 */
export interface NewTagDraft {
  name: string
  unit: string
  target?: number
  colorIdx: number
  photo?: string
}

interface NewTagSheetProps {
  photo: string
  onSave: (draft: NewTagDraft) => void
  onSetCol: (idx: number) => void
  onPickPhoto: () => void
  onClose: () => void
}

export default function NewTagSheet({ photo, onSave, onSetCol, onPickPhoto, onClose }: NewTagSheetProps) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('次')
  const [target, setTarget] = useState('')
  const [colorIdx, setColorIdx] = useState<number>(peekColorIdx())
  const usePhoto = !!photo

  return (
    <Sheet title='新建一个标签' onClose={onClose}>
      <View className='form-field'>
        <Text className='form-label'>名称</Text>
        <Input
          className='form-input'
          value={name}
          maxlength={12}
          placeholder='比如：今天走了多少步'
          placeholderStyle='color:#B8A99E'
          onInput={(e: any) => setName(e.detail.value)}
        />
      </View>

      <View className='form-field'>
        <Text className='form-label'>单位</Text>
        <Input
          className='form-input'
          value={unit}
          maxlength={4}
          onInput={(e: any) => setUnit(e.detail.value)}
        />
      </View>

      <View className='form-field'>
        <Text className='form-label'>目标（选填）</Text>
        <Input
          className='form-input'
          type='number'
          value={target}
          placeholder='不填 = 不开启预测'
          placeholderStyle='color:#B8A99E'
          onInput={(e: any) => setTarget(e.detail.value)}
        />
      </View>

      <View className='form-field'>
        <Text className='form-label'>颜色 · 或用一张照片</Text>
        <View className='color-dots'>
          {COUNTER_COLORS.map((cc, i) => (
            <View
              key={i}
              className={`cdot ${i === colorIdx && !usePhoto ? 'on' : ''}`}
              style={{ background: cc.hex }}
              onClick={() => { setColorIdx(i); onSetCol(i) }}
            >
              {i === colorIdx && !usePhoto ? <Text className='cdot-check'>✓</Text> : null}
            </View>
          ))}
          <View
            className={`cdot cdot-custom ${usePhoto ? 'on' : ''}`}
            onClick={onPickPhoto}
          >
            {photo ? <View className='cdot-photo' style={{ backgroundImage: `url(${photo})` }} /> : null}
            <Text className='cdot-cam'>⌾</Text>
          </View>
        </View>
        <Text className='cdot-hint'>点最后的圆圈，从相册选图并裁剪；照片会随标签同步给好友。</Text>
      </View>

      <View className='add-actions'>
        <View className='add-cancel' onClick={onClose}><Text>取消</Text></View>
        <View
          className='add-ok'
          onClick={() =>
            onSave({
              name,
              unit,
              target: Math.floor(Number(target)) > 0 ? Math.floor(Number(target)) : undefined,
              colorIdx: usePhoto ? 6 : colorIdx,
              photo: photo || undefined
            })
          }
        >
          <Text>创建标签</Text>
        </View>
      </View>
    </Sheet>
  )
}
