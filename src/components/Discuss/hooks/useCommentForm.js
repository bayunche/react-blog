import { useState, useCallback } from 'react';
import { message } from 'antd';
import useAjaxLoading from '@/hooks/useAjaxLoading';

/**
 * 评论表单相关逻辑的自定义 Hook
 * @param {object} options - 配置选项
 * @param {Function} options.onSubmit - 提交回调函数
 * @param {boolean} options.articleId - 文章ID，用于区分评论和留言
 * @returns {object} 表单相关的状态和方法
 */
export const useCommentForm = ({ onSubmit, articleId = -1 }) => {
  const [content, setContent] = useState('');
  const [submitting, withLoading] = useAjaxLoading();

  /**
   * 更新评论内容
   * @param {string} value - 评论内容
   */
  const updateContent = useCallback((value) => {
    setContent(value);
  }, []);

  /**
   * 清空评论内容
   */
  const clearContent = useCallback(() => {
    setContent('');
  }, []);

  /**
   * 处理表单提交
   * @param {object} userInfo - 用户信息
   * @param {object} guestInfo - 访客信息（如果未登录）
   * @returns {Promise} 提交结果
   */
  const handleSubmit = useCallback(async (userInfo, guestInfo = {}) => {
    // 验证评论内容
    if (!content.trim()) {
      message.warning('请输入评论内容');
      return false;
    }

    // 如果未登录且没有访客信息，提示登录
    if (!userInfo?.username && (!guestInfo.username || !guestInfo.email)) {
      message.warning('请先登录或填写用户名和邮箱');
      return false;
    }

    try {
      const commentData = {
        articleId,
        content: content.trim(),
        userId: userInfo?.userId || null
      };

      // 如果是访客评论，添加访客信息
      if (!userInfo?.username && guestInfo.username) {
        commentData.guestInfo = guestInfo;
      }

      const result = await withLoading(onSubmit(commentData));
      
      if (result) {
        // 提交成功后清空内容
        clearContent();
        message.success(articleId !== -1 ? '评论发表成功' : '留言发表成功');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Submit comment failed:', error);
      message.error('发表失败，请重试');
      return false;
    }
  }, [content, articleId, onSubmit, withLoading, clearContent]);

  /**
   * 验证表单是否可以提交
   * @param {object} userInfo - 用户信息
   * @param {object} guestInfo - 访客信息
   * @returns {boolean} 是否可以提交
   */
  const canSubmit = useCallback((userInfo, guestInfo = {}) => {
    // 内容不能为空
    if (!content.trim()) return false;
    
    // 必须有用户信息或完整的访客信息
    if (userInfo?.username) return true;
    
    return guestInfo.username && guestInfo.email;
  }, [content]);

  /**
   * 获取提交按钮文字
   * @returns {string} 按钮文字
   */
  const getSubmitButtonText = useCallback(() => {
    return articleId !== -1 ? '添加评论' : '留言';
  }, [articleId]);

  /**
   * 获取占位符文字
   * @returns {string} 占位符文字
   */
  const getPlaceholder = useCallback(() => {
    return articleId !== -1 ? '说点什么...' : '留下你的足迹...';
  }, [articleId]);

  return {
    // 状态
    content,
    submitting,
    
    // 方法
    updateContent,
    clearContent,
    handleSubmit,
    canSubmit,
    getSubmitButtonText,
    getPlaceholder
  };
};