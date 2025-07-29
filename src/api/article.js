import axios from '@/utils/axios'
import { message } from 'antd'

// 获取文章列表
export const getArticleListAPI = async (params = {}) => {
  try {
    const res = await axios.get('/article/list', { params })
    return res
  } catch (error) {
    message.error(error.message || '获取文章列表失败')
    throw error
  }
}

// 获取文章详情
export const getArticleDetailAPI = async (id) => {
  try {
    const res = await axios.get(`/article/${id}`)
    return res
  } catch (error) {
    message.error(error.message || '获取文章详情失败')
    throw error
  }
}

// 创建文章
export const createArticleAPI = async (data) => {
  try {
    const res = await axios.post('/article', data)
    message.success('文章创建成功')
    return res
  } catch (error) {
    message.error(error.message || '创建文章失败')
    throw error
  }
}

// 更新文章
export const updateArticleAPI = async (id, data) => {
  try {
    const res = await axios.put(`/article/${id}`, data)
    message.success('文章更新成功')
    return res
  } catch (error) {
    message.error(error.message || '更新文章失败')
    throw error
  }
}

// 删除文章
export const deleteArticleAPI = async (id) => {
  try {
    const res = await axios.delete(`/article/${id}`)
    message.success('文章删除成功')
    return res
  } catch (error) {
    message.error(error.message || '删除文章失败')
    throw error
  }
}

// 获取分类列表
export const getCategoryListAPI = async () => {
  try {
    const res = await axios.get('/category/list')
    return res
  } catch (error) {
    message.error(error.message || '获取分类列表失败')
    throw error
  }
}

// 获取标签列表
export const getTagListAPI = async () => {
  try {
    const res = await axios.get('/tag/list')
    return res
  } catch (error) {
    message.error(error.message || '获取标签列表失败')
    throw error
  }
}