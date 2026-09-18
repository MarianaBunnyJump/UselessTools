import { View } from '@tarojs/components'
import './muyu.scss'

interface MuyuProps {
  /* 宽度，设计稿 px（默认 340） */
  size?: number
}

/* 纯 CSS 绘制的木色木鱼：木鱼页主形象与首页盒子弹出共用 */
export default function Muyu({ size = 340 }: MuyuProps) {
  return (
    <View className='muyu' style={{ width: `${size}px`, height: `${size * 0.74}px` }}>
      <View className='muyu-body'>
        <View className='muyu-scale muyu-scale--1' />
        <View className='muyu-scale muyu-scale--2' />
        <View className='muyu-hole' />
        <View className='muyu-mouth' />
        <View className='muyu-shine' />
      </View>
    </View>
  )
}
