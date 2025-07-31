import React from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { SERVER_URL } from '@/config';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import download from '@/utils/download';

// 自定义Hooks
import { useArticleTable } from './hooks/useArticleTable';
import { useArticleFilters } from './hooks/useArticleFilters';
import { useArticleBatch } from './hooks/useArticleBatch';

// 子组件
import ArticleFilters from './components/ArticleFilters';
import ArticleTable from './components/ArticleTable';
import BatchActions from './components/BatchActions';

// 样式
import './styles/index.less';

/**
 * 文章管理页面组件 - 重构后的版本
 * 功能包括：文章列表展示、搜索过滤、批量操作、导出等
 */
const ArticleManager = () => {
  // 设置面包屑导航
  useBreadcrumb(['文章管理']);

  // 获取Redux状态
  const { tagList, categoryList } = useSelector(state => ({
    tagList: state.article.tagList,
    categoryList: state.article.categoryList
  }));

  // 搜索过滤逻辑
  const {
    queryParams,
    filterForm,
    handleSearch,
    resetFilters,
    hasActiveFilters,
    getFiltersSummary
  } = useArticleFilters((params) => {
    onSearch(params);
  });

  /**
   * 复制分享链接
   * @param {string} uuid - 文章UUID
   */
  const handleCopyShare = (uuid) => {
    const shareUrl = `${SERVER_URL}/article/share/${uuid}`;
    
    // 尝试使用现代剪贴板API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        notification.success({
          message: '分享链接已复制',
          description: shareUrl,
          duration: 3
        });
      }).catch(() => {
        // fallback到通知显示
        showShareNotification(shareUrl);
      });
    } else {
      // fallback方案
      showShareNotification(shareUrl);
    }
  };

  /**
   * 显示分享链接通知
   * @param {string} url - 分享链接
   */
  const showShareNotification = (url) => {
    notification.open({
      message: '分享链接',
      description: (
        <div>
          <p>请复制以下链接进行分享：</p>
          <p style={{ 
            background: '#f5f5f5', 
            padding: '8px', 
            borderRadius: '4px',
            wordBreak: 'break-all',
            userSelect: 'all'
          }}>
            {url}
          </p>
        </div>
      ),
      duration: 0,
      style: { width: '500px' }
    });
  };

  /**
   * 导出单篇文章
   * @param {number} articleId - 文章ID
   * @param {string} title - 文章标题
   */
  const handleExportArticle = async (articleId, title) => {
    try {
      await download(`/article/output/${articleId}`);
    } catch (error) {
      console.error('Export article failed:', error);
    }
  };

  // 表格数据管理
  const {
    tableProps,
    updateList,
    onSearch
  } = useArticleTable({
    queryParams,
    tagList,
    categoryList,
    onCopyShare: handleCopyShare,
    onExport: handleExportArticle
  });

  // 批量操作逻辑
  const {
    batchMode,
    selectedRowKeys,
    loading: batchLoading,
    toggleBatchMode,
    getRowSelection,
    getSelectionInfo,
    batchDelete,
    batchExportSelected,
    exportAll,
    batchSetPublic,
    batchSetPrivate,
    batchSetTop,
    batchUnsetTop
  } = useArticleBatch(() => {
    onSearch(queryParams);
  });

  // 获取选中状态信息
  const { hasSelection, selectionCount } = getSelectionInfo();

  /**
   * 渲染表格底部
   */
  const renderTableFooter = () => (
    <BatchActions
      batchMode={batchMode}
      hasSelection={hasSelection}
      selectionCount={selectionCount}
      loading={batchLoading}
      onToggleBatchMode={toggleBatchMode}
      onBatchDelete={batchDelete}
      onBatchExport={batchExportSelected}
      onBatchSetPublic={batchSetPublic}
      onBatchSetPrivate={batchSetPrivate}
      onBatchSetTop={batchSetTop}
      onBatchUnsetTop={batchUnsetTop}
    />
  );

  return (
    <div className="article-manager">
      <div className="article-manager__header">
        <h2 className="page-title">文章管理</h2>
        <p className="page-description">
          管理所有发布的文章，支持搜索、过滤、批量操作和导出功能
        </p>
      </div>

      <div className="article-manager__content">
        {/* 搜索过滤区域 */}
        <ArticleFilters
          tagList={tagList}
          categoryList={categoryList}
          filterForm={filterForm}
          onSearch={handleSearch}
          onReset={resetFilters}
          onExportAll={exportAll}
          loading={tableProps.loading || batchLoading}
          hasActiveFilters={hasActiveFilters()}
          filtersSummary={getFiltersSummary()}
        />

        {/* 文章表格 */}
        <ArticleTable
          tableProps={tableProps}
          rowSelection={getRowSelection()}
          footer={renderTableFooter}
          loading={tableProps.loading || batchLoading}
        />
      </div>
    </div>
  );
};

export default ArticleManager;