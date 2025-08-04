import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { decodeQuery } from '@/utils'
import { useUserStore } from '@/stores'
import { get, remove } from '@/utils/storage'

function AppLoading(props) {
  const loginAsync = useUserStore(state => state.loginAsync)

  const [loading, setLoading] = useState('')

  function jumpToBefore() {
    const url = get('prevRouter') || '/'
    if (url.includes('?code=')) {
      props.history.push('/')
    } else {
      props.history.push(url)
    }
  }

  // github 加载中状态 方案1
  useEffect(() => {
    let componentWillUnmount = false
    // component did mount
    const params = decodeQuery(props.location.search)
    if (params.code) {
      // github callback code
      setLoading(true)
      loginAsync({ code: params.code })
        .then(() => {
          jumpToBefore()
          if (componentWillUnmount) return
          setLoading(false)
        })
        .catch(e => {
          console.log(e)
          jumpToBefore()
          if (componentWillUnmount) return
          setLoading(false)
        })
    }

    return () => {
      componentWillUnmount = true
    }
  }, [])

  return (
    <div className='github-loading-container'>
      <div>
        <img
          src='https://github.githubassets.com/images/spinners/octocat-spinner-64.gif'
          alt='loading'
          className='github-loading-img'
        />
      </div>
      <div className='text'>Loading activity...</div>
    </div>
  )
}

export default AppLoading
