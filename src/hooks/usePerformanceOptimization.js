import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { throttle, debounce, performanceMonitor, getAdaptiveQualityConfig } from '@/utils/performance';

/**
 * 性能优化集合Hook
 * 提供各种性能优化的工具和方法
 */
export const usePerformanceOptimization = () => {
  const [performanceLevel, setPerformanceLevel] = useState('medium');
  const [metrics, setMetrics] = useState({});

  // 检测设备性能并应用配置
  useEffect(() => {
    const config = getAdaptiveQualityConfig();
    const level = config.imageQuality === 'high' ? 'high' : 
                 config.imageQuality === 'low' ? 'low' : 'medium';
    setPerformanceLevel(level);
  }, []);

  // 性能监控
  const startMonitoring = useCallback((name) => {
    performanceMonitor.start(name);
  }, []);

  const endMonitoring = useCallback((name) => {
    const result = performanceMonitor.end(name);
    if (result) {
      setMetrics(prev => ({ ...prev, [name]: result }));
    }
    return result;
  }, []);

  return {
    performanceLevel,
    metrics,
    startMonitoring,
    endMonitoring,
  };
};

/**
 * 防抖Hook
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟时间
 * @param {Array} deps - 依赖数组
 */
export const useDebounce = (callback, delay, deps = []) => {
  const debouncedFn = useMemo(
    () => debounce(callback, delay),
    [delay, ...deps]
  );

  // 清理函数
  useEffect(() => {
    return () => {
      if (debouncedFn.cancel) {
        debouncedFn.cancel();
      }
    };
  }, [debouncedFn]);

  return debouncedFn;
};

/**
 * 节流Hook
 * @param {Function} callback - 回调函数
 * @param {number} limit - 限制时间
 * @param {Array} deps - 依赖数组
 */
export const useThrottle = (callback, limit, deps = []) => {
  const throttledFn = useMemo(
    () => throttle(callback, limit),
    [limit, ...deps]
  );

  return throttledFn;
};

/**
 * 深度比较Hook
 * 避免不必要的重新渲染
 */
export const useDeepCompareMemo = (factory, deps) => {
  const ref = useRef();
  
  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }
  
  return ref.current.value;
};

/**
 * 深度比较函数
 */
const deepEqual = (a, b) => {
  if (a === b) return true;
  
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    
    return keys.every(key => deepEqual(a[key], b[key]));
  }
  
  return false;
};

/**
 * 异步任务Hook
 * 处理组件卸载时的异步操作清理
 */
export const useAsyncTask = () => {
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runAsyncTask = useCallback(async (asyncFn) => {
    try {
      const result = await asyncFn();
      if (mountedRef.current) {
        return result;
      }
    } catch (error) {
      if (mountedRef.current) {
        throw error;
      }
    }
  }, []);

  return { runAsyncTask, isMounted: () => mountedRef.current };
};

/**
 * 缓存Hook
 * 提供基于依赖的缓存功能
 */
export const useCache = (maxSize = 50) => {
  const cacheRef = useRef(new Map());
  
  const get = useCallback((key) => {
    const cache = cacheRef.current;
    if (cache.has(key)) {
      // LRU: 移动到最前面
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    return undefined;
  }, []);

  const set = useCallback((key, value) => {
    const cache = cacheRef.current;
    
    if (cache.has(key)) {
      cache.delete(key);
    } else if (cache.size >= maxSize) {
      // 删除最旧的项
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, value);
  }, [maxSize]);

  const has = useCallback((key) => {
    return cacheRef.current.has(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const size = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  return { get, set, has, clear, size };
};

/**
 * 批量更新Hook
 * 将多个状态更新合并为一次渲染
 */
export const useBatchUpdate = () => {
  const [, forceUpdate] = useState({});
  const updateQueueRef = useRef([]);
  const timeoutRef = useRef(null);

  const batchUpdate = useCallback((updateFn) => {
    updateQueueRef.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const updates = updateQueueRef.current;
      updateQueueRef.current = [];
      
      updates.forEach(fn => fn());
      forceUpdate({});
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
};

/**
 * 可见性Hook
 * 监听页面可见性变化
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

/**
 * 网络状态Hook
 * 监听网络连接状态
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState(
    navigator.connection?.effectiveType || 'unknown'
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleConnectionChange = () => {
      setConnectionType(navigator.connection?.effectiveType || 'unknown');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return { isOnline, connectionType };
};

/**
 * 内存使用监控Hook
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    if (!performance.memory) {
      return;
    }

    const updateMemoryInfo = () => {
      setMemoryInfo({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      });
    };

    updateMemoryInfo();
    
    const interval = setInterval(updateMemoryInfo, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * 渲染性能监控Hook
 */
export const useRenderPerformance = (name) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current++;
    const now = performance.now();
    const renderTime = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    if (name && renderTime > 16) { // 超过一帧时间
      console.warn(`Slow render detected in ${name}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return {
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTimeRef.current,
  };
};

/**
 * 懒执行Hook
 * 延迟执行非关键操作
 */
export const useLazyExecution = (callback, delay = 1000) => {
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const execute = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        callback(...args);
      }
    }, delay);
  }, [callback, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { execute, cancel };
};

/**
 * 智能重试Hook
 * 自动重试失败的操作
 */
export const useSmartRetry = (asyncFn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    backoffFactor = 2,
    onRetry,
    onError,
  } = options;

  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    retryCount: 0,
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn(...args);
        setState({
          loading: false,
          error: null,
          data: result,
          retryCount: attempt,
        });
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(backoffFactor, attempt);
          onRetry?.(error, attempt + 1, delay);
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setState({
      loading: false,
      error: lastError,
      data: null,
      retryCount: maxRetries,
    });
    
    onError?.(lastError);
    throw lastError;
  }, [asyncFn, maxRetries, baseDelay, backoffFactor, onRetry, onError]);

  return {
    ...state,
    execute,
  };
};

export default {
  usePerformanceOptimization,
  useDebounce,
  useThrottle,
  useDeepCompareMemo,
  useAsyncTask,
  useCache,
  useBatchUpdate,
  usePageVisibility,
  useNetworkStatus,
  useMemoryMonitor,
  useRenderPerformance,
  useLazyExecution,
  useSmartRetry,
};