import { View, Text, Slider, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { BACKGROUNDS, getTheme, setTheme, type BackgroundPreset } from '../../utils/theme'
import {
  PATTERNS,
  getPatternConfig,
  setPatternConfig,
  renderPatternPreview,
  type PatternConfig
} from '../../data/patterns'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function Settings() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [pattern, setPattern] = useState<PatternConfig>(getPatternConfig())

  useEffect(() => {
    return () => {
      /* 页面返回时主题已通过事件广播 */
    }
  }, [])

  const handlePick = (id: string) => {
    const next = setTheme(id)
    setTh(next)
    Taro.showToast({ title: `已切换为${next.name}`, icon: 'none', duration: 1200 })
  }

  /* ---------- 印花 ---------- */
  const pickPattern = (id: string) => {
    const next = setPatternConfig({ id })
    setPattern(next)
  }

  /* 拖动中只改本地状态（预览实时变），松手才落库并广播 */
  const tweakPatternLocal = (patch: Partial<PatternConfig>) => {
    setPattern({ ...pattern, ...patch })
  }

  const commitPattern = (patch: Partial<PatternConfig>) => {
    const next = setPatternConfig(patch)
    setPattern(next)
  }

  /* 预览画布：当前背景渐变 + 印花 */
  useEffect(() => {
    const timer = setTimeout(() => {
      const colors = (theme.bg.match(/#[0-9A-Fa-f]{6}/g) || []).slice(0, 2)
      const bgFrom = colors[0] || '#FFF9F2'
      const bgTo = colors[1] || colors[0] || '#FFE8D6'
      let winW = 375
      try {
        winW = Taro.getSystemInfoSync().windowWidth || 375
      } catch (e) {
        /* 默认值兜底 */
      }
      const scale = winW / 750
      const query = Taro.createSelectorQuery()
      query
        .select('#patternPreview')
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res || !res[0] || !res[0].node) return
          const canvas = res[0].node
          let dpr = 2
          try {
            dpr = Taro.getSystemInfoSync().pixelRatio || 2
          } catch (e) {
            /* 默认值兜底 */
          }
          const w = res[0].width
          const h = res[0].height
          canvas.width = w * dpr
          canvas.height = h * dpr
          const ctx = canvas.getContext('2d')
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          renderPatternPreview(ctx, w, h, pattern, bgFrom, bgTo, theme.accent, scale)
        })
    }, 60)
    return () => clearTimeout(timer)
  }, [pattern, theme])

  const goAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='设置' />

      <View className='settings-section-title'>全局背景（应用到整个工具盒）</View>
      <View className='settings-bg-list'>
        {BACKGROUNDS.map(bg => (
          <View
            key={bg.id}
            className={`settings-bg-card ${theme.id === bg.id ? 'settings-bg-card--active' : ''}`}
            style={{ background: bg.bg }}
            onClick={() => handlePick(bg.id)}
          >
            <Text className='settings-bg-accent' style={{ background: bg.accent }} />
            <Text className='settings-bg-name'>{bg.name}</Text>
            {theme.id === bg.id && <Text className='settings-bg-check'>✓</Text>}
          </View>
        ))}
      </View>

      <View className='settings-tip'>转盘配色会跟随全局背景自动搭配</View>

      {/* ---------- 背景印花 ---------- */}
      <View className='settings-section-title'>背景印花（叠加在首页背景上）</View>
      <View className='settings-pattern-preview-wrap'>
        <Canvas type='2d' id='patternPreview' className='settings-pattern-preview' />
        {pattern.id === '' && <Text className='settings-pattern-preview-tip'>当前无印花</Text>}
      </View>
      <View className='settings-pattern-list'>
        <View
          className={`settings-pattern-chip ${pattern.id === '' ? 'settings-pattern-chip--active' : ''}`}
          onClick={() => pickPattern('')}
        >
          无印花
        </View>
        {PATTERNS.map(p => (
          <View
            key={p.id}
            className={`settings-pattern-chip ${pattern.id === p.id ? 'settings-pattern-chip--active' : ''}`}
            onClick={() => pickPattern(p.id)}
          >
            {p.name}
          </View>
        ))}
      </View>

      {pattern.id !== '' && (
        <View className='settings-pattern-params'>
          <View className='settings-slider-row'>
            <Text className='settings-slider-label'>印花浓度 {pattern.opacity}%</Text>
            <Slider
              className='settings-slider'
              value={pattern.opacity}
              min={4}
              max={40}
              step={2}
              activeColor={theme.accent}
              backgroundColor='rgba(74, 59, 50, 0.12)'
              blockSize={24}
              onChanging={e => tweakPatternLocal({ opacity: e.detail.value as number })}
              onChange={e => commitPattern({ opacity: e.detail.value as number })}
            />
          </View>
          <View className='settings-slider-row'>
            <Text className='settings-slider-label'>印花大小 {pattern.size}</Text>
            <Slider
              className='settings-slider'
              value={pattern.size}
              min={24}
              max={64}
              step={4}
              activeColor={theme.accent}
              backgroundColor='rgba(74, 59, 50, 0.12)'
              blockSize={24}
              onChanging={e => tweakPatternLocal({ size: e.detail.value as number })}
              onChange={e => commitPattern({ size: e.detail.value as number })}
            />
          </View>
          <View className='settings-slider-row'>
            <Text className='settings-slider-label'>印花间距 {pattern.gap}</Text>
            <Slider
              className='settings-slider'
              value={pattern.gap}
              min={90}
              max={220}
              step={10}
              activeColor={theme.accent}
              backgroundColor='rgba(74, 59, 50, 0.12)'
              blockSize={24}
              onChanging={e => tweakPatternLocal({ gap: e.detail.value as number })}
              onChange={e => commitPattern({ gap: e.detail.value as number })}
            />
          </View>
        </View>
      )}

      <View className='settings-tip'>印花颜色自动跟随全局背景主题色</View>

      <View className='settings-about-entry' onClick={goAbout}>
        关于有点意思工具盒 ›
      </View>
    </View>
  )
}
