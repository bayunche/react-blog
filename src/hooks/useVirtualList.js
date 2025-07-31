import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { throttle } from '@/utils/performance';

/**
 * 虚拟列表Hook
 * 用于优化大量数据的列表渲染性能
 * @param {Object} options - 配置选项
 * @returns {Object} 虚拟列表状态和方法
 */
export const useVirtualList = (options = {}) => {
  const {
    items = [], // 数据源
    itemHeight = 50, // 每项高度
    containerHeight = 400, // 容器高度
    overscan = 5, // 缓冲区大小
    scrollingDelay = 150, // 滚动延迟
    getItemHeight, // 动态高度计算函数
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingTimeoutRef = useRef(null);

  // 节流的滚动处理函数
  const handleScroll = useCallback(
    throttle((event) => {
      const scrollTop = event.currentTarget.scrollTop;
      setScrollTop(scrollTop);
      setIsScrolling(true);

      // 设置滚动结束的延迟
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }

      scrollingTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);
    }, 16), // 60fps
    [scrollingDelay]
  );

  // 计算可见范围
  const visibleRange = useMemo(() => {
    const totalHeight = containerHeight;
    let startIndex = 0;
    let endIndex = 0;
    let offsetY = 0;

    if (getItemHeight) {
      // 动态高度计算
      let accumulatedHeight = 0;
      let hasFoundStart = false;

      for (let i = 0; i < items.length; i++) {
        const currentItemHeight = getItemHeight(i, items[i]);
        
        if (!hasFoundStart && accumulatedHeight + currentItemHeight > scrollTop) {
          startIndex = Math.max(0, i - overscan);
          offsetY = items.slice(0, startIndex).reduce((acc, item, index) => {
            return acc + getItemHeight(index, item);
          }, 0);
          hasFoundStart = true;
        }

        if (hasFoundStart && accumulatedHeight > scrollTop + totalHeight) {
          endIndex = Math.min(items.length - 1, i + overscan);
          break;
        }

        accumulatedHeight += currentItemHeight;
      }

      if (!hasFoundStart) {
        startIndex = Math.max(0, items.length - overscan);
        endIndex = items.length - 1;
      } else if (endIndex === 0) {
        endIndex = Math.min(items.length - 1, startIndex + Math.ceil(totalHeight / itemHeight) + overscan);
      }
    } else {
      // 固定高度计算
      const visibleStart = Math.floor(scrollTop / itemHeight);
      const visibleEnd = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + totalHeight) / itemHeight)
      );

      startIndex = Math.max(0, visibleStart - overscan);
      endIndex = Math.min(items.length - 1, visibleEnd + overscan);
      offsetY = startIndex * itemHeight;
    }

    return {
      startIndex,
      endIndex,
      offsetY,
    };
  }, [scrollTop, items, itemHeight, containerHeight, overscan, getItemHeight]);

  // 可见项目
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
      key: `${visibleRange.startIndex + index}`,
    }));
  }, [items, visibleRange]);

  // 总高度计算
  const totalHeight = useMemo(() => {
    if (getItemHeight) {
      return items.reduce((acc, item, index) => acc + getItemHeight(index, item), 0);
    }
    return items.length * itemHeight;
  }, [items, itemHeight, getItemHeight]);

  // 滚动到指定索引
  const scrollToIndex = useCallback((index, align = 'auto') => {
    const maxIndex = items.length - 1;
    const targetIndex = Math.max(0, Math.min(maxIndex, index));

    let targetScrollTop = 0;

    if (getItemHeight) {
      targetScrollTop = items.slice(0, targetIndex).reduce((acc, item, i) => {
        return acc + getItemHeight(i, item);
      }, 0);
    } else {
      targetScrollTop = targetIndex * itemHeight;
    }

    // 根据对齐方式调整滚动位置
    if (align === 'center') {
      targetScrollTop -= containerHeight / 2;
    } else if (align === 'end') {
      const itemSize = getItemHeight ? getItemHeight(targetIndex, items[targetIndex]) : itemHeight;
      targetScrollTop -= containerHeight - itemSize;
    }

    // 触发滚动事件
    setScrollTop(Math.max(0, targetScrollTop));

    return targetScrollTop;
  }, [items, itemHeight, containerHeight, getItemHeight]);

  // 滚动到指定偏移量
  const scrollToOffset = useCallback((offset) => {
    const targetScrollTop = Math.max(0, Math.min(offset, totalHeight - containerHeight));
    setScrollTop(targetScrollTop);
    return targetScrollTop;
  }, [totalHeight, containerHeight]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // 状态
    scrollTop,
    isScrolling,
    visibleRange,
    visibleItems,
    totalHeight,

    // 方法
    handleScroll,
    scrollToIndex,
    scrollToOffset,

    // 容器属性
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto',
      },
      onScroll: handleScroll,
    },

    // 内容包装器属性
    wrapperProps: {
      style: {
        height: totalHeight,
        position: 'relative',
      },
    },

    // 可见内容属性
    innerProps: {
      style: {
        transform: `translateY(${visibleRange.offsetY}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
    },
  };
};

/**
 * 虚拟网格Hook
 * 用于二维网格布局的虚拟化
 * @param {Object} options - 配置选项
 * @returns {Object} 虚拟网格状态和方法
 */
export const useVirtualGrid = (options = {}) => {
  const {
    items = [],
    itemWidth = 200,
    itemHeight = 150,
    containerWidth = 800,
    containerHeight = 600,
    gap = 10,
    overscan = 2,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 计算列数
  const columnCount = Math.floor((containerWidth + gap) / (itemWidth + gap));
  
  // 计算行数
  const rowCount = Math.ceil(items.length / columnCount);

  // 节流的滚动处理函数
  const handleScroll = useCallback(
    throttle((event) => {
      const { scrollTop, scrollLeft } = event.currentTarget;
      setScrollTop(scrollTop);
      setScrollLeft(scrollLeft);
    }, 16),
    []
  );

  // 计算可见范围
  const visibleRange = useMemo(() => {
    const startRow = Math.floor(scrollTop / (itemHeight + gap));
    const endRow = Math.min(
      rowCount - 1,
      Math.ceil((scrollTop + containerHeight) / (itemHeight + gap))
    );

    const startCol = Math.floor(scrollLeft / (itemWidth + gap));
    const endCol = Math.min(
      columnCount - 1,
      Math.ceil((scrollLeft + containerWidth) / (itemWidth + gap))
    );

    return {
      startRow: Math.max(0, startRow - overscan),
      endRow: Math.min(rowCount - 1, endRow + overscan),
      startCol: Math.max(0, startCol - overscan),
      endCol: Math.min(columnCount - 1, endCol + overscan),
    };
  }, [scrollTop, scrollLeft, rowCount, columnCount, containerHeight, containerWidth, itemHeight, itemWidth, gap, overscan]);

  // 可见项目
  const visibleItems = useMemo(() => {
    const items_list = [];
    
    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const index = row * columnCount + col;
        
        if (index < items.length) {
          items_list.push({
            item: items[index],
            index,
            row,
            col,
            key: `${row}-${col}`,
            style: {
              position: 'absolute',
              left: col * (itemWidth + gap),
              top: row * (itemHeight + gap),
              width: itemWidth,
              height: itemHeight,
            },
          });
        }
      }
    }
    
    return items_list;
  }, [items, visibleRange, columnCount, itemWidth, itemHeight, gap]);

  // 总尺寸
  const totalWidth = columnCount * (itemWidth + gap) - gap;
  const totalHeight = rowCount * (itemHeight + gap) - gap;

  return {
    // 状态
    scrollTop,
    scrollLeft,
    visibleRange,
    visibleItems,
    columnCount,
    rowCount,
    totalWidth,
    totalHeight,

    // 方法
    handleScroll,

    // 容器属性
    containerProps: {
      style: {
        width: containerWidth,
        height: containerHeight,
        overflow: 'auto',
      },
      onScroll: handleScroll,
    },

    // 内容包装器属性
    wrapperProps: {
      style: {
        width: totalWidth,
        height: totalHeight,
        position: 'relative',
      },
    },
  };
};

export default useVirtualList;