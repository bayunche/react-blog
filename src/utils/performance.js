/**
 * 性能优化工具函数
 * 提供各种性能监控和优化的工具函数
 */

/**
 * 防抖函数 - 用于优化频繁触发的事件
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 防抖延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
};

/**
 * 节流函数 - 控制函数执行频率
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 节流间隔时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 创建缓存函数 - 用于缓存计算结果
 * @param {Function} func - 要缓存的函数
 * @param {Function} keyGenerator - 缓存键生成函数
 * @param {number} maxSize - 最大缓存大小
 * @returns {Function} 带缓存的函数
 */
export const memoize = (func, keyGenerator = (...args) => JSON.stringify(args), maxSize = 100) => {
  const cache = new Map();
  
  return function memoizedFunction(...args) {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      // 移动到最前面（LRU策略）
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    const result = func.apply(this, args);
    
    // 如果缓存满了，删除最旧的项
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
};

/**
 * 批处理函数 - 将多个操作合并为一次执行
 * @param {Function} func - 要批处理的函数
 * @param {number} delay - 批处理延迟时间
 * @returns {Function} 批处理函数
 */
export const batchProcess = (func, delay = 0) => {
  let batch = [];
  let timeoutId = null;
  
  return function batchedFunction(item) {
    batch.push(item);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      if (batch.length > 0) {
        func(batch);
        batch = [];
      }
    }, delay);
  };
};

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  /**
   * 开始性能监控
   * @param {string} name - 监控名称
   */
  start(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      startMemory: this.getMemoryUsage(),
    });
  }

  /**
   * 结束性能监控
   * @param {string} name - 监控名称
   * @returns {Object} 性能数据
   */
  end(name) {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    
    const result = {
      name,
      duration: endTime - metric.startTime,
      memoryUsed: endMemory - metric.startMemory,
      timestamp: Date.now(),
    };

    this.metrics.delete(name);
    this.notifyObservers(result);
    
    return result;
  }

  /**
   * 获取内存使用情况
   * @returns {number} 内存使用量（字节）
   */
  getMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 添加性能观察者
   * @param {Function} observer - 观察者函数
   */
  addObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * 移除性能观察者
   * @param {Function} observer - 观察者函数
   */
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * 通知所有观察者
   * @param {Object} data - 性能数据
   */
  notifyObservers(data) {
    this.observers.forEach(observer => {
      try {
        observer(data);
      } catch (error) {
        console.error('Performance observer error:', error);
      }
    });
  }

  /**
   * 获取所有性能数据
   * @returns {Array} 性能数据数组
   */
  getAllMetrics() {
    return Array.from(this.metrics.entries()).map(([name, data]) => ({
      name,
      ...data,
      isRunning: true,
    }));
  }
}

/**
 * 全局性能监控实例
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * 性能监控装饰器
 * @param {string} name - 监控名称
 * @returns {Function} 装饰器函数
 */
export const performanceDecorator = (name) => {
  return function decorator(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args) {
      const monitorName = `${name || target.constructor.name}.${propertyKey}`;
      performanceMonitor.start(monitorName);
      
      try {
        const result = originalMethod.apply(this, args);
        
        // 处理异步函数
        if (result && typeof result.then === 'function') {
          return result.finally(() => {
            performanceMonitor.end(monitorName);
          });
        }
        
        performanceMonitor.end(monitorName);
        return result;
      } catch (error) {
        performanceMonitor.end(monitorName);
        throw error;
      }
    };
    
    return descriptor;
  };
};

/**
 * 计算函数执行时间
 * @param {Function} func - 要测量的函数
 * @param {...any} args - 函数参数
 * @returns {Promise<{result: any, duration: number}>} 执行结果和耗时
 */
export const measureExecutionTime = async (func, ...args) => {
  const startTime = performance.now();
  
  try {
    const result = await func(...args);
    const duration = performance.now() - startTime;
    
    return { result, duration };
  } catch (error) {
    const duration = performance.now() - startTime;
    throw { error, duration };
  }
};

/**
 * 虚拟滚动工具
 */
export class VirtualScroller {
  constructor(options = {}) {
    this.itemHeight = options.itemHeight || 50;
    this.containerHeight = options.containerHeight || 400;
    this.buffer = options.buffer || 5;
    this.scrollTop = 0;
  }

  /**
   * 计算可见项目范围
   * @param {number} totalItems - 总项目数
   * @returns {Object} 可见范围信息
   */
  getVisibleRange(totalItems) {
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    
    const bufferedStart = Math.max(0, startIndex - this.buffer);
    const bufferedEnd = Math.min(totalItems - 1, startIndex + visibleCount + this.buffer);
    
    return {
      startIndex: bufferedStart,
      endIndex: bufferedEnd,
      visibleCount: bufferedEnd - bufferedStart + 1,
      offsetY: bufferedStart * this.itemHeight,
      totalHeight: totalItems * this.itemHeight,
    };
  }

  /**
   * 更新滚动位置
   * @param {number} scrollTop - 滚动位置
   */
  updateScrollTop(scrollTop) {
    this.scrollTop = scrollTop;
  }
}

/**
 * 图片预加载
 * @param {string|Array} urls - 图片URL或URL数组
 * @returns {Promise} 预加载Promise
 */
export const preloadImages = (urls) => {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  
  return Promise.all(
    urlArray.map(url => 
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      })
    )
  );
};

/**
 * 资源预加载
 * @param {string} url - 资源URL
 * @param {string} as - 资源类型
 * @returns {Promise} 预加载Promise
 */
export const preloadResource = (url, as = 'fetch') => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    link.onload = () => {
      document.head.removeChild(link);
      resolve(url);
    };
    
    link.onerror = () => {
      document.head.removeChild(link);
      reject(new Error(`Failed to preload resource: ${url}`));
    };
    
    document.head.appendChild(link);
  });
};

/**
 * 检测设备性能等级
 * @returns {string} 性能等级: 'high', 'medium', 'low'
 */
export const detectDevicePerformance = () => {
  // 检测硬件并发数
  const cores = navigator.hardwareConcurrency || 4;
  
  // 检测内存
  const memory = navigator.deviceMemory || 4;
  
  // 检测连接类型
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // 简单性能评分
  let score = 0;
  
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;
  
  if (memory >= 8) score += 3;
  else if (memory >= 4) score += 2;
  else score += 1;
  
  if (effectiveType === '4g') score += 2;
  else if (effectiveType === '3g') score += 1;
  
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

/**
 * 自适应质量配置
 * @returns {Object} 质量配置
 */
export const getAdaptiveQualityConfig = () => {
  const performance = detectDevicePerformance();
  
  const configs = {
    high: {
      imageQuality: 'high',
      animationDuration: 300,
      enableParticles: true,
      enableBlur: true,
      maxImageSize: 2048,
      enableLive2D: true,
      preloadCount: 10,
    },
    medium: {
      imageQuality: 'medium',
      animationDuration: 200,
      enableParticles: false,
      enableBlur: false,
      maxImageSize: 1024,
      enableLive2D: true,
      preloadCount: 5,
    },
    low: {
      imageQuality: 'low',
      animationDuration: 100,
      enableParticles: false,
      enableBlur: false,
      maxImageSize: 512,
      enableLive2D: false,
      preloadCount: 3,
    },
  };
  
  return configs[performance];
};

/**
 * 帧率监控
 */
export class FPSMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = performance.now();
    this.frames = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
  }

  tick() {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    this.frames++;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frames = 0;
      this.lastTime = now;
    }
    
    if (this.running) {
      requestAnimationFrame(() => this.tick());
    }
  }

  getFPS() {
    return this.fps;
  }
}

/**
 * 内存泄漏检测
 */
export const detectMemoryLeaks = () => {
  if (!performance.memory) {
    console.warn('Memory API not supported');
    return null;
  }

  const initial = performance.memory.usedJSHeapSize;
  
  return {
    getMemoryIncrease: () => {
      const current = performance.memory.usedJSHeapSize;
      return current - initial;
    },
    
    getMemoryInfo: () => ({
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    }),
  };
};

/**
 * 默认导出
 */
export default {
  debounce,
  throttle,
  memoize,
  batchProcess,
  PerformanceMonitor,
  performanceMonitor,
  performanceDecorator,
  measureExecutionTime,
  VirtualScroller,
  preloadImages,
  preloadResource,
  detectDevicePerformance,
  getAdaptiveQualityConfig,
  FPSMonitor,
  detectMemoryLeaks,
};