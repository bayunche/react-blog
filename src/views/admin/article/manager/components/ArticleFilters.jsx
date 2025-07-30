import React from 'react';
import { Form, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import './ArticleFilters.less';

/**
 * 文章搜索过滤组件
 * @param {object} props - 组件属性
 * @param {Array} props.tagList - 标签列表
 * @param {Array} props.categoryList - 分类列表
 * @param {object} props.filterForm - 表单初始值
 * @param {Function} props.onSearch - 搜索回调
 * @param {Function} props.onReset - 重置回调
 * @param {Function} props.onExportAll - 导出全部回调
 * @param {boolean} props.loading - 加载状态
 * @param {boolean} props.hasActiveFilters - 是否有活动的搜索条件
 * @param {Array} props.filtersSummary - 搜索条件摘要
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element} 搜索过滤组件
 */
const ArticleFilters = ({
  tagList = [],
  categoryList = [],
  filterForm = {},
  onSearch,
  onReset,
  onExportAll,
  loading = false,
  hasActiveFilters = false,
  filtersSummary = [],
  className = ''
}) => {
  const [form] = Form.useForm();

  /**
   * 处理表单提交
   */
  const handleSubmit = (values) => {
    onSearch?.(values);
  };

  /**
   * 处理重置表单
   */
  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <div className={`article-filters ${className}`}>
      <div className="article-filters__form">
        <Form
          form={form}
          layout="inline"
          initialValues={filterForm}
          onFinish={handleSubmit}
          className="search-form"
        >
          <Form.Item label="关键词" name="keyword">
            <Input 
              placeholder="请输入文章关键词" 
              allowClear 
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item label="标签" name="tag">
            <Select 
              placeholder="请选择标签"
              allowClear 
              style={{ width: 200 }}
            >
              {tagList.map(item => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="分类" name="category">
            <Select 
              placeholder="请选择分类"
              allowClear 
              style={{ width: 200 }}
            >
              {categoryList.map(item => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="私密性" name="type">
            <Select 
              placeholder="请选择私密性"
              allowClear 
              style={{ width: 200 }}
            >
              <Select.Option value={true}>公开</Select.Option>
              <Select.Option value={false}>私密</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                loading={loading}
              >
                搜索
              </Button>
              
              <Button 
                onClick={handleReset}
                icon={<ReloadOutlined />}
                disabled={loading}
              >
                重置
              </Button>
              
              <Button 
                type="default"
                onClick={onExportAll}
                icon={<ExportOutlined />}
                loading={loading}
              >
                导出全部
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* 搜索条件摘要 */}
      {hasActiveFilters && filtersSummary.length > 0 && (
        <div className="article-filters__summary">
          <span className="summary-label">当前搜索条件：</span>
          <Space wrap>
            {filtersSummary.map((item, index) => (
              <Tag key={index} color="blue" closable={false}>
                {item}
              </Tag>
            ))}
          </Space>
          <Button 
            type="link" 
            size="small" 
            onClick={handleReset}
            className="clear-filters-btn"
          >
            清空条件
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;