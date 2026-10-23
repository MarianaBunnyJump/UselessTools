import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { getTheme } from '../../../utils/theme'
import { get } from '../../../utils/storage'
import NavBar from '../../../components/NavBar'
import { CALCS } from '../data'
import './index.scss'

export default function CalcSuite() {
  const [theme] = useState(getTheme())
  const recent = get<string[]>('calc_recent', [])

  useShareAppMessage(() => ({
    title: '房贷、个税、BMI……一个分包全算清',
    path: '/pages/index/index'
  }))

  const open = (id: string) => {
    const next = [id, ...recent.filter(x => x !== id)].slice(0, 4)
    Taro.setStorageSync('calc_recent', JSON.stringify(next))
    Taro.navigateTo({ url: `/pages/calc/run/index?id=${id}` })
  }

  const recentCalcs = recent.map(id => CALCS.find(c => c.id === id)).filter(Boolean)

  return (
    <View className='page-root calc-index-root' style={{ background: theme.bg }}>
      <NavBar title='生活计算器' />
      <ScrollView scrollY className='calcix-scroll'>
        {recentCalcs.length > 0 && (
          <>
            <View className='calcix-label'>最近用过</View>
            <View className='calcix-chips'>
              {recentCalcs.map(c => (
                <View key={c!.id} className='calcix-chip' onClick={() => open(c!.id)}>
                  {c!.icon} {c!.name}
                </View>
              ))}
            </View>
          </>
        )}

        <View className='calcix-label'>全部 {CALCS.length} 个</View>
        <View className='calcix-grid'>
          {CALCS.map(c => (
            <View key={c.id} className='calcix-card' onClick={() => open(c.id)}>
              <Text className='calcix-icon'>{c.icon}</Text>
              <Text className='calcix-name'>{c.name}</Text>
              <Text className='calcix-desc'>{c.desc}</Text>
            </View>
          ))}
        </View>

        <View className='calcix-tip'>每个结果都附一句「局长碎碎念」人话解读 · 数据不联网</View>
      </ScrollView>
    </View>
  )
}
