import { useEffect } from 'react'
import { useUserStore } from '@/stores'

// 初始化 stores 的 hook
export const useStoreInit = () => {
  const initUser = useUserStore(state => state.initUser)

  useEffect(() => {
    // 初始化用户信息
    initUser()
  }, [initUser])
}

export default useStoreInit