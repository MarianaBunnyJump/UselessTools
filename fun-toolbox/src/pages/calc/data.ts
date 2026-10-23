/* ===================== 生活计算器配置（calc 分包） =====================
 * 每个计算器 = 输入字段列表 + 计算 + 结果行 + 局长碎碎念。
 * 新增计算器只需在此加一项，run 页自动渲染。
 */

export type FieldType = 'number' | 'select'

export interface CalcField {
  key: string
  label: string
  unit?: string
  type: FieldType
  placeholder?: string
  options?: string[]  /* select 的显示项 */
  values?: number[]    /* options 对应值 */
  defaultValue?: number
}

export interface CalcDef {
  id: string
  name: string
  icon: string
  desc: string
  fields: CalcField[]
  compute: (v: Record<string, number>) => { lines: { label: string; value: string; main?: boolean }[] }
  quips: string[]
}

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export const CALCS: CalcDef[] = [
  {
    id: 'mortgage',
    name: '房贷',
    icon: '🏠',
    desc: '月供与利息一看就懂',
    fields: [
      { key: 'loan', label: '贷款总额', unit: '万元', type: 'number', placeholder: '100', defaultValue: 100 },
      { key: 'years', label: '年限', unit: '年', type: 'number', placeholder: '30', defaultValue: 30 },
      { key: 'rate', label: '年利率', unit: '%', type: 'number', placeholder: '4.0', defaultValue: 4 }
    ],
    compute: v => {
      const P = v.loan * 10000
      const n = v.years * 12
      const r = v.rate / 100 / 12
      const m = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      return {
        lines: [
          { label: '月供（等额本息）', value: `${fmt(m)} 元`, main: true },
          { label: '总还款', value: `${fmt(m * n)} 元` },
          { label: '总利息', value: `${fmt(m * n - P)} 元` }
        ]
      }
    },
    quips: [
      '每月少喝 32 杯奶茶 ≈ 这套房的利息，值得吗？',
      '利息够再付个首付的零头了，且行且珍惜。',
      '三十年很长，但房子比大多数爱情久。'
    ]
  },
  {
    id: 'bmi',
    name: '健康三合一',
    icon: '❤️',
    desc: 'BMI / 基础代谢 / 体脂率',
    fields: [
      { key: 'height', label: '身高', unit: 'cm', type: 'number', placeholder: '170', defaultValue: 170 },
      { key: 'weight', label: '体重', unit: 'kg', type: 'number', placeholder: '65', defaultValue: 65 },
      { key: 'age', label: '年龄', unit: '岁', type: 'number', placeholder: '28', defaultValue: 28 },
      { key: 'gender', label: '性别', type: 'select', options: ['男', '女'], values: [1, 0], defaultValue: 1 }
    ],
    compute: v => {
      const h = v.height / 100
      const bmi = v.weight / (h * h)
      const bmr =
        v.gender === 1
          ? 10 * v.weight + 6.25 * v.height - 5 * v.age + 5
          : 10 * v.weight + 6.25 * v.height - 5 * v.age - 161
      const whr = 0
      void whr
      const bmiLabel = bmi < 18.5 ? '偏瘦' : bmi < 24 ? '标准' : bmi < 28 ? '偏胖' : '肥胖'
      return {
        lines: [
          { label: 'BMI', value: `${fmt(bmi, 1)}（${bmiLabel}）`, main: true },
          { label: '基础代谢 BMR', value: `${fmt(bmr, 0)} 千卡/天` },
          { label: '每日不动消耗', value: `≈ ${fmt(bmr * 1.2, 0)} 千卡` }
        ]
      }
    },
    quips: [
      'BMI 只是参考，可爱不受指标约束。',
      '基础代谢就是你躺一天也在燃烧的热量，躺着也是有贡献的。',
      '数字是镜子不是判决书。'
    ]
  },
  {
    id: 'unit',
    name: '单位换算',
    icon: '📏',
    desc: '长度/重量/温度常用互转',
    fields: [
      { key: 'kind', label: '换算类型', type: 'select', options: ['公里→英里', '公斤→斤', '摄氏→华氏', '米→英尺'], values: [0, 1, 2, 3], defaultValue: 0 },
      { key: 'value', label: '输入数值', type: 'number', placeholder: '10', defaultValue: 10 }
    ],
    compute: v => {
      const map = [
        { label: '英里', value: v.value * 0.6214 },
        { label: '斤', value: v.value * 2 },
        { label: '华氏度', value: v.value * 1.8 + 32 },
        { label: '英尺', value: v.value * 3.281 }
      ]
      const r = map[Math.round(v.kind)]
      return { lines: [{ label: '换算结果', value: fmt(r.value, 2), main: true }] }
    },
    quips: ['跑 10 公里 ≈ 6.2 英里，听起来瞬间轻松了。', '温度换算给海外党省过无数次脑子。']
  },
  {
    id: 'compound',
    name: '复利与养老',
    icon: '📈',
    desc: '时间的朋友算给你看',
    fields: [
      { key: 'principal', label: '本金', unit: '元', type: 'number', placeholder: '10000', defaultValue: 10000 },
      { key: 'monthly', label: '每月追加', unit: '元', type: 'number', placeholder: '1000', defaultValue: 1000 },
      { key: 'rate', label: '年化收益', unit: '%', type: 'number', placeholder: '4', defaultValue: 4 },
      { key: 'years', label: '年数', unit: '年', type: 'number', placeholder: '20', defaultValue: 20 }
    ],
    compute: v => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const grow = v.principal * Math.pow(1 + r, n)
      const add = r === 0 ? v.monthly * n : v.monthly * ((Math.pow(1 + r, n) - 1) / r)
      const total = grow + add
      const cost = v.principal + v.monthly * n
      return {
        lines: [
          { label: '到期总额', value: `${fmt(total, 0)} 元`, main: true },
          { label: '累计投入', value: `${fmt(cost, 0)} 元` },
          { label: '收益部分', value: `${fmt(total - cost, 0)} 元` }
        ]
      }
    },
    quips: ['复利是世界第八大奇迹——前提是你别中途取出来买手机。', '时间站在你这边，只要你不催它。']
  },
  {
    id: 'tax',
    name: '个税',
    icon: '💸',
    desc: '按 2026 综合所得税率',
    fields: [
      { key: 'income', label: '税前年收入', unit: '元', type: 'number', placeholder: '200000', defaultValue: 200000 },
      { key: 'deduct', label: '专项扣除合计', unit: '元', type: 'number', placeholder: '60000', defaultValue: 60000 }
    ],
    compute: v => {
      const taxable = Math.max(0, v.income - v.deduct)
      const brackets: [number, number][] = [
        [36000, 0.03], [144000, 0.1], [300000, 0.2], [420000, 0.25],
        [660000, 0.3], [960000, 0.35], [Infinity, 0.45]
      ]
      const quick = [0, 2520, 16920, 31920, 52920, 85920, 181920]
      let tax = 0
      let rate = 0
      for (let i = 0; i < brackets.length; i++) {
        if (taxable <= brackets[i][0]) {
          rate = brackets[i][1]
          tax = taxable * rate - quick[i]
          break
        }
      }
      tax = Math.max(0, tax)
      return {
        lines: [
          { label: '全年应纳税', value: `${fmt(tax, 0)} 元`, main: true },
          { label: '适用税率', value: `${fmt(rate * 100, 0)}%` },
          { label: '税后年收入', value: `${fmt(v.income - tax, 0)} 元` }
        ]
      }
    },
    quips: ['专项扣除记得填满，那是国家给你发的隐藏红包。', '看税率不如看退税，每年三月是开盲盒的日子。']
  },
  {
    id: 'datediff',
    name: '日期间隔',
    icon: '📅',
    desc: '相差天数与倒数日',
    fields: [
      { key: 'days', label: '间隔天数', unit: '天', type: 'number', placeholder: '100', defaultValue: 100 }
    ],
    compute: v => {
      const now = new Date()
      const target = new Date(now.getTime() + v.days * 86400000)
      const weeks = Math.floor(v.days / 7)
      const y = target.getFullYear()
      const m = String(target.getMonth() + 1).padStart(2, '0')
      const d = String(target.getDate()).padStart(2, '0')
      return {
        lines: [
          { label: '今天之后的日期', value: `${y}-${m}-${d}`, main: true },
          { label: '折合', value: `${weeks} 周 + ${v.days % 7} 天` },
          { label: '小时', value: `${fmt(v.days * 24, 0)} 小时` }
        ]
      }
    },
    quips: ['100 天说长不长，够养成一个习惯再戒掉它。', '倒数日的意义：把「以后」变成日历上的一格。']
  },
  {
    id: 'fuel',
    name: '油耗与出行',
    icon: '⛽',
    desc: '一公里几块钱',
    fields: [
      { key: 'km', label: '里程', unit: '公里', type: 'number', placeholder: '350', defaultValue: 350 },
      { key: 'consumption', label: '百公里油耗', unit: 'L', type: 'number', placeholder: '8', defaultValue: 8 },
      { key: 'price', label: '油价', unit: '元/L', type: 'number', placeholder: '7.8', defaultValue: 7.8 }
    ],
    compute: v => {
      const liters = v.km * v.consumption / 100
      const cost = liters * v.price
      return {
        lines: [
          { label: '总油费', value: `${fmt(cost, 1)} 元`, main: true },
          { label: '每公里', value: `${fmt(cost / v.km, 2)} 元` },
          { label: '总油耗', value: `${fmt(liters, 1)} 升` }
        ]
      }
    },
    quips: ['通勤来回 30 公里，一个月油费 ≈ 一顿火锅，选吧。', '每公里两块二，比地铁贵出一张蛋挞。']
  },
  {
    id: 'travel',
    name: '旅行预算 AA',
    icon: '✈️',
    desc: '人均一秒算清',
    fields: [
      { key: 'total', label: '总预算', unit: '元', type: 'number', placeholder: '8000', defaultValue: 8000 },
      { key: 'people', label: '人数', unit: '人', type: 'number', placeholder: '4', defaultValue: 4 },
      { key: 'nights', label: '晚数', unit: '晚', type: 'number', placeholder: '3', defaultValue: 3 }
    ],
    compute: v => {
      const per = v.total / Math.max(1, v.people)
      return {
        lines: [
          { label: '人均', value: `${fmt(per, 0)} 元`, main: true },
          { label: '人均/晚', value: `${fmt(per / Math.max(1, v.nights), 0)} 元` },
          { label: '每日人均', value: `${fmt(per / Math.max(1, v.nights + 1), 0)} 元` }
        ]
      }
    },
    quips: ['AA 制是友谊的防腐剂。', '预算的第一条定律：实际 × 1.3。']
  },
  {
    id: 'uppercase',
    name: '金额大写',
    icon: '🧾',
    desc: '报销合同用',
    fields: [
      { key: 'amount', label: '金额', unit: '元', type: 'number', placeholder: '12345.67', defaultValue: 12345.67 }
    ],
    compute: v => {
      const digits = '零壹贰叁肆伍陆柒捌玖'
      const units = ['', '拾', '佰', '仟']
      const bigUnits = ['', '万', '亿']
      const n = Math.floor(v.amount)
      const frac = Math.round((v.amount - n) * 100)
      let intStr = String(n)
      let result = ''
      let sec = 0
      while (intStr.length > 0) {
        const chunk = intStr.slice(-4)
        intStr = intStr.slice(0, -4)
        let chunkStr = ''
        for (let i = 0; i < chunk.length; i++) {
          const d = Number(chunk[chunk.length - 1 - i])
          if (d === 0) {
            if (!chunkStr.startsWith('零')) chunkStr = '零' + chunkStr
          } else {
            chunkStr = digits[d] + units[i] + chunkStr
          }
        }
        chunkStr = chunkStr.replace(/零+$/, '')
        if (chunkStr) result = chunkStr + bigUnits[sec] + result
        else if (result && !result.startsWith('零')) result = '零' + result
        sec++
      }
      result = result || '零'
      const j = Math.floor(frac / 10)
      const f = frac % 10
      const fracStr = j === 0 && f === 0 ? '整' : `${j ? digits[j] + '角' : ''}${f ? digits[f] + '分' : ''}`
      return { lines: [{ label: '大写金额', value: `人民币 ${result}元${fracStr}`, main: true }] }
    },
    quips: ['壹贰叁肆伍陆柒捌玖——财务的世界里没有简体字。', '报销单上写错一个字，财务的眉毛就会动一下。']
  },
  {
    id: 'percent',
    name: '百分比计算',
    icon: '％',
    desc: '涨了跌了算明白',
    fields: [
      { key: 'from', label: '原值', type: 'number', placeholder: '100', defaultValue: 100 },
      { key: 'to', label: '现值', type: 'number', placeholder: '88', defaultValue: 88 }
    ],
    compute: v => {
      if (v.from === 0) return { lines: [{ label: '提示', value: '原值不能为 0' }] }
      const pct = ((v.to - v.from) / v.from) * 100
      return {
        lines: [
          { label: pct >= 0 ? '上涨' : '下跌', value: `${fmt(Math.abs(pct), 2)}%`, main: true },
          { label: '变化量', value: fmt(v.to - v.from, 2) }
        ]
      }
    },
    quips: ['跌 50% 需要涨 100% 才能回本，数学从不安慰人。', '工资涨 5% 的快乐，约等于奶茶中杯升大杯。']
  },
  {
    id: 'sleep',
    name: '睡眠计算',
    icon: '😴',
    desc: '几点睡够 7.5 小时',
    fields: [
      { key: 'hour', label: '起床时间（时，24h）', type: 'number', placeholder: '7', defaultValue: 7 },
      { key: 'minutes', label: '起床时间（分）', type: 'number', placeholder: '30', defaultValue: 30 },
      { key: 'cycleHours', label: '目标睡眠', unit: '小时', type: 'select', options: ['6小时(4周期)', '7.5小时(5周期)', '9小时(6周期)'], values: [6, 7.5, 9], defaultValue: 7.5 }
    ],
    compute: v => {
      const rise = v.hour * 60 + v.minutes
      const back = (rise - v.cycleHours * 60 - 14 + 1440) % 1440
      const h = Math.floor(back / 60)
      const m = back % 60
      return {
        lines: [
          { label: '建议入睡时间', value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, main: true },
          { label: '含 14 分钟入睡缓冲', value: '躺下后别看手机哦' }
        ]
      }
    },
    quips: ['睡眠周期 90 分钟一环，卡在环上醒，比睡满更重要。', '计算器算不出你放下手机的手速。']
  }
]

export function findCalc(id: string): CalcDef | undefined {
  return CALCS.find(c => c.id === id)
}
