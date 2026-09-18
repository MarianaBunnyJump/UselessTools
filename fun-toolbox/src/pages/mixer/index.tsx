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
  stopAll,
  startFileTrack,
  setFileTrackVolume,
  stopFileTrack,
  fileTrackPath
} from '../../utils/audio'
import NavBar from '../../components/NavBar'
import './index.scss'

interface CustomPreset {
  name: string
  volumes: number[]
}

/* 音轨绑定的 MP3 文件（保存在小程序用户目录） */
interface TrackSource {
  name: string
  file: string
}

const MAX_MP3_SIZE = 10 * 1024 * 1024

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
  /* MP3 声源：绑定的文件与每轨开关 */
  const [sources, setSources] = useState<Record<string, TrackSource>>(
    get<Record<string, TrackSource>>('mixer_track_sources', {})
  )
  const [mp3On, setMp3On] = useState<Record<string, boolean>>(
    get<Record<string, boolean>>('mixer_track_mp3_on', {})
  )
  const isWeapp = process.env.TARO_ENV === 'weapp'
  /* 点击开关音轨时记住上次的音量 */
  const lastVolRef = useRef<number[]>(
    get<number[]>('mixer_last_vols', MIXER_TRACKS.map(() => 50))
  )

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

  /* 该轨当前是否走 MP3 声源（绑定且开关开启） */
  const usingMp3 = (i: number, onMap = mp3On, srcMap = sources): boolean => {
    const t = MIXER_TRACKS[i]
    return !!(onMap[t.id] && srcMap[t.id])
  }

  /* 按当前声源播放 / 更新音量 */
  const playTrackAt = (i: number, volume: number, onMap = mp3On, srcMap = sources) => {
    const t = MIXER_TRACKS[i]
    if (onMap[t.id] && srcMap[t.id]) {
      startFileTrack(t.id, srcMap[t.id].file, volume)
    } else {
      setTrackVolume(t.id, volume)
      startTrack(t.id, volume)
    }
  }

  /* 静音该轨：合成与 MP3 两种声源都停 */
  const muteTrackAt = (i: number) => {
    const t = MIXER_TRACKS[i]
    stopTrack(t.id)
    stopFileTrack(t.id)
  }

  /* 声源按钮：切换 合成 ⇄ MP3；未绑定时先走导入流程 */
  const toggleSource = (i: number) => {
    const t = MIXER_TRACKS[i]
    if (!sources[t.id]) {
      importMp3(i)
      return
    }
    const nextOn = { ...mp3On, [t.id]: !mp3On[t.id] }
    setMp3On(nextOn)
    set('mixer_track_mp3_on', nextOn)
    if (playing && volumes[i] > 0) {
      /* 无缝切换：先停两种声源，再按新声源起 */
      stopTrack(t.id)
      stopFileTrack(t.id)
      if (nextOn[t.id]) startFileTrack(t.id, sources[t.id].file, volumes[i])
      else startTrack(t.id, volumes[i])
    }
  }

  /* 从微信聊天导入 mp3 并绑定到音轨（同名覆盖即换绑） */
  const importMp3 = (i: number) => {
    if (!isWeapp) {
      Taro.showToast({ title: 'MP3 导入仅小程序端支持', icon: 'none' })
      return
    }
    const t = MIXER_TRACKS[i]
    Taro.showModal({
      title: '导入 MP3',
      content:
        '先把 mp3 发到微信任意聊天（推荐发给「文件传输助手」），再点「去选文件」从聊天记录里选取，文件将保存到本机。',
      confirmText: '去选文件',
      success: res => {
        if (!res.confirm) return
        Taro.chooseMessageFile({
          count: 1,
          type: 'file',
          extension: ['mp3'],
          success: r => {
            const f = r.tempFiles[0]
            if (!f) return
            if (f.size > MAX_MP3_SIZE) {
              Taro.showToast({ title: '文件超过 10MB，换个小点的吧', icon: 'none' })
              return
            }
            const dest = `mixer_${t.id}.mp3`
            /* 覆盖前先停掉旧文件，避免占用 */
            stopFileTrack(t.id)
            Taro.getFileSystemManager().copyFile({
              srcPath: f.path,
              destPath: fileTrackPath(dest),
              success: () => {
                const nextSources = { ...sources, [t.id]: { name: f.name || '自定义.mp3', file: dest } }
                const nextOn = { ...mp3On, [t.id]: true }
                setSources(nextSources)
                set('mixer_track_sources', nextSources)
                setMp3On(nextOn)
                set('mixer_track_mp3_on', nextOn)
                if (playing && volumes[i] > 0) {
                  stopTrack(t.id)
                  startFileTrack(t.id, dest, volumes[i])
                }
                Taro.showToast({ title: '已绑定 MP3 声源', icon: 'success' })
              },
              fail: () => {
                Taro.showToast({ title: '导入失败，再试一次', icon: 'none' })
              }
            })
          },
          fail: () => {
            /* 用户取消选择 */
          }
        })
      }
    })
  }

  /* 长按声源按钮：换绑 / 删除 */
  const manageSource = (i: number) => {
    const t = MIXER_TRACKS[i]
    if (!sources[t.id]) return
    Taro.showActionSheet({
      itemList: ['换一个文件', '删除 MP3 绑定'],
      success: res => {
        if (res.tapIndex === 0) {
          importMp3(i)
        } else if (res.tapIndex === 1) {
          stopFileTrack(t.id)
          try {
            Taro.getFileSystemManager().unlink({
              filePath: fileTrackPath(sources[t.id].file),
              fail: () => {}
            })
          } catch (e) {
            /* 文件可能已不存在 */
          }
          const nextSources = { ...sources }
          delete nextSources[t.id]
          const nextOn = { ...mp3On, [t.id]: false }
          setSources(nextSources)
          set('mixer_track_sources', nextSources)
          setMp3On(nextOn)
          set('mixer_track_mp3_on', nextOn)
          if (playing && volumes[i] > 0) startTrack(t.id, volumes[i])
          Taro.showToast({ title: '已删除，恢复合成', icon: 'none' })
        }
      }
    })
  }

  const handleSlider = (index: number, value: number) => {
    const next = [...volumes]
    next[index] = value
    if (value > 0) lastVolRef.current[index] = value
    persistVolumes(next)
    if (!playing || !supported) return
    if (value > 0) playTrackAt(index, value)
    else muteTrackAt(index)
  }

  /* 点击卡片：开 → 记住音量并关闭；关 → 恢复上次音量 */
  const toggleTrack = (index: number) => {
    const next = [...volumes]
    if (next[index] > 0) {
      lastVolRef.current[index] = next[index]
      next[index] = 0
      if (playing && supported) muteTrackAt(index)
    } else {
      next[index] = lastVolRef.current[index] || 50
      if (playing && supported) playTrackAt(index, next[index])
    }
    persistVolumes(next)
  }

  const play = () => {
    if (!supported) {
      Taro.showToast({ title: '当前微信版本不支持，请升级', icon: 'none' })
      return
    }
    volumes.forEach((v, i) => {
      if (v > 0) playTrackAt(i, v)
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
      if (v > 0) playTrackAt(i, v)
      else muteTrackAt(i)
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
        if (next.length >= 5) {
          Taro.showModal({
            title: '自定义预设已满 5 个',
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
        音轨混音{activeCount > 0 ? ` · ${activeCount} 条在响` : ' · 点击卡片开关'}
      </View>
      <View className='mixer-tracks'>
        {MIXER_TRACKS.map((t, i) => (
          <View key={t.id} className={`mixer-track ${volumes[i] > 0 ? 'mixer-track--on' : ''}`}>
            <View className='mixer-track-head' onClick={() => toggleTrack(i)}>
              <Text className='mixer-track-icon'>{t.icon}</Text>
              <View className='mixer-track-info'>
                <Text className='mixer-track-name'>{t.name}</Text>
                <Text className='mixer-track-desc'>
                  {mp3On[t.id] && sources[t.id] ? sources[t.id].name : t.desc}
                </Text>
              </View>
              {isWeapp && (
                <View
                  className={`mixer-src-chip ${
                    mp3On[t.id] && sources[t.id] ? 'mixer-src-chip--mp3' : ''
                  }`}
                  onClick={e => {
                    e.stopPropagation()
                    toggleSource(i)
                  }}
                  onLongPress={e => {
                    e.stopPropagation()
                    manageSource(i)
                  }}
                >
                  {mp3On[t.id] && sources[t.id] ? '🎵MP3' : '⚙合成'}
                </View>
              )}
              <Text className='mixer-track-vol'>{volumes[i]}%</Text>
              {playing && volumes[i] > 0 && (
                <View className='mixer-eq'>
                  <View className='mixer-eq-bar' />
                  <View className='mixer-eq-bar mixer-eq-bar--2' />
                  <View className='mixer-eq-bar mixer-eq-bar--3' />
                </View>
              )}
            </View>

            <View className='mixer-slider-row'>
              <Slider
                className='mixer-slider'
                value={volumes[i]}
                min={0}
                max={100}
                step={5}
                activeColor='#4DB6AC'
                backgroundColor='rgba(74, 59, 50, 0.1)'
                blockSize={26}
                blockColor='#ffffff'
                onChange={e => handleSlider(i, e.detail.value as number)}
              />
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
        {supported
          ? '点击卡片开关音轨 · 拖动长条调节音量 · 声源可实时混合'
          : '当前微信版本过低，暂时无法发声'}
      </View>
      {isWeapp && (
        <View className='mixer-tip mixer-tip--sub'>
          🎵 按钮可导入自己的 MP3（先发到微信聊天再选取）· 长按换绑或删除
        </View>
      )}
    </View>
  )
}
