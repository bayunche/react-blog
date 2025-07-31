import React from 'react'
import DOMPurify from 'dompurify'

/**
 * 安全的HTML渲染组件，防止XSS攻击
 * @param {Object} props - 组件属性
 * @param {string} props.content - 要渲染的HTML内容
 * @param {string} props.className - CSS类名
 * @param {Function} props.onClick - 点击事件处理函数
 * @param {Object} props.sanitizeOptions - DOMPurify配置选项
 * @returns {JSX.Element} 安全的HTML元素
 */
const SafeHTML = ({ 
  content, 
  className, 
  onClick, 
  sanitizeOptions = {},
  ...props 
}) => {
  // 默认的DOMPurify配置，只允许安全的标签和属性
  const defaultOptions = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 
      'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'span', 'div', 'table', 'tr', 'td', 'th', 'thead', 'tbody'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'id', 'title', 'target',
      'width', 'height', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  }

  // 合并用户配置和默认配置
  const options = { ...defaultOptions, ...sanitizeOptions }

  // 净化HTML内容
  const sanitizedContent = DOMPurify.sanitize(content || '', options)

  return (
    <div 
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      {...props}
    />
  )
}

export default SafeHTML