import { View } from '@tarojs/components'
import { getTheme } from '../../../utils/theme'
import NavBar from '../../../components/NavBar'
import './index.scss'

export default function StrokeCard() {
  const theme = getTheme()
  return (
    <View className='page-root' style={{ background: theme.bg }}>
      <NavBar title='StrokeCard' />
    </View>
  )
}
