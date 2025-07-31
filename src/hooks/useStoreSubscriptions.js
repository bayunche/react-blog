import { useEffect } from 'react';
import { useUserStore, useAppStore } from '@/stores';

/**
 * 状态订阅管理Hook
 * 用于监听状态变化并执行相应的副作用
 */
export const useStoreSubscriptions = () => {
  // 监听用户登录状态变化
  useEffect(() => {
    const unsubscribe = useUserStore.subscribe(
      (state) => state.isAuthenticated,
      (isAuthenticated, previousAuth) => {
        // 用户登录状态变化时的处理
        if (isAuthenticated && !previousAuth) {
          console.log('用户已登录');
          // 可以在这里执行登录后的初始化操作
        } else if (!isAuthenticated && previousAuth) {
          console.log('用户已登出');
          // 登出时清除相关状态
          useAppStore.getState().reset();
        }
      }
    );

    return unsubscribe;
  }, []);

  // 监听用户活跃状态
  useEffect(() => {
    const updateActiveTime = () => {
      const userStore = useUserStore.getState();
      if (userStore.isAuthenticated) {
        userStore.updateLastActiveTime();
      }
    };

    // 监听用户活动
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    let throttleTimer = null;
    const throttledUpdate = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        updateActiveTime();
        throttleTimer = null;
      }, 30000); // 30秒内最多更新一次
    };

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledUpdate);
      });
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, []);

  // 监听应用错误状态
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe(
      (state) => state.error,
      (error) => {
        if (error) {
          console.error('应用错误:', error);
          // 可以在这里集成错误报告服务
        }
      }
    );

    return unsubscribe;
  }, []);
};

export default useStoreSubscriptions;