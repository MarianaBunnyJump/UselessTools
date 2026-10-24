/* ===================== 文言文陪读进度存取 =====================
 * 独立于页面模块：页面之间不得互相 import（weapp 分包下跨页面
 * import 会把页面模块变成共享依赖，可能触发 sub-common 分包
 * 抽 chunk 异常导致页面打不开，见 V4.1 修复记录）。
 */

import { get, set } from '../../../utils/storage'

/* 篇目进度：read 已读 / recite 背熟等级 0~3 */
export type Progress = Record<string, { read: boolean; recite: number }>

const KEY = 'classics_progress'

export function getProgress(): Progress {
  return get<Progress>(KEY, {})
}

export function saveProgress(p: Progress): void {
  set(KEY, p)
}
