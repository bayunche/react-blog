import { create } from 'zustand';
import { persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware';
import { save, get, remove } from '@/utils/storage';

/**
 * 用户状态管理
 * 管理用户认证、个人信息、权限等状态
 */
export const useUserStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // 基本用户信息
        username: '',
        role: 2, // 0: 超级管理员, 1: 管理员, 2: 普通用户
        userId: 0,
        github: null,
        email: null,
        token: null,
        avatar: null,
        bio: null,
        
        // 认证状态
        isAuthenticated: false,
        loginTime: null,
        lastActiveTime: null,
        
        // 操作状态
        loading: false,
        error: null,
        
        // 用户偏好设置
        preferences: {
          theme: 'light',
          language: 'zh-CN',
          timezone: 'Asia/Shanghai',
          emailNotifications: true,
          pushNotifications: true,
        },

        // Actions
        
        /**
         * 登录成功处理
         */
        loginSuccess: (userInfo) => {
          const { 
            username, 
            userId, 
            role, 
            github = null, 
            token, 
            email,
            avatar = null,
            bio = null
          } = userInfo;
          
          const now = Date.now();
          
          set({
            username,
            userId,
            role,
            github,
            email,
            token,
            avatar,
            bio,
            isAuthenticated: true,
            loginTime: now,
            lastActiveTime: now,
            error: null,
            loading: false,
          });
          
          // 保存到本地存储
          save('userInfo', { 
            username, 
            userId, 
            role, 
            github, 
            token, 
            email, 
            avatar, 
            bio,
            loginTime: now 
          });
        },

        /**
         * 登出处理
         */
        logout: () => {
          set({
            username: '',
            userId: 0,
            role: 2,
            github: null,
            email: null,
            token: null,
            avatar: null,
            bio: null,
            isAuthenticated: false,
            loginTime: null,
            lastActiveTime: null,
            error: null,
            loading: false,
          });
          
          // 清除本地存储
          remove('userInfo');
        },

        /**
         * 设置加载状态
         */
        setLoading: (loading) => set({ loading }),

        /**
         * 设置错误状态
         */
        setError: (error) => set({ 
          error: typeof error === 'string' ? error : error?.message || '未知错误',
          loading: false 
        }),

        /**
         * 清除错误
         */
        clearError: () => set({ error: null }),

        /**
         * 初始化用户信息（从本地存储）
         */
        initUser: () => {
          const userInfo = get('userInfo');
          if (userInfo && userInfo.token) {
            // 检查token是否过期（这里可以添加token过期逻辑）
            const now = Date.now();
            const loginTime = userInfo.loginTime || 0;
            const tokenExpireTime = 7 * 24 * 60 * 60 * 1000; // 7天过期
            
            if (now - loginTime < tokenExpireTime) {
              set({
                ...userInfo,
                isAuthenticated: true,
                lastActiveTime: now,
              });
            } else {
              // Token过期，清除登录状态
              get().logout();
            }
          }
        },

        /**
         * 更新用户信息
         */
        updateUserInfo: (updates) => {
          const currentState = get();
          const newUserInfo = { ...currentState, ...updates };
          
          set(newUserInfo);
          
          // 更新本地存储
          if (currentState.isAuthenticated) {
            save('userInfo', {
              username: newUserInfo.username,
              userId: newUserInfo.userId,
              role: newUserInfo.role,
              github: newUserInfo.github,
              token: newUserInfo.token,
              email: newUserInfo.email,
              avatar: newUserInfo.avatar,
              bio: newUserInfo.bio,
              loginTime: newUserInfo.loginTime,
            });
          }
        },

        /**
         * 更新用户偏好设置
         */
        updatePreferences: (newPreferences) => {
          const { preferences } = get();
          set({
            preferences: {
              ...preferences,
              ...newPreferences,
            }
          });
        },

        /**
         * 更新最后活跃时间
         */
        updateLastActiveTime: () => {
          set({ lastActiveTime: Date.now() });
        },

        /**
         * 检查用户权限
         */
        hasPermission: (requiredRole) => {
          const { role, isAuthenticated } = get();
          if (!isAuthenticated) return false;
          return role <= requiredRole; // 角色值越小权限越高
        },

        /**
         * 检查是否为管理员
         */
        isAdmin: () => {
          const { role, isAuthenticated } = get();
          return isAuthenticated && role <= 1;
        },

        /**
         * 检查是否为超级管理员
         */
        isSuperAdmin: () => {
          const { role, isAuthenticated } = get();
          return isAuthenticated && role === 0;
        },

        /**
         * 获取用户信息摘要
         */
        getUserSummary: () => {
          const state = get();
          return {
            username: state.username,
            email: state.email,
            avatar: state.avatar,
            role: state.role,
            isAuthenticated: state.isAuthenticated,
            loginTime: state.loginTime,
            lastActiveTime: state.lastActiveTime,
          };
        },

        /**
         * 获取用户角色名称
         */
        getRoleName: () => {
          const { role } = get();
          const roleNames = {
            0: '超级管理员',
            1: '管理员',
            2: '普通用户',
          };
          return roleNames[role] || '未知角色';
        },

        /**
         * 异步登录方法
         */
        loginAsync: async (params) => {
          const { setLoading, setError, loginSuccess, clearError } = get();
          
          try {
            setLoading(true);
            clearError();
            
            // 导入依赖
            const axios = (await import('@/utils/axios')).default;
            const { message } = await import('antd');
            const PSW = (await import('@/utils/password')).default;
            
            // 加密密码（如果有）
            if (params.password !== undefined) {
              params.password = PSW.encrypt(params.password);
            }
            
            const res = await axios.post('/login', params);
            
            loginSuccess(res);
            message.success(`登录成功, 欢迎您 ${res.username}`);
            
            return res;
          } catch (error) {
            setError(error);
            throw error;
          }
        },

        /**
         * 重置用户状态
         */
        reset: () => {
          set({
            username: '',
            role: 2,
            userId: 0,
            github: null,
            email: null,
            token: null,
            avatar: null,
            bio: null,
            isAuthenticated: false,
            loginTime: null,
            lastActiveTime: null,
            loading: false,
            error: null,
          });
        },
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          username: state.username,
          userId: state.userId,
          role: state.role,
          github: state.github,
          email: state.email,
          token: state.token,
          avatar: state.avatar,
          bio: state.bio,
          isAuthenticated: state.isAuthenticated,
          loginTime: state.loginTime,
          preferences: state.preferences,
        }),
      }
    )
  )
);