/* ===================== 转盘场景预设包 =====================
 * 一键把「场景」装进转盘：选项 + 配色 + 结果彩蛋文案。
 * 新增场景：在此加一项即可，转盘页自动出现。
 */

export interface WheelScene {
  id: string
  name: string
  icon: string
  options: string[]
  /* 转到结果时的彩蛋文案（{r} 会被结果替换） */
  resultLines: string[]
}

export const WHEEL_SCENES: WheelScene[] = [
  {
    id: 'eat',
    name: '今天吃什么',
    icon: '🍜',
    options: ['火锅', '烧烤', '面馆', '饺子', '麻辣烫', '盖浇饭', '汉堡', '寿司', '米粉', '沙拉', '煎饼', '黄焖鸡'],
    resultLines: ['就它了：{r}，锅底我点鸳鸯', '别纠结了，{r}，走着', '转盘说 {r}，那就是它']
  },
  {
    id: 'drink',
    name: '行酒令',
    icon: '🍺',
    options: ['你喝', '我喝', '左边喝', '右边喝', '对面喝', '全体喝', '讲个笑话免喝', '喝一半', '指定一人喝', '摇骰子定'],
    resultLines: ['{r}——都不许耍赖！', '天意：{r}', '{r}，酒桌宪法第一条']
  },
  {
    id: 'dice',
    name: '骰子',
    icon: '🎲',
    options: ['1', '2', '3', '4', '5', '6'],
    resultLines: ['{r} 点！', '开出 {r} 点', '骰子落定：{r}']
  },
  {
    id: 'coin',
    name: '抛硬币',
    icon: '🪙',
    options: ['正面', '反面', '立起来了（重来）'],
    resultLines: ['{r}！接受天意吧', '硬币说：{r}', '{r}——不许再抛第二次']
  },
  {
    id: 'name',
    name: '抽签点名',
    icon: '🎯',
    options: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号'],
    resultLines: ['天选之子：{r}', '{r}，躲不掉了', '{r}！全场目光看过来']
  },
  {
    id: 'number',
    name: '随机数字',
    icon: '🔢',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    resultLines: ['幸运数字：{r}', '{r}，就它了', '抽中 {r}']
  }
]
