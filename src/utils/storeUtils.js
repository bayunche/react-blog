/**
 * 状态管理工具函数
 * 提供状态操作的辅助函数和类型定义
 */

/**
 * 创建选择器工厂函数
 * 用于优化状态选择性能
 */
export const createSelector = (selector) => {
  let lastResult;
  let lastArgs;
  
  return (...args) => {
    if (!lastArgs || !shallowEqual(args, lastArgs)) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    return lastResult;
  };
};

/**
 * 浅比较函数
 */
export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

/**
 * 深度合并对象
 */
export const deepMerge = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

/**
 * 创建异步状态处理器
 */
export const createAsyncHandler = (setLoading, setError, clearError) => {
  return async (asyncFn, options = {}) => {
    const { 
      showLoading = true, 
      throwError = true,
      successMessage,
      errorMessage 
    } = options;
    
    try {
      if (showLoading) setLoading(true);
      clearError();
      
      const result = await asyncFn();
      
      if (successMessage) {
        // 这里可以调用通知系统
        console.log(successMessage);
      }
      
      return result;
    } catch (error) {
      const message = errorMessage || error.message || '操作失败';
      setError(message);
      
      if (throwError) {
        throw error;
      }
      
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  };
};

/**
 * 状态重置工具
 */
export const createResetHelper = (stores) => {
  return () => {
    stores.forEach(store => {
      if (typeof store.getState().reset === 'function') {
        store.getState().reset();
      }
    });
  };
};

/**
 * 批量更新状态
 */
export const batchUpdate = (store, updates) => {
  const currentState = store.getState();
  
  // 使用immer-like的方式批量更新
  store.setState(state => {
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'function') {
        state[key] = updates[key](state[key]);
      } else {
        state[key] = updates[key];
      }
    });
  });
};

/**
 * 创建缓存键
 */
export const createCacheKey = (...parts) => {
  return parts.filter(Boolean).join(':');
};

/**
 * 状态持久化帮助函数
 */
export const createPersistConfig = (name, options = {}) => {
  const {
    blacklist = [],
    whitelist = [],
    version = 1,
    migrate,
  } = options;
  
  return {
    name,
    getStorage: () => localStorage,
    version,
    migrate,
    partialize: (state) => {
      if (whitelist.length > 0) {
        // 只保存白名单中的字段
        return whitelist.reduce((acc, key) => {
          if (key in state) {
            acc[key] = state[key];
          }
          return acc;
        }, {});
      }
      
      if (blacklist.length > 0) {
        // 排除黑名单中的字段
        return Object.keys(state).reduce((acc, key) => {
          if (!blacklist.includes(key)) {
            acc[key] = state[key];
          }
          return acc;
        }, {});
      }
      
      return state;
    },
  };
};

/**
 * 状态调试工具
 */
export const createDevtools = (name) => {
  if (process.env.NODE_ENV === 'development') {
    return {
      name,
      trace: true,
      traceLimit: 25,
    };
  }
  return false;
};

/**
 * 状态验证器
 */
export const createValidator = (schema) => {
  return (state) => {
    const errors = [];
    
    Object.keys(schema).forEach(key => {
      const value = state[key];
      const rules = schema[key];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
      }
      
      if (rules.type && value !== undefined && typeof value !== rules.type) {
        errors.push(`${key} must be of type ${rules.type}`);
      }
      
      if (rules.validate && !rules.validate(value)) {
        errors.push(`${key} validation failed`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
};

/**
 * 创建状态中间件
 */
export const createMiddleware = (middlewares) => {
  return (config) => {
    return middlewares.reduce((acc, middleware) => {
      return middleware(acc);
    }, config);
  };
};

/**
 * 状态同步工具
 */
export const syncStores = (sourceStore, targetStore, mapping) => {
  return sourceStore.subscribe((state) => {
    const updates = {};
    
    Object.keys(mapping).forEach(sourceKey => {
      const targetKey = mapping[sourceKey];
      updates[targetKey] = state[sourceKey];
    });
    
    targetStore.setState(updates);
  });
};

/**
 * 创建计算属性
 */
export const createComputed = (selector, dependencies = []) => {
  let cachedValue;
  let cachedDeps;
  
  return (state) => {
    const currentDeps = dependencies.map(dep => state[dep]);
    
    if (!cachedDeps || !shallowEqual(currentDeps, cachedDeps)) {
      cachedDeps = currentDeps;
      cachedValue = selector(state);
    }
    
    return cachedValue;
  };
};

/**
 * 状态历史记录
 */
export const createHistory = (maxSize = 10) => {
  const history = [];
  let currentIndex = -1;
  
  return {
    push: (state) => {
      // 移除当前位置之后的历史
      history.splice(currentIndex + 1);
      
      // 添加新状态
      history.push(JSON.parse(JSON.stringify(state)));
      currentIndex = history.length - 1;
      
      // 限制历史大小
      if (history.length > maxSize) {
        history.shift();
        currentIndex--;
      }
    },
    
    undo: () => {
      if (currentIndex > 0) {
        currentIndex--;
        return history[currentIndex];
      }
      return null;
    },
    
    redo: () => {
      if (currentIndex < history.length - 1) {
        currentIndex++;
        return history[currentIndex];
      }
      return null;
    },
    
    canUndo: () => currentIndex > 0,
    canRedo: () => currentIndex < history.length - 1,
    
    clear: () => {
      history.length = 0;
      currentIndex = -1;
    },
  };
};