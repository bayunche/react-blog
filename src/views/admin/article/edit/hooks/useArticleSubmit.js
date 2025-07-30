import { useState } from 'react';
import { message, Modal } from 'antd';
import axios from '@/utils/axios';

/**
 * 文章提交相关逻辑的自定义 Hook
 * @param {object} options - 配置选项
 * @param {Function} options.onSuccess - 成功回调函数
 * @param {Function} options.onError - 错误回调函数
 * @returns {object} 提交相关的状态和方法
 */
export const useArticleSubmit = ({ onSuccess, onError } = {}) => {
  const [submitting, setSubmitting] = useState(false);

  /**
   * 创建新文章
   * @param {object} formData - 表单数据
   * @param {object} navigation - 路由导航对象（用于跳转）
   */
  const createArticle = async (formData, navigation) => {
    setSubmitting(true);

    try {
      const response = await axios.post('/article', formData);
      
      message.success('文章创建成功！');
      
      // 显示确认对话框，询问是否查看文章
      Modal.confirm({
        title: '文章创建成功！是否立即查看？',
        content: '您可以选择查看刚创建的文章，或继续编辑其他内容。',
        okText: '立即查看',
        cancelText: '继续编辑',
        onOk: () => {
          if (navigation && navigation.push) {
            navigation.push(`/article/${response.id}`);
          } else if (typeof window !== 'undefined') {
            window.open(`/article/${response.id}`, '_blank');
          }
        },
        onCancel: () => {
          // 用户选择继续编辑，可以清空表单或其他操作
          onSuccess?.(response, 'continue');
        }
      });
      
      onSuccess?.(response, 'created');
      return response;
    } catch (error) {
      console.error('Failed to create article:', error);
      const errorMessage = error.response?.data?.message || error.message || '创建失败，请重试';
      message.error(errorMessage);
      onError?.(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 更新文章
   * @param {number} articleId - 文章ID
   * @param {object} updateData - 更新数据
   */
  const updateArticle = async (articleId, updateData) => {
    setSubmitting(true);

    try {
      const response = await axios.put(`/article/${articleId}`, updateData);
      
      message.success('文章更新成功！');
      onSuccess?.(response, 'updated');
      return response;
    } catch (error) {
      console.error('Failed to update article:', error);
      const errorMessage = error.response?.data?.message || error.message || '更新失败，请重试';
      message.error(errorMessage);
      onError?.(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 保存草稿
   * @param {object} formData - 表单数据
   */
  const saveDraft = async (formData) => {
    setSubmitting(true);

    try {
      const draftData = {
        ...formData,
        type: false, // 标记为草稿
        top: false   // 草稿不置顶
      };

      const response = await axios.post('/article/draft', draftData);
      
      message.success('草稿保存成功！');
      onSuccess?.(response, 'draft');
      return response;
    } catch (error) {
      console.error('Failed to save draft:', error);
      const errorMessage = error.response?.data?.message || error.message || '保存草稿失败';
      message.error(errorMessage);
      onError?.(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 预览文章
   * @param {object} formData - 表单数据
   */
  const previewArticle = (formData) => {
    try {
      // 将数据保存到本地存储用于预览
      const previewData = {
        ...formData,
        previewMode: true,
        previewTime: Date.now()
      };
      
      localStorage.setItem('articlePreview', JSON.stringify(previewData));
      
      // 打开预览窗口
      const previewWindow = window.open('/article/preview', '_blank');
      
      if (!previewWindow) {
        message.warning('请允许弹窗以预览文章');
      }
    } catch (error) {
      console.error('Failed to preview article:', error);
      message.error('预览失败');
    }
  };

  return {
    submitting,
    createArticle,
    updateArticle,
    saveDraft,
    previewArticle
  };
};