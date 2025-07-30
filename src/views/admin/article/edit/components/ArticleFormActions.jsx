import React from 'react';
import { Button, Space } from 'antd';
import { 
  SaveOutlined, 
  EyeOutlined, 
  SendOutlined,
  FileTextOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import './ArticleFormActions.less';

/**
 * 文章表单操作按钮组件
 * @param {object} props - 组件属性
 * @param {boolean} props.isEdit - 是否为编辑模式
 * @param {boolean} props.submitting - 是否正在提交
 * @param {boolean} props.canSubmit - 是否可以提交
 * @param {Function} props.onSave - 保存回调
 * @param {Function} props.onSaveDraft - 保存草稿回调
 * @param {Function} props.onPreview - 预览回调
 * @param {Function} props.onReset - 重置回调
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 操作按钮组件
 */
const ArticleFormActions = ({
  isEdit = false,
  submitting = false,
  canSubmit = true,
  onSave,
  onSaveDraft,
  onPreview,
  onReset,
  className = ''
}) => {
  return (
    <div className={`article-form-actions ${className}`}>
      <Space size="middle" wrap>
        {/* 主要操作按钮 */}
        <Button
          type="primary"
          icon={isEdit ? <SaveOutlined /> : <SendOutlined />}
          loading={submitting}
          disabled={!canSubmit}
          onClick={onSave}
          size="large"
        >
          {isEdit ? '更新文章' : '发布文章'}
        </Button>

        {/* 保存草稿按钮（仅新增时显示） */}
        {!isEdit && (
          <Button
            icon={<FileTextOutlined />}
            loading={submitting}
            disabled={!canSubmit}
            onClick={onSaveDraft}
            size="large"
          >
            保存草稿
          </Button>
        )}

        {/* 预览按钮 */}
        <Button
          icon={<EyeOutlined />}
          disabled={!canSubmit}
          onClick={onPreview}
          size="large"
        >
          预览文章
        </Button>

        {/* 重置按钮（仅新增时显示） */}
        {!isEdit && (
          <Button
            icon={<ReloadOutlined />}
            disabled={submitting}
            onClick={onReset}
            size="large"
          >
            重置表单
          </Button>
        )}
      </Space>

      {/* 操作提示 */}
      <div className="article-form-actions__tips">
        <p>
          💡 <strong>操作提示：</strong>
        </p>
        <ul>
          <li>
            <strong>发布文章：</strong>文章将立即发布并对用户可见
          </li>
          {!isEdit && (
            <li>
              <strong>保存草稿：</strong>文章保存为草稿状态，不会对用户展示
            </li>
          )}
          <li>
            <strong>预览文章：</strong>在新窗口中预览文章效果
          </li>
          <li>
            文章支持 <strong>Markdown</strong> 语法，可以使用丰富的格式
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ArticleFormActions;