import { useEffect } from 'react';
import { useStoreActions } from './useStoreActions';
import { useStoreSubscriptions } from './useStoreSubscriptions';

/**
 * 初始化所有状态管理的Hook
 * 包含应用初始化和状态订阅
 */
export const useStoreInit = () => {
  const { app } = useStoreActions();
  
  // 设置状态订阅
  useStoreSubscriptions();

  useEffect(() => {
    // 初始化应用
    app.initializeApp();
  }, [app]);
};

export default useStoreInit;