import React from 'react'
import '@/styles/app.less'
import { Layout, Row, Col, BackTop } from 'antd'
import ReactLive2d from 'react-live2d'

import Header from './header'
import SideBar from './sidebar'
import AppMain from './AppMain'
import ReactCanvasNest from 'react-canvas-nest'
import Player from 'components/musicPlayer/Player'
// 响应式
const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 }
const contentLayout = { xxl: 20, xl: 19, lg: 19, sm: 24, xs: 24 }

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
      {!window.innerWidth < 900 && (
        <ReactLive2d
          width={300}
          height={500}
          ModelList={['miku', 'Hiyori', 'Rice']}
          TouchBody={['啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊你要干嘛', '哼', '坏人']}
        />
      )}

      <Player />
      <Beian></Beian>
    </Layout>
  )
}

export default WebLayout
