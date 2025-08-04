import React from 'react'
import PropTypes from 'prop-types'

// iconfont svg
const SvgIcon = ({ type, className = '', style }) => {
  return (
    <svg className={`svg-icon ${className}`} aria-hidden='true' style={style}>
      <use xlinkHref={`#${type}`} />
    </svg>
  )
}

SvgIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
}

export default SvgIcon
