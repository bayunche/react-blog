import React from 'react';
import { Table } from 'antd';
import './ArticleTable.less';

/**
 * 文章表格组件
 * @param {object} props - 组件属性
 * @param {object} props.tableProps - 表格属性
 * @param {object} props.rowSelection - 行选择配置
 * @param {React.ReactNode} props.footer - 表格底部内容
 * @param {boolean} props.loading - 加载状态
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 文章表格组件
 */
const ArticleTable = ({
  tableProps,
  rowSelection,
  footer,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`article-table ${className}`}>
      <Table
        {...tableProps}
        rowSelection={rowSelection}
        loading={loading}
        scroll={{ x: 1200 }}
        size="middle"
        footer={footer}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        rowKey="id"
        className="article-table__table"
      />
    </div>
  );
};

export default ArticleTable;