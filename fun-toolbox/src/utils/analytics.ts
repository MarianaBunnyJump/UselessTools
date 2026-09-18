/* ===================== 自定义分析埋点封装 =====================
 * weapp: Taro.reportEvent（需 MP 后台「自定义分析」先创建同名事件）
 * H5: 静默跳过
 * 事件清单见《首页升级方案设计》§7
 */

import Taro from '@tarojs/taro'

type AnalyticsParams = Record<string, string | number | boolean>

export function track(event: string, params?: AnalyticsParams): void {
  if (process.env.TARO_ENV !== 'weapp') return
  try {
    if (typeof Taro.reportEvent === 'function') {
      Taro.reportEvent(event, params || {})
    }
  } catch (e) {
    /* 埋点失败不影响主流程 */
  }
}
