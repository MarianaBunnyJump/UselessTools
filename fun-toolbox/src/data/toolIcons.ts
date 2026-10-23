/* ===================== 工具图标配置表（作者维护） =====================
 * 把统一风格的图标文件放到 `src/assets/icons/<toolId>.png`，
 * 然后在此登记路径即可全量替换该工具的 emoji 图标。
 * 用户还可在 App 内上传本机图标覆盖（优先级更高）。
 * 示例：
 *   import ClassicsIcon from '../assets/icons/classics.png'
 *   const map = { classics: ClassicsIcon }
 */

const map: Record<string, string> = {
  // 在这里登记，例如：
  // classics: require('../assets/icons/classics.png'),
}

export default map as Record<string, string>
