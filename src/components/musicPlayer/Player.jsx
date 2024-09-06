import { Col } from 'antd'
import './player.min.css'
import React, { useRef, useEffect } from 'react'
const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 }

const Player = () => {
  return (
    <meting-js
      server='netease'
      type='playlist'
      id='12243826930'
      fixed='true'
      autoplay='true'
      loop='all'
      order='random'
      preload='auto'
      list-folded='ture'
      lrc-type='3'
      mutex='true'></meting-js>
  )
}

export default Player
