import React, { Suspense, memo } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

/**
 * 懒加载组件包装器
 * 提供统一的加载状态和错误边界处理
 */

// 默认加载组件
const DefaultLoader = ({ size = 'default', tip = '加载中...', className = '' }) => (
  <div className={`lazy-loader ${className}`}>
    <Spin 
      size={size}
      tip={tip}
      indicator={<LoadingOutlined spin />}
    />
  </div>
);

// 极简加载组件（用于小组件）
const MinimalLoader = ({ className = '' }) => (
  <div className={`lazy-loader minimal ${className}`}>
    <div className="spinner" />
  </div>
);

// 骨架屏加载组件
const SkeletonLoader = ({ rows = 3, className = '' }) => (
  <div className={`lazy-loader skeleton ${className}`}>
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="skeleton-row">
        <div className="skeleton-line" style={{ width: `${90 - index * 10}%` }} />
      </div>
    ))}
  </div>
);

// 卡片骨架屏
const CardSkeletonLoader = ({ className = '' }) => (
  <div className={`lazy-loader card-skeleton ${className}`}>
    <div className="skeleton-header">
      <div className="skeleton-avatar" />
      <div className="skeleton-title" />
    </div>
    <div className="skeleton-content">
      <div className="skeleton-line" style={{ width: '100%' }} />
      <div className="skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton-line" style={{ width: '60%' }} />
    </div>
  </div>
);

// 表格骨架屏
const TableSkeletonLoader = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`lazy-loader table-skeleton ${className}`}>
    <div className="skeleton-table-header">
      {Array.from({ length: columns }, (_, index) => (
        <div key={index} className="skeleton-table-cell header" />
      ))}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <div key={colIndex} className="skeleton-table-cell" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * 懒加载高阶组件
 * @param {React.ComponentType} Component - 要懒加载的组件
 * @param {Object} options - 配置选项
 * @returns {React.ComponentType} 包装后的组件
 */
export const withLazyLoad = (Component, options = {}) => {
  const {
    loader = 'default',
    loaderProps = {},
    displayName,
    errorBoundary = true,
  } = options;

  // 选择加载组件
  const getLoader = () => {
    switch (loader) {
      case 'minimal':
        return <MinimalLoader {...loaderProps} />;
      case 'skeleton':
        return <SkeletonLoader {...loaderProps} />;
      case 'card':
        return <CardSkeletonLoader {...loaderProps} />;
      case 'table':
        return <TableSkeletonLoader {...loaderProps} />;
      case 'custom':
        return loaderProps.component || <DefaultLoader {...loaderProps} />;
      default:
        return <DefaultLoader {...loaderProps} />;
    }
  };

  const LazyComponent = memo((props) => (
    <Suspense fallback={getLoader()}>
      {errorBoundary ? (
        <ErrorBoundary>
          <Component {...props} />
        </ErrorBoundary>
      ) : (
        <Component {...props} />
      )}
    </Suspense>
  ));

  LazyComponent.displayName = displayName || `LazyLoad(${Component.displayName || Component.name})`;

  return LazyComponent;
};

/**
 * 错误边界组件
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LazyLoad Error:', error, errorInfo);
    
    // 这里可以集成错误报告服务
    if (typeof window !== 'undefined' && window.__ERROR_REPORTER__) {
      window.__ERROR_REPORTER__(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="lazy-loader error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <div className="error-title">组件加载失败</div>
            <div className="error-message">
              {this.state.error?.message || '未知错误'}
            </div>
            <button 
              className="error-retry"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 创建懒加载组件的工厂函数
 * @param {Function} importFn - 动态导入函数
 * @param {Object} options - 配置选项
 * @returns {React.ComponentType} 懒加载组件
 */
export const createLazyComponent = (importFn, options = {}) => {
  const LazyComponent = React.lazy(() => {
    // 添加最小加载时间，避免闪烁
    const minLoadTime = options.minLoadTime || 200;
    
    return Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, minLoadTime))
    ]).then(([moduleExports]) => moduleExports);
  });

  return withLazyLoad(LazyComponent, options);
};

/**
 * 图片懒加载组件
 */
export const LazyImage = memo(({ 
  src, 
  alt, 
  placeholder, 
  className = '',
  onLoad,
  onError,
  ...props 
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          
          img.onload = () => {
            setLoaded(true);
            onLoad?.();
          };
          
          img.onerror = () => {
            setError(true);
            onError?.();
          };
          
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, onLoad, onError]);

  return (
    <div ref={imgRef} className={`lazy-image ${className}`} {...props}>
      {!loaded && !error && (
        <div className="lazy-image-placeholder">
          {placeholder || <div className="lazy-image-spinner" />}
        </div>
      )}
      {loaded && (
        <img 
          src={src} 
          alt={alt}
          className="lazy-image-content"
          onLoad={() => setLoaded(true)}
        />
      )}
      {error && (
        <div className="lazy-image-error">
          <div className="error-icon">📷</div>
          <div className="error-text">图片加载失败</div>
        </div>
      )}
    </div>
  );
});

/**
 * Live2D懒加载组件
 */
export const LazyLive2D = createLazyComponent(
  () => import('@/components/Live2D'),
  {
    loader: 'minimal',
    loaderProps: { 
      className: 'live2d-loader',
      tip: 'Live2D 模型加载中...' 
    },
    minLoadTime: 1000, // Live2D需要更长的加载时间
    displayName: 'LazyLive2D'
  }
);

/**
 * 预加载工具函数
 */
export const preloadComponent = (importFn) => {
  if (typeof importFn === 'function') {
    // 在空闲时间预加载
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFn().catch(() => {
          // 预加载失败时静默处理
        });
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        importFn().catch(() => {});
      }, 100);
    }
  }
};

/**
 * 批量预加载
 */
export const preloadComponents = (importFns) => {
  importFns.forEach((importFn, index) => {
    setTimeout(() => {
      preloadComponent(importFn);
    }, index * 100); // 分批加载，避免阻塞
  });
};

// 默认导出
export default {
  withLazyLoad,
  createLazyComponent,
  LazyImage,
  LazyLive2D,
  preloadComponent,
  preloadComponents,
};