import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import { API_BASE_URL } from '@/config.jsx';
import { getToken } from '@/utils';
import axios from '@/utils/axios';

/**
 * 文件上传管理Hook
 * @returns {Object} 上传文件相关状态和方法
 */
export const useUploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [parsedList, setParsedList] = useState([]);
  const timer = useRef(null);

  /**
   * 获取文件解析结果
   * @param {string} fileName - 文件名
   * @returns {Object} 解析结果
   */
  const getParsedFile = useCallback((fileName) => {
    return parsedList.find(d => d.fileName === fileName) || {};
  }, [parsedList]);

  /**
   * 处理文件变化
   * @param {Object} param0 - 文件变化参数
   */
  const handleFileChange = useCallback(({ file, fileList }) => {
    if (file.status === 'done') {
      // 防抖检查文件是否存在
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fileNameList = fileList.map(item => item.name);
        
        if (fileNameList.length > 0) {
          axios.post('/article/checkExist', { fileNameList })
            .then(list => {
              setParsedList(list);
            })
            .catch(error => {
              console.error('检查文件存在性失败:', error);
              message.error('检查文件状态失败');
            });
        }
      }, 1000);
    }
    
    setFileList(fileList);
  }, []);

  /**
   * 删除文件
   * @param {string} uid - 文件唯一标识
   */
  const removeFile = useCallback((uid) => {
    const index = fileList.findIndex(file => file.uid === uid);
    if (index > -1) {
      const newFileList = [...fileList];
      newFileList.splice(index, 1);
      setFileList(newFileList);
    }
  }, [fileList]);

  /**
   * 重置文件列表
   */
  const resetFiles = useCallback(() => {
    setFileList([]);
    setParsedList([]);
    clearTimeout(timer.current);
  }, []);

  /**
   * 获取上传配置
   * @returns {Object} 上传配置
   */
  const getUploadConfig = useCallback(() => ({
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: `${API_BASE_URL}/article/upload`,
    onChange: handleFileChange,
    headers: { Authorization: getToken() },
    accept: 'text/markdown',
    beforeUpload: (file) => {
      const isMarkdown = file.type === 'text/markdown' || file.name.endsWith('.md');
      
      if (!isMarkdown) {
        message.error('只能上传 Markdown 文件!');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!');
        return false;
      }

      return true;
    }
  }), [handleFileChange]);

  /**
   * 准备上传的文件列表
   * @returns {Array} 准备上传的文件列表
   */
  const getUploadList = useCallback(() => {
    return fileList.reduce((list, file) => {
      if (file.status === 'done') {
        const result = parsedList.find(d => file.name === d.fileName);
        if (result) {
          list.push(result);
        }
      }
      return list;
    }, []);
  }, [fileList, parsedList]);

  return {
    // 状态
    fileList,
    parsedList,
    
    // 方法
    getParsedFile,
    handleFileChange,
    removeFile,
    resetFiles,
    getUploadConfig,
    getUploadList
  };
};