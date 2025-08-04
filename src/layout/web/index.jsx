import React from 'react'
import '@/styles/app.less'
import { Layout, FloatButton } from 'antd'
import Header from './header'
import TopCard from '@/components/TopCard'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import Player from '@/components/musicPlayer/Player'
import ModernLive2D from '@/components/ModernLive2D'
import { Outlet } from 'react-router-dom'

const WebLayout = props => {
  return (
    <Layout className='app-container'>
      {/* 现代背景动画 - 包含粒子效果和背景图片轮播 */}
      <BackgroundAnimation />
      <Header />
      {/* 顶部卡片区域 */}
      <TopCard />
      {/* 主内容区域 - 移除侧边栏，内容占满宽度 */}
      <div className='app-wrapper'>
        <div className='app-main-container'>
          <Outlet />
        </div>
      </div>
      <FloatButton.BackTop style={{ zIndex: 100000 }} target={() => document.querySelector('.app-main')} />
      {/* 新的现代化Live2D组件 */}
      <ModernLive2D />
      <Player />
    </Layout>
  )
}

export default WebLayout