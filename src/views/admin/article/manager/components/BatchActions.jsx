import React from 'react';
import { Button, Switch, Space, Popconfirm, Dropdown, Menu, Badge } from 'antd';
import { 
  DeleteOutlined, 
  ExportOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  UpOutlined,
  DownOutlined,
  MoreOutlined
} from '@ant-design/icons';
import './BatchActions.less';

/**
 * 批量操作组件
 * @param {object} props - 组件属性
 * @param {boolean} props.batchMode - 批量操作模式
 * @param {boolean} props.hasSelection - 是否有选中项
 * @param {number} props.selectionCount - 选中项数量
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onToggleBatchMode - 切换批量模式回调
 * @param {Function} props.onBatchDelete - 批量删除回调
 * @param {Function} props.onBatchExport - 批量导出回调
 * @param {Function} props.onBatchSetPublic - 批量设为公开回调
 * @param {Function} props.onBatchSetPrivate - 批量设为私密回调
 * @param {Function} props.onBatchSetTop - 批量置顶回调
 * @param {Function} props.onBatchUnsetTop - 批量取消置顶回调
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 批量操作组件
 */
const BatchActions = ({
  batchMode = false,
  hasSelection = false,
  selectionCount = 0,
  loading = false,
  onToggleBatchMode,
  onBatchDelete,
  onBatchExport,
  onBatchSetPublic,
  onBatchSetPrivate,
  onBatchSetTop,
  onBatchUnsetTop,
  className = ''
}) => {
  /**
   * 更多批量操作菜单
   */
  const moreActionsMenu = (
    <Menu>
      <Menu.Item 
        key="set-public" 
        icon={<EyeOutlined />}
        onClick={onBatchSetPublic}
        disabled={!hasSelection || loading}
      >
        设为公开
      </Menu.Item>
      <Menu.Item 
        key="set-private" 
        icon={<EyeInvisibleOutlined />}
        onClick={onBatchSetPrivate}
        disabled={!hasSelection || loading}
      >
        设为私密
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="set-top" 
        icon={<UpOutlined />}
        onClick={onBatchSetTop}
        disabled={!hasSelection || loading}
      >
        设为置顶
      </Menu.Item>
      <Menu.Item 
        key="unset-top" 
        icon={<DownOutlined />}
        onClick={onBatchUnsetTop}
        disabled={!hasSelection || loading}
      >
        取消置顶
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`batch-actions ${className}`}>
      <div className="batch-actions__toggle">
        <span className="toggle-label">批量操作</span>
        <Switch 
          checked={batchMode} 
          onChange={onToggleBatchMode}
          loading={loading}
        />
      </div>

      {batchMode && (
        <div className="batch-actions__operations">
          {/* 选中状态显示 */}
          <div className="selection-info">
            <Badge 
              count={selectionCount} 
              showZero 
              style={{ backgroundColor: '#52c41a' }}
            >
              <span className="selection-text">已选中</span>
            </Badge>
          </div>

          {/* 批量操作按钮 */}
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<ExportOutlined />}
              onClick={onBatchExport}
              disabled={!hasSelection || loading}
              loading={loading}
            >
              导出选中
            </Button>

            <Popconfirm
              title={`确定要删除选中的 ${selectionCount} 篇文章吗？`}
              description="删除后无法恢复，请谨慎操作。"
              onConfirm={onBatchDelete}
              okText="确定删除"
              cancelText="取消"
              okType="danger"
              disabled={!hasSelection || loading}
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                disabled={!hasSelection || loading}
                loading={loading}
              >
                批量删除
              </Button>
            </Popconfirm>

            <Dropdown 
              overlay={moreActionsMenu} 
              trigger={['click']}
              disabled={!hasSelection || loading}
            >
              <Button size="small" icon={<MoreOutlined />}>
                更多操作
              </Button>
            </Dropdown>
          </Space>
        </div>
      )}
    </div>
  );
};

export default BatchActions;