import React, { useState, useEffect } from 'react'
import { Spin, Alert } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const asyncComponent = importComponent => {
  return function AsyncComponent(props) {
    const [component, setComponent] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
      let isMounted = true

      const loadComponent = async () => {
        try {
          const { default: loadedComponent } = await importComponent()
          if (isMounted) {
            setComponent(() => loadedComponent)
          }
        } catch (err) {
          if (isMounted) {
            setError(err)
          }
        }
      }

      loadComponent()

      return () => {
        isMounted = false
      }
    }, [importComponent])

    if (error) {
      return <Alert message='Error' description={`Error loading component: ${error.message}`} type='error' showIcon />
    }

    if (!component) {
      return <Spin indicator={antIcon} className='async-com-loading' />
    }
    return component ? (
      React.createElement(component, props)
    ) : (
      <Spin indicator={antIcon} className='async-com-loading' />
    )
  }
}

export default asyncComponent
