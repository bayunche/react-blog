import React, { useState } from 'react'
import { Dropdown, Menu, Input, message } from 'antd'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'

// import config
import { HEADER_BLOG_NAME } from '@/config.jsx'
import navList from '../right/navList'

// icon
import SvgIcon from '@/components/SvgIcon'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons'

const HeaderLeft = props => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    e.preventDefault()
    setKeyword(e.target.value)
  }

  function onPressEnter(e) {
    e.target.blur()
  }

  function onSubmit() {
    navigate(`/home?page=1&keyword=${keyword}`)
    setKeyword('')
  }

  function clickSearch(e) {
    e.stopPropagation()
  }

  const menuItems = [
    ...navList.map(nav => ({
      key: nav.link,
      label: (
        <Link to={nav.link}>
          {nav.icon}
          <span className='nav-text'>{nav.title}</span>
        </Link>
      )
    })),
    {
      key: 'search',
      label: (
        <>
          <SearchOutlined />
          <Input
            className='search-input'
            onClick={clickSearch}
            value={keyword}
            onChange={handleChange}
            onPressEnter={onPressEnter}
            onBlur={onSubmit}
          />
        </>
      )
    }
  ]

  return (
    <div className='header-left'>
      <SvgIcon type='iconblog' style={{ color: '#055796', width: 16, height: 16, transform: 'translateY(-2px)' }} />
      <span className='blog-name' onClick={e => history.push('/home')} >{HEADER_BLOG_NAME}</span>
      <Dropdown
        overlayClassName='header-dropdown'
        trigger={['click']}
        menu={{ items: menuItems }}
        getPopupContainer={() => document.querySelector('.app-header .header-left')}>
        <MenuOutlined className='header-dropdown-icon' />
      </Dropdown>
    </div>
  )
}

export default HeaderLeft
