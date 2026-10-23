/* ===================== 工具图标三层兜底 =====================
 * 优先级：用户上传（本机）> 配置表（assets/icons，作者维护）> emoji 默认。
 * 用户上传：chooseMedia 选正方形图 → 画布压到 256px → 存用户目录 → 记录路径。
 */

import Taro from '@tarojs/taro'
import { get, set } from './storage'
import TOOL_ICONS from '../data/toolIcons'
import type { ToolMeta } from '../data/tools'

export interface ToolIcon {
  type: 'emoji' | 'image'
  value: string
}

export function resolveToolIcon(tool: ToolMeta): ToolIcon {
  const overrides = get<Record<string, string>>('tool_icon_overrides', {})
  if (overrides[tool.id]) return { type: 'image', value: overrides[tool.id] }
  const configured = TOOL_ICONS[tool.id]
  if (configured) return { type: 'image', value: configured }
  return { type: 'emoji', value: tool.icon }
}

export function resetToolIcon(toolId: string) {
  const overrides = get<Record<string, string>>('tool_icon_overrides', {})
  delete overrides[toolId]
  set('tool_icon_overrides', overrides)
}

/* 选图并压缩为 256px 本机图标；返回新路径 */
export async function uploadToolIcon(toolId: string): Promise<string | null> {
  try {
    const res = await Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })
    const tmp = res.tempFiles && res.tempFiles[0]
    if (!tmp) return null

    /* 离屏画布压成正方形 256px */
    const query = Taro.createSelectorQuery()
    const node: any = await new Promise(resolve => {
      query
        .select('#iconResizeCanvas')
        .fields({ node: true })
        .exec(r => resolve(r && r[0] && r[0].node))
    })
    let filePath = tmp.tempFilePath
    if (node) {
      const canvas = node as any
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      const img = canvas.createImage()
      await new Promise((resolve, reject) => {
        img.onload = resolve as any
        img.onerror = reject
        img.src = tmp.tempFilePath
      })
      /* 居中裁正方形 */
      const s = Math.min(img.width, img.height)
      ctx.clearRect(0, 0, 256, 256)
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256)
      const out = await new Promise<string>((resolve, reject) => {
        Taro.canvasToTempFilePath({
          canvas,
          width: 256,
          height: 256,
          destWidth: 256,
          destHeight: 256,
          fileType: 'png',
          success: (r: any) => resolve(r.tempFilePath),
          fail: reject
        } as any)
      })
      filePath = out
    }

    /* 持久化到用户目录（H5 无需，直接用临时路径） */
    let saved = filePath
    if (process.env.TARO_ENV === 'weapp') {
      const fs = Taro.getFileSystemManager()
      const dir = `${(Taro as any).env.USER_DATA_PATH}/icons`
      try {
        fs.mkdirSync(dir, true)
      } catch (e) {
        /* 已存在 */
      }
      const dest = `${dir}/${toolId}.png`
      fs.saveFileSync(filePath, dest)
      saved = dest
    }

    const overrides = get<Record<string, string>>('tool_icon_overrides', {})
    overrides[toolId] = saved
    set('tool_icon_overrides', overrides)
    return saved
  } catch (e) {
    return null
  }
}
