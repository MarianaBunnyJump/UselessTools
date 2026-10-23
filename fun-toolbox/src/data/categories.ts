/* ===================== 首页分类（简洁模式 / 编辑模式共用） =====================
 * 分类定义与工具归属都支持用户自定义（存本机），默认值在此维护。
 */

import { get, set } from '../utils/storage'
import type { ToolMeta } from './tools'

export interface ToolCategory {
  id: string
  name: string
  icon: string
  /* 分区装饰带主题色（北欧简版） */
  hue: string
}

export const DEFAULT_CATEGORIES: ToolCategory[] = [
  { id: 'study', name: '学习 · 校园', icon: '📖', hue: '#C9A063' },
  { id: 'create', name: '创作 · 图片', icon: '🎨', hue: '#E07856' },
  { id: 'calc', name: '生活计算', icon: '🧮', hue: '#5B7A9D' },
  { id: 'fun', name: '趣味 · 解压', icon: '🎡', hue: '#9575CD' }
]

export function getCategories(): ToolCategory[] {
  const saved = get<ToolCategory[]>('home_categories', [])
  return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_CATEGORIES
}

export function saveCategories(list: ToolCategory[]) {
  set('home_categories', list)
}

/* 工具所属分类：tools.ts 默认 + 用户覆盖 */
export function getToolCategory(tool: ToolMeta, categories: ToolCategory[]): ToolCategory {
  const overrides = get<Record<string, string>>('home_tool_category', {})
  const id = overrides[tool.id] || tool.category || 'fun'
  return categories.find(c => c.id === id) || categories[categories.length - 1]
}

export function setToolCategory(toolId: string, categoryId: string) {
  const overrides = get<Record<string, string>>('home_tool_category', {})
  overrides[toolId] = categoryId
  set('home_tool_category', overrides)
}

/* 隐藏/放出 */
export function getHiddenTools(): string[] {
  return get<string[]>('home_hidden_tools', [])
}

export function setHiddenTools(ids: string[]) {
  set('home_hidden_tools', ids)
}

/* 首页布局模式 */
export type HomeLayoutMode = 'gift' | 'simple'

export function getLayoutMode(): HomeLayoutMode {
  return get<HomeLayoutMode>('home_layout_mode', 'gift')
}

export function setLayoutMode(mode: HomeLayoutMode) {
  set('home_layout_mode', mode)
}
