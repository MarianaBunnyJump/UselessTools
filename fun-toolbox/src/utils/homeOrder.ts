/* ===================== 首页工具排序持久化 =====================
 * order 中不存在的 id 按默认顺序追加到尾部；已下线的 id 忽略
 */

import { get, set } from './storage'
import { TOOLS } from '../data/tools'

const ORDER_KEY = 'home_tool_order'

export function getHomeOrder(): string[] {
  const saved = get<string[]>(ORDER_KEY, [])
  if (!Array.isArray(saved) || saved.length === 0) {
    return TOOLS.map(t => t.id)
  }
  const valid = new Set(TOOLS.map(t => t.id))
  const known = new Set<string>()
  const result: string[] = []
  for (const id of saved) {
    if (valid.has(id) && !known.has(id)) {
      result.push(id)
      known.add(id)
    }
  }
  /* 新工具按默认顺序追加到尾部 */
  for (const t of TOOLS) {
    if (!known.has(t.id)) result.push(t.id)
  }
  return result
}

export function saveHomeOrder(order: string[]): void {
  set(ORDER_KEY, order)
}
