import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection Observer Hook
 * 用于检测元素是否进入视口，支持懒加载等场景
 * @param {Object} options - 配置选项
 * @returns {Array} [ref, isVisible, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    initialIsVisible = false,
  } = options;

  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [entry, setEntry] = useState(null);

  const frozen = freezeOnceVisible && isVisible;

  const updateEntry = useCallback((entries) => {
    const [entry] = entries;
    const isVisible = entry.isIntersecting;

    setEntry(entry);
    
    if (!frozen) {
      setIsVisible(isVisible);
    }
  }, [frozen]);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || frozen) {
      return;
    }

    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen, updateEntry]);

  return [elementRef, isVisible, entry];
};

/**
 * 多元素 Intersection Observer Hook
 * 用于同时监听多个元素的可见性
 * @param {Object} options - 配置选项
 * @returns {Object} 监听控制对象  
 */
export const useMultipleIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
  } = options;

  const [entries, setEntries] = useState(new Map());
  const observerRef = useRef(null);

  // 初始化观察器
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (observedEntries) => {
        setEntries(prevEntries => {
          const newEntries = new Map(prevEntries);
          
          observedEntries.forEach(entry => {
            newEntries.set(entry.target, {
              isVisible: entry.isIntersecting,
              entry,
            });
          });
          
          return newEntries;
        });
      },
      { threshold, root, rootMargin }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin]);

  // 观察元素
  const observe = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  // 取消观察元素
  const unobserve = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
      setEntries(prevEntries => {
        const newEntries = new Map(prevEntries);
        newEntries.delete(element);
        return newEntries;
      });
    }
  }, []);

  // 获取元素的可见性状态
  const getVisibility = useCallback((element) => {
    return entries.get(element) || { isVisible: false, entry: null };
  }, [entries]);

  return {
    observe,
    unobserve,
    getVisibility,
    entries,
  };
};

/**
 * 懒加载Hook
 * 基于 Intersection Observer 实现的懒加载
 * @param {Object} options - 配置选项
 * @returns {Object} 懒加载状态和控制
 */
export const useLazyLoad = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    onLoad,
    onError,
  } = options;

  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  const [status, setStatus] = useState('idle'); // idle, loading, loaded, error
  const [data, setData] = useState(null);

  // 开始加载
  const load = useCallback(async (loadFunction) => {
    if (status !== 'idle') return;

    setStatus('loading');
    
    try {
      const result = await loadFunction();
      setData(result);
      setStatus('loaded');
      onLoad?.(result);
    } catch (error) {
      setStatus('error');
      onError?.(error);
    }
  }, [status, onLoad, onError]);

  // 重试加载
  const retry = useCallback(() => {
    setStatus('idle');
    setData(null);
  }, []);

  return {
    ref,
    isVisible,
    status,
    data,
    load,
    retry,
    isLoading: status === 'loading',
    isLoaded: status === 'loaded',
    isError: status === 'error',
  };
};

/**
 * 无限滚动Hook
 * 基于 Intersection Observer 实现的无限滚动
 * @param {Object} options - 配置选项
 * @returns {Object} 无限滚动状态和控制
 */
export const useInfiniteScroll = (options = {}) => {
  const {
    threshold = 1.0,
    rootMargin = '0px',
    hasNextPage = true,
    fetchNextPage,
    enabled = true,
  } = options;

  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // 获取下一页数据
  useEffect(() => {
    const loadNextPage = async () => {
      if (!isVisible || !hasNextPage || isFetching || !enabled) {
        return;
      }

      setIsFetching(true);
      setError(null);

      try {
        await fetchNextPage?.();
      } catch (err) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    };

    loadNextPage();
  }, [isVisible, hasNextPage, isFetching, enabled, fetchNextPage]);

  return {
    ref,
    isFetching,
    error,
    isVisible,
  };
};

/**
 * 视口变化监听Hook
 * 监听元素进入/离开视口的变化
 * @param {Object} options - 配置选项
 * @returns {Object} 视口状态
 */
export const useViewportChange = (options = {}) => {
  const {
    threshold = [0, 0.25, 0.5, 0.75, 1.0],
    rootMargin = '0px',
    onEnter,
    onLeave,
    onChange,
  } = options;

  const [ref, isVisible, entry] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const [visibilityRatio, setVisibilityRatio] = useState(0);
  const previousVisibleRef = useRef(false);

  useEffect(() => {
    if (entry) {
      const ratio = entry.intersectionRatio;
      setVisibilityRatio(ratio);

      // 触发变化回调
      onChange?.(ratio, entry);

      // 检测进入/离开状态变化
      const wasVisible = previousVisibleRef.current;
      const isCurrentlyVisible = entry.isIntersecting;

      if (!wasVisible && isCurrentlyVisible) {
        onEnter?.(entry);
      } else if (wasVisible && !isCurrentlyVisible) {
        onLeave?.(entry);
      }

      previousVisibleRef.current = isCurrentlyVisible;
    }
  }, [entry, onChange, onEnter, onLeave]);

  return {
    ref,
    isVisible,
    visibilityRatio,
    entry,
  };
};

/**
 * 进度追踪Hook
 * 用于追踪页面滚动进度等场景
 * @param {Object} options - 配置选项
 * @returns {Object} 进度状态
 */
export const useScrollProgress = (options = {}) => {
  const {
    threshold = Array.from({ length: 101 }, (_, i) => i / 100), // 0% to 100%
    rootMargin = '0px',
  } = options;

  const [ref, , entry] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (entry) {
      // 计算滚动进度
      const ratio = entry.intersectionRatio;
      const progressPercentage = Math.round(ratio * 100);
      setProgress(progressPercentage);
    }
  }, [entry]);

  return {
    ref,
    progress,
    entry,
  };
};

/**
 * 自动播放控制Hook
 * 根据元素可见性自动控制媒体播放
 * @param {Object} options - 配置选项
 * @returns {Object} 播放控制状态
 */
export const useAutoPlay = (options = {}) => {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    autoPlay = true,
    pauseOnHidden = true,
  } = options;

  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRef = useRef(null);

  // 自动播放控制
  useEffect(() => {
    if (!mediaRef.current || !autoPlay) return;

    if (isVisible && !isPlaying) {
      mediaRef.current.play?.();
      setIsPlaying(true);
    } else if (!isVisible && isPlaying && pauseOnHidden) {
      mediaRef.current.pause?.();
      setIsPlaying(false);
    }
  }, [isVisible, isPlaying, autoPlay, pauseOnHidden]);

  // 手动播放控制
  const play = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.play?.();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.pause?.();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return {
    ref,
    mediaRef,
    isVisible,
    isPlaying,
    play,
    pause,
    toggle,
  };
};

export default useIntersectionObserver;