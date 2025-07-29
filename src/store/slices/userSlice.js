import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { save, get, remove } from '@/utils/storage'

// 获取存储的用户信息
const userInfo = get('userInfo')

const initialState = {
  username: '',
  role: 2,
  userId: 0,
  github: null,
  email: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  ...(userInfo || {})
}

// 如果有存储的用户信息，设置为已登录状态
if (userInfo && userInfo.token) {
  initialState.isAuthenticated = true
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { username, userId, role, github = null, token, email } = action.payload
      state.username = username
      state.userId = userId
      state.role = role
      state.github = github
      state.email = email
      state.token = token
      state.isAuthenticated = true
      state.error = null
      
      // 保存到本地存储
      save('userInfo', { username, userId, role, github, token, email })
    },
    
    logout: (state) => {
      state.username = ''
      state.userId = 0
      state.role = 2
      state.github = null
      state.email = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // 清除本地存储
      remove('userInfo')
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { loginSuccess, logout, clearError, setLoading, setError } = userSlice.actions
export default userSlice.reducer