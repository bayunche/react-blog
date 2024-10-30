import React from 'react'
import { Alert } from 'antd'
import { ANNOUNCEMENT } from '@/config'
import { useMediaQuery } from 'react-responsive'

function AppMain(props) {
  const iphoneScreen = useMediaQuery({
    query: '(max-width: 576px)',
  })

  const ipadScreen = useMediaQuery({
    query: '(min-width: 576px) and (max-width: 992px)',
  })
  const Beian = () => {
    return (
      <div className='beian'>
        <a href='https://beian.miit.gov.cn/' target='_blank' rel='noopener noreferrer'>
          粤ICP备2024248632号
        </a>
      </div>
    )
  }
  return (
    <div className='app-main'>
      {(ipadScreen || iphoneScreen) && ANNOUNCEMENT.enable && (
        <Alert
          message={ANNOUNCEMENT.content}
          type='info'
          style={{ marginTop: iphoneScreen ? 20 : 0, marginBottom: ipadScreen ? 20 : 0 }}
        />
      )}
      {props.children}
      <Beian></Beian>
    </div>
  )
}

export default AppMain
