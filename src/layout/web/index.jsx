import React from 'react'
import '@/styles/app.less'
import { Layout, Row, Col, BackTop } from 'antd'
import ReactLive2d from 'react-live2d'

import Header from './header'
import SideBar from './sidebar'
import AppMain from './AppMain'
import ReactCanvasNest from 'react-canvas-nest'
import Player from 'components/musicPlayer/Player'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
// 响应式
const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 }
const contentLayout = { xxl: 20, xl: 19, lg: 19, sm: 24, xs: 24 }

const Live2d = () => {
  const [canRender, setCanRender] = React.useState(false)
  const reg = /home/
  const url = useLocation().pathname
  React.useEffect(() => {
    // console.log(url)
    // 判断是否为首页
    if (window.innerWidth > 900) {
      if (reg.test(url)) {
        setCanRender(true)
      } else {
        setCanRender(false)
      }
    } else {
      setCanRender(false)
    }
  }, [url])
  // 引入live2d模型
  return canRender && <ReactLive2d width={300} height={500} />
}

const Beian = () => {
  return (
    <div className='beian'>
      <a href='https://beian.miit.gov.cn/' target='_blank' rel='noopener noreferrer'>
        粤ICP备2024248632号
      </a>
    </div>
  )
}

const WebLayout = props => {
  return (
    <Layout className='app-container'>
      <ReactCanvasNest className='canvasNest' config={{ pointColor: '255,255,255' }} style={{ zIndex: 1 }} />
      <Header />
      <Row className='app-wrapper'>
        <Col {...siderLayout}>
          <SideBar />
        </Col>
        <Col {...contentLayout}>
          <AppMain {...props} />
        </Col>
      </Row>

      <BackTop style={{ zIndex: 100000 }} target={() => document.querySelector('.app-main')} />
      <Live2d></Live2d>
      <Player />
      <Beian></Beian>
    </Layout>
  )
}

export default WebLayout
