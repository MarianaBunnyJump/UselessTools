import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import './index.scss'

interface Row {
  label: string
  value: string
}

export default function DeviceInfo() {
  const [theme] = useState(getTheme())
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    try {
      const info = Taro.getSystemInfoSync()
      setRows([
        { label: '机型', value: info.model || '未知' },
        { label: '系统', value: `${info.platform} ${info.system || ''}` },
        { label: '屏幕', value: `${info.screenWidth}×${info.screenHeight} @${info.pixelRatio}x` },
        { label: '窗口', value: `${info.windowWidth}×${info.windowHeight}` },
        { label: '基础库', value: info.SDKVersion || '未知' },
        { label: '版本', value: info.version || '未知' },
        { label: '语言', value: info.language || '未知' },
        { label: '状态栏', value: `${info.statusBarHeight || 0}px` },
        { label: 'DPR', value: String(info.pixelRatio) },
        { label: '品牌', value: info.brand || '未知' }
      ])
    } catch (e) {
      setRows([{ label: '提示', value: '读取失败' }])
    }
    /* 网络 */
    Taro.getNetworkType({
      success: res => setRows(r => [...r, { label: '网络', value: res.networkType || '未知' }])
    })
    Taro.getStorageInfo({
      success: res => setRows(r => [...r, { label: '存储占用', value: `${res.currentSize} / ${res.limitSize} KB` }])
    })
  }, [])

  return (
    <View className='page-root dev-root' style={{ background: theme.bg }}>
      <NavBar title='设备信息' />
      <ScrollView scrollY className='dev-scroll'>
        {rows.map(r => (
          <View key={r.label} className='dev-row'>
            <Text className='dev-label'>{r.label}</Text>
            <Text className='dev-value'>{r.value}</Text>
          </View>
        ))}
        <View className='dev-tip'>数据仅在本页展示 · 用于排查兼容性问题</View>
      </ScrollView>
    </View>
  )
}
