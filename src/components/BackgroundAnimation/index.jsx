import React, { useEffect, useRef, useState, useCallback } from 'react'
import { backgroundConfig } from './config'
import './index.less'

/**
 * 现代背景动画组件
 * 包含粒子动画和背景图片轮播功能
 */
const BackgroundAnimation = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // 从配置文件获取背景图片
  const backgroundImages = backgroundConfig.images
  const hasBackgroundImages = backgroundImages.length > 0

  // 萌系粒子类
  class MoeParticle {
    constructor(canvas) {
      this.canvas = canvas
      this.reset()
      this.y = Math.random() * canvas.height
      this.fadeDelay = Math.random() * 600 + 100
      this.fadeStart = Date.now() + this.fadeDelay
      this.fadingOut = false
    }

    reset() {
      this.x = Math.random() * this.canvas.width
      this.y = -20
      this.speed = Math.random() * backgroundConfig.particles.speed + 0.3
      this.opacity = 0
      this.fadeDelay = Math.random() * 600 + 100
      this.fadeStart = Date.now() + this.fadeDelay
      this.fadingOut = false
      
      // 萌系属性
      this.color = backgroundConfig.particles.colors[Math.floor(Math.random() * backgroundConfig.particles.colors.length)]
      this.shape = backgroundConfig.particles.shapes[Math.floor(Math.random() * backgroundConfig.particles.shapes.length)]
      this.size = Math.random() * 2 + backgroundConfig.particles.size
      this.rotation = 0
      this.rotationSpeed = (Math.random() - 0.5) * 0.02
      this.drift = (Math.random() - 0.5) * 0.5
    }

    update() {
      const now = Date.now()
      
      if (now > this.fadeStart && this.opacity < 1 && !this.fadingOut) {
        this.opacity += 0.01
      } else if (this.opacity > 1) {
        this.opacity = 1
      }

      this.y += this.speed
      this.x += this.drift
      this.rotation += this.rotationSpeed

      if (this.y > this.canvas.height + 20) {
        this.reset()
      }
    }

    draw(ctx) {
      if (this.opacity > 0) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.shadowBlur = backgroundConfig.particles.shadowBlur
        ctx.shadowColor = this.color
        
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        switch(this.shape) {
          case 'heart':
            this.drawHeart(ctx)
            break
          case 'star':
            this.drawStar(ctx)
            break
          default:
            this.drawCircle(ctx)
        }
        
        ctx.restore()
      }
    }
    
    drawCircle(ctx) {
      ctx.beginPath()
      ctx.arc(0, 0, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    drawHeart(ctx) {
      const size = this.size
      ctx.beginPath()
      ctx.moveTo(0, size / 4)
      ctx.bezierCurveTo(-size, -size / 2, -size, -size, 0, -size / 4)
      ctx.bezierCurveTo(size, -size, size, -size / 2, 0, size / 4)
      ctx.fill()
    }
    
    drawStar(ctx) {
      const size = this.size
      const spikes = 5
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? size : size / 2
        const angle = (i * Math.PI) / spikes
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
    }
  }

  // 初始化粒子
  const initParticles = useCallback((canvas) => {
    const particles = []
    const particleCount = Math.min(
      backgroundConfig.particles.count, 
      Math.floor((canvas.width * canvas.height) / 15000)
    )
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new MoeParticle(canvas))
    }
    
    return particles
  }, [])

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 更新和绘制粒子
    particlesRef.current.forEach(particle => {
      particle.update()
      particle.draw(ctx)
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // 调整画布尺寸
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 重新初始化粒子
    particlesRef.current = initParticles(canvas)
  }, [initParticles])

  // 切换背景图片
  const switchBackground = useCallback(() => {
    if (!isPaused && hasBackgroundImages) {
      setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length)
    }
  }, [backgroundImages.length, isPaused, hasBackgroundImages])

  // 暂停/恢复切换
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  // 页面可见性检测
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden)
  }, [])

  useEffect(() => {
    resizeCanvas()
    
    // 启动动画
    if (isVisible) {
      animate()
    }

    // 事件监听
    window.addEventListener('resize', resizeCanvas)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 背景图片切换定时器（仅在有背景图片时启用）
    let bgTimer
    if (hasBackgroundImages) {
      bgTimer = setInterval(switchBackground, backgroundConfig.switchInterval)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (bgTimer) {
        clearInterval(bgTimer)
      }
    }
  }, [resizeCanvas, animate, isVisible, handleVisibilityChange, switchBackground, hasBackgroundImages])

  // 当页面不可见时停止动画
  useEffect(() => {
    if (isVisible) {
      animate()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible, animate])

  return (
    <div className="background-animation">
      {/* 背景图片层 - 仅在有图片时显示 */}
      {hasBackgroundImages && (
        <>
          <div className="background-images">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`background-image ${index === currentBgIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
          
          {/* 遮罩层 */}
          <div className="background-overlay" />
        </>
      )}
      
      {/* 粒子动画画布 */}
      <canvas
        ref={canvasRef}
        className="particles-canvas"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      
      {/* 控制按钮 - 仅在有背景图片时显示 */}
      {hasBackgroundImages && (
        <div className="bg-controls">
          <button 
            className="bg-control-btn"
            onClick={switchBackground}
            title="切换背景"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z"/>
            </svg>
          </button>
          
          <button 
            className={`bg-control-btn ${isPaused ? 'paused' : ''}`}
            onClick={togglePause}
            title={isPaused ? "恢复自动切换" : "暂停自动切换"}
          >
            {isPaused ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default BackgroundAnimation