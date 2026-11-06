import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Sheet from './Sheet'
import { pad, fmtAmt } from '../../../utils/counterCalc'

/* 记录 / 编辑浮层：时刻 chips + 时分步进 + 数量加减 + 备注。
 * 双击就地输入在小程序不可用 → 点数字弹输入框（同一能力，可靠实现）。 */
interface RecordSheetProps {
  title: string
  initTime: string
  initAmount: number
  initNote: string
  isEdit: boolean
  onSave: (time: string, amount: number, note: string) => void
  onDelete?: () => void
  onClose: () => void
}

const CHIPS = ['08:00', '12:00', '18:00', '21:00']

export default function RecordSheet({ title, initTime, initAmount, initNote, isEdit, onSave, onDelete, onClose }: RecordSheetProps) {
  const [h, setH] = useState(Number(initTime.split(':')[0]) || 0)
  const [m, setM] = useState(Number(initTime.split(':')[1]) || 0)
  const [amount, setAmount] = useState(initAmount)
  const [note, setNote] = useState(initNote || '')
  const [floatInfo, setFloatInfo] = useState<{ key: number; d: number } | null>(null)
  const [confirmDel, setConfirmDel] = useState(false)

  const cur = `${pad(h)}:${pad(m)}`

  /* 点数字直接输入：数量 / 时 / 分 */
  const inlineEdit = async (kind: 'amt' | 'h' | 'm') => {
    const curVal = kind === 'amt' ? Math.abs(amount) : kind === 'h' ? h : m
    try {
      const res = await Taro.showModal({
        title: kind === 'amt' ? '输入数量' : kind === 'h' ? '输入小时（0-23）' : '输入分钟（0-59）',
        editable: true,
        placeholderText: String(curVal)
      } as any)
      if (!res.confirm) return
      /* editable 模式的输入内容在 res.content，Taro 类型未声明 */
      const input = (res as { content?: string }).content
      const n = Math.floor(Number(input))
      if (!input || !Number.isFinite(n)) return
      if (kind === 'amt') setAmount(n)
      if (kind === 'h') setH(Math.min(23, Math.max(0, n)))
      if (kind === 'm') setM(Math.min(59, Math.max(0, n)))
    } catch (e) {
      /* 低版本基础库不支持 editable，忽略 */
    }
  }

  const stepTime = (k: 'h' | 'm', d: number) => {
    if (k === 'h') setH(((h + d) % 24 + 24) % 24)
    else setM(((m + d) % 60 + 60) % 60)
  }

  const stepAmt = (d: number) => {
    setAmount(amount + d)
    setFloatInfo({ key: Date.now(), d })
    setTimeout(() => setFloatInfo(null), 750)
  }

  const handleDelete = () => {
    if (!onDelete) return
    if (!confirmDel) {
      setConfirmDel(true)
      Taro.showToast({ title: '再点一下确认删除', icon: 'none', duration: 1700 })
      return
    }
    onDelete()
  }

  return (
    <Sheet title={title} onClose={onClose}>
      <View className='form-field'>
        <Text className='form-label'>时间</Text>
        <View className='chip-row'>
          {CHIPS.map(ch => (
            <View key={ch} className={`qchip ${cur === ch ? 'on' : ''}`} onClick={() => { const [hh, mm] = ch.split(':').map(Number); setH(hh); setM(mm) }}>
              <Text>{ch}</Text>
            </View>
          ))}
        </View>
        <View className='tm-row'>
          <View className='tm-box'>
            <View className='tm-btn' onClick={() => stepTime('h', -1)}><Text>−</Text></View>
            <Text className='tm-v' onClick={() => inlineEdit('h')}>{pad(h)}</Text>
            <View className='tm-btn' onClick={() => stepTime('h', 1)}><Text>+</Text></View>
          </View>
          <Text className='tm-colon'>:</Text>
          <View className='tm-box'>
            <View className='tm-btn' onClick={() => stepTime('m', -5)}><Text>−</Text></View>
            <Text className='tm-v' onClick={() => inlineEdit('m')}>{pad(m)}</Text>
            <View className='tm-btn' onClick={() => stepTime('m', 5)}><Text>+</Text></View>
          </View>
        </View>
      </View>

      <View className='form-field'>
        <Text className='form-label'>数量</Text>
        <View className='num-row'>
          <View className='num-btn' onClick={() => stepAmt(-1)}>
            <Text>−</Text>
          </View>
          <View className='num-val-wrap' onClick={() => inlineEdit('amt')}>
            <Text className={`num-val ${amount < 0 ? 'neg' : ''}`} key={amount}>{fmtAmt(amount)}</Text>
            {floatInfo ? (
              <Text className={`amt-float ${floatInfo.d < 0 ? 'neg' : ''}`} key={floatInfo.key}>
                {floatInfo.d < 0 ? '−1' : '+1'}
              </Text>
            ) : null}
          </View>
          <View className='num-btn' onClick={() => stepAmt(1)}>
            <Text>+</Text>
          </View>
        </View>
      </View>

      <View className='form-field'>
        <Text className='form-label'>备注</Text>
        <Input
          className='form-input'
          value={note}
          maxlength={20}
          placeholder='选填'
          placeholderStyle='color:#B8A99E'
          onInput={(e: any) => setNote(e.detail.value)}
        />
      </View>

      <View className='add-actions'>
        <View className='add-cancel' onClick={onClose}><Text>取消</Text></View>
        <View className='add-ok' onClick={() => onSave(`${pad(h)}:${pad(m)}`, amount, note.trim())}>
          <Text>{isEdit ? '保存修改' : '保存这条'}</Text>
        </View>
      </View>

      {isEdit && onDelete ? (
        <View className={`del-btn ${confirmDel ? 'confirm' : ''}`} onClick={handleDelete}>
          <Text>{confirmDel ? '再点一下，确认删除这一条' : '删除这一条'}</Text>
        </View>
      ) : null}
    </Sheet>
  )
}
