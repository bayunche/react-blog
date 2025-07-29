import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题状态管理
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // 状态
      isDark: false,
      primaryColor: '#ff69b4',
      
      // Actions
      toggleTheme: () => {
        const { isDark } = get()
        set({ isDark: !isDark })
      },

      setDarkMode: (isDark) => {
        set({ isDark })
      },

      setPrimaryColor: (color) => {
        set({ primaryColor: color })
      },

      setThemeSettings: (settings) => {
        set(settings)
      },

      // 重置为默认主题
      resetTheme: () => {
        set({
          isDark: false,
          primaryColor: '#ff69b4',
        })
      },

      // 获取当前主题配置
      getThemeConfig: () => {
        const { isDark, primaryColor } = get()
        return {
          isDark,
          primaryColor,
          // 可以在这里计算衍生的主题值
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          textColor: isDark ? '#ffffff' : '#000000',
        }
      },
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
)