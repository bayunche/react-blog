import { useState, useEffect } from 'react';
import axios from '@/utils/axios';

/**
 * 评论相关逻辑的自定义 Hook
 * @param {number} articleId - 文章ID
 * @returns {object} 评论相关的状态和方法
 */
export const useComments = (articleId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 加载评论列表
   */
  const loadComments = async () => {
    if (!articleId || articleId === -1) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/discuss/article/${articleId}`);
      setComments(response.rows || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setError(error.message || '加载评论失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 添加评论
   * @param {object} commentData - 评论数据
   * @returns {Promise} 返回添加结果
   */
  const addComment = async (commentData) => {
    try {
      const response = await axios.post('/discuss', commentData);
      
      // 更新评论列表
      if (response.rows) {
        setComments(response.rows);
      } else {
        // 如果接口没有返回完整列表，则重新加载
        await loadComments();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError(error.message || '添加评论失败');
      throw error;
    }
  };

  /**
   * 更新评论列表
   * @param {Array} newComments - 新的评论列表
   */
  const updateComments = (newComments) => {
    setComments(newComments);
  };

  /**
   * 清空评论列表
   */
  const clearComments = () => {
    setComments([]);
  };

  /**
   * 清除错误状态
   */
  const clearError = () => {
    setError(null);
  };

  // 当 articleId 变化时重新加载评论
  useEffect(() => {
    if (articleId && articleId !== -1) {
      loadComments();
    } else {
      clearComments();
    }
  }, [articleId]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    updateComments,
    clearComments,
    clearError
  };
};