import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import { calcCommentsCount } from '@/utils';
import { useComments } from './hooks/useComments';
import UserAuth from './UserAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import './styles/index.less';

/**
 * 讨论组件 - 重构后的主容器组件
 * @param {object} props - 组件属性
 * @param {Array} props.commentList - 评论列表数据
 * @param {number} props.articleId - 文章ID
 * @param {Function} props.setCommentList - 设置评论列表的回调函数
 * @returns {JSX.Element} 讨论组件
 */
const Discuss = ({ 
  commentList = [], 
  articleId = -1, 
  setCommentList 
}) => {
  const {
    comments,
    loading,
    error,
    addComment,
    updateComments,
    clearError
  } = useComments(articleId);

  // 使用传入的commentList作为数据源，如果有的话
  const displayComments = commentList.length > 0 ? commentList : comments;

  /**
   * 处理评论提交
   * @param {object} commentData - 评论数据
   * @returns {Promise} 提交结果
   */
  const handleCommentSubmit = async (commentData) => {
    try {
      const result = await addComment(commentData);
      
      // 如果有外部的setCommentList回调，也要调用它来保持同步
      if (setCommentList && result.rows) {
        setCommentList(result.rows);
      }
      
      return result;
    } catch (error) {
      console.error('Submit comment failed:', error);
      throw error;
    }
  };

  /**
   * 处理回复评论
   * @param {object} comment - 被回复的评论
   */
  const handleReply = (comment) => {
    // 这里可以实现回复功能，比如打开回复表单或者@用户
    console.log('Reply to comment:', comment);
    // TODO: 实现回复功能
  };

  /**
   * 渲染讨论标题
   */
  const renderHeader = () => {
    const commentsCount = calcCommentsCount(displayComments);
    const headerText = articleId !== -1 ? '条评论' : '条留言';

    return (
      <div className="discuss__header">
        <span className="discuss__count">{commentsCount}</span>
        {headerText}
        <div className="discuss__user">
          <UserAuth />
        </div>
        <Divider className="discuss__divider" />
      </div>
    );
  };

  return (
    <div id="discuss" className="discuss">
      {renderHeader()}
      
      <div className="discuss__form">
        <CommentForm
          articleId={articleId}
          onSubmit={handleCommentSubmit}
        />
      </div>

      <div className="discuss__list">
        <CommentList
          comments={displayComments}
          loading={loading}
          error={error}
          onReply={handleReply}
          articleId={articleId}
        />
      </div>
    </div>
  );
};

Discuss.propTypes = {
  commentList: PropTypes.array,
  articleId: PropTypes.number,
  setCommentList: PropTypes.func
};

Discuss.defaultProps = {
  commentList: [],
  articleId: -1,
  setCommentList: null
};

export default Discuss;