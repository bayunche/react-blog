import React from 'react'
import { Icon } from 'antd'
import SvgIcon from '@/components/SvgIcon'

import Href from '@/components/Href'
import MyInfo from '@/views/web/about/MyInfo'
import { GithubFill } from 'utils/antdIcon'
// API_BASE_URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:6060'
// project config
export const HEADER_BLOG_NAME = '您的博客名称' // header title 显示的名字

// === sidebar
export const SIDEBAR = {
  avatar: require('@/assets/images/avatar.jpg'), // 侧边栏头像
  title: '八云澈的小站', // 标题
  subTitle: '睡了已经肝不动了', // 子标题
  // 个人主页
  homepages: {
    github: {
      link: 'https://github.com/your-username',
      icon: <GithubFill className='homepage-icon' />,
    },
    // juejin: {
    //   link: 'https://juejin.im/user/96412755827687',
    //   icon: <SvgIcon type='iconjuejin' className='homepage-icon' />
    // }
  },
  friendslink: {
    // lizi: {
    //   link: 'http://blog.liziyang.space/',
    //   img: 'http://blog.liziyang.space/images/pikachu.jpg',
    // },
    // wizchen: {
    //   link: 'http://blog.wizchen.com',
    //   img: 'https://cdn.jsdelivr.net/gh/wizcheu/content1@main/img/header.gif'
    // }
  },
}

// === discuss avatar
export const DISCUSS_AVATAR = SIDEBAR.avatar // 评论框博主头像

/**
 * github config
 */
export const GITHUB = {
  enable: true, // github 第三方授权开关  
  client_id: process.env.REACT_APP_GITHUB_CLIENT_ID, // Setting > Developer setting > OAuth applications => client_id
  url: 'https://github.com/login/oauth/authorize', // 跳转的登录的地址
}

export const ABOUT = {
  avatar: SIDEBAR.avatar,
  describe: SIDEBAR.subTitle,
  discuss: true, // 关于页面是否开启讨论
  renderMyInfo: <MyInfo />, // 我的介绍 自定义组件 => src/views/web/about/MyInfo.jsx
}

// 公告 announcement
export const ANNOUNCEMENT = {
  enable: false, // 是否开启
  content: (
    <>
      欢迎访问我的博客
      <Href href='https://github.com/your-username'>我的 GitHub</Href>
    </>
  ),
}
