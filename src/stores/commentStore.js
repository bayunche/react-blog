import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * 评论状态管理
 * 管理评论相关的状态和操作
 */
export const useCommentStore = create(
  immer((set, get) => ({
    // 状态
    comments: {},  // 按文章ID存储评论 { articleId: [comments] }
    loadingStates: {}, // 加载状态 { articleId: boolean }
    submitStates: {}, // 提交状态 { articleId: boolean }
    errors: {}, // 错误状态 { articleId: string }
    totalCounts: {}, // 评论总数 { articleId: number }
    
    // 当前操作状态
    replyingTo: null, // 正在回复的评论ID
    editingComment: null, // 正在编辑的评论ID

    // Actions
    
    /**
     * 设置文章评论列表
     */
    setComments: (articleId, comments) => set((state) => {
      state.comments[articleId] = comments;
      state.totalCounts[articleId] = comments.length;
      state.loadingStates[articleId] = false;
      state.errors[articleId] = null;
    }),

    /**
     * 添加新评论
     */
    addComment: (articleId, comment) => set((state) => {
      if (!state.comments[articleId]) {
        state.comments[articleId] = [];
      }
      
      // 如果是回复，添加到父评论的replies中
      if (comment.parentId) {
        const parentComment = state.comments[articleId].find(c => c.id === comment.parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.unshift(comment);
        }
      } else {
        // 顶级评论添加到列表开头
        state.comments[articleId].unshift(comment);
      }
      
      state.totalCounts[articleId] = (state.totalCounts[articleId] || 0) + 1;
      state.submitStates[articleId] = false;
    }),

    /**
     * 更新评论
     */
    updateComment: (articleId, commentId, updates) => set((state) => {
      const comments = state.comments[articleId] || [];
      
      // 查找并更新评论（包括回复）
      const updateCommentRecursive = (commentList) => {
        for (let comment of commentList) {
          if (comment.id === commentId) {
            Object.assign(comment, updates);
            return true;
          }
          if (comment.replies && updateCommentRecursive(comment.replies)) {
            return true;
          }
        }
        return false;
      };
      
      updateCommentRecursive(comments);
    }),

    /**
     * 删除评论
     */
    deleteComment: (articleId, commentId) => set((state) => {
      const comments = state.comments[articleId] || [];
      
      // 递归删除评论
      const deleteCommentRecursive = (commentList) => {
        for (let i = 0; i < commentList.length; i++) {
          if (commentList[i].id === commentId) {
            commentList.splice(i, 1);
            state.totalCounts[articleId] = Math.max(0, (state.totalCounts[articleId] || 0) - 1);
            return true;
          }
          if (commentList[i].replies && deleteCommentRecursive(commentList[i].replies)) {
            return true;
          }
        }
        return false;
      };
      
      deleteCommentRecursive(comments);
    }),

    /**
     * 点赞/取消点赞评论
     */
    toggleLike: (articleId, commentId, isLiked, likeCount) => set((state) => {
      const comments = state.comments[articleId] || [];
      
      const toggleLikeRecursive = (commentList) => {
        for (let comment of commentList) {
          if (comment.id === commentId) {
            comment.isLiked = isLiked;
            comment.likeCount = likeCount;
            return true;
          }
          if (comment.replies && toggleLikeRecursive(comment.replies)) {
            return true;
          }
        }
        return false;
      };
      
      toggleLikeRecursive(comments);
    }),

    /**
     * 设置加载状态
     */
    setLoading: (articleId, loading) => set((state) => {
      state.loadingStates[articleId] = loading;
    }),

    /**
     * 设置提交状态
     */
    setSubmitting: (articleId, submitting) => set((state) => {
      state.submitStates[articleId] = submitting;
    }),

    /**
     * 设置错误状态
     */
    setError: (articleId, error) => set((state) => {
      state.errors[articleId] = error;
      state.loadingStates[articleId] = false;
      state.submitStates[articleId] = false;
    }),

    /**
     * 清除错误
     */
    clearError: (articleId) => set((state) => {
      state.errors[articleId] = null;
    }),

    /**
     * 设置正在回复的评论
     */
    setReplyingTo: (commentId) => set((state) => {
      state.replyingTo = commentId;
      state.editingComment = null; // 回复时清除编辑状态
    }),

    /**
     * 设置正在编辑的评论
     */
    setEditingComment: (commentId) => set((state) => {
      state.editingComment = commentId;
      state.replyingTo = null; // 编辑时清除回复状态
    }),

    /**
     * 清除操作状态
     */
    clearOperationStates: () => set((state) => {
      state.replyingTo = null;
      state.editingComment = null;
    }),

    /**
     * 获取文章评论数据
     */
    getArticleComments: (articleId) => {
      const state = get();
      return {
        comments: state.comments[articleId] || [],
        loading: state.loadingStates[articleId] || false,
        submitting: state.submitStates[articleId] || false,
        error: state.errors[articleId] || null,
        totalCount: state.totalCounts[articleId] || 0,
      };
    },

    /**
     * 获取评论统计信息
     */
    getCommentStats: (articleId) => {
      const state = get();
      const comments = state.comments[articleId] || [];
      
      let totalReplies = 0;
      const countReplies = (commentList) => {
        commentList.forEach(comment => {
          if (comment.replies) {
            totalReplies += comment.replies.length;
            countReplies(comment.replies);
          }
        });
      };
      
      countReplies(comments);
      
      return {
        totalComments: comments.length,
        totalReplies,
        totalCount: comments.length + totalReplies,
      };
    },

    /**
     * 清空指定文章的评论数据
     */
    clearArticleComments: (articleId) => set((state) => {
      delete state.comments[articleId];
      delete state.loadingStates[articleId];
      delete state.submitStates[articleId];
      delete state.errors[articleId];
      delete state.totalCounts[articleId];
    }),

    /**
     * 重置所有状态
     */
    reset: () => set((state) => {
      state.comments = {};
      state.loadingStates = {};
      state.submitStates = {};
      state.errors = {};
      state.totalCounts = {};
      state.replyingTo = null;
      state.editingComment = null;
    }),
  }))
);