import { useState, useEffect } from 'react';
import { useArticleStore, useUserStore } from '@/stores';
import axios from '@/utils/axios';

/**
 * 文章数据管理的自定义 Hook
 * @param {string|null} editId - 编辑的文章ID，null表示新增
 * @returns {object} 文章数据相关的状态和方法
 */
export const useArticleData = (editId) => {
  const storeTagList = useArticleStore(state => state.tagList);
  const storeCategoryList = useArticleStore(state => state.categoryList);
  const authorId = useUserStore(state => state.userId);
  
  const store = { tagList: storeTagList, categoryList: storeCategoryList, authorId };

  const [realId, setRealId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 文章基本信息
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState(true);
  const [top, setTop] = useState(false);

  // 标签和分类
  const [tagList, setTagList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [tagSelectedList, setTagSelectedList] = useState([]);
  const [cateSelectedList, setCateSelectedList] = useState([]);

  /**
   * 获取文章详情
   * @param {string} id - 文章ID
   */
  const fetchArticle = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/article/share/${id}?type=0`);
      
      setRealId(response.id);
      setTitle(response.title);
      setContent(response.content);
      setType(response.type);
      setTop(response.top);
      
      const tags = response.tags.map(d => d.name);
      const categories = response.categories.map(d => d.name);
      
      setTagList(tags);
      setCategoryList(categories);
      setTagSelectedList(tags);
      setCateSelectedList(categories);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setError(error.message || '获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 初始化新文章的标签和分类
   */
  const initializeNewArticle = () => {
    const tags = storeTagList.map(d => d.name).slice(0, 10);
    const cates = storeCategoryList.map(d => d.name).slice(0, 10);
    
    setTagList(tags);
    setCategoryList(cates);
    
    if (tags[0]) setTagSelectedList([tags[0]]);
    if (cates[0]) setCateSelectedList([cates[0]]);
  };

  /**
   * 重置表单数据
   */
  const resetForm = () => {
    setTitle('');
    setContent('');
    setType(true);
    setTop(false);
    setTagSelectedList([]);
    setCateSelectedList([]);
    setError(null);
  };

  /**
   * 验证表单数据
   * @returns {boolean} 是否通过验证
   */
  const validateForm = () => {
    if (!title.trim()) {
      setError('标题不能为空');
      return false;
    }
    
    if (!content.trim()) {
      setError('内容不能为空');
      return false;
    }
    
    if (tagSelectedList.length === 0) {
      setError('请至少选择一个标签');
      return false;
    }
    
    if (cateSelectedList.length === 0) {
      setError('请至少选择一个分类');
      return false;
    }
    
    return true;
  };

  /**
   * 获取表单数据
   * @returns {object} 表单数据对象
   */
  const getFormData = () => ({
    title: title.trim(),
    content: content.trim(),
    tagList: tagSelectedList,
    categoryList: cateSelectedList,
    authorId: store.authorId,
    type,
    top
  });

  /**
   * 获取更新数据
   * @returns {object} 更新数据对象
   */
  const getUpdateData = () => ({
    title: title.trim(),
    content: content.trim(),
    tags: tagSelectedList,
    categories: cateSelectedList,
    type,
    top
  });

  // 初始化效果
  useEffect(() => {
    if (editId) {
      fetchArticle(editId);
    }
  }, [editId]);

  useEffect(() => {
    if (!editId && storeTagList.length > 0 && storeCategoryList.length > 0) {
      initializeNewArticle();
    }
  }, [editId, storeTagList, storeCategoryList]);

  return {
    // 状态
    realId,
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
    
    // 设置方法
    setTitle,
    setContent,
    setType,
    setTop,
    setTagSelectedList,
    setCateSelectedList,
    setError,
    
    // 业务方法
    fetchArticle,
    resetForm,
    validateForm,
    getFormData,
    getUpdateData,
    
    // 计算属性
    isEdit: !!editId,
    formTitle: editId ? '编辑文章' : '新增文章'
  };
};