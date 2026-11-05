import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro'
import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '../../components/NavBar'
import {
  CounterCard,
  CounterMember,
  enqueue,
  enqueueEvent,
  formatRelative,
  formatStamp,
  loadActiveId,
  loadCards,
  newId,
  nextColorIdx,
  saveActiveId,
  saveCards,
  starterCard,
  clearPendingCard,
  removePendingEvent,
  colorOf,
  CounterMark
} from '../../utils/counterStore'
import {
  isCloudEnabled,
  syncAll,
  ensureSession,
  joinByCode,
  memberDisplayName,
  memberColor
} from '../../utils/counterApi'
import './index.scss'

type SheetKind = 'create' | 'history' | 'share' | null

const toast = (title: string) => {
  Taro.showToast({ title, icon: 'none', duration: 1800 })
}

const LOCAL_SELF: CounterMember = { id: 'local-self', name: '我', colorIdx: 0, role: 'owner', contribution: 0 }

export default function Counter() {
  const [cards, setCards] = useState<CounterCard[]>([])
  const [activeId, setActiveId] = useState('')
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newValue, setNewValue] = useState(0)
  const [confirmDel, setConfirmDel] = useState('')
  const [confirmHis, setConfirmHis] = useState('')
  const [popKey, setPopKey] = useState(0)
  const [floatInfo, setFloatInfo] = useState<{ key: number; delta: number } | null>(null)
  const [markTick, setMarkTick] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')
  const [cloud] = useState(isCloudEnabled())

  const cardsRef = useRef<CounterCard[]>([])
  const activeIdRef = useRef('')
  const syncTimer = useRef<any>(null)
  const popTimer = useRef<any>(null)
  const floatTimer = useRef<any>(null)
  const tickTimer = useRef<any>(null)

  const activeCard = cards.find(c => c.id === activeId) || cards[0]

  const selectCard = useCallback((id: string) => {
    if (!id) return
    activeIdRef.current = id
    saveActiveId(id)
    setActiveId(id)
    setConfirmDel('')
    setConfirmHis('')
  }, [])

  const reload = useCallback(() => {
    const next = loadCards()
    cardsRef.current = next
    setCards(next)
    if (!next.some(c => c.id === activeIdRef.current)) {
      const fallback = next[0] ? next[0].id : ''
      activeIdRef.current = fallback
      saveActiveId(fallback)
      setActiveId(fallback)
    }
  }, [])

  const runSync = useCallback(
    async (delay = 0) => {
      if (!cloud) return
      if (syncTimer.current) clearTimeout(syncTimer.current)
      const exec = async () => {
        setSyncing(true)
        try {
          await syncAll()
          reload()
          setSyncError('')
        } catch (e: any) {
          setSyncError(e && e.message ? e.message : '同步失败')
        } finally {
          setSyncing(false)
        }
      }
      if (delay > 0) {
        syncTimer.current = setTimeout(exec, delay)
      } else {
        await exec()
      }
    },
    [cloud, reload]
  )

  const scheduleSync = useCallback(
    (delay = 700) => {
      if (!cloud) return
      runSync(delay)
    },
    [cloud, runSync]
  )

  const commit = useCallback((next: CounterCard[]) => {
    cardsRef.current = next
    saveCards(next)
    setCards([...next])
  }, [])

  /* ---------------- 初始化 / 口令加入 ---------------- */
  useEffect(() => {
    let list = loadCards()
    if (!list.length) {
      const starter = starterCard()
      starter.colorIdx = nextColorIdx()
      list = [starter]
      saveCards(list)
      enqueue({ key: 'c' + starter.id, type: 'create', cardId: starter.id })
    }
    const savedActive = loadActiveId()
    const initialActive = list.some(c => c.id === savedActive) ? savedActive : list[0].id
    cardsRef.current = list
    activeIdRef.current = initialActive
    setCards(list)
    setActiveId(initialActive)
    saveActiveId(initialActive)

    const params = Taro.getCurrentInstance().router?.params
    const code = params && params.code ? String(params.code) : ''
    if (code) {
      ;(async () => {
        if (!cloud) {
          toast('云同步未开启，暂时无法加入好友的计数')
          return
        }
        try {
          setSyncing(true)
          await ensureSession()
          const joined = await joinByCode(code)
          reload()
          selectCard(joined.id)
          toast(`已加入「${joined.title}」`)
          runSync(0)
        } catch (e: any) {
          toast(e && e.message ? e.message : '口令无效或已过期')
        } finally {
          setSyncing(false)
        }
      })()
    } else {
      runSync(500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDidShow(() => {
    runSync(0)
  })

  useShareAppMessage(() => {
    const card = cardsRef.current.find(c => c.id === activeIdRef.current)
    if (card && card.shareCode) {
      return {
        title: `一起数「${card.title}」，现在是 ${card.value} ${card.unit}`,
        path: `/pages/counter/index?code=${card.shareCode}`
      }
    }
    return { title: '一起数数 · 一屏到底，数到尽头', path: '/pages/counter/index' }
  })

  /* ---------------- 计数动作 ---------------- */
  const bump = (delta: number) => {
    const card = cardsRef.current.find(c => c.id === activeIdRef.current)
    if (!card) return
    const nextValue = Math.max(0, card.value + delta)
    const real = nextValue - card.value
    if (!real) return

    const now = Date.now()
    const event = { id: newId('v'), type: 'delta' as const, delta: real, value: nextValue, ts: now }
    enqueueEvent(card.id, event)
    commit(
      cardsRef.current.map(c =>
        c.id === card.id
          ? { ...c, value: nextValue, updatedAt: now, lastBy: '我', lastAt: now, synced: false }
          : c
      )
    )

    setPopKey(k => k + 1)
    if (popTimer.current) clearTimeout(popTimer.current)
    popTimer.current = setTimeout(() => setPopKey(0), 220)

    setFloatInfo({ key: now, delta: real })
    if (floatTimer.current) clearTimeout(floatTimer.current)
    floatTimer.current = setTimeout(() => setFloatInfo(null), 1000)

    if (process.env.TARO_ENV === 'weapp') {
      try {
        const r = Taro.vibrateShort({ type: 'light' } as any)
        if (r && typeof r.catch === 'function') r.catch(() => {})
      } catch (e) {
        /* 低版本基础库忽略 */
      }
    }
    scheduleSync(800)
  }

  const markHistory = () => {
    const card = cardsRef.current.find(c => c.id === activeIdRef.current)
    if (!card) return
    const now = Date.now()
    const mark: CounterMark = { id: newId('m'), ts: now, value: card.value }
    const event = { id: mark.id, type: 'mark' as const, value: card.value, ts: now }
    enqueueEvent(card.id, event)

    commit(
      cardsRef.current.map(c =>
        c.id === card.id
          ? {
              ...c,
              history: [mark, ...c.history].slice(0, 500),
              updatedAt: now,
              lastBy: '我',
              lastAt: now,
              synced: false
            }
          : c
      )
    )

    setMarkTick(k => k + 1)
    if (tickTimer.current) clearTimeout(tickTimer.current)
    tickTimer.current = setTimeout(() => setMarkTick(0), 600)
    toast(`已标记 · ${card.value} ${card.unit}`)
    scheduleSync(800)
  }

  /* ---------------- 卡片与历史 ---------------- */
  const handleDeleteCard = (id: string) => {
    if (confirmDel !== id) {
      setConfirmDel(id)
      toast('再点一下确认删除')
      return
    }
    const card = cardsRef.current.find(c => c.id === id)
    if (!card) return
    if (card.shareCode) {
      enqueue({ key: 'd' + id, type: 'deleteCard', cardId: id })
    } else {
      clearPendingCard(id)
    }

    let next = cardsRef.current.filter(c => c.id !== id)
    if (!next.length) {
      const starter = starterCard()
      starter.colorIdx = nextColorIdx()
      next = [starter]
      enqueue({ key: 'c' + starter.id, type: 'create', cardId: starter.id })
    }
    commit(next)
    if (activeIdRef.current === id) selectCard(next[0].id)
    setConfirmDel('')
    toast('卡片已删除')
    scheduleSync(600)
  }

  const handleDeleteMark = (markId: string) => {
    if (confirmHis !== markId) {
      setConfirmHis(markId)
      toast('再点一下确认删除')
      return
    }
    const card = cardsRef.current.find(c => c.id === activeIdRef.current)
    if (!card) return
    if (card.shareCode) {
      enqueue({ key: 'dm' + markId, type: 'deleteMark', cardId: card.id, markId })
    } else {
      removePendingEvent(card.id, markId)
    }
    commit(
      cardsRef.current.map(c =>
        c.id === card.id ? { ...c, history: c.history.filter(h => h.id !== markId) } : c
      )
    )
    setConfirmHis('')
    toast('这条时间戳已删除')
    scheduleSync(600)
  }

  const createCard = () => {
    const title = newTitle.trim() || '我的计数'
    const now = Date.now()
    const card: CounterCard = {
      id: newId('c'),
      title: title.slice(0, 12),
      unit: '次',
      value: Math.max(0, Math.min(9999, newValue)),
      colorIdx: nextColorIdx(),
      history: [],
      members: [],
      version: 0,
      synced: false,
      createdAt: now,
      updatedAt: now
    }
    enqueue({ key: 'c' + card.id, type: 'create', cardId: card.id })
    commit([...cardsRef.current, card])
    selectCard(card.id)
    setSheet(null)
    setNewTitle('')
    setNewValue(0)
    toast('计数创建好了，开始数吧')
    scheduleSync(600)
  }

  const copyCode = () => {
    if (!activeCard || !activeCard.shareCode) {
      toast(cloud ? '口令正在生成，稍等一下' : '云同步未开启，暂无口令')
      return
    }
    Taro.setClipboardData({ data: activeCard.shareCode }).then(() => {
      toast('口令已复制，发给朋友吧')
    })
  }

  /* ---------------- 渲染 ---------------- */
  const displayMembers: CounterMember[] =
    activeCard && activeCard.members.length
      ? activeCard.members
      : activeCard
      ? [{ ...LOCAL_SELF, colorIdx: activeCard.colorIdx }]
      : []

  const cloudLabel = !cloud ? '本机' : activeCard && activeCard.synced ? '已同步' : '待同步'
  const latestMark = activeCard && activeCard.history.length ? activeCard.history[0] : null

  return (
    <View className='page-root counter-page'>
      <NavBar
        title='一起数数'
        right={
          <View
            className='nav-share'
            onClick={() => {
              setSheet('share')
              if (cloud && activeCard && !activeCard.shareCode) runSync(0)
            }}
          >
            <Text className='nav-share-icon'>↗</Text>
          </View>
        }
      />

      {!activeCard ? null : (
        <View className='counter-body'>
          <View
            className='main-block'
            key={activeCard.id}
            style={{ background: `linear-gradient(180deg, ${colorOf(activeCard.colorIdx).deep[0]}, ${colorOf(activeCard.colorIdx).deep[1]})` }}
          >
            <View className='mb-top'>
              <Text className='mb-title'>{activeCard.title}</Text>
              <View className='mb-pills'>
                <Text className={`mb-pill ${cloud && activeCard.synced ? '' : 'mb-pill--wait'}`}>{cloudLabel}</Text>
                <View className='mb-pill mb-pill--his' onClick={() => setSheet('history')}>
                  <Text className='mb-pill-icon'>◷</Text>
                  <Text>历史</Text>
                  <Text className='mb-badge'>{activeCard.history.length}</Text>
                </View>
              </View>
            </View>

            <View className='mb-num'>
              <Text className={`mb-num-val ${popKey ? 'is-pop' : ''}`} key={popKey}>{activeCard.value}</Text>
              <Text className='mb-unit'>{activeCard.unit}</Text>
            </View>

            <View className='mb-actions'>
              <View className='mb-btn mb-minus' onClick={() => bump(-1)}>
                <Text className='mb-btn-sign'>−</Text>
                {floatInfo && floatInfo.delta < 0 ? (
                  <Text className='mb-float' key={floatInfo.key}>{floatInfo.delta}</Text>
                ) : null}
              </View>
              <View className='mb-mark' onClick={markHistory}>
                <Text className='mb-mark-icon'>◷</Text>
                <Text>标记历史</Text>
                <View className={`mb-mark-tick ${markTick ? 'show' : ''}`} key={markTick}>
                  <Text>✓</Text>
                </View>
              </View>
              <View className='mb-btn mb-plus' onClick={() => bump(1)}>
                <Text className='mb-btn-sign'>+</Text>
                {floatInfo && floatInfo.delta > 0 ? (
                  <Text className='mb-float' key={floatInfo.key}>+{floatInfo.delta}</Text>
                ) : null}
              </View>
            </View>

            <View className='mb-stamp'>
              {latestMark ? (
                <Text className='mb-stamp-text'>✓ 最近标记 · {formatStamp(latestMark.ts)} · {latestMark.value} {activeCard.unit}</Text>
              ) : (
                <Text className='mb-stamp-text'>还没标记过历史，点上面的「标记历史」留下第一条</Text>
              )}
            </View>
          </View>

          <View className='panel-title'>
            <Text className='panel-title-main'>我的计数</Text>
            <Text className='panel-title-hint'>{cards.length} 张</Text>
          </View>

          <View className='card-list'>
            {cards.map(card => {
              const col = colorOf(card.colorIdx)
              const on = card.id === activeCard.id
              const cardMembers = card.members.length ? card.members : [{ ...LOCAL_SELF, colorIdx: card.colorIdx }]
              return (
                <View
                  key={card.id}
                  className={`mini-card ${on ? 'on' : ''}`}
                  onClick={() => selectCard(card.id)}
                >
                  <View className='m-topbar' style={{ background: col.hex }} />
                  <View className='m-name'>
                    <Text className='m-name-text'>{card.title}</Text>
                    <Text className='m-name-sub'>{on ? '正在顶部显示' : '点一下换到顶部'}</Text>
                  </View>
                  <Text className='m-val' style={{ color: col.hex }}>{card.value}</Text>
                  <Text className='m-unit'>{card.unit}</Text>
                  {cloud && card.synced ? <Text className='m-sync'>☁ 云</Text> : null}
                  {cardMembers.length ? (
                    <View className='m-members'>
                      {cardMembers.slice(0, 3).map((m, i) => (
                        <Text
                          key={m.id + i}
                          className='m-ava'
                          style={{ background: memberColor(m).hex }}
                        >
                          {memberDisplayName(m).slice(0, 1)}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                  <View
                    className='m-share'
                    onClick={(e: any) => {
                      e.stopPropagation()
                      selectCard(card.id)
                      setSheet('share')
                      if (cloud && !card.shareCode) runSync(0)
                    }}
                  >
                    <Text>↗</Text>
                  </View>
                  <View
                    className={`m-del ${confirmDel === card.id ? 'confirm' : ''}`}
                    onClick={(e: any) => {
                      e.stopPropagation()
                      handleDeleteCard(card.id)
                    }}
                  >
                    <Text>{confirmDel === card.id ? '删' : '×'}</Text>
                  </View>
                </View>
              )
            })}
          </View>

          <View className='add-card' onClick={() => setSheet('create')}>
            <Text className='add-card-icon'>+</Text>
            <Text>新建一张计数</Text>
          </View>
        </View>
      )}

      {/* ---------------- 新建 ---------------- */}
      {sheet === 'create' ? (
        <View className='sheet-mask' catchMove onClick={() => setSheet(null)}>
          <View className='sheet-inner' onClick={(e: any) => e.stopPropagation()}>
            <View className='sheet-grab' />
            <View className='sheet-head'>
              <Text className='sheet-title'>新建一张计数</Text>
              <View className='sheet-x' onClick={() => setSheet(null)}><Text>×</Text></View>
            </View>

            <View className='form-field'>
              <Text className='form-label'>它叫什么</Text>
              <Input
                className='form-input'
                value={newTitle}
                maxlength={12}
                placeholder='比如：今天写了几个字'
                placeholderStyle='color:#B8A99E'
                onInput={(e: any) => setNewTitle(e.detail.value)}
                focus
              />
            </View>

            <View className='form-field'>
              <Text className='form-label'>从几开始</Text>
              <View className='num-row'>
                <View className='num-btn' onClick={() => setNewValue(v => Math.max(0, v - 1))}>
                  <Text>−</Text>
                </View>
                <Text className='num-val'>{newValue}</Text>
                <View className='num-btn' onClick={() => setNewValue(v => Math.min(9999, v + 1))}>
                  <Text>+</Text>
                </View>
              </View>
            </View>

            <View className='add-actions'>
              <View className='add-cancel' onClick={() => setSheet(null)}>取消</View>
              <View className='add-ok' onClick={createCard}>创建，开始数</View>
            </View>
          </View>
        </View>
      ) : null}

      {/* ---------------- 历史 ---------------- */}
      {sheet === 'history' && activeCard ? (
        <View className='sheet-mask' catchMove onClick={() => setSheet(null)}>
          <View className='sheet-inner' onClick={(e: any) => e.stopPropagation()}>
            <View className='sheet-grab' />
            <View className='sheet-head'>
              <Text className='sheet-title'>「{activeCard.title}」的历史</Text>
              <View className='sheet-x' onClick={() => setSheet(null)}><Text>×</Text></View>
            </View>

            {activeCard.history.length ? (
              <ScrollView className='his-list' scrollY>
                {activeCard.history.map(h => (
                  <View className='his-item' key={h.id}>
                    <View className='h-dot'><Text>{h.value}</Text></View>
                    <View className='h-info'>
                      <Text className='h-time'>{formatStamp(h.ts)}</Text>
                      <Text className='h-note'>{h.value} {activeCard.unit} · {activeCard.synced ? '云端同步' : '本机时间戳'}</Text>
                    </View>
                    <View
                      className={`h-del ${confirmHis === h.id ? 'confirm' : ''}`}
                      onClick={() => handleDeleteMark(h.id)}
                    >
                      <Text>{confirmHis === h.id ? '删' : '×'}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View className='his-empty'>
                <Text>还没有时间戳。</Text>
                <Text>回到大块，数到一个想留住的数字，</Text>
                <Text>点一下 <Text className='his-empty-strong'>「标记历史」</Text> 就有了。</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}

      {/* ---------------- 好友协作 ---------------- */}
      {sheet === 'share' && activeCard ? (
        <View className='sheet-mask' catchMove onClick={() => setSheet(null)}>
          <View className='sheet-inner' onClick={(e: any) => e.stopPropagation()}>
            <View className='sheet-grab' />
            <View className='sheet-head'>
              <Text className='sheet-title'>分享「{activeCard.title}」</Text>
              <View className='sheet-x' onClick={() => setSheet(null)}><Text>×</Text></View>
            </View>

            <View className='share-card'>
              <View className='sc-top' style={{ background: colorOf(activeCard.colorIdx).deep[1] }}>
                <Text>{activeCard.value}</Text>
              </View>
              <View className='sc-info'>
                <Text className='sc-name'>{activeCard.title}</Text>
                <Text className='sc-num'>当前 {activeCard.value} {activeCard.unit}</Text>
              </View>
              <Text className={`sc-status ${cloud && activeCard.synced ? 'ok' : ''}`}>{cloudLabel}</Text>
            </View>

            <View className='share-code'>
              <View className='code-box'>
                <Text>{activeCard.shareCode || (cloud ? '同步中' : '未开启')}</Text>
              </View>
              <View className='share-copy' onClick={copyCode}>
                <Text>复制口令</Text>
              </View>
            </View>
            <Text className='share-code-hint'>6 位口令 · 朋友打开分享卡片会自动加入</Text>

            <Button className='share-send' openType='share'>发送给好友</Button>

            <View className='share-members'>
              {displayMembers.map((m, i) => (
                <View className='share-member' key={m.id + i}>
                  <View className='m-ava-big' style={{ background: memberColor(m).hex }}>
                    <Text>{memberDisplayName(m).slice(0, 1)}</Text>
                  </View>
                  <View className='share-member-info'>
                    <Text className='share-member-name'>{memberDisplayName(m)}</Text>
                    <Text className='share-member-sub'>{m.role === 'owner' ? '创建者' : '好友'} · 共同维护</Text>
                  </View>
                  <Text className='share-member-count'>+{m.contribution} 次</Text>
                </View>
              ))}
              <View className='share-member'>
                <View className='m-ava-big m-ava-empty'><Text>＋</Text></View>
                <View className='share-member-info'>
                  <Text className='share-member-name'>等待朋友加入</Text>
                  <Text className='share-member-sub'>分享卡片或口令任一即可</Text>
                </View>
              </View>
            </View>

            <View className='share-record'>
              <Text>
                {activeCard.lastBy
                  ? `${activeCard.lastBy} ${formatRelative(activeCard.lastAt)}数了一下`
                  : '还没有同步记录'}
                {latestMark ? ` · ${formatStamp(latestMark.ts)} 标记了 ${latestMark.value} ${activeCard.unit}` : ''}
              </Text>
            </View>

            <View className='share-sync'>
              <Text className={cloud && !syncError ? 'share-sync-ok' : 'share-sync-warn'}>
                {!cloud
                  ? '云同步未开启 · 数据只保存在本机'
                  : syncError
                  ? `同步异常 · ${syncError}`
                  : syncing
                  ? '正在同步…'
                  : activeCard.shareCode
                  ? `已同步 · ${displayMembers.length} 位小伙伴随时可数`
                  : '等待联网生成口令'}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}
