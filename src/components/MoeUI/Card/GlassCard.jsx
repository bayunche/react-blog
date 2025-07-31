import React, { forwardRef } from 'react'
import classNames from 'classnames'
import './GlassCard.less'

/**
 * 毛玻璃卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.variant - 卡片变体: 'default' | 'elevated' | 'outlined' | 'filled'
 * @param {boolean} props.hoverable - 是否启用悬浮效果
 * @param {boolean} props.clickable - 是否可点击
 * @param {string} props.blur - 模糊程度: 'light' | 'medium' | 'heavy'
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {Function} props.onClick - 点击事件
 * @param {string} props.className - 额外CSS类名
 */
const GlassCard = forwardRef(({
  variant = 'default',
  hoverable = true,
  clickable = false,
  blur = 'medium',
  children,
  onClick,
  className,
  style,
  ...props
}, ref) => {
  const cardClasses = classNames(
    'glass-card',
    `glass-card--${variant}`,
    `glass-card--blur-${blur}`,
    {
      'glass-card--hoverable': hoverable,
      'glass-card--clickable': clickable,
    },
    className
  )

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e)
    }
  }

  const handleKeyDown = (e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.(e)
    }
  }

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      style={style}
      {...props}
    >
      {/* 顶部光线效果 */}
      <div className="glass-card__highlight" />
      
      {/* 内容区域 */}
      <div className="glass-card__content">
        {children}
      </div>
      
      {/* 悬浮时的光晕效果 */}
      {hoverable && <div className="glass-card__glow" />}
    </div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard