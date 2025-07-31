import React, { memo } from 'react';
import { Comment } from 'antd';
import dayjs from 'dayjs';
import AppAvatar from '@/components/Avatar';
import { translateMarkdown } from '@/utils';
import SafeHTML from '@/components/SafeHTML';
import './styles/CommentItem.less';

/**
 * 单个评论项组件
 * @param {object} props - 组件属性
 * @param {object} props.comment - 评论数据
 * @param {Function} props.onReply - 回复回调函数
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 评论项组件
 */
const CommentItem = memo(({ 
  comment, 
  onReply,
  className = '' 
}) => {
  const {
    id,
    content,
    createdAt,
    user = {},
    children = []
  } = comment;

  /**
   * 格式化时间显示
   * @param {string} time - 时间字符串
   * @returns {string} 格式化后的时间
   */
  const formatTime = (time) => {
    const now = dayjs();
    const commentTime = dayjs(time);
    const diffDays = now.diff(commentTime, 'day');

    if (diffDays === 0) {
      return commentTime.format('HH:mm');
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return commentTime.format('MM-DD');
    }
  };

  /**
   * 获取用户头像
   * @param {object} userInfo - 用户信息
   * @returns {JSX.Element} 头像组件
   */
  const getUserAvatar = (userInfo) => {
    if (userInfo.email && /[1-9][0-9]{4,}@qq\.com/.test(userInfo.email)) {
      return (
        <img 
          src={`http://q1.qlogo.cn/g?b=qq&nk=${userInfo.email.split('@')[0]}&s=100`} 
          alt="头像"
          className="comment-item__avatar"
        />
      );
    }

    if (userInfo.github?.avatar_url) {
      return (
        <img 
          src={userInfo.github.avatar_url} 
          alt="GitHub头像"
          className="comment-item__avatar"
        />
      );
    }

    return <AppAvatar userInfo={userInfo} />;
  };

  /**
   * 渲染评论内容
   * @param {string} contentText - 评论内容
   * @returns {JSX.Element} 渲染后的内容
   */
  const renderContent = (contentText) => {
    const htmlContent = translateMarkdown(contentText);
    return <SafeHTML content={htmlContent} className="comment-item__content" />;
  };

  /**
   * 处理回复按钮点击
   */
  const handleReply = () => {
    onReply?.(comment);
  };

  /**
   * 渲染子评论列表
   * @param {Array} childComments - 子评论列表
   * @returns {JSX.Element|null} 子评论组件
   */
  const renderChildren = (childComments) => {
    if (!childComments || childComments.length === 0) return null;

    return childComments.map(childComment => (
      <CommentItem
        key={childComment.id}
        comment={childComment}
        onReply={onReply}
        className="comment-item--child"
      />
    ));
  };

  return (
    <div className={`comment-item ${className}`}>
      <Comment
        avatar={getUserAvatar(user)}
        author={
          <div className="comment-item__author">
            <span className="comment-item__username">
              {user.username || '匿名用户'}
            </span>
            {user.role === 1 && (
              <span className="comment-item__admin-badge">博主</span>
            )}
          </div>
        }
        content={renderContent(content)}
        datetime={
          <span className="comment-item__time" title={dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            {formatTime(createdAt)}
          </span>
        }
        actions={[
          <span 
            key="reply" 
            className="comment-item__reply-btn"
            onClick={handleReply}
          >
            回复
          </span>
        ]}
      >
        {renderChildren(children)}
      </Comment>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;