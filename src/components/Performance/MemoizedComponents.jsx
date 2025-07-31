import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { List, Card, Avatar, Tag, Button, Empty } from 'antd';
import { EyeOutlined, LikeOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useVirtualList } from '@/hooks/useVirtualList';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { throttle, debounce } from '@/utils/performance';
import './MemoizedComponents.less';

/**
 * 高性能文章卡片组件
 * 使用 memo 优化渲染性能
 */
export const ArticleCard = memo(({ 
  article, 
  onView, 
  onLike, 
  onComment, 
  onShare,
  showActions = true,
  compact = false 
}) => {
  // 使用 useCallback 缓存事件处理函数
  const handleView = useCallback(() => {
    onView?.(article.id);
  }, [article.id, onView]);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    onLike?.(article.id);
  }, [article.id, onLike]);

  const handleComment = useCallback((e) => {
    e.stopPropagation();
    onComment?.(article.id);
  }, [article.id, onComment]);

  const handleShare = useCallback((e) => {
    e.stopPropagation();
    onShare?.(article.id);
  }, [article.id, onShare]);

  // 使用 useMemo 缓存复杂计算
  const formattedDate = useMemo(() => {
    return new Date(article.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [article.createdAt]);

  const summary = useMemo(() => {
    if (!article.content) return '';
    return article.content.length > 150 
      ? article.content.substring(0, 150) + '...'
      : article.content;
  }, [article.content]);

  const actions = useMemo(() => {
    if (!showActions) return [];
    
    return [
      <Button 
        key="view" 
        type="text" 
        icon={<EyeOutlined />} 
        onClick={handleView}
        size={compact ? 'small' : 'middle'}
      >
        {article.viewCount || 0}
      </Button>,
      <Button 
        key="like" 
        type="text" 
        icon={<LikeOutlined />} 
        onClick={handleLike}
        size={compact ? 'small' : 'middle'}
        className={article.isLiked ? 'liked' : ''}
      >
        {article.likeCount || 0}
      </Button>,
      <Button 
        key="comment" 
        type="text" 
        icon={<CommentOutlined />} 
        onClick={handleComment}
        size={compact ? 'small' : 'middle'}
      >
        {article.commentCount || 0}
      </Button>,
      <Button 
        key="share" 
        type="text" 
        icon={<ShareAltOutlined />} 
        onClick={handleShare}
        size={compact ? 'small' : 'middle'}
      />
    ];
  }, [showActions, compact, article, handleView, handleLike, handleComment, handleShare]);

  return (
    <Card
      className={`article-card ${compact ? 'compact' : ''}`}
      hoverable
      actions={actions}
      onClick={handleView}
    >
      <Card.Meta
        avatar={
          <Avatar 
            src={article.author?.avatar} 
            size={compact ? 'small' : 'default'}
          >
            {article.author?.username?.[0]?.toUpperCase()}
          </Avatar>
        }
        title={
          <div className="article-title">
            <span>{article.title}</span>
            {article.category && (
              <Tag color="blue" size="small">
                {article.category.name}
              </Tag>
            )}
          </div>
        }
        description={
          <div className="article-meta">
            <div className="article-summary">{summary}</div>
            <div className="article-info">
              <span className="author">{article.author?.username}</span>
              <span className="date">{formattedDate}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                {article.tags.map(tag => (
                  <Tag key={tag.id} size="small" color={tag.color}>
                    {tag.name}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
});

ArticleCard.displayName = 'ArticleCard';

/**
 * 虚拟化文章列表组件
 * 使用虚拟滚动优化大量数据渲染
 */
export const VirtualizedArticleList = memo(({ 
  articles = [], 
  onView, 
  onLike, 
  onComment, 
  onShare,
  height = 600,
  itemHeight = 200,
  loading = false,
  empty = null
}) => {
  const {
    containerProps,
    wrapperProps,
    innerProps,
    visibleItems,
  } = useVirtualList({
    items: articles,
    itemHeight,
    containerHeight: height,
    overscan: 3,
  });

  const renderItem = useCallback((itemData) => {
    const { item: article, index } = itemData;
    
    return (
      <div 
        key={article.id || index}
        className="virtual-article-item"
        style={{ height: itemHeight }}
      >
        <ArticleCard
          article={article}
          onView={onView}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      </div>
    );
  }, [itemHeight, onView, onLike, onComment, onShare]);

  if (loading) {
    return (
      <div className="virtual-list-loading">
        <List
          itemLayout="vertical"
          dataSource={Array.from({ length: 3 })}
          renderItem={() => (
            <List.Item>
              <Card loading />
            </List.Item>
          )}
        />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="virtual-list-empty">
        {empty || <Empty description="暂无文章" />}
      </div>
    );
  }

  return (
    <div className="virtualized-article-list">
      <div {...containerProps}>
        <div {...wrapperProps}>
          <div {...innerProps}>
            {visibleItems.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedArticleList.displayName = 'VirtualizedArticleList';

/**
 * 懒加载图片组件
 * 使用 Intersection Observer 实现图片懒加载
 */
export const LazyImage = memo(({ 
  src, 
  alt, 
  placeholder, 
  className = '',
  width,
  height,
  onLoad,
  onError,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
  });

  // 加载真实图片
  useEffect(() => {
    if (isVisible && src && !loaded && !error) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [isVisible, src, loaded, error, onLoad, onError]);

  return (
    <div 
      ref={ref}
      className={`lazy-image ${className} ${loaded ? 'loaded' : ''} ${error ? 'error' : ''}`}
      style={{ width, height }}
      {...props}
    >
      {!error && (
        <img
          src={imageSrc}
          alt={alt}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: loaded ? 1 : 0.6
          }}
        />
      )}
      {error && (
        <div className="lazy-image-error">
          <div className="error-icon">📷</div>
          <div className="error-text">图片加载失败</div>
        </div>
      )}
      {!loaded && !error && (
        <div className="lazy-image-loading">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

/**
 * 搜索输入框组件
 * 使用防抖优化搜索性能
 */
export const SearchInput = memo(({ 
  onSearch, 
  placeholder = '搜索文章...', 
  delay = 300,
  className = ''
}) => {
  const [value, setValue] = useState('');
  const searchTimeoutRef = useRef(null);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      onSearch?.(searchValue);
    }, delay),
    [onSearch, delay]
  );

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch?.('');
  }, [onSearch]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`search-input ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input-field"
      />
      {value && (
        <button 
          className="search-input-clear"
          onClick={handleClear}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * 无限滚动列表组件
 * 结合虚拟化和懒加载的高性能列表
 */
export const InfiniteScrollList = memo(({ 
  items = [],
  hasNextPage = false,
  fetchNextPage,
  loading = false,
  itemHeight = 200,
  renderItem,
  emptyText = '暂无数据'
}) => {
  const loaderRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  // 使用 Intersection Observer 监听加载器
  const [, isLoaderVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // 节流的获取下一页函数
  const throttledFetchNextPage = useCallback(
    throttle(async () => {
      if (isFetching || !hasNextPage) return;
      
      setIsFetching(true);
      try {
        await fetchNextPage?.();
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    [fetchNextPage, hasNextPage, isFetching]
  );

  // 监听加载器可见性
  useEffect(() => {
    if (isLoaderVisible && hasNextPage && !loading) {
      throttledFetchNextPage();
    }
  }, [isLoaderVisible, hasNextPage, loading, throttledFetchNextPage]);

  const {
    containerProps,
    wrapperProps,
    innerProps,
    visibleItems,
  } = useVirtualList({
    items,
    itemHeight,
    containerHeight: 600,
    overscan: 5,
  });

  const renderVirtualItem = useCallback((itemData) => {
    const { item, index } = itemData;
    
    return (
      <div
        key={item.id || index}
        className="infinite-scroll-item"
        style={{ height: itemHeight }}
      >
        {renderItem ? renderItem(item, index) : (
          <div className="default-item">
            <h3>{item.title || `Item ${index + 1}`}</h3>
            <p>{item.description || item.content}</p>
          </div>
        )}
      </div>
    );
  }, [itemHeight, renderItem]);

  if (items.length === 0 && !loading) {
    return (
      <div className="infinite-scroll-empty">
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div className="infinite-scroll-list">
      <div {...containerProps}>
        <div {...wrapperProps}>
          <div {...innerProps}>
            {visibleItems.map(renderVirtualItem)}
          </div>
        </div>
      </div>
      
      {/* 加载器 */}
      {hasNextPage && (
        <div 
          ref={(el) => {
            loaderRef.current = el;
            // 这里需要手动设置ref给intersection observer
          }}
          className="infinite-scroll-loader"
        >
          {(loading || isFetching) ? (
            <div className="loading-spinner">加载中...</div>
          ) : (
            <div className="load-more-trigger">滑动加载更多</div>
          )}
        </div>
      )}
    </div>
  );
});

InfiniteScrollList.displayName = 'InfiniteScrollList';

/**
 * 优化的表格行组件
 * 只在必要时重新渲染
 */
export const OptimizedTableRow = memo(({ 
  record, 
  columns, 
  rowIndex,
  onRowClick,
  selected = false,
  ...props 
}) => {
  const handleClick = useCallback(() => {
    onRowClick?.(record, rowIndex);
  }, [record, rowIndex, onRowClick]);

  const cells = useMemo(() => {
    return columns.map((column, colIndex) => {
      const { key, dataIndex, render, width } = column;
      const cellKey = key || dataIndex || colIndex;
      const value = dataIndex ? record[dataIndex] : record;
      const content = render ? render(value, record, rowIndex) : value;

      return (
        <td
          key={cellKey}
          className="optimized-table-cell"
          style={{ width }}
        >
          {content}
        </td>
      );
    });
  }, [columns, record, rowIndex]);

  return (
    <tr
      className={`optimized-table-row ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      {...props}
    >
      {cells}
    </tr>
  );
});

OptimizedTableRow.displayName = 'OptimizedTableRow';

export default {
  ArticleCard,
  VirtualizedArticleList,
  LazyImage,
  SearchInput,
  InfiniteScrollList,
  OptimizedTableRow,
};