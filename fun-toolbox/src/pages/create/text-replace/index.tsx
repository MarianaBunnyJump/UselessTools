import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../../utils/theme'
import { get, set } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import './index.scss'

interface Rule {
  from: string
  to: string
}

interface Recipe {
  name: string
  rules: Rule[]
}

export default function TextReplace() {
  const [theme] = useState(getTheme())
  const [text, setText] = useState('')
  const [rules, setRules] = useState<Rule[]>([{ from: '', to: '' }])
  const [recipes, setRecipes] = useState<Recipe[]>(get<Recipe[]>('text_replace_recipes', []))

  useShareAppMessage(() => ({
    title: '多组查找替换一键跑完，规则还能存配方',
    path: '/pages/index/index'
  }))

  const updateRule = (i: number, patch: Partial<Rule>) => {
    setRules(rules.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  const addRule = () => setRules([...rules, { from: '', to: '' }])
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i))

  /* 按顺序执行，返回结果与替换计数 */
  const run = (): { out: string; count: number } => {
    let out = text
    let count = 0
    rules.forEach(r => {
      if (!r.from) return
      count += out.split(r.from).length - 1
      out = out.split(r.from).join(r.to)
    })
    return { out, count }
  }

  const { out, count } = run()

  const copy = () => {
    if (!out) return
    Taro.setClipboardData({
      data: out,
      success: () => Taro.showToast({ title: count > 0 ? `已复制，共替换 ${count} 处` : '已复制（无匹配）', icon: 'none' })
    })
  }

  const saveRecipe = () => {
    const valid = rules.filter(r => r.from)
    if (valid.length === 0) {
      Taro.showToast({ title: '先填至少一条规则', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '配方起个名',
      editable: true,
      placeholderText: '如：公众号排版',
      success: res => {
        if (!res.confirm || !res.content) return
        const next = [...recipes, { name: res.content.slice(0, 10), rules: valid }].slice(-8)
        setRecipes(next)
        set('text_replace_recipes', next)
        Taro.showToast({ title: '配方已存', icon: 'success' })
      }
    } as any)
  }

  const useRecipe = (r: Recipe) => {
    setRules(r.rules.map(x => ({ ...x })))
    Taro.showToast({ title: `已装「${r.name}」`, icon: 'none' })
  }

  return (
    <View className='page-root trp-root' style={{ background: theme.bg }}>
      <NavBar title='文本批量替换' />
      <ScrollView scrollY className='trp-scroll'>
        <View className='trp-scroll-pad'>
        <View className='trp-card'>
          <View className='trp-label'>原文</View>
          <Textarea
            className='trp-input'
            value={text}
            maxlength={20000}
            placeholder='粘贴要处理的文本'
            placeholderClass='trp-placeholder'
            autoHeight
            onInput={e => setText(e.detail.value)}
          />
          <View className='trp-count'>{text.length} 字</View>
        </View>

        <View className='trp-label trp-label--row'>
          替换规则（按顺序执行）
          <Text className='trp-add' onClick={addRule}>＋ 加一条</Text>
        </View>

        {rules.map((r, i) => (
          <View key={i} className='trp-rule'>
            <Textarea
              className='trp-rule-input'
              value={r.from}
              maxlength={60}
              placeholder='查找'
              placeholderClass='trp-placeholder'
              autoHeight
              onInput={e => updateRule(i, { from: e.detail.value })}
            />
            <Text className='trp-arrow' style={{ color: theme.accent }}>→</Text>
            <Textarea
              className='trp-rule-input'
              value={r.to}
              maxlength={60}
              placeholder='替换为（可空=删除）'
              placeholderClass='trp-placeholder'
              autoHeight
              onInput={e => updateRule(i, { to: e.detail.value })}
            />
            <Text className='trp-del' onClick={() => removeRule(i)}>✕</Text>
          </View>
        ))}

        <View className='trp-recipe' style={{ background: `${theme.accent}14` }} onClick={saveRecipe}>
          📦 存为配方{recipes.length > 0 ? `（已存 ${recipes.length} 个）` : ''}
        </View>
        {recipes.map((r, i) => (
          <View key={i} className='trp-recipe-item' onClick={() => useRecipe(r)}>
            {r.name} · {r.rules.length} 条
          </View>
        ))}

        {text && (
          <View className='trp-card trp-card--out'>
            <View className='trp-label'>结果 {count > 0 && <Text style={{ color: theme.accentDeep }}>· 替换 {count} 处</Text>}</View>
            <View className='trp-output'>{out}</View>
            <View className='trp-copy' style={{ background: theme.accent }} onClick={copy}>复制结果</View>
          </View>
        )}

        <View className='trp-tip'>替换为留空即为删除 · 规则从上到下依次执行 · 全程本地处理</View>
      </View>
      </ScrollView>
    </View>
  )
}
