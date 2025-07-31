import React from 'react';
import { Input, Switch, Alert } from 'antd';
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import MdEditor from '@/components/MdEditor';
import TagSelector from './TagSelector';
import './ArticleFormFields.less';

/**
 * 文章表单字段组件
 * @param {object} props - 组件属性
 * @param {string} props.title - 文章标题
 * @param {string} props.content - 文章内容
 * @param {boolean} props.type - 文章类型（true: 发布, false: 草稿）
 * @param {boolean} props.top - 是否置顶
 * @param {Array} props.tagList - 可选标签列表
 * @param {Array} props.categoryList - 可选分类列表
 * @param {Array} props.tagSelectedList - 已选标签
 * @param {Array} props.cateSelectedList - 已选分类
 * @param {string} props.error - 错误信息
 * @param {Function} props.onTitleChange - 标题变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 * @param {Function} props.onTypeChange - 类型变更回调
 * @param {Function} props.onTopChange - 置顶变更回调
 * @param {Function} props.onTagChange - 标签变更回调
 * @param {Function} props.onCategoryChange - 分类变更回调
 * @returns {JSX.Element} 表单字段组件
 */
const ArticleFormFields = ({
  title,
  content,
  type,
  top,
  tagList,
  categoryList,
  tagSelectedList,
  cateSelectedList,
  error,
  onTitleChange,
  onContentChange,
  onTypeChange,
  onTopChange,
  onTagChange,
  onCategoryChange,
  className = ''
}) => {
  return (
    <div className={`article-form-fields ${className}`}>
      {/* 错误信息显示 */}
      {error && (
        <Alert
          message="表单验证失败"
          description={error}
          type="error"
          showIcon
          closable
          className="article-form-fields__error"
        />
      )}

      {/* 文章标题 */}
      <div className="article-form-fields__field">
        <label className="article-form-fields__label">
          文章标题 <span className="required">*</span>
        </label>
        <Input
          placeholder="请输入文章标题"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="article-form-fields__title-input"
        />
      </div>

      {/* 文章状态控制 */}
      <div className="article-form-fields__controls">
        <div className="article-form-fields__control-item">
          <label className="article-form-fields__control-label">
            <Switch
              checked={type}
              onChange={onTypeChange}
              checkedChildren={<CheckCircleFilled />}
              unCheckedChildren={<CheckCircleOutlined />}
            />
            <span className="control-text">
              {type ? '发布文章' : '保存草稿'}
            </span>
          </label>
        </div>

        <div className="article-form-fields__control-item">
          <label className="article-form-fields__control-label">
            <Switch
              checked={top}
              onChange={onTopChange}
            />
            <span className="control-text">
              置顶文章
            </span>
          </label>
        </div>
      </div>

      {/* 标签选择 */}
      <div className="article-form-fields__field">
        <label className="article-form-fields__label">
          文章标签 <span className="required">*</span>
        </label>
        <TagSelector
          tagList={tagList}
          selectedTags={tagSelectedList}
          onChange={onTagChange}
          placeholder="选择文章标签"
        />
      </div>

      {/* 分类选择 */}
      <div className="article-form-fields__field">
        <label className="article-form-fields__label">
          文章分类 <span className="required">*</span>
        </label>
        <TagSelector
          tagList={categoryList}
          selectedTags={cateSelectedList}
          onChange={onCategoryChange}
          placeholder="选择文章分类"
        />
      </div>

      {/* 文章内容编辑器 */}
      <div className="article-form-fields__field">
        <label className="article-form-fields__label">
          文章内容 <span className="required">*</span>
        </label>
        <div className="article-form-fields__editor">
          <MdEditor
            value={content}
            onChange={onContentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleFormFields;