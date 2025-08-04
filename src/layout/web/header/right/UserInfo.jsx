import React from 'react'
import { useNavigate } from 'react-router-dom'

// stores
import { useUserStore } from '@/stores'

// components
import { Button, Dropdown, Menu, Avatar } from 'antd'
import AppAvatar from '@/components/Avatar'

// hooks
import useBus from '@/hooks/useBus.jsx'

function UserInfo() {
  const navigate = useNavigate()
  const bus = useBus()
  const { username, github, role, logout } = useUserStore()
  
  const userInfo = { username, github, role }

  const menuItems = [
    ...(role === 1 ? [
      {
        key: 'upload',
        label: <span onClick={e => bus.emit('openUploadModal')}>导入文章</span>
      },
      {
        key: 'admin',
        label: <span onClick={e => navigate('/admin')}>后台管理</span>
      }
    ] : []),
    {
      key: 'logout',
      label: <span className='user-logout' onClick={e => logout()}>退出登录</span>
    }
  ]
  return (
    <div className='header-userInfo'>
      {username ? (
        <Dropdown placement='bottomCenter' menu={{ items: menuItems }} trigger={['click', 'hover']}>
          <div style={{ height: 55 }}>
            <AppAvatar userInfo={userInfo} popoverVisible={false} />
          </div>
        </Dropdown>
      )
        : (
          <>
            <Button
              ghost
              type='primary'
              size='small'
              style={{ marginRight: 20 }}
              onClick={e => bus.emit('openSignModal', 'login')}>
              登录
            </Button>
            <Button ghost type='danger' size='small' onClick={e => bus.emit('openSignModal', 'register')}>
              注册
            </Button>
          </>
        )}
    </div>
  )
}

export default UserInfo
