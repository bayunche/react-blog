import React, { memo } from 'react';
import { Empty, Spin, Alert } from 'antd';
import CommentItem from './CommentItem';
import './styles/CommentList.less';

/**
 * 评论列表组件
 * @param {object} props - 组件属性
 * @param {Array} props.comments - 评论列表数据
 * @param {boolean} props.loading - 加载状态
 * @param {string} props.error - 错误信息
 * @param {Function} props.onReply - 回复回调函数
 * @param {number} props.articleId - 文章ID
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 评论列表组件
 */
const CommentList = memo(({ 
  comments = [], 
  loading = false,
  error = null,
  onReply,
  articleId = -1,
  className = '' 
}) => {
  /**
   * 渲染加载状态
   */
  if (loading) {
    return (
      <div className={`comment-list ${className}`}>
        <div className="comment-list__loading">
          <Spin size="large" tip="加载评论中..." />
        </div>
      </div>
    );
  }

  /**
   * 渲染错误状态
   */
  if (error) {
    return (
      <div className={`comment-list ${className}`}>
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          className="comment-list__error"
        />
      </div>
    );
  }

  /**
   * 渲染空状态
   */
  if (!comments || comments.length === 0) {
    const emptyDescription = articleId !== -1 ? '暂无评论，快来抢沙发吧！' : '暂无留言';
    
    return (
      <div className={`comment-list ${className}`}>
        <Empty
          description={emptyDescription}
          className="comment-list__empty"
        />
      </div>
    );
  }

  /**
   * 渲染评论列表
   */
  return (
    <div className={`comment-list ${className}`}>
      <div className="comment-list__items">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
            className="comment-list__item"
          />
        ))}
      </div>
    </div>
  );
});

CommentList.displayName = 'CommentList';

export default CommentList;