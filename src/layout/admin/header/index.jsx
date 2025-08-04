import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores'

import { Button, Dropdown, Menu, Avatar } from 'antd'
import logo from '@/assets/images/avatar.jpg'
import { DownOutlined } from '@ant-design/icons'

function AdminHeader(props) {
  const navigate = useNavigate()
  const userInfo = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)

  const menuItems = [
    {
      key: 'home',
      label: <span onClick={e => navigate('/home')}>返回主页</span>
    },
    {
      key: 'logout',
      label: <span onClick={e => { logout(); navigate('/'); }}>退出登录</span>
    }
  ]

  return (
    <>
      <div>
        {/* <img src={logo} alt='pvmed' /> */}
        <span className='header-title' onClick={e => history.push('/home')}>React-Blog Manager</span>
        <Dropdown menu={{ items: menuItems }} className='header-dropdown'>
          <a className='ant-dropdown-link'>
            {userInfo.username} <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </>
  )
}

export default AdminHeader
