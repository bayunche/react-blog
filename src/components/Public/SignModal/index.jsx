import React, { useState, useCallback } from 'react';
import { Modal, Alert, Tabs } from 'antd';
import { useListener } from '@/hooks/useBus';

// 自定义Hooks
import { useAuthForm } from './hooks/useAuthForm';
import { useGithubAuth } from './hooks/useGithubAuth';

// 子组件
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';

// 样式
import './styles/index.less';

const { TabPane } = Tabs;

/**
 * 登录注册弹窗组件 - 重构后的版本
 * 支持账号登录、注册和GitHub第三方登录
 */
const SignModal = () => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');

  // GitHub登录相关
  const {
    isGithubAuthAvailable,
    handleGithubLogin,
    getGithubButtonConfig
  } = useGithubAuth();

  // 表单相关
  const {
    form,
    submitting,
    handleSubmit,
    resetForm,
    getFormRules,
    getFormLayout
  } = useAuthForm({
    onSuccess: (response, type) => {
      console.log(`${type} success:`, response);
      setVisible(false);
      if (type === 'register') {
        // 注册成功后切换到登录页面
        setActiveTab('login');
        resetForm();
      }
    },
    onClose: () => {
      setVisible(false);
    }
  });

  /**
   * 监听打开弹窗事件
   */
  useListener('openSignModal', (type) => {
    resetForm();
    setError('');
    setActiveTab(type || 'login');
    setVisible(true);
  });

  /**
   * 处理弹窗关闭
   */
  const handleClose = useCallback(() => {
    setVisible(false);
    setError('');
    resetForm();
  }, [resetForm]);

  /**
   * 处理标签页切换
   * @param {string} key - 标签页键值
   */
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setError('');
    resetForm();
  }, [resetForm]);

  /**
   * 处理表单提交
   */
  const handleFormSubmit = useCallback(async () => {
    try {
      await handleSubmit(activeTab);
    } catch (error) {
      console.error('Form submit failed:', error);
    }
  }, [handleSubmit, activeTab]);

  /**
   * 处理GitHub登录
   */
  const handleGithubAuth = useCallback(() => {
    handleGithubLogin({
      onBeforeRedirect: () => {
        setVisible(false);
      },
      onError: (error) => {
        setError(error.message);
      }
    });
  }, [handleGithubLogin]);

  // 获取表单配置
  const formLayout = getFormLayout();
  const formRules = getFormRules();
  const githubConfig = getGithubButtonConfig();

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={480}
      centered
      className="sign-modal"
      destroyOnClose
    >
      <div className="sign-modal__content">
        {/* 错误提示 */}
        {error && (
          <Alert
            message="操作失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="error-alert"
          />
        )}

        {/* 标签页切换 */}
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          className="auth-tabs"
        >
          <TabPane tab="登录" key="login">
            <LoginForm
              form={form}
              formLayout={formLayout}
              formRules={formRules.login}
              submitting={submitting}
              onSubmit={handleFormSubmit}
            />
          </TabPane>
          
          <TabPane tab="注册" key="register">
            <RegisterForm
              form={form}
              formLayout={formLayout}
              formRules={formRules.register}
              submitting={submitting}
              onSubmit={handleFormSubmit}
            />
          </TabPane>
        </Tabs>

        {/* 第三方登录 */}
        <SocialAuth
          available={githubConfig.available}
          loading={submitting}
          onGithubLogin={handleGithubAuth}
        />
      </div>
    </Modal>
  );
};

export default SignModal;