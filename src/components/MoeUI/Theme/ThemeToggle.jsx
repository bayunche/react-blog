import React, { useState } from 'react'
import { useThemeStore, THEMES } from '@/stores/themeStore'
import { SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import './ThemeToggle.less'

/**
 * 主题切换组件
 * @param {Object} props - 组件属性
 * @param {string} props.variant - 显示变体: 'button' | 'switch' | 'dropdown'
 * @param {string} props.size - 组件尺寸: 'small' | 'medium' | 'large'
 * @param {boolean} props.showLabel - 是否显示标签
 * @param {string} props.className - 额外CSS类名
 */
const ThemeToggle = ({
  variant = 'button',
  size = 'medium',
  showLabel = false,
  className,
  ...props
}) => {
  const { theme, actualTheme, setTheme, isTransitioning } = useThemeStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const themeOptions = [
    {
      key: THEMES.LIGHT,
      label: '亮色模式',
      icon: <SunOutlined />,
      description: '经典的亮色主题'
    },
    {
      key: THEMES.DARK,
      label: '暗色模式',
      icon: <MoonOutlined />,
      description: '护眼的暗色主题'
    },
    {
      key: THEMES.AUTO,
      label: '跟随系统',
      icon: <DesktopOutlined />,
      description: '自动跟随系统设置'
    }
  ]

  const currentTheme = themeOptions.find(option => option.key === theme)
  const currentIcon = currentTheme?.icon

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setDropdownOpen(false)
  }

  const toggleTheme = () => {
    const nextTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    setTheme(nextTheme)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const componentClasses = classNames(
    'theme-toggle',
    `theme-toggle--${variant}`,
    `theme-toggle--${size}`,
    {
      'theme-toggle--transitioning': isTransitioning,
      'theme-toggle--dropdown-open': dropdownOpen,
    },
    className
  )

  // 按钮变体
  if (variant === 'button') {
    return (
      <button
        className={componentClasses}
        onClick={toggleTheme}
        title={`切换到${theme === THEMES.LIGHT ? '暗色' : '亮色'}模式`}
        {...props}
      >
        <span className="theme-toggle__icon">
          {currentIcon}
        </span>
        {showLabel && (
          <span className="theme-toggle__label">
            {currentTheme?.label}
          </span>
        )}
        
        {/* 切换动画效果 */}
        <span className="theme-toggle__ripple" />
      </button>
    )
  }

  // 开关变体
  if (variant === 'switch') {
    return (
      <div className={componentClasses}>
        {showLabel && (
          <span className="theme-toggle__label">
            主题模式
          </span>
        )}
        <div
          className="theme-toggle__switch"
          onClick={toggleTheme}
          role="switch"
          aria-checked={actualTheme === THEMES.DARK}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleTheme()
            }
          }}
        >
          <div className="theme-toggle__switch-track">
            <div className="theme-toggle__switch-thumb">
              <span className="theme-toggle__switch-icon">
                {actualTheme === THEMES.DARK ? <MoonOutlined /> : <SunOutlined />}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 下拉菜单变体
  if (variant === 'dropdown') {
    return (
      <div className={componentClasses}>
        <button
          className="theme-toggle__trigger"
          onClick={toggleDropdown}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <span className="theme-toggle__icon">
            {currentIcon}
          </span>
          {showLabel && (
            <span className="theme-toggle__label">
              {currentTheme?.label}
            </span>
          )}
          <span className="theme-toggle__arrow" />
        </button>
        
        {dropdownOpen && (
          <>
            <div 
              className="theme-toggle__backdrop"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="theme-toggle__dropdown">
              {themeOptions.map((option) => (
                <button
                  key={option.key}
                  className={classNames('theme-toggle__option', {
                    'theme-toggle__option--active': theme === option.key
                  })}
                  onClick={() => handleThemeChange(option.key)}
                >
                  <span className="theme-toggle__option-icon">
                    {option.icon}
                  </span>
                  <div className="theme-toggle__option-content">
                    <span className="theme-toggle__option-label">
                      {option.label}
                    </span>
                    <span className="theme-toggle__option-description">
                      {option.description}
                    </span>
                  </div>
                  {theme === option.key && (
                    <span className="theme-toggle__option-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}

export default ThemeToggle