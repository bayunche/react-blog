import React from 'react';
import { Button, Input, Form } from 'antd';
import { InfoCircleOutlined, GithubOutlined } from '@ant-design/icons';
import { useUserAuth } from './hooks/useUserAuth';
import { useCommentForm } from './hooks/useCommentForm';
import './styles/CommentForm.less';

const { TextArea } = Input;

/**
 * 评论表单组件
 * @param {object} props - 组件属性
 * @param {number} props.articleId - 文章ID
 * @param {Function} props.onSubmit - 提交回调函数
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 评论表单组件
 */
const CommentForm = ({ 
  articleId = -1, 
  onSubmit,
  className = '' 
}) => {
  const {
    userInfo,
    guestInfo,
    emailError,
    updateGuestUsername,
    updateGuestEmail,
    handleGuestAuth,
    getUserAvatar
  } = useUserAuth();

  const {
    content,
    submitting,
    updateContent,
    handleSubmit,
    canSubmit,
    getSubmitButtonText,
    getPlaceholder
  } = useCommentForm({ onSubmit, articleId });

  /**
   * 处理表单提交
   */
  const onFormSubmit = async () => {
    if (!userInfo.username) {
      // 访客用户需要先进行认证
      const authSuccess = await handleGuestAuth((updatedUserInfo) => {
        // 认证成功后提交评论
        const commentData = {
          articleId,
          content,
          userId: updatedUserInfo.userId
        };
        onSubmit(commentData);
      });

      if (!authSuccess) return;
    } else {
      // 已登录用户直接提交
      await handleSubmit(userInfo, guestInfo);
    }
  };

  /**
   * 渲染访客信息输入
   */
  const renderGuestInputs = () => {
    if (userInfo.username) return null;

    return (
      <div className="comment-form__guest-inputs">
        <Form.Item className="comment-form__guest-input">
          <Input 
            placeholder="用户名" 
            value={guestInfo.username}
            onChange={(e) => updateGuestUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item className="comment-form__guest-input">
          <Input 
            status={emailError ? 'error' : ''}
            placeholder="QQ邮箱" 
            value={guestInfo.email}
            onChange={(e) => updateGuestEmail(e.target.value)}
          />
        </Form.Item>
      </div>
    );
  };

  /**
   * 渲染用户头像
   */
  const renderAvatar = () => {
    const avatarImg = getUserAvatar();
    
    if (avatarImg) {
      return avatarImg;
    }

    // 访客头像（基于邮箱）
    if (!userInfo.username && guestInfo.email && !emailError) {
      return (
        <img 
          src={`http://q1.qlogo.cn/g?b=qq&nk=${guestInfo.email.split('@')[0]}&s=100`} 
          alt="头像" 
        />
      );
    }

    // 默认头像
    return (
      <GithubOutlined 
        style={{ fontSize: 40, margin: '5px 5px 0 0', color: '#8c8c8c' }} 
      />
    );
  };

  return (
    <div className={`comment-form ${className}`}>
      <div className="comment-form__avatar">
        {renderAvatar()}
      </div>
      
      <div className="comment-form__content">
        {renderGuestInputs()}
        
        <Form.Item>
          <TextArea 
            rows={4} 
            placeholder={getPlaceholder()}
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            className="comment-form__textarea"
          />
        </Form.Item>
        
        <Form.Item>
          <div className="comment-form__controls">
            <div className="comment-form__tip">
              <InfoCircleOutlined className="comment-form__tip-icon" />
              <span className="comment-form__tip-text">支持 Markdown 语法</span>
            </div>
            
            <Button 
              type="primary"
              loading={submitting}
              disabled={!canSubmit(userInfo, guestInfo)}
              onClick={onFormSubmit}
              className="comment-form__submit-btn"
            >
              {getSubmitButtonText()}
            </Button>
          </div>
        </Form.Item>
      </div>
    </div>
  );
};

export default CommentForm;