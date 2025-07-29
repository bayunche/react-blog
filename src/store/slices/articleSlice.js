import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { genertorColor } from '@/utils'

const initialState = {
  categoryList: [],
  tagList: [],
  articleList: [],
  currentArticle: null,
  loading: false,
  error: null,
}

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setTagList: (state, action) => {
      state.tagList = genertorColor(action.payload)
    },
    
    setCategoryList: (state, action) => {
      state.categoryList = genertorColor(action.payload)
    },
    
    setArticleList: (state, action) => {
      state.articleList = action.payload
    },
    
    setCurrentArticle: (state, action) => {
      state.currentArticle = action.payload
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { 
  setTagList, 
  setCategoryList, 
  setArticleList, 
  setCurrentArticle, 
  setLoading, 
  setError, 
  clearError 
} = articleSlice.actions

export default articleSlice.reducer