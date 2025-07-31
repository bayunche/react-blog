import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import axios from '@/utils/axios';
import useBoolean from '@/hooks/useBoolean';

/**
 * 上传提交管理Hook
 * @returns {Object} 提交相关状态和方法
 */
export const useUploadSubmit = () => {
  const authorId = useSelector(state => state.user.userId);
  const confirmLoading = useBoolean(false);

  /**
   * 提交上传文件
   * @param {Array} uploadList - 要上传的文件列表
   * @param {Function} onSuccess - 成功回调
   * @param {Function} onError - 错误回调
   */
  const handleSubmit = useCallback(async (uploadList, onSuccess, onError) => {
    if (!uploadList || uploadList.length === 0) {
      notification.warning({
        message: '提示',
        description: '请选择要上传的文件'
      });
      return;
    }

    try {
      confirmLoading.setTrue();
      
      const response = await axios.post('/article/upload/confirm', {
        authorId,
        uploadList
      });
      
      // 成功通知
      notification.success({
        message: '上传成功',
        description: `插入文章数: ${response.insertList.length}，更新文章数: ${response.updateList.length}`,
        duration: 4.5
      });
      
      // 执行成功回调
      if (typeof onSuccess === 'function') {
        onSuccess(response);
      }
      
    } catch (error) {
      console.error('上传失败:', error);
      
      const errorMessage = error.response?.data?.message || error.message || '上传失败，请重试';
      
      notification.error({
        message: '上传失败',
        description: errorMessage,
        duration: 6
      });
      
      // 执行错误回调
      if (typeof onError === 'function') {
        onError(error);
      }
    } finally {
      confirmLoading.setFalse();
    }
  }, [authorId, confirmLoading]);

  /**
   * 获取提交按钮配置
   * @param {number} fileCount - 文件数量
   * @returns {Object} 按钮配置
   */
  const getSubmitButtonProps = useCallback((fileCount = 0) => ({
    loading: confirmLoading.value,
    disabled: fileCount === 0,
    type: 'primary'
  }), [confirmLoading.value]);

  return {
    // 状态
    confirmLoading: confirmLoading.value,
    
    // 方法
    handleSubmit,
    getSubmitButtonProps
  };
};