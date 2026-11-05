import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage, useDidShow } from '@tarojs/taro'
import { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from '../../components/NavBar'
import {
  CounterTag,
  CounterEntry,
  CounterAnniversary,
  newId,
  nextColorIdx,
  loadTags,
  saveTag,
  removeTagLocal,
  loadActiveId,
  saveActiveId,
  enqueue,
  enqueueEntries,
  enqueueMarks,
  removePendingEntry,
  removePendingMark,
  clearPendingTag
} from '../../utils/counterStore'
import {
  isCloudEnabled,
  syncAll,
  ensureSession,
  joinByCode
} from '../../utils/counterApi'
import { exportCsvFile, pickAndImportCsv } from '../../utils/counterCsv'
import {
  todayStr,
  allSum,
  daySum,
  fmtCN,
  fmtAmt,
  relDay,
  forecast
} from '../../utils/counterCalc'
import TagRow from './components/TagRow'
import BigCard from './components/BigCard'
import CalBlock from './components/CalBlock'
import RecordSheet from './components/RecordSheet'
import AnnSheet from './components/AnnSheet'
import ManageSheet from './components/ManageSheet'
import NewTagSheet, { NewTagDraft } from './components/NewTagSheet'
import DataSheet from './components/DataSheet'
import CropSheet from './components/CropSheet'
import './index.scss'

type SheetKind = 'add' | 'edit' | 'ann' | 'manage' | 'data' | 'newTag' | 'crop' | null

const toast = (title: string, duration = 1700) => {
  Taro.showToast({ title, icon: 'none', duration })
}

function starterTag(): CounterTag {
  const now = Date.now()
  return {
    id: newId('t'),
    name: '喝水打卡',
    unit: '杯',
    colorIdx: 0,
    synced: false,
    members: [],
    version: 0,
    createdAt: now,
    updatedAt: now,
    entries: [],
    anniversaries: []
  }
}

export default function Counter() {
  const [tags, setTags] = useState<CounterTag[]>([])
  const [activeId, setActiveId] = useState('')
  const [selDate, setSelDate] = useState(todayStr())
  const [calY, setCalY] = useState(new Date().getFullYear())
  const [calM, setCalM] = useState(new Date().getMonth() + 1)
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [editId, setEditId] = useState('')
  const [popKey, setPopKey] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')
  const [mgPhoto, setMgPhoto] = useState('')
  const [ntPhoto, setNtPhoto] = useState('')
  const [cropFor, setCropFor] = useState<'new' | 'manage'>('new')
  const [cropImg, setCropImg] = useState('')
  const [cloud] = useState(isCloudEnabled())

  const tagsRef = useRef<CounterTag[]>([])
  const activeIdRef = useRef('')
  const syncTimer = useRef<any>(null)
  const popTimer = useRef<any>(null)

  const activeTag = tags.find(t => t.id === activeId) || tags[0]

  const commit = useCallback((next: CounterTag[]) => {
    tagsRef.current = next
    setTags([...next])
  }, [])

  const updateTag = useCallback((tagId: string, mutate: (t: CounterTag) => CounterTag) => {
    const list = tagsRef.current
    const idx = list.findIndex(t => t.id === tagId)
    if (idx < 0) return
    const next = [...list]
    next[idx] = mutate(list[idx])
    saveTag(next[idx])
    commit(next)
  }, [commit])

  const reload = useCallback(() => {
    const next = loadTags()
    commit(next)
    if (!next.some(t => t.id === activeIdRef.current)) {
      const fallback = next[0] ? next[0].id : ''
      activeIdRef.current = fallback
      saveActiveId(fallback)
      setActiveId(fallback)
    }
  }, [commit])

  const runSync = useCallback(
    async (opts: { silent?: boolean; delay?: number } = {}) => {
      if (!cloud) return
      if (syncTimer.current) clearTimeout(syncTimer.current)
      const exec = async () => {
        setSyncing(true)
        if (!opts.silent) toast('正在同步 · 拉取好友端的改动')
        try {
          await syncAll()
          reload()
          setSyncError('')
          if (!opts.silent) toast('已同步 · 刚刚')
        } catch (e: any) {
          setSyncError(e && e.message ? e.message : '同步失败')
          if (!opts.silent) toast(e && e.message ? e.message : '同步失败')
        } finally {
          setSyncing(false)
        }
      }
      if (opts.delay && opts.delay > 0) {
        syncTimer.current = setTimeout(exec, opts.delay)
      } else {
        await exec()
      }
    },
    [cloud, reload]
  )

  const scheduleSync = useCallback(
    (delay = 800) => {
      runSync({ silent: true, delay })
    },
    [runSync]
  )

  /* ---------------- 初始化 / 口令加入 ---------------- */
  useEffect(() => {
    let list = loadTags()
    if (!list.length) {
      const starter = starterTag()
      starter.colorIdx = nextColorIdx()
      list = [starter]
      saveTag(starter)
      enqueue({ key: 'c' + starter.id, type: 'createTag', tagId: starter.id })
    }
    const savedActive = loadActiveId()
    const initialActive = list.some(t => t.id === savedActive) ? savedActive : list[0].id
    tagsRef.current = list
    activeIdRef.current = initialActive
    setTags(list)
    setActiveId(initialActive)
    saveActiveId(initialActive)

    /* 跨天刷新 TODAY：进入页面时校准今天 */
    setSelDate(todayStr())
    const now = new Date()
    setCalY(now.getFullYear())
    setCalM(now.getMonth() + 1)

    const params = Taro.getCurrentInstance().router?.params
    const code = params && params.code ? String(params.code) : ''
    if (code) {
      ;(async () => {
        if (!cloud) {
          toast('云同步未开启，暂时无法加入好友的标签')
          return
        }
        try {
          setSyncing(true)
          await ensureSession()
          const joined = await joinByCode(code)
          reload()
          activeIdRef.current = joined.id
          saveActiveId(joined.id)
          setActiveId(joined.id)
          toast(`已加入「${joined.name}」`)
        } catch (e: any) {
          toast(e && e.message ? e.message : '口令无效或已过期')
        } finally {
          setSyncing(false)
        }
      })()
    } else {
      runSync({ silent: true, delay: 500 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDidShow(() => {
    runSync({ silent: true })
  })

  useShareAppMessage(() => {
    const t = tagsRef.current.find(x => x.id === activeIdRef.current)
    if (t && t.shareCode) {
      return {
        title: `一起数「${t.name}」，累计 ${allSum(t)} ${t.unit}`,
        path: `/pages/counter/index?code=${t.shareCode}`
      }
    }
    return { title: '一起数数 · 日历账 · 全家一起记', path: '/pages/counter/index' }
  })

  /* ---------------- 日历 ---------------- */
  const pickDay = (ds: string) => {
    if (ds > todayStr()) {
      toast('今天之后的日子还没到，记不了')
      return
    }
    setSelDate(ds)
  }

  const calNav = (dir: -1 | 1) => {
    let m = calM + dir
    let y = calY
    if (m < 1) {
      m = 12
      y -= 1
    }
    if (m > 12) {
      m = 1
      y += 1
    }
    setCalY(y)
    setCalM(m)
  }

  /* ---------------- 记录 / 编辑 ---------------- */
  const saveEntry = (time: string, amount: number, note: string) => {
    const t = activeTag
    if (!t) return
    const below = t.target ? allSum(t) < t.target : false
    const entry: CounterEntry = { id: newId('e'), date: selDate, time, amount, note, by: '我' }
    enqueueEntries(t.id, [entry])
    updateTag(t.id, x => ({ ...x, entries: [...x.entries, entry], updatedAt: Date.now(), synced: false }))

    setSheet(null)
    toast(
      t.target && below && allSum({ ...t, entries: [...t.entries, entry] }) >= t.target
        ? `达成目标 ${t.target} ${t.unit}！立个纪念日吧`
        : `已记录 ${fmtAmt(amount)} ${t.unit} · ${time}`
    )
    if (selDate === todayStr()) {
      setPopKey(k => k + 1)
      if (popTimer.current) clearTimeout(popTimer.current)
      popTimer.current = setTimeout(() => setPopKey(0), 220)
    }
    scheduleSync(800)
  }

  const saveEdit = (time: string, amount: number, note: string) => {
    const t = activeTag
    if (!t) return
    const below = t.target ? allSum(t) < t.target : false
    let updated: CounterTag | null = null
    updateTag(t.id, x => {
      const entries = x.entries.map(e =>
        e.id === editId ? { ...e, time, amount, note, by: e.by || '我' } : e
      )
      updated = { ...x, entries, updatedAt: Date.now(), synced: false }
      return updated
    })
    enqueueEntries(t.id, [{ id: editId, date: (updated?.entries.find(e => e.id === editId)?.date) || selDate, time, amount, note, by: '我' }])
    setSheet(null)
    setEditId('')
    toast(
      t.target && below && updated && allSum(updated) >= (t.target || 0)
        ? `达成目标 ${t.target} ${t.unit}！立个纪念日吧`
        : '改好了，合计已重算'
    )
    scheduleSync(800)
  }

  const deleteEntry = (entryId: string) => {
    const t = activeTag
    if (!t) return
    if (t.synced) {
      enqueue({ key: 'de' + entryId, type: 'delEntry', tagId: t.id, entryId })
    } else {
      removePendingEntry(t.id, entryId)
    }
    updateTag(t.id, x => ({ ...x, entries: x.entries.filter(e => e.id !== entryId), updatedAt: Date.now() }))
    setSheet(null)
    setEditId('')
    toast('这一条已删除，合计重算')
    scheduleSync(600)
  }

  /* ---------------- 标记历史 ---------------- */
  const markAnn = (time: string) => {
    const t = activeTag
    if (!t) return
    if (selDate > todayStr()) {
      toast('今天之后的日子还没到，标不了')
      return
    }
    if (t.anniversaries.some(a => a.date === selDate)) {
      toast('这一天已经是纪念日了')
      return
    }
    const mark: CounterAnniversary = {
      id: newId('a'),
      date: selDate,
      time,
      label: `「${t.name}」纪念日`,
      valueAtMark: daySum(t, selDate)
    }
    enqueueMarks(t.id, [mark])
    updateTag(t.id, x => ({ ...x, anniversaries: [...x.anniversaries, mark], updatedAt: Date.now(), synced: false }))
    toast(`★ 已标记为历史 ${time}，日历上会亮星标`)
    scheduleSync(800)
  }

  const deleteAnn = (markId: string) => {
    const t = activeTag
    if (!t) return
    if (t.synced) {
      enqueue({ key: 'dm' + markId, type: 'delMark', tagId: t.id, markId })
    } else {
      removePendingMark(t.id, markId)
    }
    updateTag(t.id, x => ({ ...x, anniversaries: x.anniversaries.filter(a => a.id !== markId), updatedAt: Date.now() }))
    toast('纪念日已删除')
    scheduleSync(600)
  }

  /* ---------------- 新建 / 管理 ---------------- */
  const createTag = (draft: NewTagDraft) => {
    const tag: CounterTag = {
      id: newId('t'),
      name: (draft.name || '').trim().slice(0, 12) || '我的标签',
      unit: (draft.unit || '次').trim().slice(0, 4) || '次',
      colorIdx: draft.colorIdx,
      target: draft.target,
      photo: draft.photo,
      synced: false,
      members: [],
      version: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      entries: [],
      anniversaries: []
    }
    saveTag(tag)
    enqueue({ key: 'c' + tag.id, type: 'createTag', tagId: tag.id })
    if (draft.photo) enqueue({ key: 'ph' + tag.id, type: 'photo', tagId: tag.id })
    nextColorIdx()
    commit([...tagsRef.current, tag])
    activeIdRef.current = tag.id
    saveActiveId(tag.id)
    setActiveId(tag.id)
    setSheet(null)
    setNtPhoto('')
    setSelDate(todayStr())
    toast('标签建好了，今天记第一笔吧')
    scheduleSync(600)
  }

  const saveMeta = (name: string, unit: string, target: number | undefined) => {
    const t = activeTag
    if (!t) return
    updateTag(t.id, x => {
      const next: CounterTag = {
        ...x,
        name: name.slice(0, 12) || x.name,
        unit: unit.slice(0, 4) || x.unit,
        target,
        updatedAt: Date.now(),
        synced: false
      }
      if (mgPhoto) {
        next.photo = mgPhoto
        next.colorIdx = 6
      }
      return next
    })
    if (t.synced) enqueue({ key: 'um' + t.id + Date.now().toString(36), type: 'updateMeta', tagId: t.id })
    if (mgPhoto) enqueue({ key: 'ph' + t.id, type: 'photo', tagId: t.id })
    toast('标签已更新，好友端实时同步')
    scheduleSync(800)
  }

  const setCol = (idx: number) => {
    const t = activeTag
    if (!t) return
    updateTag(t.id, x => ({ ...x, colorIdx: idx, photo: undefined, updatedAt: Date.now(), synced: false }))
    setMgPhoto('')
    if (t.synced) enqueue({ key: 'um' + t.id + Date.now().toString(36), type: 'updateMeta', tagId: t.id })
    scheduleSync(800)
  }

  const deleteTag = () => {
    const t = activeTag
    if (!t) return
    if (t.synced) {
      enqueue({ key: 'dt' + t.id, type: 'delTag', tagId: t.id })
    } else {
      clearPendingTag(t.id)
    }
    let next = tagsRef.current.filter(x => x.id !== t.id)
    removeTagLocal(t.id)
    if (!next.length) {
      const starter = starterTag()
      starter.colorIdx = nextColorIdx()
      saveTag(starter)
      enqueue({ key: 'c' + starter.id, type: 'createTag', tagId: starter.id })
      next = [starter]
    }
    commit(next)
    activeIdRef.current = next[0].id
    saveActiveId(next[0].id)
    setActiveId(next[0].id)
    setSheet(null)
    setMgPhoto('')
    toast('标签已删除')
    scheduleSync(600)
  }

  /* ---------------- 照片 ---------------- */
  const pickPhoto = (for_: 'new' | 'manage') => {
    setCropFor(for_)
    Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res: any) => {
        const file = res.tempFiles && res.tempFiles[0]
        if (file && file.tempFilePath) setCropImg(file.tempFilePath)
      }
    } as any)
  }

  const confirmCrop = (tempPath: string) => {
    /* 存到 USER_DATA_PATH 持久目录，只存路径不进 storage */
    try {
      const fs = Taro.getFileSystemManager()
      const saved = fs.saveFileSync(tempPath)
      if (cropFor === 'new') {
        setNtPhoto(saved)
      } else {
        setMgPhoto(saved)
      }
      toast('照片已裁剪 · 会随标签一起同步')
    } catch (e) {
      toast('照片保存失败，再试一次')
    }
    setCropImg('')
    setSheet(cropFor === 'new' ? 'newTag' : 'manage')
  }

  /* ---------------- 导入导出 ---------------- */
  const exportCsv = async () => {
    try {
      const mode = await exportCsvFile(tagsRef.current)
      toast(mode === 'shared' ? 'CSV 已生成，留意聊天发送面板' : '已复制文本（数据较长可能截断）')
    } catch (e: any) {
      toast(e && e.message ? e.message : '导出失败')
    }
  }

  const importCsv = async () => {
    try {
      const result = await pickAndImportCsv()
      if (!result) return
      reload()
      toast(`导入完成：记录 ${result.nE} 条、历史标记 ${result.nA} 个${result.nSkip ? `，跳过 ${result.nSkip} 行` : ''}`)
      setSheet(null)
      scheduleSync(800)
    } catch (e: any) {
      toast('这个文件读不出来，换一个试试')
    }
  }

  const copyCode = () => {
    const t = activeTag
    if (!t || !t.shareCode) {
      toast(cloud ? '口令正在生成，稍等一下' : '云同步未开启，暂无口令')
      return
    }
    Taro.setClipboardData({ data: t.shareCode }).then(() => {
      toast('口令已复制，发给朋友吧')
    })
  }

  /* ---------------- 渲染 ---------------- */
  const editing = sheet === 'edit' ? activeTag?.entries.find(e => e.id === editId) : undefined
  const addTitle = sheet === 'add' ? `记录 · ${fmtCN(selDate)}${relDay(selDate) ? `（${relDay(selDate)}）` : ''}` : ''
  const editTitle = editing ? `${fmtCN(editing.date)}${relDay(editing.date) ? `（${relDay(editing.date)}）` : ''} ${editing.time}` : ''
  const fc = activeTag ? forecast(activeTag) : null

  return (
    <View className='page-root counter-page'>
      <NavBar
        title='一起数数'
        right={
          <View className='nav-actions'>
            <View className='nav-btn' onClick={() => runSync({})}>
              <Text className={`nav-btn-ico ${syncing ? 'spin' : ''}`}>↻</Text>
            </View>
            <View className='nav-btn' onClick={() => setSheet('data')}>
              <Text className='nav-btn-ico'>⇩</Text>
            </View>
            <View className='nav-btn' onClick={() => setSheet('manage')}>
              <Text className='nav-btn-ico'>☰</Text>
            </View>
          </View>
        }
      />

      {activeTag ? (
        <View className='app-body'>
          <TagRow
            tags={tags}
            activeId={activeTag.id}
            onPick={id => {
              activeIdRef.current = id
              saveActiveId(id)
              setActiveId(id)
            }}
            onNew={() => setSheet('newTag')}
          />

          <BigCard
            tag={activeTag}
            calY={calY}
            calM={calM}
            cloud={cloud}
            popKey={popKey}
            onOpenAdd={() => {
              if (selDate > todayStr()) {
                toast('今天之后的日子还没到，记不了')
                return
              }
              setSheet('add')
            }}
            onOpenAnn={() => {
              if (selDate > todayStr()) {
                toast('今天之后的日子还没到，标不了')
                return
              }
              setSheet('ann')
            }}
          />

          <CalBlock
            tag={activeTag}
            calY={calY}
            calM={calM}
            selDate={selDate}
            fc={fc}
            onPickDay={pickDay}
            onCalNav={calNav}
            onOpenEdit={id => {
              setEditId(id)
              setSheet('edit')
            }}
            onOpenAdd={() => {
              if (selDate > todayStr()) {
                toast('今天之后的日子还没到，记不了')
                return
              }
              setSheet('add')
            }}
          />
        </View>
      ) : null}

      {/* ---------------- 记录 / 编辑 ---------------- */}
      {sheet === 'add' && activeTag ? (
        <RecordSheet
          title={addTitle}
          initTime='12:00'
          initAmount={1}
          initNote=''
          isEdit={false}
          onSave={saveEntry}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {sheet === 'edit' && editing ? (
        <RecordSheet
          title={editTitle}
          initTime={editing.time}
          initAmount={editing.amount}
          initNote={editing.note}
          isEdit
          onSave={saveEdit}
          onDelete={() => deleteEntry(editing.id)}
          onClose={() => {
            setSheet(null)
            setEditId('')
          }}
        />
      ) : null}

      {/* ---------------- 标记历史 ---------------- */}
      {sheet === 'ann' && activeTag ? (
        <AnnSheet
          tag={activeTag}
          selDate={selDate}
          onMark={markAnn}
          onDelete={deleteAnn}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {/* ---------------- 标签与分享 ---------------- */}
      {sheet === 'manage' && activeTag ? (
        <ManageSheet
          tag={activeTag}
          photo={mgPhoto}
          cloud={cloud}
          syncing={syncing}
          syncError={syncError}
          onSaveMeta={saveMeta}
          onSetCol={setCol}
          onPickPhoto={() => pickPhoto('manage')}
          onCopyCode={copyCode}
          onDelTag={deleteTag}
          onClose={() => {
            setSheet(null)
            setMgPhoto('')
          }}
        />
      ) : null}

      {/* ---------------- 导入导出 ---------------- */}
      {sheet === 'data' ? (
        <DataSheet onExport={exportCsv} onImport={importCsv} onClose={() => setSheet(null)} />
      ) : null}

      {/* ---------------- 新建标签 ---------------- */}
      {sheet === 'newTag' ? (
        <NewTagSheet
          photo={ntPhoto}
          onSave={createTag}
          onSetCol={() => setNtPhoto('')}
          onPickPhoto={() => pickPhoto('new')}
          onClose={() => {
            setSheet(null)
            setNtPhoto('')
          }}
        />
      ) : null}

      {/* ---------------- 裁剪照片 ---------------- */}
      {cropImg ? (
        <CropSheet
          imgPath={cropImg}
          onConfirm={confirmCrop}
          onCancel={() => {
            setCropImg('')
            setSheet(cropFor === 'new' ? 'newTag' : 'manage')
          }}
        />
      ) : null}
    </View>
  )
}
