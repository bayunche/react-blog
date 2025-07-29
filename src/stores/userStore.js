import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { save, get, remove } from '@/utils/storage'

// 用户状态管理
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 状态
      username: '',
      role: 2,
      userId: 0,
      github: null,
      email: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      loginSuccess: (userInfo) => {
        const { username, userId, role, github = null, token, email } = userInfo
        
        set({
          username,
          userId,
          role,
          github,
          email,
          token,
          isAuthenticated: true,
          error: null,
          loading: false,
        })
        
        // 保存到本地存储
        save('userInfo', { username, userId, role, github, token, email })
      },

      logout: () => {
        set({
          username: '',
          userId: 0,
          role: 2,
          github: null,
          email: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        })
        
        // 清除本地存储
        remove('userInfo')
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error, loading: false }),

      clearError: () => set({ error: null }),

      // 初始化用户信息（从本地存储）
      initUser: () => {
        const userInfo = get('userInfo')
        if (userInfo && userInfo.token) {
          set({
            ...userInfo,
            isAuthenticated: true,
          })
        }
      },

      // 更新用户信息
      updateUserInfo: (updates) => {
        const currentState = get()
        const newUserInfo = { ...currentState, ...updates }
        
        set(newUserInfo)
        
        // 更新本地存储
        save('userInfo', {
          username: newUserInfo.username,
          userId: newUserInfo.userId,
          role: newUserInfo.role,
          github: newUserInfo.github,
          token: newUserInfo.token,
          email: newUserInfo.email,
        })
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        username: state.username,
        userId: state.userId,
        role: state.role,
        github: state.github,
        email: state.email,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)