import { create } from 'zustand'
import { genertorColor } from '@/utils'

// 文章状态管理
export const useArticleStore = create((set, get) => ({
  // 状态
  categoryList: [],
  tagList: [],
  articleList: [],
  currentArticle: null,
  loading: false,
  error: null,

  // Actions
  setTagList: (tagList) => {
    set({ tagList: genertorColor(tagList) })
  },

  setCategoryList: (categoryList) => {
    set({ categoryList: genertorColor(categoryList) })
  },

  setArticleList: (articleList) => {
    set({ articleList })
  },

  setCurrentArticle: (article) => {
    set({ currentArticle: article })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setError: (error) => {
    set({ error, loading: false })
  },

  clearError: () => {
    set({ error: null })
  },

  // 添加文章到列表
  addArticle: (article) => {
    const { articleList } = get()
    set({ articleList: [article, ...articleList] })
  },

  // 更新文章
  updateArticle: (updatedArticle) => {
    const { articleList } = get()
    const newList = articleList.map(article => 
      article.id === updatedArticle.id ? updatedArticle : article
    )
    set({ articleList: newList })
  },

  // 删除文章
  removeArticle: (articleId) => {
    const { articleList } = get()
    const newList = articleList.filter(article => article.id !== articleId)
    set({ articleList: newList })
  },

  // 清空文章列表
  clearArticles: () => {
    set({ articleList: [], currentArticle: null })
  },

  // 添加标签
  addTag: (tag) => {
    const { tagList } = get()
    const tagWithColor = genertorColor([tag])[0]
    set({ tagList: [...tagList, tagWithColor] })
  },

  // 添加分类
  addCategory: (category) => {
    const { categoryList } = get()
    const categoryWithColor = genertorColor([category])[0]
    set({ categoryList: [...categoryList, categoryWithColor] })
  },

  // 重置所有状态
  reset: () => {
    set({
      categoryList: [],
      tagList: [],
      articleList: [],
      currentArticle: null,
      loading: false,
      error: null,
    })
  },
}))