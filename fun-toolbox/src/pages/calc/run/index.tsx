import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import { CALCS, findCalc, type CalcField } from '../data'
import './index.scss'

export default function CalcRun() {
  const [theme] = useState(getTheme())
  const params = Taro.getCurrentInstance().router?.params || {}
  const calc = findCalc(params.id || CALCS[0].id) || CALCS[0]

  /* 字段初值 */
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    calc.fields.forEach(f => (init[f.key] = f.defaultValue ?? 0))
    return init
  })
  const [quips] = useState(() => {
    void calc.id
    return calc.quips
  })
  const [quipIdx] = useState(() => Math.floor(Math.random() * calc.quips.length))

  useShareAppMessage(() => ({
    title: `${calc.icon} ${calc.name}算好了：${result.lines[0]?.value || ''}`,
    path: '/pages/index/index'
  }))

  const result = useMemo(() => {
    try {
      return calc.compute(values)
    } catch (e) {
      return { lines: [{ label: '提示', value: '填好数字再算' }] }
    }
  }, [calc, values])

  const setField = (f: CalcField, raw: string) => {
    let v = parseFloat(raw)
    if (isNaN(v)) v = 0
    setValues(prev => ({ ...prev, [f.key]: v }))
  }

  const setSelect = (f: CalcField, idx: number) => {
    const v = (f.values || [])[idx] ?? 0
    setValues(prev => ({ ...prev, [f.key]: v }))
  }

  const copy = () => {
    const text = result.lines.map(l => `${l.label}：${l.value}`).join('\n')
    Taro.setClipboardData({
      data: `${calc.name} · ${text}（趣工局）`,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    })
  }

  return (
    <View className='page-root calcrun-root' style={{ background: theme.bg }}>
      <NavBar title={`${calc.icon} ${calc.name}`} />
      <ScrollView scrollY className='calcrun-scroll'>
        {/* 输入 */}
        <View className='calcrun-card'>
          {calc.fields.map(f => (
            <View key={f.key} className='calcrun-field'>
              {f.type === 'number' ? (
                <>
                  <Text className='calcrun-field-label'>
                    {f.label}{f.unit ? `（${f.unit}）` : ''}
                  </Text>
                  <Input
                    className='calcrun-input'
                    type='digit'
                    value={String(values[f.key])}
                    placeholder={f.placeholder}
                    placeholderClass='calcrun-placeholder'
                    onInput={e => setField(f, e.detail.value)}
                  />
                </>
              ) : (
                <>
                  <Text className='calcrun-field-label'>{f.label}</Text>
                  <View className='calcrun-seg'>
                    {(f.options || []).map((opt, i) => (
                      <View
                        key={opt}
                        className={`calcrun-seg-item ${values[f.key] === (f.values || [])[i] ? 'calcrun-seg-item--on' : ''}`}
                        style={values[f.key] === (f.values || [])[i] ? { background: theme.accent } : undefined}
                        onClick={() => setSelect(f, i)}
                      >
                        {opt}
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          ))}
        </View>

        {/* 结果 */}
        <View className='calcrun-result' style={{ borderColor: `${theme.accent}55` }}>
          {result.lines.map((l, i) => (
            <View key={i} className={`calcrun-line ${l.main ? 'calcrun-line--main' : ''}`}>
              <Text className='calcrun-line-label'>{l.label}</Text>
              <Text
                className={`calcrun-line-value ${l.main ? 'calcrun-line-value--main' : ''}`}
                style={l.main ? { color: theme.accentDeep } : undefined}
              >
                {l.value}
              </Text>
            </View>
          ))}
          <View className='calcrun-copy' style={{ background: theme.accent }} onClick={copy}>复制结果</View>
        </View>

        {/* 局长碎碎念 */}
        <View className='calcrun-quip' style={{ background: `${theme.accent}14` }}>
          <Text className='calcrun-quip-title' style={{ color: theme.accentDeep }}>📌 局长碎碎念</Text>
          <Text className='calcrun-quip-text'>{quips[quipIdx]}</Text>
        </View>

        <View className='calcrun-tip'>结果仅供参考 · 大额决策请以官方计算为准</View>
      </ScrollView>
    </View>
  )
}
