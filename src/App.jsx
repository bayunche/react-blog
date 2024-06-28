import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
// config
import routes from '@/routes'

// components
import PublicComponent from '@/components/Public'

const App = props => {
  const role = useSelector(state => state.user.role) // 相当于 connect(state => state.user.role)(App)

  document.addEventListener('visibilitychange', function () {
    const normal_title = '八云澈的blog'
    if (document.visibilityState === 'hidden') {
      document.title = '(。_。) 别走好吗... (。_。)'
    } else document.title = normal_title
  })

  // 解构 route
  // 渲染路由
  function renderRoutes(routes, contextPath) {
    // 创建一个空数组，用于存放路由
    const children = []
    // 定义一个函数，用于渲染路由
    const renderRoute = (item, routeContextPath) => {
      // 创建一个新的路径，如果存在路径，则添加到新的路径中
      let newContextPath = item.path ? `${routeContextPath}/${item.path}` : routeContextPath
      // 将路径中的多个斜杠替换为一个斜杠
      newContextPath = newContextPath.replace(/\/+/g, '/')
      // 如果路径中包含admin，且角色不是1，则返回一个重定向到/的路由
      if (newContextPath.includes('admin') && role !== 1) {
        item = {
          ...item,
          component: () => <Redirect to='/' />,
          children: [],
        }
      }
      // 如果组件不存在，则返回
      if (!item.component) return

      // 如果存在子路由，则递归渲染子路由
      if (item.childRoutes) {
        // 渲染子路由
        const childRoutes = renderRoutes(item.childRoutes, newContextPath)
        // 将渲染好的子路由添加到路由中
        children.push(
          <Route
            key={newContextPath}
            render={props => <item.component {...props}>{childRoutes}</item.component>}
            path={newContextPath}
          />
        )
        // 递归渲染子路由
        item.childRoutes.forEach(r => renderRoute(r, newContextPath))
      } else {
        // 将路由添加到路由中
        children.push(<Route key={newContextPath} component={item.component} path={newContextPath} exact />)
      }
    }

    // 渲染路由
    routes.forEach(item => renderRoute(item, contextPath))
    // 返回路由
    return <Switch>{children}</Switch>
  }
  const children = renderRoutes(routes, '/')

  return (
    <BrowserRouter>
      {children}
      <PublicComponent />
    </BrowserRouter>
  )
}

export default App
