import { View, Text, Slider } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { MIXER_TRACKS, MIXER_PRESETS } from '../../data/mixerTracks'
import { getTheme } from '../../utils/theme'
import { get, set } from '../../utils/storage'
import {
  isSupported,
  startTrack,
  setTrackVolume,
  stopTrack,
  stopAll
} from '../../utils/audio'
import NavBar from '../../components/NavBar'
import './index.scss'

interface CustomPreset {
  name: string
  volumes: number[]
}

const TIMER_OPTIONS = [
  { label: '不限时', minutes: 0 },
  { label: '15 分钟', minutes: 15 },
  { label: '30 分钟', minutes: 30 },
  { label: '60 分钟', minutes: 60 }
]

export default function Mixer() {
  const [theme] = useState(getTheme())
  const supported = isSupported()
  const [volumes, setVolumes] = useState<number[]>(
    get<number[]>('mixer_last_state', [0, 0, 0, 0, 0, 0, 0, 0])
  )
  const [playing, setPlaying] = useState(false)
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(
    get<CustomPreset[]>('mixer_custom_presets', [])
  )
  const [timerMinutes, setTimerMinutes] = useState(get<number>('mixer_timer_pref', 0))
  const [remainSeconds, setRemainSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      stopAll()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useShareAppMessage(() => ({
    title: '我在调一杯安静，你也来试试',
    path: '/pages/index/index'
  }))

  const persistVolumes = (next: number[]) => {
    setVolumes(next)
    set('mixer_last_state', next)
  }

  const handleSlider = (index: number, value: number) => {
    const next = [...volumes]
    next[index] = value
    persistVolumes(next)
    if (!playing || !supported) return
    const id = MIXER_TRACKS[index].id
    if (value > 0) {
      setTrackVolume(id, value)
      startTrack(id, value)
    } else {
      stopTrack(id)
    }
  }

  const play = () => {
    if (!supported) {
      Taro.showToast({ title: '当前微信版本不支持，请升级', icon: 'none' })
      return
    }
    volumes.forEach((v, i) => {
      if (v > 0) startTrack(MIXER_TRACKS[i].id, v)
    })
    setPlaying(true)
    startTimer()
  }

  const stop = () => {
    stopAll()
    setPlaying(false)
    clearTimer()
    setRemainSeconds(0)
  }

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = () => {
    clearTimer()
    if (timerMinutes <= 0) {
      setRemainSeconds(0)
      return
    }
    setRemainSeconds(timerMinutes * 60)
    timerRef.current = setInterval(() => {
      setRemainSeconds(prev => {
        if (prev <= 1) {
          stop()
          Taro.showToast({ title: '定时结束，好好休息', icon: 'none' })
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pickTimer = (minutes: number) => {
    setTimerMinutes(minutes)
    set('mixer_timer_pref', minutes)
    if (playing) startTimer()
  }

  const applyPreset = (vs: number[]) => {
    persistVolumes(vs)
    if (!playing || !supported) return
    vs.forEach((v, i) => {
      const id = MIXER_TRACKS[i].id
      if (v > 0) startTrack(id, v)
      else stopTrack(id)
    })
  }

  const savePreset = () => {
    /* editable 为基础库 2.17.1+ 扩展参数，Taro 类型定义未覆盖 */
    const opts: any = {
      title: '保存当前混音',
      editable: true,
      placeholderText: '给这杯安静起个名字',
      success: (res: any) => {
        if (!res.confirm) return
        const name = (res.content || '').trim() || '我的混音'
        let next = [...customPresets]
        if (next.length >= 3) {
          Taro.showModal({
            title: '自定义预设已满 3 个',
            content: `将替换最早的"${next[0].name}"？`,
            success: (r2: any) => {
              if (!r2.confirm) return
              next = next.slice(1)
              next.push({ name, volumes: [...volumes] })
              setCustomPresets(next)
              set('mixer_custom_presets', next)
              Taro.showToast({ title: '已保存', icon: 'success' })
            }
          })
          return
        }
        next.push({ name, volumes: [...volumes] })
        setCustomPresets(next)
        set('mixer_custom_presets', next)
        Taro.showToast({ title: '已保存', icon: 'success' })
      }
    }
    Taro.showModal(opts)
  }

  const removePreset = (index: number) => {
    Taro.showModal({
      title: '删除预设',
      content: `确定删除"${customPresets[index].name}"？`,
      confirmColor: '#EF5350',
      success: res => {
        if (!res.confirm) return
        const next = customPresets.filter((_, i) => i !== index)
        setCustomPresets(next)
        set('mixer_custom_presets', next)
      }
    })
  }

  const remainText = () => {
    if (remainSeconds <= 0) return ''
    const m = Math.floor(remainSeconds / 60)
    const s = remainSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const activeCount = volumes.filter(v => v > 0).length

  return (
    <View className='page-root mixer-root' style={{ background: theme.bg }}>
      <NavBar title='白噪音混音台' />

      {/* ---------- 预设 ---------- */}
      <View className='mixer-section-label'>场景预设</View>
      <View className='mixer-preset-row'>
        {MIXER_PRESETS.map(p => (
          <View key={p.id} className='mixer-preset-chip' onClick={() => applyPreset(p.volumes)}>
            {p.name}
          </View>
        ))}
        {customPresets.map((p, i) => (
          <View
            key={p.name + i}
            className='mixer-preset-chip mixer-preset-chip--custom'
            onClick={() => applyPreset(p.volumes)}
            onLongPress={() => removePreset(i)}
          >
            {p.name}
          </View>
        ))}
        <View className='mixer-preset-chip mixer-preset-chip--save' onClick={savePreset}>
          + 保存当前
        </View>
      </View>

      {/* ---------- 音轨 ---------- */}
      <View className='mixer-section-label'>
        音轨混音{activeCount > 0 ? ` · ${activeCount} 条在响` : ''}
      </View>
      <View className='mixer-tracks'>
        {MIXER_TRACKS.map((t, i) => (
          <View
            key={t.id}
            className={`mixer-track ${volumes[i] > 0 ? 'mixer-track--on' : ''}`}
          >
            <View className='mixer-track-left'>
              <Text className='mixer-track-icon'>{t.icon}</Text>
              <View className='mixer-track-info'>
                <Text className='mixer-track-name'>{t.name}</Text>
                <Text className='mixer-track-desc'>{t.desc}</Text>
              </View>
            </View>

            {playing && volumes[i] > 0 && (
              <View className='mixer-eq'>
                <View className='mixer-eq-bar' />
                <View className='mixer-eq-bar mixer-eq-bar--2' />
                <View className='mixer-eq-bar mixer-eq-bar--3' />
              </View>
            )}

            <View className='mixer-track-right'>
              <Slider
                className='mixer-slider'
                value={volumes[i]}
                min={0}
                max={100}
                step={5}
                activeColor='#4DB6AC'
                backgroundColor='rgba(77, 182, 172, 0.18)'
                blockSize={22}
                blockColor='#ffffff'
                onChange={e => handleSlider(i, e.detail.value as number)}
              />
              <Text className='mixer-track-vol'>{volumes[i]}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ---------- 播放控制 ---------- */}
      <View className='mixer-play-row'>
        <View
          className={`mixer-play-btn ${playing ? 'mixer-play-btn--stop' : ''}`}
          onClick={playing ? stop : play}
        >
          <Text className='mixer-play-icon'>{playing ? '⏹' : '▶'}</Text>
          <Text>{playing ? '停止' : '播放'}</Text>
        </View>
        {playing && remainText() !== '' && (
          <View className='mixer-remain'>{remainText()} 后停止</View>
        )}
      </View>

      {/* ---------- 定时 ---------- */}
      <View className='mixer-section-label'>定时关闭</View>
      <View className='mixer-timer-row'>
        {TIMER_OPTIONS.map(o => (
          <View
            key={o.minutes}
            className={`mixer-timer-chip ${timerMinutes === o.minutes ? 'mixer-timer-chip--active' : ''}`}
            onClick={() => pickTimer(o.minutes)}
          >
            {o.label}
          </View>
        ))}
      </View>

      <View className='mixer-tip'>
        {supported ? '所有声音实时合成，不打烊' : '当前微信版本过低，暂时无法发声'}
      </View>
    </View>
  )
}
