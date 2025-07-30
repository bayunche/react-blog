import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import { GITHUB } from '@/config';
import { save } from '@/utils/storage';

/**
 * GitHub第三方登录逻辑的自定义 Hook
 * @returns {object} GitHub登录相关的状态和方法
 */
export const useGithubAuth = () => {
  const location = useLocation();

  /**
   * 检查GitHub登录是否可用
   * @returns {boolean} 是否可用
   */
  const isGithubAuthAvailable = useCallback(() => {
    return !!(GITHUB?.enable && GITHUB?.client_id && GITHUB?.url);
  }, []);

  /**
   * 生成GitHub授权URL
   * @param {object} options - 选项配置
   * @param {string} options.state - 状态参数，用于防止CSRF攻击
   * @param {string} options.redirectUri - 回调地址
   * @returns {string} 授权URL
   */
  const generateAuthUrl = useCallback((options = {}) => {
    if (!isGithubAuthAvailable()) {
      throw new Error('GitHub登录未配置或不可用');
    }

    const { state = '', redirectUri = '' } = options;
    const baseUrl = GITHUB.url;
    const clientId = GITHUB.client_id;
    
    const params = new URLSearchParams({
      client_id: clientId,
      scope: 'user:email', // 请求用户邮箱权限
      state: state || generateStateParam()
    });

    if (redirectUri) {
      params.append('redirect_uri', redirectUri);
    }

    return `${baseUrl}?${params.toString()}`;
  }, [isGithubAuthAvailable]);

  /**
   * 生成状态参数
   * @returns {string} 随机状态字符串
   */
  const generateStateParam = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }, []);

  /**
   * 保存当前路由信息
   */
  const saveCurrentRoute = useCallback(() => {
    const { pathname, search } = location;
    const currentRoute = `${pathname}${search}`;
    save('prevRouter', currentRoute);
    save('githubAuthTime', Date.now()); // 保存认证时间，用于验证
  }, [location]);

  /**
   * 处理GitHub登录
   * @param {object} options - 登录选项
   * @param {Function} options.onBeforeRedirect - 重定向前的回调
   * @param {Function} options.onError - 错误回调
   */
  const handleGithubLogin = useCallback((options = {}) => {
    const { onBeforeRedirect, onError } = options;

    try {
      if (!isGithubAuthAvailable()) {
        const errorMsg = 'GitHub登录功能未启用或配置不完整';
        message.error(errorMsg);
        onError?.(new Error(errorMsg));
        return;
      }

      // 保存当前路由信息
      saveCurrentRoute();

      // 生成授权URL
      const authUrl = generateAuthUrl();
      
      // 执行重定向前回调
      onBeforeRedirect?.();

      // 跳转到GitHub授权页面
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('GitHub login failed:', error);
      message.error(error.message || 'GitHub登录失败');
      onError?.(error);
    }
  }, [isGithubAuthAvailable, saveCurrentRoute, generateAuthUrl]);

  /**
   * 处理GitHub登录回调
   * @param {string} code - 授权码
   * @param {string} state - 状态参数
   * @returns {Promise} 处理结果
   */
  const handleGithubCallback = useCallback(async (code, state) => {
    try {
      // 这里应该调用后端API来完成GitHub登录流程
      // 由于这是前端Hook，具体的API调用应该在使用该Hook的组件中处理
      console.log('GitHub callback received:', { code, state });
      
      // 验证状态参数（可选，增强安全性）
      // validateStateParam(state);

      return {
        code,
        state,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Handle GitHub callback failed:', error);
      throw error;
    }
  }, []);

  /**
   * 获取GitHub登录按钮配置
   * @returns {object} 按钮配置
   */
  const getGithubButtonConfig = useCallback(() => ({
    available: isGithubAuthAvailable(),
    text: 'GitHub 登录',
    icon: 'GithubOutlined',
    type: 'default',
    block: true,
    style: { 
      marginTop: 12,
      borderColor: '#24292e',
      color: '#24292e'
    },
    disabled: !isGithubAuthAvailable()
  }), [isGithubAuthAvailable]);

  /**
   * 清理GitHub认证相关的本地存储
   */
  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem('prevRouter');
    localStorage.removeItem('githubAuthTime');
  }, []);

  return {
    // 状态检查
    isGithubAuthAvailable,
    
    // 登录流程
    handleGithubLogin,
    handleGithubCallback,
    
    // 配置获取
    getGithubButtonConfig,
    
    // 工具方法
    generateAuthUrl,
    saveCurrentRoute,
    clearAuthStorage
  };
};