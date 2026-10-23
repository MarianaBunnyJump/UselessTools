import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useMemo, useCallback } from 'react'
import type { ToolMeta } from '../data/tools'
import {
  getCategories,
  saveCategories,
  getToolCategory,
  setToolCategory,
  getHiddenTools,
  setHiddenTools,
  type ToolCategory
} from '../data/categories'
import { resolveToolIcon, uploadToolIcon } from '../utils/toolAssets'
import { getWorkPoints, getWorkLevel } from '../skins/workPoints'
import './simple-home.scss'

interface SimpleHomeProps {
  tools: ToolMeta[]
  order: string[]
  onOpen: (tool: ToolMeta) => void
  accent: string
  accentDeep: string
}

interface Group {
  cat: ToolCategory
  tools: ToolMeta[]
}

export default function SimpleHome({ tools, order, onOpen, accent, accentDeep }: SimpleHomeProps) {
  const [editing, setEditing] = useState(false)
  const [hidden, setHidden] = useState<string[]>(getHiddenTools())
  const [cats, setCats] = useState<ToolCategory[]>(getCategories())
  const [scrollTo, setScrollTo] = useState('')
  const [renameTarget, setRenameTarget] = useState<ToolCategory | null>(null)
  const [renameDraft, setRenameDraft] = useState('')

  const points = getWorkPoints()
  const level = getWorkLevel(points)
  const levelPct = level.nextAt > level.curBase
    ? Math.min(100, Math.round(((points - level.curBase) / (level.nextAt - level.curBase)) * 100))
    : 100

  const byId = useMemo(() => {
    const m = new Map<string, ToolMeta>()
    tools.forEach(t => m.set(t.id, t))
    return m
  }, [tools])

  /* 分组：按 order 顺序装进各分类 */
  const groups: Group[] = useMemo(() => {
    const visible = order.map(id => byId.get(id)).filter((t): t is ToolMeta => !!t && !hidden.includes(t.id))
    return cats
      .map(cat => ({ cat, tools: visible.filter(t => getToolCategory(t, cats).id === cat.id) }))
      .filter(g => g.tools.length > 0)
  }, [order, byId, hidden, cats])

  const hiddenTools = hidden.map(id => byId.get(id)).filter((t): t is ToolMeta => !!t)

  const jump = (catId: string) => setScrollTo(`grp-${catId}`)

  const toggleHidden = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter(x => x !== id) : [...hidden, id]
    setHidden(next)
    setHiddenTools(next)
  }

  /* 组内上移（简洁模式的排序方式：箭头，稳定可靠） */
  const moveTool = (toolId: string, dir: -1 | 1) => {
    const idx = order.indexOf(toolId)
    const swapIdx = idx + dir
    if (idx < 0 || swapIdx < 0 || swapIdx >= order.length) return
    const next = [...order]
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    Taro.eventCenter.trigger('home-order-change', next)
  }

  const changeCategory = (tool: ToolMeta) => {
    const items = cats.map(c => `${c.icon} ${c.name}`)
    Taro.showActionSheet({
      itemList: items.slice(0, 6),
      success: res => {
        setToolCategory(tool.id, cats[res.tapIndex].id)
        /* 触发重渲染 */
        setHidden([...getHiddenTools()])
      }
    })
  }

  const addCategory = () => {
    Taro.showModal({
      title: '新建分类',
      editable: true,
      placeholderText: '比如：工作常用',
      success: res => {
        if (!res.confirm || !res.content) return
        const id = `custom_${Date.now()}`
        const next = [...cats, { id, name: res.content.slice(0, 8), icon: '🗂', hue: '#B8A99E' }]
        setCats(next)
        saveCategories(next)
      }
    } as any)
  }

  const startRename = (cat: ToolCategory) => {
    setRenameTarget(cat)
    setRenameDraft(cat.name)
  }

  const confirmRename = () => {
    if (renameTarget && renameDraft.trim()) {
      const next = cats.map(c => (c.id === renameTarget.id ? { ...c, name: renameDraft.trim().slice(0, 8) } : c))
      setCats(next)
      saveCategories(next)
    }
    setRenameTarget(null)
  }

  const removeCategory = (cat: ToolCategory) => {
    if (cat.id === 'fun') {
      Taro.showToast({ title: '默认分类不可删', icon: 'none' })
      return
    }
    Taro.showModal({
      title: `删除「${cat.name}」？`,
      content: '该分类下的工具会回到「趣味 · 解压」组',
      confirmText: '删除',
      success: res => {
        if (!res.confirm) return
        const next = cats.filter(c => c.id !== cat.id)
        setCats(next)
        saveCategories(next)
        /* 归属重置到兜底分类 */
        const overrides = Taro.getStorageSync('home_tool_category')
        Taro.showToast({ title: '已删除', icon: 'none' })
        void overrides
      }
    })
  }

  const pickIcon = useCallback(async (tool: ToolMeta) => {
    const saved = await uploadToolIcon(tool.id)
    if (saved) {
      Taro.showToast({ title: '图标已更新', icon: 'success' })
      setHidden([...getHiddenTools()])
    }
  }, [])

  const renderIcon = (tool: ToolMeta, size: 'lg' | 'sm') => {
    const icon = resolveToolIcon(tool)
    if (icon.type === 'image') {
      return <Image className={`sh-icon-img ${size === 'lg' ? 'sh-icon-img--lg' : ''}`} src={icon.value} mode='aspectFill' />
    }
    return <Text className={`sh-icon-emoji ${size === 'lg' ? 'sh-icon-emoji--lg' : ''}`}>{icon.value}</Text>
  }

  return (
    <View className='simple-home'>
      {/* 顶栏：等级 + 模式切换 */}
      <View className='sh-topbar'>
        <View className='sh-level-mini'>
          <Text className='sh-level-txt'>🏅 Lv.{level.level}</Text>
          <View className='sh-level-track'>
            <View className='sh-level-fill' style={{ width: `${levelPct}%`, background: `linear-gradient(90deg, ${accent}, ${accentDeep})` }} />
          </View>
        </View>
        <View className='sh-topbar-right'>
          <Text className='sh-mode-btn' onClick={() => Taro.eventCenter.trigger('home-layout-mode', 'gift')}>🎨 礼盒</Text>
          <Text className={`sh-mode-btn ${editing ? 'sh-mode-btn--on' : ''}`} onClick={() => setEditing(v => !v)}>
            {editing ? '完成' : '整理'}
          </Text>
        </View>
      </View>

      {editing && (
        <View className='sh-edit-tip'>点 👁 隐藏/放出 · ↑↓ 调顺序 · 点分类名换归属 · 点图标可换图</View>
      )}

      <ScrollView
        className='sh-scroll'
        scrollY
        scrollWithAnimation
        scrollIntoView={scrollTo}
      >
        {groups.map(g => (
          <View key={g.cat.id} id={`grp-${g.cat.id}`} className='sh-group'>
            {/* 北欧装饰带：分类专属色 + 几何形状，纯背景不交互 */}
            <View className='sh-deco' style={{ background: `linear-gradient(120deg, ${g.cat.hue}1f, ${g.cat.hue}08)` }}>
              <View className='sh-deco-tri sh-deco-tri--1' style={{ borderColor: `${g.cat.hue}3d` }} />
              <View className='sh-deco-tri sh-deco-tri--2' style={{ borderColor: `${g.cat.hue}30` }} />
              <View className='sh-deco-dot sh-deco-dot--1' style={{ background: `${g.cat.hue}4d` }} />
              <View className='sh-deco-dot sh-deco-dot--2' style={{ background: `${g.cat.hue}38` }} />
            </View>

            <View className='sh-group-head' onClick={() => editing && startRename(g.cat)}>
              <Text className='sh-group-icon'>{g.cat.icon}</Text>
              <Text className='sh-group-name'>{g.cat.name}</Text>
              <Text className='sh-group-count'>{g.tools.length}</Text>
              {editing && g.cat.id !== 'fun' && (
                <Text className='sh-group-del' onClick={e => { e.stopPropagation(); removeCategory(g.cat) }}>删除</Text>
              )}
            </View>

            <View className='sh-cards'>
              {g.tools.map(t => (
                <View key={t.id} className={`sh-card ${editing ? 'sh-card--edit' : ''}`} onClick={() => !editing && onOpen(t)}>
                  <View className='sh-card-icon' onClick={e => { if (editing) { e.stopPropagation(); pickIcon(t) } }}>
                    {renderIcon(t, 'lg')}
                  </View>
                  <View className='sh-card-body'>
                    <Text className='sh-card-name'>{t.name}</Text>
                    <Text className='sh-card-desc'>{t.desc}</Text>
                  </View>
                  {editing ? (
                    <View className='sh-card-ops' onClick={e => e.stopPropagation()}>
                      <Text className='sh-op' onClick={() => moveTool(t.id, -1)}>↑</Text>
                      <Text className='sh-op' onClick={() => moveTool(t.id, 1)}>↓</Text>
                      <Text className='sh-op' onClick={() => changeCategory(t)}>🗂</Text>
                      <Text className='sh-op' onClick={() => toggleHidden(t.id)}>👁</Text>
                    </View>
                  ) : (
                    <Text className='sh-card-go'>›</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {editing && (
          <View className='sh-hidden-zone'>
            <View className='sh-group-head'>
              <Text className='sh-group-icon'>🗄</Text>
              <Text className='sh-group-name'>已收起</Text>
              <Text className='sh-group-count'>{hiddenTools.length}</Text>
            </View>
            {hiddenTools.length === 0 ? (
              <View className='sh-hidden-empty'>隐藏的工具会收进这里，随时放出</View>
            ) : (
              hiddenTools.map(t => (
                <View key={t.id} className='sh-card sh-card--hidden'>
                  <View className='sh-card-icon'>{renderIcon(t, 'sm')}</View>
                  <View className='sh-card-body'>
                    <Text className='sh-card-name'>{t.name}</Text>
                  </View>
                  <Text className='sh-op' onClick={() => toggleHidden(t.id)}>👁 放出</Text>
                </View>
              ))
            )}
            <View className='sh-add-cat' onClick={addCategory}>＋ 新建分类</View>
          </View>
        )}

        <View className='sh-footer-space' />
      </ScrollView>

      {/* 右侧分类索引条 */}
      {!editing && groups.length > 1 && (
        <View className='sh-rail'>
          {groups.map(g => (
            <Text key={g.cat.id} className='sh-rail-item' onClick={() => jump(g.cat.id)}>
              {g.cat.icon}
            </Text>
          ))}
        </View>
      )}

      {/* 分类重命名弹层 */}
      {renameTarget && (
        <View className='sh-rename-mask' onClick={confirmRename}>
          <View className='sh-rename-panel' onClick={e => e.stopPropagation()}>
            <View className='sh-rename-title'>重命名分类</View>
            <Input
              className='sh-rename-input'
              value={renameDraft}
              maxlength={8}
              autoFocus
              onInput={e => setRenameDraft(e.detail.value)}
            />
            <View className='sh-rename-btn' style={{ background: accent }} onClick={confirmRename}>保存</View>
          </View>
        </View>
      )}
    </View>
  )
}
