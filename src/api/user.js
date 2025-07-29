import axios from '@/utils/axios'
import { message } from 'antd'
import * as PSW from '@/utils/password'

// 用户登录
export const loginAPI = async (params) => {
  if (params.password !== undefined) {
    params.password = PSW.default.encrypt(params.password)
  }
  
  try {
    const res = await axios.post('/login', params)
    message.success(`登录成功, 欢迎您 ${res.username}`)
    return res
  } catch (error) {
    message.error(error.message || '登录失败')
    throw error
  }
}

// 用户注册
export const registerAPI = async (params) => {
  if (params.password !== undefined) {
    params.password = PSW.default.encrypt(params.password)
  }
  
  try {
    const res = await axios.post('/register', params)
    message.success('注册成功，请重新登录您的账号！')
    return res
  } catch (error) {
    message.error(error.message || '注册失败')
    throw error
  }
}

// 获取用户信息
export const getUserInfoAPI = async () => {
  try {
    const res = await axios.get('/user/info')
    return res
  } catch (error) {
    message.error(error.message || '获取用户信息失败')
    throw error
  }
}