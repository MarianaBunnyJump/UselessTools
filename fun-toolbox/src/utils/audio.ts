import Taro from '@tarojs/taro'
import { get } from './storage'

/* ===================== WebAudio 合成引擎 =====================
 * 白噪音混音台与电子木鱼音效全部由 WebAudio 实时合成，
 * 不依赖任何音频文件，音量调节即时生效。
 * 基础库要求 >= 2.19.0（wx.createWebAudioContext）
 */

type AnyCtx = any

let ctx: AnyCtx = null
let masterGain: AnyCtx = null
let whiteBuffer: AnyCtx = null
let brownBuffer: AnyCtx = null

/* 当前正在播放的音轨实例 */
interface ActiveVoice {
  source: AnyCtx
  gain: AnyCtx
  lfo?: AnyCtx
  lfoGain?: AnyCtx
  eventTimer?: ReturnType<typeof setInterval>
  volume: number
}

const activeVoices: Record<string, ActiveVoice> = {}

export function isSupported(): boolean {
  return typeof Taro.createWebAudioContext === 'function'
}

/* 设置页的「敲击音效」开关（不影响白噪音混音台） */
function tapSoundOn(): boolean {
  return get<boolean>('sound_enabled', true)
}

function ensureCtx(): AnyCtx | null {
  if (!isSupported()) return null
  try {
    if (!ctx) {
      ctx = Taro.createWebAudioContext() as AnyCtx
      masterGain = ctx.createGain()
      masterGain.gain.value = 1
      masterGain.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    return ctx
  } catch (e) {
    return null
  }
}

function getWhiteBuffer(c: AnyCtx): AnyCtx {
  if (whiteBuffer) return whiteBuffer
  const len = Math.floor(c.sampleRate * 2)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1
  }
  whiteBuffer = buf
  return buf
}

function getBrownBuffer(c: AnyCtx): AnyCtx {
  if (brownBuffer) return brownBuffer
  const len = Math.floor(c.sampleRate * 2)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  brownBuffer = buf
  return buf
}

function makeNoiseSource(c: AnyCtx, brown = false): AnyCtx {
  const src = c.createBufferSource()
  src.buffer = brown ? getBrownBuffer(c) : getWhiteBuffer(c)
  src.loop = true
  return src
}

/* 音轨合成参数 */
interface TrackSpec {
  baseGain: number
  build: (c: AnyCtx, src: AnyCtx) => { chain: AnyCtx; lfo?: { osc: AnyCtx; gain: AnyCtx } }
}

/* 一次性短促噪声（敲击/爆裂声） */
function burst(c: AnyCtx, freq: number, q: number, dur: number, peak: number, when = 0) {
  const src = makeNoiseSource(c)
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = q
  const gain = c.createGain()
  const t = c.currentTime + when
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(peak, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)
  src.start(t)
  src.stop(t + dur + 0.05)
}

const TRACK_SPECS: Record<string, TrackSpec> = {
  rain: {
    baseGain: 0.4,
    build: (c, src) => {
      const hp = c.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 500
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 6500
      src.connect(hp)
      hp.connect(lp)
      return { chain: lp }
    }
  },
  fire: {
    baseGain: 0.55,
    build: (c, src) => {
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 480
      src.connect(lp)
      return { chain: lp }
    }
  },
  keyboard: {
    baseGain: 0.0001,
    build: (c, src) => {
      /* 键盘声由调度器生成点击，底噪极低 */
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 100
      src.connect(lp)
      return { chain: lp }
    }
  },
  cat: {
    baseGain: 0.9,
    build: (c, src) => {
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 200
      src.connect(lp)
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 24
      const oscGain = c.createGain()
      oscGain.gain.value = 0.8
      osc.connect(oscGain)
      osc.start()
      return {
        chain: lp,
        lfo: { osc, gain: oscGain }
      }
    }
  },
  waves: {
    baseGain: 0.5,
    build: (c, src) => {
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 900
      src.connect(lp)
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 0.12
      const oscGain = c.createGain()
      oscGain.gain.value = 0.4
      osc.connect(oscGain)
      osc.start()
      return { chain: lp, lfo: { osc, gain: oscGain } }
    }
  },
  cafe: {
    baseGain: 0.35,
    build: (c, src) => {
      const bp = c.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 750
      bp.Q.value = 0.6
      src.connect(bp)
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 0.35
      const oscGain = c.createGain()
      oscGain.gain.value = 0.3
      osc.connect(oscGain)
      osc.start()
      return { chain: bp, lfo: { osc, gain: oscGain } }
    }
  },
  leaves: {
    baseGain: 0.3,
    build: (c, src) => {
      const bp = c.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 3600
      bp.Q.value = 0.5
      src.connect(bp)
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 0.45
      const oscGain = c.createGain()
      oscGain.gain.value = 0.55
      osc.connect(oscGain)
      osc.start()
      return { chain: bp, lfo: { osc, gain: oscGain } }
    }
  },
  insects: {
    baseGain: 0.0001,
    build: (c, src) => {
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 100
      src.connect(lp)
      return { chain: lp }
    }
  }
}

/* 需要事件调度的音轨 */
const EVENT_TRACKS: Record<string, (c: AnyCtx) => void> = {
  fire: (c) => {
    burst(c, 2400 + Math.random() * 2000, 2, 0.03, 0.12 + Math.random() * 0.1)
    if (Math.random() < 0.25) {
      burst(c, 1200, 3, 0.06, 0.15, 0.05)
    }
  },
  keyboard: (c) => {
    burst(c, 2600 + Math.random() * 1600, 1.5, 0.025, 0.35)
    if (Math.random() < 0.2) {
      burst(c, 3500, 2, 0.02, 0.28, 0.09)
    }
  },
  insects: (c) => {
    /* 蟋蟀：一组 4 个短促高频脉冲 */
    const base = 4300 + Math.random() * 600
    for (let i = 0; i < 4; i++) {
      const t = i * 0.055
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = base
      const g = c.createGain()
      const st = c.currentTime + t
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.09, st + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.04)
      osc.connect(g)
      g.connect(masterGain)
      osc.start(st)
      osc.stop(st + 0.06)
    }
  }
}

const EVENT_INTERVAL: Record<string, [number, number]> = {
  fire: [120, 420],
  keyboard: [140, 600],
  insects: [500, 1800]
}

export function isTrackPlaying(trackId: string): boolean {
  return !!activeVoices[trackId]
}

export function getPlayingVolumes(): Record<string, number> {
  const result: Record<string, number> = {}
  Object.keys(activeVoices).forEach(id => {
    result[id] = activeVoices[id].volume
  })
  return result
}

export function startTrack(trackId: string, volume: number): boolean {
  const c = ensureCtx()
  if (!c) return false
  const spec = TRACK_SPECS[trackId]
  if (!spec) return false

  if (activeVoices[trackId]) {
    setTrackVolume(trackId, volume)
    return true
  }

  const isBrown = trackId === 'fire'
  const src = makeNoiseSource(c, isBrown)
  const { chain, lfo } = spec.build(c, src)

  const gain = c.createGain()
  const v = Math.max(0, Math.min(100, volume)) / 100
  const target = spec.baseGain * v
  gain.gain.value = target

  let lfoOsc: AnyCtx = null
  let lfoGain: AnyCtx = null
  if (lfo) {
    lfoOsc = lfo.osc
    lfoGain = lfo.gain
    lfoGain.gain.value = target * 0.9
    lfoGain.connect(gain.gain)
  }

  chain.connect(gain)
  gain.connect(masterGain)
  src.start(0)

  const voice: ActiveVoice = { source: src, gain, volume, lfo: lfoOsc, lfoGain }

  const evt = EVENT_TRACKS[trackId]
  if (evt) {
    const [minMs, maxMs] = EVENT_INTERVAL[trackId] || [300, 800]
    const schedule = () => {
      if (!activeVoices[trackId]) return
      try {
        evt(c)
      } catch (e) {
        /* 忽略单次调度失败 */
      }
      voice.eventTimer = setTimeout(schedule, minMs + Math.random() * (maxMs - minMs)) as any
    }
    voice.eventTimer = setTimeout(schedule, minMs) as any
  }

  activeVoices[trackId] = voice
  return true
}

export function setTrackVolume(trackId: string, volume: number) {
  const voice = activeVoices[trackId]
  if (!voice || !ctx) return
  const spec = TRACK_SPECS[trackId]
  const v = Math.max(0, Math.min(100, volume)) / 100
  const target = spec.baseGain * v
  try {
    voice.gain.gain.setTargetAtTime(target, ctx.currentTime, 0.05)
    if (voice.lfoGain) {
      voice.lfoGain.gain.setTargetAtTime(target * 0.9, ctx.currentTime, 0.05)
    }
  } catch (e) {
    voice.gain.gain.value = target
  }
  voice.volume = volume
}

export function stopTrack(trackId: string) {
  const voice = activeVoices[trackId]
  if (!voice) return
  if (voice.eventTimer) clearTimeout(voice.eventTimer)
  try {
    voice.source.stop()
  } catch (e) {
    /* 已停止 */
  }
  try {
    if (voice.lfo) voice.lfo.stop()
  } catch (e) {
    /* 已停止 */
  }
  try {
    voice.gain.disconnect()
  } catch (e) {
    /* 已断开 */
  }
  delete activeVoices[trackId]
}

export function stopAll() {
  Object.keys(activeVoices).forEach(id => stopTrack(id))
  stopAllFileTracks()
}

/* ===================== MP3 文件音轨（InnerAudioContext） =====================
 * 用户从微信聊天导入的 mp3 保存在小程序用户目录（wx.env.USER_DATA_PATH），
 * 与 WebAudio 合成音轨互不干扰，可同时混合播放。
 */

interface FileVoice {
  audio: Taro.InnerAudioContext
  volume: number
}

const fileVoices: Record<string, FileVoice> = {}

export function fileTrackPath(fileName: string): string {
  return `${Taro.env.USER_DATA_PATH}/${fileName}`
}

export function startFileTrack(trackId: string, fileName: string, volume: number): boolean {
  try {
    if (fileVoices[trackId]) {
      setFileTrackVolume(trackId, volume)
      return true
    }
    const audio = Taro.createInnerAudioContext()
    audio.src = fileTrackPath(fileName)
    audio.loop = true
    audio.volume = Math.max(0, Math.min(100, volume)) / 100
    audio.onError(() => {
      /* 文件损坏/格式不支持时清掉并提示 */
      stopFileTrack(trackId)
      Taro.showToast({ title: '该 MP3 无法播放，已切回合成', icon: 'none' })
    })
    audio.play()
    fileVoices[trackId] = { audio, volume }
    return true
  } catch (e) {
    return false
  }
}

export function setFileTrackVolume(trackId: string, volume: number) {
  const voice = fileVoices[trackId]
  if (!voice) return
  voice.audio.volume = Math.max(0, Math.min(100, volume)) / 100
  voice.volume = volume
}

export function stopFileTrack(trackId: string) {
  const voice = fileVoices[trackId]
  if (!voice) return
  try {
    voice.audio.stop()
    voice.audio.destroy()
  } catch (e) {
    /* 已销毁 */
  }
  delete fileVoices[trackId]
}

export function stopAllFileTracks() {
  Object.keys(fileVoices).forEach(id => stopFileTrack(id))
}

/* ===================== 电子木鱼音效（振荡器合成） ===================== */

function tone(freqs: number[], gains: number[], decay: number, when = 0) {
  const c = ensureCtx()
  if (!c) return
  const t = c.currentTime + when
  freqs.forEach((f, i) => {
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const g = c.createGain()
    g.gain.setValueAtTime(gains[i], t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay * (i === 0 ? 1 : 0.6))
    osc.connect(g)
    g.connect(masterGain)
    osc.start(t)
    osc.stop(t + decay + 0.1)
  })
}

export function playMeritSound(style: string) {
  const c = ensureCtx()
  if (!c) return
  if (!tapSoundOn()) return
  switch (style) {
    case 'muyu':
    case 'fish':
      tone([520, 1600], [0.55, 0.15], 0.12)
      break
    case 'bowl':
      tone([528, 1056, 1584], [0.32, 0.14, 0.07], 2.2)
      break
    case 'bell':
      tone([196, 294, 392, 523], [0.3, 0.16, 0.1, 0.06], 3.2)
      break
    case 'drop': {
      const osc = c.createOscillator()
      osc.type = 'sine'
      const t = c.currentTime
      osc.frequency.setValueAtTime(1300, t)
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.09)
      const g = c.createGain()
      g.gain.setValueAtTime(0.35, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      osc.connect(g)
      g.connect(masterGain)
      osc.start(t)
      osc.stop(t + 0.25)
      break
    }
    /* 风铃：多颗高频小铃错落响起 */
    case 'wind':
      tone([1568, 2093], [0.22, 0.12], 0.5)
      tone([1319], [0.16], 0.55, 0.07)
      tone([1760], [0.18], 0.6, 0.16)
      tone([2637], [0.1], 0.45, 0.27)
      break
    /* 雷鼓：低频闷响 + 短促回弹 */
    case 'thunder':
      tone([96, 142], [0.7, 0.25], 0.32)
      tone([72], [0.4], 0.5, 0.06)
      break
    /* 夜钟：低沉绵长的月下钟声 */
    case 'night':
      tone([220, 331, 441], [0.32, 0.14, 0.08], 2.6)
      break
    case 'silent':
    default:
      break
  }
}

/* ===================== 通用点击音效 ===================== */

export function playTap() {
  const c = ensureCtx()
  if (!c) return
  if (!tapSoundOn()) return
  tone([880], [0.12], 0.08)
}

/* ===================== 情绪粉碎机音效 ===================== */

function noiseSweep(c: AnyCtx, freqFrom: number, freqTo: number, dur: number, peak: number, type = 'bandpass') {
  const src = makeNoiseSource(c)
  const filter = c.createBiquadFilter()
  filter.type = type
  filter.Q.value = 1
  const gain = c.createGain()
  const t = c.currentTime
  filter.frequency.setValueAtTime(freqFrom, t)
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqTo), t + dur)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(peak, t + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)
  src.start(t)
  src.stop(t + dur + 0.05)
}

/* 撕碎：连续高频噪声脉冲，模拟纸张撕裂 */
function playShred() {
  const c = ensureCtx()
  if (!c) return
  for (let i = 0; i < 9; i++) {
    const t = c.currentTime + i * 0.11
    const src = makeNoiseSource(c)
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2200 + Math.random() * 2600
    bp.Q.value = 0.8
    const gain = c.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.3, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    src.connect(bp)
    bp.connect(gain)
    gain.connect(masterGain)
    src.start(t)
    src.stop(t + 0.12)
  }
}

/* 焚烧：低频轰鸣 + 高频噼啪 */
function playBurn() {
  const c = ensureCtx()
  if (!c) return
  noiseSweep(c, 900, 120, 2.6, 0.22, 'lowpass')
  for (let i = 0; i < 22; i++) {
    const t = c.currentTime + Math.random() * 2.4
    const src = makeNoiseSource(c)
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1800 + Math.random() * 3000
    bp.Q.value = 3
    const gain = c.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.12, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    src.connect(bp)
    bp.connect(gain)
    gain.connect(masterGain)
    src.start(t)
    src.stop(t + 0.08)
  }
}

/* 冲走：滤波噪声扫频 + 水流渐弱 */
function playFlush() {
  const c = ensureCtx()
  if (!c) return
  noiseSweep(c, 300, 1600, 1.1, 0.28)
  noiseSweep(c, 1600, 200, 1.8, 0.2)
}

export function playCrushSound(mode: string) {
  const c = ensureCtx()
  if (!c) return
  if (!tapSoundOn()) return
  switch (mode) {
    case 'shred':
      playShred()
      break
    case 'burn':
      playBurn()
      break
    case 'flush':
      playFlush()
      break
    default:
      break
  }
}


/* ===================== 无限气泡纸音效 ===================== */

/* 捏爆气泡：短促的「啪」——正弦从高频速降，随机音高避免单调 */
export function playPopSound() {
  const c = ensureCtx()
  if (!c) return
  if (!tapSoundOn()) return
  const t = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(520 + Math.random() * 180, t)
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.09)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(0.3, t + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
  osc.connect(gain)
  gain.connect(masterGain)
  osc.start(t)
  osc.stop(t + 0.12)
}
