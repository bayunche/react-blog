import React, { useEffect, useState } from 'react'
import { loadOml2d } from 'oh-my-live2d'
import { useLocation } from 'react-router-dom'
import './index.less'

const ModernLive2D = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [oml2dInstance, setOml2dInstance] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // 只在首页显示Live2D
    const shouldShow = location.pathname.includes('/home') || location.pathname === '/'
    
    if (shouldShow && !oml2dInstance) {
      setIsVisible(true)
      
      const instance = loadOml2d({
        dockedPosition: 'right',
        primaryColor: '#ff69b4',
        sayHello: true,
        tips: {
          idleTips: {
            interval: 15000,
            message: [
              '欢迎来到我的博客~',
              '今天天气真不错呢~',
              '要不要看看我的文章？',
              '记得给我点个赞哦~',
            ]
          },
          copy: '复制成功啦~',
          visibilitychange: '欢迎回来~'
        },
        models: [
          {
            name: '萌萌哒看板娘',
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/bilibili-22/index.json',
            position: [0, 60],
            scale: 0.15,
            stageStyle: {
              height: 350,
              width: 280,
            },
          },
          {
            name: '可爱小姐姐',
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/kobayaxi/model.json',
            position: [0, 80],
            scale: 0.15,
            stageStyle: {
              height: 350,
              width: 280,
            },
          },
          {
            name: '水之女神',
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/aqua/1014100aqua.model3.json',
            position: [0, 80],
            scale: 0.08,
            stageStyle: {
              height: 350,
              width: 280,
            },
          },
        ],
        statusBar: {
          loadingIcon: 'icon-loading',
          loadingMessage: '看板娘正在加载中...',
          switchingMessage: '正在切换模型...',
          mobileMessage: '移动端暂不支持看板娘功能'
        },
        menus: {
          disable: false,
          items: [
            {
              id: 'switch-model',
              icon: 'icon-switch',
              title: '切换模型',
              onClick: (oml2d) => {
                oml2d.switchModel()
              }
            },
            {
              id: 'switch-texture', 
              icon: 'icon-texture',
              title: '切换服装',
              onClick: (oml2d) => {
                oml2d.switchTexture()
              }
            }
          ]
        }
      })
      
      setOml2dInstance(instance)
    } else if (!shouldShow && oml2dInstance) {
      // 页面切换时清理Live2D
      setIsVisible(false)
      const stage = document.getElementById('oml2d-stage')
      if (stage) {
        stage.remove()
      }
      setOml2dInstance(null)
    }

    return () => {
      // 组件卸载时清理
      if (oml2dInstance) {
        const stage = document.getElementById('oml2d-stage')
        if (stage) {
          stage.remove()
        }
      }
    }
  }, [location.pathname, oml2dInstance])

  return isVisible ? (
    <div className="modern-live2d-container">
      {/* Live2D会自动挂载到这里 */}
    </div>
  ) : null
}

export default ModernLive2D