import { useState, useCallback } from 'react';

/**
 * 文章搜索过滤逻辑的自定义 Hook
 * @param {Function} onSearch - 搜索回调函数
 * @returns {object} 搜索过滤相关的状态和方法
 */
export const useArticleFilters = (onSearch) => {
  const [queryParams, setQueryParams] = useState({});
  const [filterForm, setFilterForm] = useState({
    keyword: '',
    tag: undefined,
    category: undefined,
    type: undefined
  });

  /**
   * 重置搜索条件
   */
  const resetFilters = useCallback(() => {
    const emptyParams = {};
    setQueryParams(emptyParams);
    setFilterForm({
      keyword: '',
      tag: undefined,
      category: undefined,
      type: undefined
    });
    onSearch(emptyParams);
  }, [onSearch]);

  /**
   * 处理搜索表单提交
   * @param {object} values - 表单值
   */
  const handleSearch = useCallback((values) => {
    try {
      // 过滤掉空值
      const filteredValues = Object.keys(values).reduce((acc, key) => {
        const value = values[key];
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const newQueryParams = { ...queryParams, ...filteredValues };
      setQueryParams(newQueryParams);
      setFilterForm({ ...filterForm, ...values });
      onSearch(newQueryParams);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [queryParams, filterForm, onSearch]);

  /**
   * 更新单个搜索条件
   * @param {string} key - 搜索条件键
   * @param {*} value - 搜索条件值
   */
  const updateFilter = useCallback((key, value) => {
    const newFilterForm = { ...filterForm, [key]: value };
    setFilterForm(newFilterForm);
    
    // 如果值为空，从查询参数中删除该字段
    const newQueryParams = { ...queryParams };
    if (value === undefined || value === null || value === '') {
      delete newQueryParams[key];
    } else {
      newQueryParams[key] = value;
    }
    
    setQueryParams(newQueryParams);
    onSearch(newQueryParams);
  }, [filterForm, queryParams, onSearch]);

  /**
   * 获取搜索选项
   * @param {Array} tagList - 标签列表
   * @param {Array} categoryList - 分类列表
   * @returns {object} 搜索选项配置
   */
  const getSearchOptions = useCallback((tagList, categoryList) => ({
    keyword: {
      label: '关键词',
      placeholder: '请输入文章关键词',
      allowClear: true
    },
    tag: {
      label: '标签',
      placeholder: '请选择标签',
      allowClear: true,
      options: tagList.map(item => ({
        label: item.name,
        value: item.name
      }))
    },
    category: {
      label: '分类',
      placeholder: '请选择分类',
      allowClear: true,
      options: categoryList.map(item => ({
        label: item.name,
        value: item.name
      }))
    },
    type: {
      label: '私密性',
      placeholder: '请选择私密性',
      allowClear: true,
      options: [
        { label: '公开', value: true },
        { label: '私密', value: false }
      ]
    }
  }), []);

  /**
   * 检查是否有活动的搜索条件
   */
  const hasActiveFilters = useCallback(() => {
    return Object.keys(queryParams).length > 0;
  }, [queryParams]);

  /**
   * 获取搜索条件摘要
   */
  const getFiltersSummary = useCallback(() => {
    const summary = [];
    
    if (queryParams.keyword) {
      summary.push(`关键词: ${queryParams.keyword}`);
    }
    if (queryParams.tag) {
      summary.push(`标签: ${queryParams.tag}`);
    }
    if (queryParams.category) {
      summary.push(`分类: ${queryParams.category}`);
    }
    if (queryParams.type !== undefined) {
      summary.push(`私密性: ${queryParams.type ? '公开' : '私密'}`);
    }
    
    return summary;
  }, [queryParams]);

  return {
    queryParams,
    filterForm,
    handleSearch,
    resetFilters,
    updateFilter,
    getSearchOptions,
    hasActiveFilters,
    getFiltersSummary
  };
};