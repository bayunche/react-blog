import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 应用全局状态管理
 * 管理应用级别的状态，如加载状态、错误处理、通知等
 */
export const useAppStore = create(
  persist(
    (set, get) => ({
      // 全局状态
      loading: false,
      error: null,
      notification: null,
      sidebarCollapsed: false,
      modalStates: {},
      
      // 系统设置
      settings: {
        pageSize: 10,
        autoSave: true,
        enableNotifications: true,
        compactMode: false,
      },

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ 
        error: typeof error === 'string' ? error : error?.message || '未知错误',
        loading: false 
      }),

      clearError: () => set({ error: null }),

      showNotification: (notification) => {
        set({ notification });
        // 自动清除通知
        setTimeout(() => {
          const currentNotification = get().notification;
          if (currentNotification === notification) {
            set({ notification: null });
          }
        }, 5000);
      },

      clearNotification: () => set({ notification: null }),

      toggleSidebar: () => {
        const { sidebarCollapsed } = get();
        set({ sidebarCollapsed: !sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // 模态框状态管理
      setModalOpen: (modalId, isOpen) => {
        const { modalStates } = get();
        set({
          modalStates: {
            ...modalStates,
            [modalId]: isOpen
          }
        });
      },

      getModalState: (modalId) => {
        const { modalStates } = get();
        return modalStates[modalId] || false;
      },

      // 设置管理
      updateSettings: (newSettings) => {
        const { settings } = get();
        set({
          settings: {
            ...settings,
            ...newSettings
          }
        });
      },

      resetSettings: () => {
        set({
          settings: {
            pageSize: 10,
            autoSave: true,
            enableNotifications: true,
            compactMode: false,
          }
        });
      },

      // 批量重置状态
      reset: () => {
        set({
          loading: false,
          error: null,
          notification: null,
          modalStates: {},
        });
      },

      // 获取应用状态摘要
      getAppStatus: () => {
        const state = get();
        return {
          isLoading: state.loading,
          hasError: !!state.error,
          hasNotification: !!state.notification,
          activeModals: Object.keys(state.modalStates).filter(
            key => state.modalStates[key]
          ).length,
        };
      },
    }),
    {
      name: 'app-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
      }),
    }
  )
);