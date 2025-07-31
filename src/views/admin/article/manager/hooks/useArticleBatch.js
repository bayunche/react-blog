import { useState, useCallback } from 'react';
import { message } from 'antd';
import axios from '@/utils/axios';
import download from '@/utils/download';

/**
 * 文章批量操作逻辑的自定义 Hook
 * @param {Function} onRefresh - 刷新表格回调函数
 * @returns {object} 批量操作相关的状态和方法
 */
export const useArticleBatch = (onRefresh) => {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * 切换批量操作模式
   */
  const toggleBatchMode = useCallback(() => {
    setBatchMode(prev => {
      const newMode = !prev;
      if (!newMode) {
        // 关闭批量模式时清空选中项
        setSelectedRowKeys([]);
      }
      return newMode;
    });
  }, []);

  /**
   * 处理行选择变化
   * @param {Array} selectedKeys - 选中的行键
   */
  const handleSelectionChange = useCallback((selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  }, []);

  /**
   * 清空选中项
   */
  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  /**
   * 全选/取消全选
   * @param {boolean} selected - 是否选中
   * @param {Array} selectedRows - 选中的行数据
   * @param {Array} changeRows - 变化的行数据
   */
  const handleSelectAll = useCallback((selected, selectedRows, changeRows) => {
    if (selected) {
      // 全选
      const allKeys = selectedRows.map(row => row.id);
      setSelectedRowKeys(allKeys);
    } else {
      // 取消全选
      setSelectedRowKeys([]);
    }
  }, []);

  /**
   * 批量删除文章
   */
  const batchDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的文章');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/article/list/${selectedRowKeys.join(',')}`);
      message.success(`成功删除 ${selectedRowKeys.length} 篇文章`);
      setSelectedRowKeys([]);
      onRefresh();
    } catch (error) {
      console.error('Batch delete failed:', error);
      message.error('批量删除失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [selectedRowKeys, onRefresh]);

  /**
   * 批量导出选中的文章
   */
  const batchExportSelected = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的文章');
      return;
    }

    setLoading(true);
    try {
      await download(`/article/output/list/${selectedRowKeys.join(',')}`);
      message.success('文章导出已开始，请稍候下载');
    } catch (error) {
      console.error('Batch export failed:', error);
      message.error('批量导出失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [selectedRowKeys]);

  /**
   * 导出全部文章
   */
  const exportAll = useCallback(async () => {
    setLoading(true);
    try {
      await download('/article/output/all');
      message.success('全部文章导出已开始，请稍候下载');
    } catch (error) {
      console.error('Export all failed:', error);
      message.error('导出全部文章失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 批量更新文章状态
   * @param {object} updates - 要更新的字段
   */
  const batchUpdateStatus = useCallback(async (updates) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要更新的文章');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/article/batch/status`, {
        ids: selectedRowKeys,
        ...updates
      });
      message.success(`成功更新 ${selectedRowKeys.length} 篇文章的状态`);
      setSelectedRowKeys([]);
      onRefresh();
    } catch (error) {
      console.error('Batch update failed:', error);
      message.error('批量更新失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [selectedRowKeys, onRefresh]);

  /**
   * 批量设置为公开
   */
  const batchSetPublic = useCallback(() => {
    batchUpdateStatus({ type: true });
  }, [batchUpdateStatus]);

  /**
   * 批量设置为私密
   */
  const batchSetPrivate = useCallback(() => {
    batchUpdateStatus({ type: false });
  }, [batchUpdateStatus]);

  /**
   * 批量置顶
   */
  const batchSetTop = useCallback(() => {
    batchUpdateStatus({ top: true });
  }, [batchUpdateStatus]);

  /**
   * 批量取消置顶
   */
  const batchUnsetTop = useCallback(() => {
    batchUpdateStatus({ top: false });
  }, [batchUpdateStatus]);

  /**
   * 获取表格行选择配置
   */
  const getRowSelection = useCallback(() => {
    if (!batchMode) return null;

    return {
      selectedRowKeys,
      onChange: handleSelectionChange,
      onSelectAll: handleSelectAll,
      selections: [
        {
          key: 'select-all',
          text: '全选当前页',
          onSelect: (changeableRowKeys) => {
            setSelectedRowKeys(changeableRowKeys);
          }
        },
        {
          key: 'select-none',
          text: '清空选择',
          onSelect: () => {
            setSelectedRowKeys([]);
          }
        }
      ]
    };
  }, [batchMode, selectedRowKeys, handleSelectionChange, handleSelectAll]);

  /**
   * 获取选中状态信息
   */
  const getSelectionInfo = useCallback(() => ({
    hasSelection: selectedRowKeys.length > 0,
    selectionCount: selectedRowKeys.length,
    selectedKeys: selectedRowKeys
  }), [selectedRowKeys]);

  return {
    // 状态
    batchMode,
    selectedRowKeys,
    loading,
    
    // 基本操作
    toggleBatchMode,
    clearSelection,
    getRowSelection,
    getSelectionInfo,
    
    // 批量操作
    batchDelete,
    batchExportSelected,
    exportAll,
    batchSetPublic,
    batchSetPrivate,
    batchSetTop,
    batchUnsetTop
  };
};