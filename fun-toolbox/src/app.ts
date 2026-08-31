import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import { ensureDailyReset } from './utils/storage'

import './app.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    ensureDailyReset()
  })

  return children
}

export default App
