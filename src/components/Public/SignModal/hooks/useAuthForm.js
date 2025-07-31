import { useState, useCallback } from 'react';
import { Form, message } from 'antd';
import { validatePassword } from '@/utils/password';
import { useUserStore } from '@/stores';
import { loginAPI, registerAPI } from '@/api/user';

/**
 * 认证表单逻辑的自定义 Hook
 * @param {object} options - 配置选项
 * @param {Function} options.onSuccess - 成功回调
 * @param {Function} options.onClose - 关闭回调
 * @returns {object} 表单相关的状态和方法
 */
export const useAuthForm = ({ onSuccess, onClose } = {}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { loginSuccess, setLoading, setError, clearError } = useUserStore();

  /**
   * 重置表单
   */
  const resetForm = useCallback(() => {
    form.resetFields();
    clearError();
  }, [form, clearError]);

  /**
   * 验证确认密码
   * @param {object} rule - 验证规则
   * @param {string} value - 输入值
   * @returns {Promise} 验证结果
   */
  const validateConfirmPassword = useCallback((rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && value !== form.getFieldValue('password')) {
        reject(new Error('两次输入的密码不一致！'));
      } else {
        resolve();
      }
    });
  }, [form]);

  /**
   * 处理登录
   * @param {object} values - 表单值
   */
  const handleLogin = useCallback(async (values) => {
    try {
      setSubmitting(true);
      setLoading(true);
      clearError();

      const response = await loginAPI(values);
      
      // 调用store中的登录成功方法
      loginSuccess(response);
      
      message.success('登录成功！');
      onSuccess?.(response, 'login');
      onClose?.();
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, [loginSuccess, setLoading, setError, clearError, onSuccess, onClose]);

  /**
   * 处理注册
   * @param {object} values - 表单值
   */
  const handleRegister = useCallback(async (values) => {
    try {
      setSubmitting(true);
      setLoading(true);
      clearError();

      // 验证密码强度
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        message.error(passwordValidation.message);
        return;
      }

      // 检查密码确认
      if (values.password !== values.confirm) {
        const errorMsg = '两次输入的密码不一致';
        setError(errorMsg);
        message.error(errorMsg);
        return;
      }

      const response = await registerAPI({
        username: values.username,
        password: values.password,
        email: values.email
      });
      
      message.success('注册成功！请使用新账号登录。');
      onSuccess?.(response, 'register');
      
      // 注册成功后不自动关闭，让用户可以直接登录
      // 清空表单并切换到登录模式可能更好
      resetForm();
    } catch (error) {
      console.error('Register failed:', error);
      const errorMessage = error.response?.data?.message || error.message || '注册失败，请重试';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, [setLoading, setError, clearError, onSuccess, resetForm]);

  /**
   * 处理表单提交
   * @param {string} authType - 认证类型 ('login' | 'register')
   */
  const handleSubmit = useCallback(async (authType) => {
    try {
      const values = await form.validateFields();
      
      if (authType === 'login') {
        await handleLogin(values);
      } else if (authType === 'register') {
        await handleRegister(values);
      }
    } catch (error) {
      if (error.errorFields) {
        // 表单验证失败
        console.log('Form validation failed:', error);
        message.warning('请检查表单填写是否完整和正确');
      }
    }
  }, [form, handleLogin, handleRegister]);

  /**
   * 获取表单验证规则
   */
  const getFormRules = useCallback(() => ({
    // 登录表单规则
    login: {
      account: [
        { required: true, message: '请输入用户名' },
        { min: 2, message: '用户名至少2个字符' },
        { max: 20, message: '用户名最多20个字符' }
      ],
      password: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码至少6个字符' }
      ]
    },
    // 注册表单规则
    register: {
      username: [
        { required: true, message: '请输入用户名' },
        { min: 2, message: '用户名至少2个字符' },
        { max: 20, message: '用户名最多20个字符' },
        { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
      ],
      password: [
        { required: true, message: '请输入密码' },
        { min: 8, message: '密码至少8个字符' },
        { 
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const validation = validatePassword(value);
            return validation.isValid ? Promise.resolve() : Promise.reject(new Error(validation.message));
          }
        }
      ],
      confirm: [
        { required: true, message: '请确认密码' },
        { validator: validateConfirmPassword }
      ],
      email: [
        { required: true, message: '请输入邮箱地址' },
        { type: 'email', message: '请输入有效的邮箱地址' }
      ]
    }
  }), [validateConfirmPassword]);

  /**
   * 获取表单布局配置
   */
  const getFormLayout = useCallback(() => ({
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  }), []);

  return {
    form,
    submitting,
    handleSubmit,
    resetForm,
    getFormRules,
    getFormLayout
  };
};