import React, { forwardRef } from 'react'
import classNames from 'classnames'
import './MoeButton.less'

/**
 * 萌系按钮组件
 * @param {Object} props - 组件属性
 * @param {string} props.variant - 按钮变体: 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} props.size - 按钮尺寸: 'small' | 'medium' | 'large'
 * @param {boolean} props.loading - 加载状态
 * @param {boolean} props.disabled - 禁用状态
 * @param {string} props.shape - 按钮形状: 'round' | 'circle'
 * @param {React.ReactNode} props.icon - 图标
 * @param {React.ReactNode} props.children - 按钮内容
 * @param {Function} props.onClick - 点击事件
 * @param {string} props.className - 额外CSS类名
 */
const MoeButton = forwardRef(({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  shape = 'round',
  icon,
  children,
  onClick,
  className,
  ...props
}, ref) => {
  const buttonClasses = classNames(
    'moe-button',
    `moe-button--${variant}`,
    `moe-button--${size}`,
    `moe-button--${shape}`,
    {
      'moe-button--loading': loading,
      'moe-button--disabled': disabled,
      'moe-button--icon-only': !children && icon,
    },
    className
  )

  const handleClick = (e) => {
    if (loading || disabled) return
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="moe-button__loading">
          <svg className="moe-button__spinner" viewBox="0 0 24 24">
            <circle
              className="moe-button__spinner-path"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
      
      {icon && !loading && (
        <span className="moe-button__icon">
          {icon}
        </span>
      )}
      
      {children && (
        <span className="moe-button__content">
          {children}
        </span>
      )}
      
      {/* 按钮光效 */}
      <span className="moe-button__shine" />
    </button>
  )
})

MoeButton.displayName = 'MoeButton'

export default MoeButton