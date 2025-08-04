import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useUserStore } from '@/stores'

// 布局组件
import WebLayout from '@/layout/web'
import AdminLayout from '@/layout/admin'
import WelcomeLayout from '@/layout/welcome'

// 路由保护组件
const ProtectedRoute = ({ children }) => {
  const role = useUserStore(state => state.role)
  
  if (role !== 1) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// 懒加载组件
const HomePage = React.lazy(() => import('@/views/web/home'))
const ArticlePage = React.lazy(() => import('@/views/web/article'))
const ArchivesPage = React.lazy(() => import('@/views/web/archives'))
const CategoriesPage = React.lazy(() => import('@/views/web/categories'))
const AboutPage = React.lazy(() => import('@/views/web/about'))
const FragmentsPage = React.lazy(() => import('@/views/web/fragments'))
const TagPage = React.lazy(() => import('@/views/web/tag'))

// 管理页面
const AdminHome = React.lazy(() => import('@/views/admin/home'))
const ArticleManager = React.lazy(() => import('@/views/admin/article/manager'))
const ArticleEditor = React.lazy(() => import('@/views/admin/article/edit'))
const UserManager = React.lazy(() => import('@/views/admin/user'))
const FragmentManager = React.lazy(() => import('@/views/admin/fragment/manager'))
const FragmentEditor = React.lazy(() => import('@/views/admin/fragment/edit'))
const Monitor = React.lazy(() => import('@/views/admin/monitor'))

// 其他页面
const WelcomePage = React.lazy(() => import('@/layout/welcome'))
const GithubLogining = React.lazy(() => import('@/components/GithubLogining'))
const NotFoundPage = React.lazy(() => import('@/components/404'))

// 加载组件
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" tip="加载中...">
      <div style={{ minHeight: '200px' }} />
    </Spin>
  </div>
)

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* 欢迎页 */}
        <Route path="/welcome" element={<WelcomePage />} />

        {/* 主站点 */}
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="article/:id" element={<ArticlePage />} />
          <Route path="article/share/:uuid" element={<ArticlePage />} />
          <Route path="archives" element={<ArchivesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:name" element={<TagPage />} />
          <Route path="tags/:name" element={<TagPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="fragments" element={<FragmentsPage />} />
          <Route path="github" element={<GithubLogining />} />
        </Route>

        {/* 管理后台 */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="article/manager" element={<ArticleManager />} />
          <Route path="article/add" element={<ArticleEditor />} />
          <Route path="article/edit/:id" element={<ArticleEditor />} />
          <Route path="fragment/manager" element={<FragmentManager />} />
          <Route path="fragment/add" element={<FragmentEditor />} />
          <Route path="fragment/edit/:id" element={<FragmentEditor />} />
          <Route path="user" element={<UserManager />} />
          <Route path="monitor" element={<Monitor />} />
        </Route>

        {/* 404 页面 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter