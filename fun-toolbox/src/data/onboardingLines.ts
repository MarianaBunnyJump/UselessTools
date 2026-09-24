/* ===================== 首次进入导引语 =====================
 * 逐行渐显的欢迎文案；改文案/节奏只改本文件，无需动组件逻辑
 * 详见《首页升级方案设计》§3.3
 */

export interface OnboardingLine {
  text: string     /* 该行文案 */
  delay: number    /* 开始渐显的延迟（ms） */
}

export const ONBOARDING_LINES: OnboardingLine[] = [
  { text: '欢迎来到趣工局', delay: 0 },
  { text: '你会在这里遇见很多有趣的小工具', delay: 400 },
  { text: '请尽情地使用它们，让你变得更快乐吧', delay: 900 },
  { text: '工局的工具，永远只为你服务', delay: 1400 }
]

export const ONBOARDING_BTN_TEXT = '开工'
export const ONBOARDING_BTN_DELAY = 2000    /* 开工按钮浮出延迟（ms） */
export const ONBOARDING_SKIP_TEXT = '跳过'
