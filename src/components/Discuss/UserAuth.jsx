import React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, GithubOutlined } from '@ant-design/icons';
import { useUserAuth } from './hooks/useUserAuth';
import './styles/UserAuth.less';

/**
 * 用户认证组件 - 显示用户状态和认证菜单
 * @param {object} props - 组件属性
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 用户认证组件
 */
const UserAuth = ({ className = '' }) => {
  const { userInfo, handleMenuClick } = useUserAuth();
  const { username } = userInfo;

  /**
   * 渲染下拉菜单
   */
  const renderDropdownMenu = () => {
    return username ? (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="loginout">注销</Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="login">登录</Menu.Item>
        <Menu.Item key="register">注册</Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={`user-auth ${className}`}>
      <Dropdown 
        overlay={renderDropdownMenu()} 
        trigger={['click', 'hover']}
        placement="bottomLeft"
      >
        <span className="user-auth__trigger">
          {username || '未登录用户'} <DownOutlined />
        </span>
      </Dropdown>
    </div>
  );
};

export default UserAuth;