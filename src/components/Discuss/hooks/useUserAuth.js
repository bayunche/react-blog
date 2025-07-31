import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { login, register } from '@/redux/user/actions';
import { loginout } from '@/redux/user/actions';
import { get } from '@/utils/storage';
import axios from '@/utils/axios';
import useBus from '@/hooks/useBus';

/**
 * 用户认证相关逻辑的自定义 Hook
 * @returns {object} 用户认证相关的状态和方法
 */
export const useUserAuth = () => {
  const dispatch = useDispatch();
  const bus = useBus();
  const userInfo = useSelector(state => state.user);
  
  const [guestInfo, setGuestInfo] = useState({
    username: '',
    email: ''
  });
  const [emailError, setEmailError] = useState(false);

  /**
   * 验证邮箱格式（QQ邮箱）
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  const validateEmail = useCallback((email) => {
    const regExp = /[1-9][0-9]{4,}@qq\.com/;
    return regExp.test(email);
  }, []);

  /**
   * 更新访客用户名
   * @param {string} username - 用户名
   */
  const updateGuestUsername = useCallback((username) => {
    setGuestInfo(prev => ({ ...prev, username }));
  }, []);

  /**
   * 更新访客邮箱
   * @param {string} email - 邮箱地址
   */
  const updateGuestEmail = useCallback((email) => {
    setGuestInfo(prev => ({ ...prev, email }));
    
    if (email) {
      const isValid = validateEmail(email);
      setEmailError(!isValid);
    } else {
      setEmailError(false);
    }
  }, [validateEmail]);

  /**
   * 处理菜单点击事件
   * @param {object} e - 事件对象
   */
  const handleMenuClick = useCallback((e) => {
    switch (e.key) {
      case 'login':
        bus.emit('openSignModal', 'login');
        break;
      case 'register':
        bus.emit('openSignModal', 'register');
        break;
      case 'loginout':
        dispatch(loginout());
        // 清空访客信息
        setGuestInfo({ username: '', email: '' });
        setEmailError(false);
        break;
      default:
        break;
    }
  }, [dispatch, bus]);

  /**
   * 访客用户登录/注册流程
   * @param {Function} onSuccess - 成功回调
   * @returns {Promise} 返回处理结果
   */
  const handleGuestAuth = useCallback(async (onSuccess) => {
    const { username, email } = guestInfo;

    if (!username || !email) {
      message.error('请填写用户名和邮箱');
      return false;
    }

    if (!validateEmail(email)) {
      message.error('邮箱格式不正确，请使用QQ邮箱');
      return false;
    }

    try {
      // 固定密码策略 - 这里保持与原代码一致，但在实际使用中应该改进
      const values = { username, password: 'root', email };
      const loginValues = { account: username, password: 'root' };

      // 检查用户是否存在
      const userExists = await axios.get(`/user/find/${username}`);
      
      if (userExists.id === undefined) {
        // 用户不存在，先注册
        await dispatch(register(values));
        
        // 注册成功后自动登录
        const loginResult = await dispatch(login(loginValues));
        
        if (loginResult) {
          const updatedUserInfo = get('userInfo');
          onSuccess?.(updatedUserInfo);
          return true;
        }
      } else {
        // 用户已存在，直接登录
        const loginResult = await dispatch(login(loginValues));
        
        if (loginResult) {
          const updatedUserInfo = get('userInfo');
          onSuccess?.(updatedUserInfo);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Guest auth failed:', error);
      message.error('登录失败，请重试');
      return false;
    }
  }, [guestInfo, validateEmail, dispatch]);

  /**
   * 获取用户头像
   * @param {object} user - 用户信息
   * @returns {JSX.Element} 头像元素
   */
  const getUserAvatar = useCallback((user = userInfo) => {
    if (user?.email && validateEmail(user.email)) {
      return (
        <img 
          src={`http://q1.qlogo.cn/g?b=qq&nk=${user.email.split('@')[0]}&s=100`} 
          alt="头像" 
        />
      );
    }
    
    if (user?.github) {
      return <img src={user.github.avatar_url} alt="GitHub头像" />;
    }

    // 默认头像 - 使用图标
    return null;
  }, [userInfo, validateEmail]);

  /**
   * 清空访客信息
   */
  const clearGuestInfo = useCallback(() => {
    setGuestInfo({ username: '', email: '' });
    setEmailError(false);
  }, []);

  return {
    // 状态
    userInfo,
    guestInfo,
    emailError,
    
    // 方法
    updateGuestUsername,
    updateGuestEmail,
    handleMenuClick,
    handleGuestAuth,
    getUserAvatar,
    clearGuestInfo,
    validateEmail
  };
};