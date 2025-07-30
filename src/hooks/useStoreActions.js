import { useCallback } from 'react';
import { 
  useUserStore, 
  useArticleStore, 
  useAppStore, 
  useCommentStore,
  useThemeStore 
} from '@/stores';

/**
 * 状态管理统一操作Hook
 * 提供跨store的复合操作和常用的action组合
 */
export const useStoreActions = () => {
  // 用户相关操作
  const userActions = {
    login: useCallback(async (userInfo) => {
      const { loginSuccess } = useUserStore.getState();
      const { clearError, showNotification } = useAppStore.getState();
      
      try {
        loginSuccess(userInfo);
        clearError();
        showNotification({
          type: 'success',
          message: '登录成功',
          description: `欢迎回来，${userInfo.username}！`
        });
      } catch (error) {
        useAppStore.getState().setError(error);
        throw error;
      }
    }, []),

    logout: useCallback(async () => {
      const { logout } = useUserStore.getState();
      const { reset: resetApp } = useAppStore.getState();
      const { reset: resetArticle } = useArticleStore.getState();
      const { reset: resetComment } = useCommentStore.getState();
      
      try {
        // 清除所有状态
        logout();
        resetApp();
        resetArticle();
        resetComment();
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: '已安全退出',
          description: '期待您的再次访问！'
        });
      } catch (error) {
        console.error('登出失败:', error);
      }
    }, []),

    updateProfile: useCallback(async (updates) => {
      const { updateUserInfo, setLoading, setError } = useUserStore.getState();
      
      try {
        setLoading(true);
        updateUserInfo(updates);
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: '个人信息更新成功'
        });
      } catch (error) {
        setError(error);
        throw error;
      }
    }, []),
  };

  // 文章相关操作
  const articleActions = {
    createArticle: useCallback(async (articleData) => {
      const { addArticle, setSubmitting, setError } = useArticleStore.getState();
      
      try {
        setSubmitting(true);
        // 这里会调用API创建文章
        // const newArticle = await createArticleAPI(articleData);
        // addArticle(newArticle);
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: '文章创建成功'
        });
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    }, []),

    batchDeleteArticles: useCallback(async (articleIds) => {
      const { batchRemoveArticles, setBatchOperationLoading, setError } = useArticleStore.getState();
      
      try {
        setBatchOperationLoading(true);
        // 这里会调用API批量删除
        // await batchDeleteArticlesAPI(articleIds);
        batchRemoveArticles(articleIds);
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: `成功删除 ${articleIds.length} 篇文章`
        });
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setBatchOperationLoading(false);
      }
    }, []),

    searchArticles: useCallback(async (searchParams) => {
      const { updateFilters, setLoading, setArticleList, setError } = useArticleStore.getState();
      
      try {
        setLoading(true);
        updateFilters(searchParams);
        
        // 这里会调用API搜索文章
        // const result = await searchArticlesAPI(searchParams);
        // setArticleList(result.data, result.pagination);
      } catch (error) {
        setError(error);
        throw error;
      }
    }, []),
  };

  // 评论相关操作
  const commentActions = {
    submitComment: useCallback(async (articleId, commentData) => {
      const { addComment, setSubmitting, setError } = useCommentStore.getState();
      
      try {
        setSubmitting(articleId, true);
        
        // 这里会调用API提交评论
        // const newComment = await submitCommentAPI(articleId, commentData);
        // addComment(articleId, newComment);
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: '评论发表成功'
        });
      } catch (error) {
        setError(articleId, error);
        throw error;
      } finally {
        setSubmitting(articleId, false);
      }
    }, []),

    likeComment: useCallback(async (articleId, commentId) => {
      const { toggleLike } = useCommentStore.getState();
      
      try {
        // 这里会调用API点赞/取消点赞
        // const result = await toggleCommentLikeAPI(commentId);
        // toggleLike(articleId, commentId, result.isLiked, result.likeCount);
      } catch (error) {
        useAppStore.getState().setError(error);
        throw error;
      }
    }, []),
  };

  // 主题相关操作
  const themeActions = {
    switchTheme: useCallback((themeName) => {
      const { setThemeSettings } = useThemeStore.getState();
      
      try {
        setThemeSettings({ currentTheme: themeName });
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: `已切换到${themeName}主题`
        });
      } catch (error) {
        useAppStore.getState().setError(error);
      }
    }, []),

    toggleDarkMode: useCallback(() => {
      const { toggleTheme, isDark } = useThemeStore.getState();
      
      try {
        toggleTheme();
        const newMode = !isDark;
        
        useAppStore.getState().showNotification({
          type: 'success',
          message: `已切换到${newMode ? '深色' : '浅色'}模式`
        });
      } catch (error) {
        useAppStore.getState().setError(error);
      }
    }, []),
  };

  // 应用级操作
  const appActions = {
    initializeApp: useCallback(async () => {
      const { setLoading, setError } = useAppStore.getState();
      const { initUser } = useUserStore.getState();
      
      try {
        setLoading(true);
        
        // 初始化用户信息
        initUser();
        
        // 可以在这里执行其他初始化操作
        // 如获取系统配置、检查更新等
        
        console.log('应用初始化完成');
      } catch (error) {
        setError(error);
        console.error('应用初始化失败:', error);
      } finally {
        setLoading(false);
      }
    }, []),

    handleGlobalError: useCallback((error, context = '') => {
      const { setError, showNotification } = useAppStore.getState();
      
      setError(error);
      
      // 显示用户友好的错误通知
      showNotification({
        type: 'error',
        message: '操作失败',
        description: context ? `${context}: ${error.message}` : error.message
      });
      
      // 可以在这里集成错误报告服务
      console.error(`Global Error ${context}:`, error);
    }, []),

    clearAllErrors: useCallback(() => {
      useAppStore.getState().clearError();
      useUserStore.getState().clearError();
      useArticleStore.getState().clearError();
      // 清除所有评论错误
      const commentStore = useCommentStore.getState();
      Object.keys(commentStore.errors).forEach(articleId => {
        commentStore.clearError(articleId);
      });
    }, []),
  };

  return {
    user: userActions,
    article: articleActions,
    comment: commentActions,
    theme: themeActions,
    app: appActions,
  };
};

export default useStoreActions;