import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 样式导入
import 'virtual:windi.css'
import '@/styles/index.less'

// 应用组件
import App from './App'
import { themeConfig } from './config/theme'

// 设置 dayjs 中文
dayjs.locale('zh-cn')

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider 
        locale={zhCN}
        theme={themeConfig}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
)