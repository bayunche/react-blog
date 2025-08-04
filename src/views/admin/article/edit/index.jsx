import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloatButton, message } from 'antd';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { useArticleData } from './hooks/useArticleData';
import { useArticleSubmit } from './hooks/useArticleSubmit';
import ArticleFormFields from './components/ArticleFormFields';
import ArticleFormActions from './components/ArticleFormActions';
import './styles/index.less';

/**
 * 文章编辑页面组件 - 重构后的版本
 * 支持新增和编辑文章功能
 */
const ArticleEdit = () => {
  const { id: editId } = useParams();
  const navigate = useNavigate();

  // 设置面包屑导航
  useBreadcrumb([
    { link: '/admin/article/manager', name: '文章管理' }, 
    editId ? '编辑文章' : '新增文章'
  ]);

  // 使用文章数据管理Hook
  const {
    loading,
    error,
    title,
    content,
    type,
    top,
    tagList,
    categoryList,
    tagSelectedList,
    cateSelectedList,
    realId,
    isEdit,
    formTitle,
    setTitle,
    setContent,
    setType,
    setTop,
    setTagSelectedList,
    setCateSelectedList,
    setError,
    validateForm,
    getFormData,
    getUpdateData,
    resetForm
  } = useArticleData(editId);

  // 使用文章提交Hook
  const {
    submitting,
    createArticle,
    updateArticle,
    saveDraft,
    previewArticle
  } = useArticleSubmit({
    onSuccess: (response, action) => {
      if (action === 'created' || action === 'updated') {
        // 可以选择跳转到文章管理页或保持在当前页
        // history.push('/admin/article/manager');
      } else if (action === 'continue') {
        // 用户选择继续编辑，清空表单
        resetForm();
      }
    },
    onError: (error) => {
      console.error('Article operation failed:', error);
    }
  });

  /**
   * 处理表单保存
   */
  const handleSave = async () => {
    // 清除之前的错误
    setError(null);

    // 表单验证
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        // 更新现有文章
        const updateData = getUpdateData();
        await updateArticle(realId, updateData);
      } else {
        // 创建新文章
        const formData = getFormData();
        await createArticle(formData, history);
      }
    } catch (error) {
      // 错误已在Hook中处理
    }
  };

  /**
   * 处理保存草稿
   */
  const handleSaveDraft = async () => {
    // 清除之前的错误
    setError(null);

    // 基本验证（草稿的验证要求较低）
    if (!title.trim()) {
      setError('标题不能为空');
      return;
    }

    try {
      const formData = getFormData();
      await saveDraft(formData);
      
      // 保存草稿后可以选择清空表单
      resetForm();
    } catch (error) {
      // 错误已在Hook中处理
    }
  };

  /**
   * 处理预览
   */
  const handlePreview = () => {
    if (!title.trim() || !content.trim()) {
      message.warning('请先填写标题和内容');
      return;
    }

    const formData = getFormData();
    previewArticle(formData);
  };

  /**
   * 处理重置表单
   */
  const handleReset = () => {
    resetForm();
    message.success('表单已重置');
  };

  /**
   * 检查是否可以提交
   */
  const canSubmit = title.trim() && content.trim() && !loading;

  if (loading && isEdit) {
    return (
      <div className="article-edit article-edit--loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  return (
    <div className="article-edit">
      <div className="article-edit__header">
        <h2 className="article-edit__title">{formTitle}</h2>
        <p className="article-edit__description">
          {isEdit 
            ? '编辑您的文章内容，修改后点击更新即可保存更改。' 
            : '创建一篇新文章，填写完整信息后可选择发布或保存为草稿。'
          }
        </p>
      </div>

      <div className="article-edit__content">
        {/* 表单字段 */}
        <ArticleFormFields
          title={title}
          content={content}
          type={type}
          top={top}
          tagList={tagList}
          categoryList={categoryList}
          tagSelectedList={tagSelectedList}
          cateSelectedList={cateSelectedList}
          error={error}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onTypeChange={setType}
          onTopChange={setTop}
          onTagChange={setTagSelectedList}
          onCategoryChange={setCateSelectedList}
        />

        {/* 操作按钮 */}
        <ArticleFormActions
          isEdit={isEdit}
          submitting={submitting}
          canSubmit={canSubmit}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onPreview={handlePreview}
          onReset={handleReset}
        />
      </div>

      {/* 回到顶部按钮 */}
      <FloatButton.BackTop />
    </div>
  );
};

export default ArticleEdit;