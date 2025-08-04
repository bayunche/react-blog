import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Popconfirm } from 'antd';
import dayjs from '@/utils/dayjs';
import useAntdTable from '@/hooks/useAntdTable';
import axios from '@/utils/axios';

/**
 * 文章表格数据管理的自定义 Hook
 * @param {object} options - 配置选项
 * @param {object} options.queryParams - 查询参数
 * @param {Array} options.tagList - 标签列表
 * @param {Array} options.categoryList - 分类列表
 * @param {Function} options.onCopyShare - 复制分享链接回调
 * @param {Function} options.onExport - 导出文章回调
 * @returns {object} 表格相关的数据和方法
 */
export const useArticleTable = ({ 
  queryParams, 
  tagList, 
  categoryList, 
  onCopyShare, 
  onExport 
}) => {
  /**
   * 根据标签名称获取颜色
   * @param {string} name - 标签名称
   * @param {Array} list - 标签列表
   * @returns {string} 标签颜色
   */
  const getTagColor = (name, list) => {
    const target = list.find(l => l.name === name);
    return target && target.color;
  };

  /**
   * 表格列配置
   */
  const columns = useMemo(() => [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Link to={`/article/${record.id}`} className="article-title-link">
          {text}
        </Link>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => (
        <div className="tags-container">
          {tags.map(tag => (
            <Tag color={getTagColor(tag.name, tagList)} key={tag.name}>
              <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'categories',
      key: 'categories',
      width: 150,
      render: (categories) => (
        <div className="categories-container">
          {categories.map(category => (
            <Tag color="#2db7f5" key={category.name}>
              <Link to={`/categories/${category.name}`}>{category.name}</Link>
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: '浏览数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: (a, b) => b.viewCount - a.viewCount,
      render: (count) => (
        <span className="view-count">{count || 0}</span>
      )
    },
    {
      title: '私密性',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type ? '#52c41a' : '#ff4d4f'}>
          {type ? '公开' : '私密'}
        </Tag>
      )
    },
    {
      title: '置顶',
      dataIndex: 'top',
      key: 'top',
      width: 100,
      render: (top) => (
        <Tag color={top ? '#722ed1' : '#d9d9d9'}>
          {top ? '置顶' : '普通'}
        </Tag>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => (dayjs(a.createdAt).isBefore(b.createdAt) ? 1 : -1),
      render: (date) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      sorter: (a, b) => (dayjs(a.updatedAt).isBefore(b.updatedAt) ? 1 : -1),
      render: (date) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <ul className="action-list">
          <li>
            <Link to={`/article/${record.id}`}>查看</Link>
          </li>
          <li>
            <Link 
              to={{
                pathname: `/admin/article/edit/${record.uuid}`,
                state: { articleId: record.id }
              }}
            >
              编辑
            </Link>
          </li>
          <li>
            <a onClick={() => onCopyShare(record.uuid)}>分享</a>
          </li>
          <li>
            <a onClick={() => onExport(record.id, record.title)}>导出</a>
          </li>
          <li>
            <Popconfirm 
              title="确定要删除这篇文章吗？" 
              cancelText="取消" 
              okText="确定"
              onConfirm={() => handleDeleteArticle(record.id)}
            >
              <a className="delete-text">删除</a>
            </Popconfirm>
          </li>
        </ul>
      )
    }
  ], [tagList, categoryList, onCopyShare, onExport]);

  /**
   * 使用表格Hook
   */
  const { tableProps, updateList, onSearch } = useAntdTable({
    requestUrl: '/article/list',
    queryParams,
    columns
  });

  /**
   * 删除单篇文章
   * @param {number} articleId - 文章ID
   */
  const handleDeleteArticle = async (articleId) => {
    try {
      await updateList(() => axios.delete(`/article/${articleId}`));
    } catch (error) {
      console.error('Delete article failed:', error);
    }
  };

  return {
    tableProps,
    updateList,
    onSearch,
    columns
  };
};