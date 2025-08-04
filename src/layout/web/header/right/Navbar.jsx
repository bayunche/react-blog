import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'

import navList from './navList'

function NavBar(props) {
  const location = useLocation()
  const { mode = 'horizontal' } = props
  const menuItems = navList.map(nav => ({
    key: nav.link,
    label: (
      <Link to={nav.link}>
        {nav.icon}
        <span className='nav-text'>{nav.title}</span>
      </Link>
    )
  }))

  return (
    <Menu 
      mode={mode} 
      selectedKeys={[location.pathname]} 
      className='header-nav'
      items={menuItems}
    />
  )
}

export default NavBar
