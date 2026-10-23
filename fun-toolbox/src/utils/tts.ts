/* ===================== 语音朗读封装（微信同声传译插件） =====================
 * 首次调用需插件授权；未授权/不支持时静默降级（返回 false，由调用方提示）。
 * 使用前需在 MP 后台「设置-第三方设置-插件管理」添加「同声传译」。
 */

import Taro from '@tarojs/taro'

let plugin: any = null
let tried = false

function ensurePlugin(): any {
  if (tried) return plugin
  tried = true
  if (process.env.TARO_ENV !== 'weapp') return null
  try {
    plugin = Taro.requirePlugin('WechatSI')
  } catch (e) {
    plugin = null
  }
  return plugin
}

export function ttsAvailable(): boolean {
  const p = ensurePlugin()
  return !!(p && p.textToSpeech)
}

/* 单句朗读；返回 promise，结束/失败时 resolve */
export function speak(
  text: string,
  opts?: { speed?: number; done?: () => void; fail?: (err: any) => void }
): void {
  const p = ensurePlugin()
  if (!p || !p.textToSpeech) {
    opts && opts.fail && opts.fail(new Error('tts-unavailable'))
    return
  }
  p.textToSpeech({
    lang: 'zh_CN',
    content: text,
    speed: opts && opts.speed !== undefined ? opts.speed : 1.0,
    success: (res: any) => {
      /* 播放音频文件 */
      const inner = Taro.createInnerAudioContext()
      inner.src = res.filename
      inner.onEnded(() => opts && opts.done && opts.done())
      inner.onError(() => opts && opts.done && opts.done())
      inner.play()
    },
    fail: (err: any) => {
      opts && opts.fail && opts.fail(err)
    }
  })
}

export function stopTts() {
  /* 插件无全局 stop；依赖 done 回调串行控制 */
}
