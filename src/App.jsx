import React, { useEffect } from 'react'
import { useStoreInit } from '@/hooks/useStoreInit'
import AppRouter from '@/router'
import { Provider as BusProvider } from '@/hooks/useBus'

// components
import PublicComponent from '@/components/Public'

const App = () => {
  // 初始化 stores
  useStoreInit()

  useEffect(() => {
    document.addEventListener('visibilitychange', function () {
      const normal_title = '八云澈的blog'
      if (document.visibilityState === 'hidden') {
        document.title = '(。_。) 别走好吗... (。_。)'
      } else document.title = normal_title
    })
  }, [])

  return (
    <BusProvider>
      <AppRouter />
      <PublicComponent />
    </BusProvider>
  )
}

export default App
