import React from 'react';
import { Button, Divider } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './SocialAuth.less';

/**
 * 第三方登录组件
 * @param {object} props - 组件属性
 * @param {boolean} props.available - GitHub登录是否可用
 * @param {boolean} props.loading - 登录状态
 * @param {Function} props.onGithubLogin - GitHub登录回调
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 第三方登录组件
 */
const SocialAuth = ({
  available = false,
  loading = false,
  onGithubLogin,
  className = ''
}) => {
  if (!available) {
    return null;
  }

  return (
    <div className={`social-auth ${className}`}>
      <Divider className="divider">
        <span className="divider-text">或</span>
      </Divider>
      
      <div className="social-auth__content">
        <Button
          block
          size="large"
          icon={<GithubOutlined />}
          onClick={onGithubLogin}
          loading={loading}
          className="github-btn"
        >
          {loading ? 'GitHub 登录中...' : '使用 GitHub 登录'}
        </Button>
        
        <p className="social-auth__tips">
          使用 GitHub 登录将自动创建账号
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;