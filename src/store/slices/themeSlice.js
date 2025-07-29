import { createSlice } from '@reduxjs/toolkit'
import { save, get } from '@/utils/storage'

// 获取存储的主题设置
const savedTheme = get('themeSettings') || {}

const initialState = {
  isDark: false,
  primaryColor: '#ff69b4',
  ...savedTheme
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
      save('themeSettings', { isDark: state.isDark, primaryColor: state.primaryColor })
    },
    
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload
      save('themeSettings', { isDark: state.isDark, primaryColor: state.primaryColor })
    },
    
    setThemeSettings: (state, action) => {
      const { isDark, primaryColor } = action.payload
      state.isDark = isDark
      state.primaryColor = primaryColor
      save('themeSettings', { isDark, primaryColor })
    },
  },
})

export const { toggleTheme, setPrimaryColor, setThemeSettings } = themeSlice.actions
export default themeSlice.reducer