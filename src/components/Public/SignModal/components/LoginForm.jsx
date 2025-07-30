import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './LoginForm.less';

/**
 * 登录表单组件
 * @param {object} props - 组件属性
 * @param {Form} props.form - 表单实例
 * @param {object} props.formLayout - 表单布局配置
 * @param {object} props.formRules - 表单验证规则
 * @param {boolean} props.submitting - 提交状态
 * @param {Function} props.onSubmit - 提交回调
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 登录表单组件
 */
const LoginForm = ({
  form,
  formLayout,
  formRules,
  submitting = false,
  onSubmit,
  className = ''
}) => {
  return (
    <div className={`login-form ${className}`}>
      <div className="login-form__header">
        <h3 className="form-title">用户登录</h3>
        <p className="form-description">请输入您的登录凭据</p>
      </div>

      <Form
        form={form}
        layout="horizontal"
        {...formLayout}
        onFinish={onSubmit}
        className="login-form__form"
      >
        <Form.Item
          label="用户名"
          name="account"
          rules={formRules.account}
        >
          <Input
            prefix={<UserOutlined className="input-icon" />}
            placeholder="请输入用户名"
            size="large"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={formRules.password}
        >
          <Input.Password
            prefix={<LockOutlined className="input-icon" />}
            placeholder="请输入密码"
            size="large"
            className="form-input"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: formLayout.labelCol.sm.span, span: formLayout.wrapperCol.sm.span }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            size="large"
            block
            className="submit-btn"
          >
            {submitting ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </Form>

      <div className="login-form__footer">
        <p className="footer-text">
          还没有账号？
          <Button type="link" size="small" className="switch-link">
            立即注册
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;