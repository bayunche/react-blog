import React from 'react'
import '@/styles/app.less'
import { Layout, Row, Col, BackTop } from 'antd'
// import ReactLive2d from 'react-live2d'
import { loadOml2d } from 'oh-my-live2d'
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
    console.log(reg.test(url))

    if (reg.test(url)) {
      setCanRender(true)
      const oml2d = loadOml2d({
        dockedPosition: 'right',
        models: [
          {
            path: 'https://model.oml2d.com/shizuku_48/index.json',
            position: [100, 100],
            scale: 0.1,
            stageStyle: {
              height: 300,
              width: 300,
            },
          },
          {
            path: 'https://model.oml2d.com/HK416-1-normal/model.json',
            position: [10, 110],
            scale: 0.06,
            stageStyle: {
              height: 400,
              width: 300,
            },
          },
          {
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.1/Resources/miku/miku.model.json',
            position: [10, 110],
            scale: 0.2,
            stageStyle: {
              height: 400,
              width: 300,
            },
          },
        ],
      })
    } else {
      setCanRender(false)
    }

    if (document.getElementById('oml2d-stage') && canRender) {
      document.getElementById('oml2d-stage').remove()
    }
  }, [url])
  // 引入live2d模型

  return canRender && <></>
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
    </Layout>
  )
}

export default WebLayout
