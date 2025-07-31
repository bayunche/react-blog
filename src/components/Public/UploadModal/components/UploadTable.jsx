import React, { useMemo } from 'react';
import { Table, Tag, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

/**
 * 文件上传列表表格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.fileList - 文件列表
 * @param {Function} props.getParsedFile - 获取文件解析结果
 * @param {Function} props.onRemoveFile - 删除文件回调
 * @returns {JSX.Element} 上传列表表格
 */
const UploadTable = ({ fileList, getParsedFile, onRemoveFile }) => {
  /**
   * 表格列定义
   */
  const columns = useMemo(() => [
    {
      dataIndex: 'name',
      title: '文件名',
      ellipsis: true,
      render: (text) => (
        <span title={text} className="file-name">
          {text}
        </span>
      )
    },
    {
      dataIndex: 'title',
      title: '文章标题',
      ellipsis: true,
      render: (_, record) => {
        const parsed = getParsedFile(record.name);
        return (
          <span title={parsed.title} className="article-title">
            {parsed.title || '解析中...'}
          </span>
        );
      }
    },
    {
      dataIndex: 'status',
      title: '状态',
      width: 100,
      render: (status, record) => {
        if (status === 'error') {
          return <Tag color="red">上传失败</Tag>;
        }
        if (status === 'uploading') {
          return <Tag color="blue">上传中</Tag>;
        }
        if (status === 'done') {
          const parsed = getParsedFile(record.name);
          return parsed.exist ? 
            <Tag color="gold">更新</Tag> : 
            <Tag color="green">新增</Tag>;
        }
        return <Tag color="default">等待中</Tag>;
      }
    },
    {
      dataIndex: 'uid',
      title: '操作',
      width: 80,
      render: (uid, record) => (
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveFile(uid)}
          className="remove-btn"
        >
          删除
        </Button>
      )
    }
  ], [getParsedFile, onRemoveFile]);

  return (
    <div className="upload-table">
      <Table
        dataSource={fileList}
        columns={columns}
        rowKey="uid"
        pagination={false}
        size="small"
        className="upload-files-table"
        locale={{
          emptyText: '暂无文件'
        }}
      />
    </div>
  );
};

export default UploadTable;