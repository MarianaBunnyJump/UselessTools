import { View, Text, Slider, Canvas, Picker, Switch } from '@tarojs/components'
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
import { get, set } from '../../utils/storage'
import NavBar from '../../components/NavBar'
import './index.scss'

const EXPECT_RANGE = Array.from({ length: 41 }, (_, i) => `${60 + i} 岁`)

export default function Settings() {
  const [theme, setTh] = useState<BackgroundPreset>(getTheme())
  const [pattern, setPattern] = useState<PatternConfig>(getPatternConfig())
  const [bgOpen, setBgOpen] = useState(true)
  const [patternOpen, setPatternOpen] = useState(true)
  const [expectancy, setExpectancy] = useState(get<number>('life_expectancy', 77))
  const [soundOn, setSoundOn] = useState(get<boolean>('sound_enabled', true))

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
    if (!patternOpen) return
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
  }, [pattern, theme, patternOpen])

  /* ---------- 通用设置 ---------- */
  const onExpectancyChange = e => {
    const idx = Number(e.detail.value)
    const next = 60 + idx
    setExpectancy(next)
    set('life_expectancy', next)
    Taro.showToast({ title: `预期寿命已设为 ${next} 岁`, icon: 'none', duration: 1200 })
  }

  const onSoundChange = e => {
    const next = Boolean(e.detail.value)
    setSoundOn(next)
    set('sound_enabled', next)
  }

  const resetAll = () => {
    Taro.showModal({
      title: '清空全部数据',
      content: '将清除所有工具的本地记录、设置和主题，无法恢复。确定继续吗？',
      confirmText: '清空',
      confirmColor: '#EF5350',
      success: res => {
        if (!res.confirm) return
        try {
          Taro.clearStorageSync()
        } catch (err) {
          /* 忽略 */
        }
        Taro.showToast({ title: '已清空，重启小程序生效', icon: 'none', duration: 2000 })
      }
    })
  }

  const goAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='设置' />

      {/* ---------- 通用 ---------- */}
      <View className='set-group'>
        <View className='set-row'>
          <View className='set-row-left'>
            <Text className='set-row-icon'>⏳</Text>
            <Text className='set-row-name'>预期寿命</Text>
            <Text className='set-row-sub'>人生倒计时用</Text>
          </View>
          <Picker mode='selector' range={EXPECT_RANGE} value={expectancy - 60} onChange={onExpectancyChange}>
            <View className='set-row-value'>
              {expectancy} 岁 <Text className='set-row-arrow'>▸</Text>
            </View>
          </Picker>
        </View>

        <View className='set-row'>
          <View className='set-row-left'>
            <Text className='set-row-icon'>🔊</Text>
            <Text className='set-row-name'>敲击音效</Text>
            <Text className='set-row-sub'>木鱼 / 粉碎机</Text>
          </View>
          <Switch checked={soundOn} color={theme.accent} onChange={onSoundChange} />
        </View>

        <View className='set-row' onClick={resetAll}>
          <View className='set-row-left'>
            <Text className='set-row-icon'>🧹</Text>
            <Text className='set-row-name'>清空全部数据</Text>
          </View>
          <Text className='set-row-value set-row-value--danger'>重置 <Text className='set-row-arrow'>▸</Text></Text>
        </View>
      </View>

      {/* ---------- 全局背景（收纳） ---------- */}
      <View className='set-section'>
        <View className='set-section-head' onClick={() => setBgOpen(v => !v)}>
          <View className='set-section-title-wrap'>
            <Text className='set-section-title'>全局背景</Text>
            <Text className='set-section-sub'>应用到整个工具盒</Text>
          </View>
          <Text className={`set-fold-btn ${bgOpen ? 'set-fold-btn--open' : ''}`}>▾</Text>
        </View>

        {bgOpen && (
          <View className='set-bg-list'>
            {BACKGROUNDS.map(bg => (
              <View
                key={bg.id}
                className={`set-bg-row ${theme.id === bg.id ? 'set-bg-row--active' : ''}`}
                style={theme.id === bg.id ? { borderColor: theme.accent } : undefined}
                onClick={() => handlePick(bg.id)}
              >
                <View className='set-bg-swatch' style={{ background: bg.bg }}>
                  <Text className='set-bg-dot' style={{ background: bg.accent }} />
                </View>
                <Text className='set-bg-name'>{bg.name}</Text>
                {theme.id === bg.id && (
                  <Text className='set-bg-check' style={{ color: theme.accent }}>
                    ✓
                  </Text>
                )}
              </View>
            ))}
            <View className='settings-tip'>转盘配色会跟随全局背景自动搭配</View>
          </View>
        )}
      </View>

      {/* ---------- 背景印花（收纳） ---------- */}
      <View className='set-section'>
        <View className='set-section-head' onClick={() => setPatternOpen(v => !v)}>
          <View className='set-section-title-wrap'>
            <Text className='set-section-title'>背景印花</Text>
            <Text className='set-section-sub'>叠加在首页背景上</Text>
          </View>
          <Text className={`set-fold-btn ${patternOpen ? 'set-fold-btn--open' : ''}`}>▾</Text>
        </View>

        {patternOpen && (
          <View className='set-pattern-body'>
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
          </View>
        )}
      </View>

      <View className='settings-about-entry' onClick={goAbout}>
        关于趣工局 ›
      </View>
    </View>
  )
}
