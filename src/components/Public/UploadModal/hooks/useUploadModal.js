import { useCallback } from 'react';
import useBoolean from '@/hooks/useBoolean';
import { useListener } from '@/hooks/useBus';

/**
 * 上传弹窗管理Hook
 * @returns {Object} 弹窗状态和控制方法
 */
export const useUploadModal = ({ onOpen, onClose } = {}) => {
  const { value: visible, setTrue, setFalse } = useBoolean(false);

  /**
   * 打开弹窗
   */
  const openModal = useCallback(() => {
    setTrue();
    if (typeof onOpen === 'function') {
      onOpen();
    }
  }, [setTrue, onOpen]);

  /**
   * 关闭弹窗
   */
  const closeModal = useCallback(() => {
    setFalse();
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [setFalse, onClose]);

  /**
   * 监听全局打开弹窗事件
   */
  useListener('openUploadModal', openModal);

  /**
   * 获取弹窗配置
   * @returns {Object} 弹窗配置
   */
  const getModalConfig = useCallback(() => ({
    width: 760,
    open: visible,
    title: '导入文章',
    onCancel: closeModal,
    maskClosable: false,
    destroyOnClose: true,
    centered: true,
    className: 'upload-modal'
  }), [visible, closeModal]);

  return {
    // 状态
    visible,
    
    // 方法
    openModal,
    closeModal,
    getModalConfig
  };
};