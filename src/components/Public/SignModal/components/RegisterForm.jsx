import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import './RegisterForm.less';

/**
 * 注册表单组件
 * @param {object} props - 组件属性
 * @param {Form} props.form - 表单实例
 * @param {object} props.formLayout - 表单布局配置
 * @param {object} props.formRules - 表单验证规则
 * @param {boolean} props.submitting - 提交状态
 * @param {Function} props.onSubmit - 提交回调
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 注册表单组件
 */
const RegisterForm = ({
  form,
  formLayout,
  formRules,
  submitting = false,
  onSubmit,
  className = ''
}) => {
  return (
    <div className={`register-form ${className}`}>
      <div className="register-form__header">
        <h3 className="form-title">用户注册</h3>
        <p className="form-description">创建您的新账号</p>
      </div>

      <Form
        form={form}
        layout="horizontal"
        {...formLayout}
        onFinish={onSubmit}
        className="register-form__form"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={formRules.username}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined className="input-icon" />}
            placeholder="请输入用户名（2-20个字符）"
            size="large"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={formRules.password}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="input-icon" />}
            placeholder="请输入密码（至少8位，包含字母和数字）"
            size="large"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirm"
          rules={formRules.confirm}
          hasFeedback
        >
          <Input.Password
            prefix={<SafetyOutlined className="input-icon" />}
            placeholder="请再次输入密码"
            size="large"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={formRules.email}
          hasFeedback
        >
          <Input
            prefix={<MailOutlined className="input-icon" />}
            placeholder="请输入邮箱地址"
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
            {submitting ? '注册中...' : '注册'}
          </Button>
        </Form.Item>
      </Form>

      <div className="register-form__footer">
        <div className="password-tips">
          <h4>密码要求：</h4>
          <ul>
            <li>至少8个字符</li>
            <li>包含大小写字母</li>
            <li>包含数字</li>
            <li>可包含特殊字符</li>
          </ul>
        </div>
        
        <p className="footer-text">
          已有账号？
          <Button type="link" size="small" className="switch-link">
            立即登录
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;