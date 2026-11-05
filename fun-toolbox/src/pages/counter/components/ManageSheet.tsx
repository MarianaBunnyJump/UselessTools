import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Sheet from './Sheet'
import type { CounterTag } from '../../../utils/counterStore'
import { COUNTER_COLORS, loadAccountId } from '../../../utils/counterStore'
import { allSum, fmtCN, relDay } from '../../../utils/counterCalc'
import { tagColor } from './BigCard'

/* 标签与分享浮层：改名称/单位/目标/颜色/照片 + 口令分享 + 成员 */
interface ManageSheetProps {
  tag: CounterTag
  photo: string
  cloud: boolean
  syncing: boolean
  syncError: string
  onSaveMeta: (name: string, unit: string, target: number | undefined) => void
  onSetCol: (idx: number) => void
  onPickPhoto: () => void
  onCopyCode: () => void
  onDelTag: () => void
  onClose: () => void
}

export default function ManageSheet({
  tag, photo, cloud, syncing, syncError, onSaveMeta, onSetCol, onPickPhoto, onCopyCode, onDelTag, onClose
}: ManageSheetProps) {
  const [name, setName] = useState(tag.name)
  const [unit, setUnit] = useState(tag.unit)
  const [target, setTarget] = useState(tag.target ? String(tag.target) : '')
  const [confirmTag, setConfirmTag] = useState(false)
  const c = tagColor(tag)
  const usePhoto = !!photo
  const myId = loadAccountId()

  const recent = [...tag.entries]
    .sort((a, b) => ((a.date + a.time) < (b.date + b.time) ? 1 : -1))
    .slice(0, 3)
    .map(e => `${e.by} ${relDay(e.date) || fmtCN(e.date)} ${e.time}`)

  const handleDelTag = () => {
    if (!confirmTag) {
      setConfirmTag(true)
      Taro.showToast({ title: '再点一下确认删除整个标签', icon: 'none', duration: 1700 })
      return
    }
    onDelTag()
  }

  return (
    <Sheet title={`标签与分享 · ${tag.name}`} onClose={onClose}>
      <View className='form-field'>
        <Text className='form-label'>名称</Text>
        <Input
          className='form-input'
          value={name}
          maxlength={12}
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
              className={`cdot ${i === tag.colorIdx && !usePhoto ? 'on' : ''}`}
              style={{ background: cc.hex }}
              onClick={() => onSetCol(i)}
            >
              {i === tag.colorIdx && !usePhoto ? <Text className='cdot-check'>✓</Text> : null}
            </View>
          ))}
          <View
            className={`cdot cdot-custom ${usePhoto ? 'on' : ''}`}
            onClick={onPickPhoto}
          >
            {photo ? (
              <View className='cdot-photo' style={{ backgroundImage: `url(${photo})` }} />
            ) : null}
            <Text className='cdot-cam'>⌾</Text>
          </View>
        </View>
        <Text className='cdot-hint'>照片背景会随标签同步给好友，好友端看到同一张图；大卡与日历都用它。</Text>
      </View>

      <View className='add-ok manage-save' onClick={() => onSaveMeta(name.trim(), unit.trim(), target)}>
        <Text>保存标签设置</Text>
      </View>

      <Text className='form-label'>和朋友共同维护</Text>
      <View className='share-card'>
        <View className='sc-top' style={{ background: `linear-gradient(180deg, ${c.deep[0]}, ${c.deep[1]})` }}>
          <Text>{allSum(tag)}</Text>
        </View>
        <View className='sc-info'>
          <Text className='sc-name'>{tag.name}</Text>
          <Text className='sc-num'>
            {tag.target ? `目标进度 ${allSum(tag)}/${tag.target} ${tag.unit}` : `累计 ${allSum(tag)} ${tag.unit}`}
          </Text>
        </View>
        <Text className='sc-pill'>每条署名</Text>
      </View>

      {tag.synced && tag.shareCode ? (
        <>
          <View className='share-link'>
            <Text className='share-link-text'>邀请链接随分享卡片自动携带</Text>
            <Button className='share-link-btn' openType='share'>分享</Button>
          </View>
          <View className='share-code'>
            <View className='code-box' onClick={onCopyCode}>
              <Text>{tag.shareCode}</Text>
            </View>
            <View className='share-code-hint'>
              <Text>口令 · 朋友凭此加入</Text>
              <Text>共同维护同一个标签</Text>
            </View>
          </View>
          <View className='share-members'>
            {tag.members.map((m, i) => (
              <View className='share-member' key={m.id + i}>
                <View className='m-ava' style={{ background: `linear-gradient(180deg, ${['#36564B,#223931', '#9B7FD4,#7E57C2', '#F5A623,#EF8B00', '#3FAF9F,#00897B', '#EF7FA6,#D6658F', '#E8795A,#CE5B3F'][m.colorIdx % 6] || '#36564B,#223931'})` }}>
                  <Text>{(m.id === myId ? '我' : m.name).slice(0, 1)}</Text>
                </View>
                <View className='m-name'>
                  <Text className='m-name-txt'>{m.id === myId ? '我' : m.name}</Text>
                  <Text className='m-name-sub'>{m.role === 'owner' ? '创建者' : '好友'}</Text>
                </View>
                <Text className='m-count'>{m.contribution} 条</Text>
              </View>
            ))}
            <View className='share-member'>
              <View className='m-ava m-ava-empty'><Text>＋</Text></View>
              <View className='m-name'>
                <Text className='m-name-txt'>等朋友加入</Text>
                <Text className='m-name-sub'>链接或口令任一即可</Text>
              </View>
            </View>
          </View>
          {recent.length ? (
            <View className='share-record'>
              <Text>
                {recent.map((r, i) => (
                  <Text key={i}>{i === 0 ? <Text className='sr-b'>{r}</Text> : ` · ${r}`}{i === 0 ? ' 记了一笔' : ''}</Text>
                ))}
              </Text>
            </View>
          ) : null}
          <View className='share-sync'>
            <Text className='share-sync-ok'>✓ 已落库，{tag.members.length} 位小伙伴改动实时推送</Text>
          </View>
        </>
      ) : (
        <>
          <View className='share-record'>
            <Text>这个标签还只在本机。分享给朋友后，大家记的每一条都会实时落库同步。</Text>
          </View>
          <View className='share-sync'>
            <Text className='share-sync-dim'>
              {!cloud ? '云同步未开启 · 数据只保存在本机' : syncError ? `同步异常 · ${syncError}` : syncing ? '正在同步…' : '等待联网生成口令'}
            </Text>
          </View>
        </>
      )}

      <View className={`del-btn ${confirmTag ? 'confirm' : ''} manage-del`} onClick={handleDelTag}>
        <Text>{confirmTag ? '再点一下，确认删除整个标签' : '删除整个标签'}</Text>
      </View>
    </Sheet>
  )
}
