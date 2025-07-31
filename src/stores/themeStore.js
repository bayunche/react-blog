import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题类型定义
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// 获取系统主题偏好
const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEMES.DARK 
    : THEMES.LIGHT
}

// 应用主题到DOM
const applyTheme = (theme) => {
  const root = document.documentElement
  const actualTheme = theme === THEMES.AUTO ? getSystemTheme() : theme
  
  root.setAttribute('data-theme', actualTheme)
  
  // 更新meta主题色
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', 
      actualTheme === THEMES.DARK ? '#1a202c' : '#ffffff'
    )
  }
  
  // 平滑过渡效果
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => {
      root.setAttribute('data-theme', actualTheme)
    })
  }
}

// 主题状态管理
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // 状态
      theme: THEMES.AUTO,
      actualTheme: getSystemTheme(),
      isTransitioning: false,
      primaryColor: '#ff69b4',
      
      // 动作
      setTheme: (newTheme) => {
        set({ isTransitioning: true })
        
        setTimeout(() => {
          const actualTheme = newTheme === THEMES.AUTO ? getSystemTheme() : newTheme
          applyTheme(newTheme)
          
          set({ 
            theme: newTheme, 
            actualTheme,
            isTransitioning: false 
          })
        }, 50)
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
        get().setTheme(newTheme)
      },

      setDarkMode: (isDark) => {
        get().setTheme(isDark ? THEMES.DARK : THEMES.LIGHT)
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
          theme: THEMES.AUTO,
          primaryColor: '#ff69b4',
        })
      },
      
      // 监听系统主题变化
      watchSystemTheme: () => {
        if (typeof window === 'undefined') return
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
          const { theme } = get()
          if (theme === THEMES.AUTO) {
            const systemTheme = getSystemTheme()
            applyTheme(THEMES.AUTO)
            set({ actualTheme: systemTheme })
          }
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      },
      
      // 初始化主题
      initTheme: () => {
        const { theme } = get()
        const actualTheme = theme === THEMES.AUTO ? getSystemTheme() : theme
        applyTheme(theme)
        set({ actualTheme })
        
        // 启动系统主题监听
        return get().watchSystemTheme()
      },

      // 获取当前主题配置
      getThemeConfig: () => {
        const { actualTheme, primaryColor } = get()
        const isDark = actualTheme === THEMES.DARK
        return {
          isDark,
          isLight: actualTheme === THEMES.LIGHT,
          primaryColor,
          actualTheme,
          themeClass: `theme-${actualTheme}`,
          // 可以在这里计算衍生的主题值
          backgroundColor: isDark ? '#1a202c' : '#ffffff',
          textColor: isDark ? '#f7fafc' : '#2d3748',
        }
      },
      
      // 获取主题相关的CSS类名
      getThemeClasses: () => {
        const { actualTheme } = get()
        return {
          isDark: actualTheme === THEMES.DARK,
          isLight: actualTheme === THEMES.LIGHT,
          themeClass: `theme-${actualTheme}`
        }
      }
    }),
    {
      name: 'moe-theme-storage',
      partialize: (state) => ({ theme: state.theme, primaryColor: state.primaryColor }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 水合后初始化主题
          setTimeout(() => {
            state.initTheme()
          }, 0)
        }
      }
    }
  )
)

// 主题常量导出
export { THEMES }