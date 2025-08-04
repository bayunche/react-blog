import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { genertorColor } from '@/utils';
import axios from '@/utils/axios';

/**
 * 文章状态管理
 * 管理文章、分类、标签等相关状态
 */
export const useArticleStore = create(
  persist(
    immer((set, get) => ({
      // 文章相关状态
      articleList: [],
      currentArticle: null,
      articleCache: {}, // 文章缓存 { id: article }
      
      // 分类和标签
      categoryList: [],
      tagList: [],
      
      // 筛选和搜索状态
      filters: {
        category: null,
        tag: null,
        keyword: '',
        status: 'all', // all, published, draft
        author: null,
      },
      
      // 分页状态
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      
      // 排序状态
      sorting: {
        field: 'createdAt',
        order: 'desc', // asc, desc
      },
      
      // 操作状态
      loading: false,
      submitting: false,
      error: null,
      
      // 批量操作状态
      selectedArticles: [],
      batchOperationLoading: false,

      // Actions
      
      /**
       * 设置文章列表
       */
      setArticleList: (articleList, pagination = null) => set((state) => {
        state.articleList = articleList;
        if (pagination) {
          state.pagination = { ...state.pagination, ...pagination };
        }
        state.loading = false;
        state.error = null;
      }),

      /**
       * 设置当前文章
       */
      setCurrentArticle: (article) => set((state) => {
        state.currentArticle = article;
        if (article && article.id) {
          // 缓存文章
          state.articleCache[article.id] = article;
        }
      }),

      /**
       * 从缓存获取文章
       */
      getArticleFromCache: (articleId) => {
        return get().articleCache[articleId] || null;
      },

      /**
       * 设置标签列表
       */
      setTagList: (tagList) => set((state) => {
        state.tagList = genertorColor(tagList);
      }),

      /**
       * 设置分类列表
       */
      setCategoryList: (categoryList) => set((state) => {
        state.categoryList = genertorColor(categoryList);
      }),

      /**
       * 添加文章到列表
       */
      addArticle: (article) => set((state) => {
        state.articleList.unshift(article);
        if (article.id) {
          state.articleCache[article.id] = article;
        }
        state.pagination.total += 1;
      }),

      /**
       * 更新文章
       */
      updateArticle: (updatedArticle) => set((state) => {
        const index = state.articleList.findIndex(
          article => article.id === updatedArticle.id
        );
        if (index !== -1) {
          state.articleList[index] = updatedArticle;
        }
        
        // 更新缓存
        if (updatedArticle.id) {
          state.articleCache[updatedArticle.id] = updatedArticle;
        }
        
        // 更新当前文章
        if (state.currentArticle?.id === updatedArticle.id) {
          state.currentArticle = updatedArticle;
        }
      }),

      /**
       * 删除文章
       */
      removeArticle: (articleId) => set((state) => {
        state.articleList = state.articleList.filter(
          article => article.id !== articleId
        );
        
        // 清除缓存
        delete state.articleCache[articleId];
        
        // 清除当前文章
        if (state.currentArticle?.id === articleId) {
          state.currentArticle = null;
        }
        
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.selectedArticles = state.selectedArticles.filter(id => id !== articleId);
      }),

      /**
       * 批量删除文章
       */
      batchRemoveArticles: (articleIds) => set((state) => {
        state.articleList = state.articleList.filter(
          article => !articleIds.includes(article.id)
        );
        
        // 清除缓存
        articleIds.forEach(id => {
          delete state.articleCache[id];
        });
        
        // 清除当前文章
        if (state.currentArticle && articleIds.includes(state.currentArticle.id)) {
          state.currentArticle = null;
        }
        
        state.pagination.total = Math.max(0, state.pagination.total - articleIds.length);
        state.selectedArticles = [];
      }),

      /**
       * 添加标签
       */
      addTag: (tag) => set((state) => {
        const tagWithColor = genertorColor([tag])[0];
        const exists = state.tagList.find(t => t.id === tag.id || t.name === tag.name);
        if (!exists) {
          state.tagList.push(tagWithColor);
        }
      }),

      /**
       * 添加分类
       */
      addCategory: (category) => set((state) => {
        const categoryWithColor = genertorColor([category])[0];
        const exists = state.categoryList.find(c => c.id === category.id || c.name === category.name);
        if (!exists) {
          state.categoryList.push(categoryWithColor);
        }
      }),

      /**
       * 更新筛选条件
       */
      updateFilters: (newFilters) => set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        // 重置分页到第一页
        state.pagination.current = 1;
      }),

      /**
       * 重置筛选条件
       */
      resetFilters: () => set((state) => {
        state.filters = {
          category: null,
          tag: null,
          keyword: '',
          status: 'all',
          author: null,
        };
        state.pagination.current = 1;
      }),

      /**
       * 更新分页
       */
      updatePagination: (pagination) => set((state) => {
        state.pagination = { ...state.pagination, ...pagination };
      }),

      /**
       * 更新排序
       */
      updateSorting: (sorting) => set((state) => {
        state.sorting = { ...state.sorting, ...sorting };
        // 重置分页到第一页
        state.pagination.current = 1;
      }),

      /**
       * 设置选中的文章
       */
      setSelectedArticles: (articleIds) => set((state) => {
        state.selectedArticles = Array.isArray(articleIds) ? articleIds : [];
      }),

      /**
       * 切换文章选中状态
       */
      toggleArticleSelection: (articleId) => set((state) => {
        const index = state.selectedArticles.indexOf(articleId);
        if (index > -1) {
          state.selectedArticles.splice(index, 1);
        } else {
          state.selectedArticles.push(articleId);
        }
      }),

      /**
       * 全选/取消全选文章
       */
      toggleSelectAll: () => set((state) => {
        if (state.selectedArticles.length === state.articleList.length) {
          state.selectedArticles = [];
        } else {
          state.selectedArticles = state.articleList.map(article => article.id);
        }
      }),

      /**
       * 设置加载状态
       */
      setLoading: (loading) => set((state) => {
        state.loading = loading;
      }),

      /**
       * 设置提交状态
       */
      setSubmitting: (submitting) => set((state) => {
        state.submitting = submitting;
      }),

      /**
       * 设置批量操作加载状态
       */
      setBatchOperationLoading: (loading) => set((state) => {
        state.batchOperationLoading = loading;
      }),

      /**
       * 设置错误状态
       */
      setError: (error) => set((state) => {
        state.error = typeof error === 'string' ? error : error?.message || '未知错误';
        state.loading = false;
        state.submitting = false;
        state.batchOperationLoading = false;
      }),

      /**
       * 清除错误
       */
      clearError: () => set((state) => {
        state.error = null;
      }),

      /**
       * 获取筛选后的查询参数
       */
      getQueryParams: () => {
        const { filters, pagination, sorting } = get();
        return {
          ...filters,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortField: sorting.field,
          sortOrder: sorting.order,
        };
      },

      /**
       * 获取文章统计信息
       */
      getArticleStats: () => {
        const { articleList, categoryList, tagList } = get();
        return {
          totalArticles: articleList.length,
          totalCategories: categoryList.length,
          totalTags: tagList.length,
          publishedArticles: articleList.filter(a => a.status === 'published').length,
          draftArticles: articleList.filter(a => a.status === 'draft').length,
        };
      },

      /**
       * 清空文章列表
       */
      clearArticles: () => set((state) => {
        state.articleList = [];
        state.currentArticle = null;
        state.articleCache = {};
        state.selectedArticles = [];
        state.pagination = {
          current: 1,
          pageSize: 10,
          total: 0,
        };
      }),

      /**
       * 重置所有状态
       */
      reset: () => set((state) => {
        state.articleList = [];
        state.currentArticle = null;
        state.articleCache = {};
        state.categoryList = [];
        state.tagList = [];
        state.filters = {
          category: null,
          tag: null,
          keyword: '',
          status: 'all',
          author: null,
        };
        state.pagination = {
          current: 1,
          pageSize: 10,
          total: 0,
        };
        state.sorting = {
          field: 'createdAt',
          order: 'desc',
        };
        state.selectedArticles = [];
        state.loading = false;
        state.submitting = false;
        state.batchOperationLoading = false;
        state.error = null;
      }),

      /**
       * 获取标签列表
       */
      fetchTagList: async () => {
        try {
          set((state) => { state.loading = true; });
          const response = await axios.get('/tag');
          const { setTagList } = get();
          setTagList(response.data || []);
        } catch (error) {
          console.error('获取标签列表失败:', error);
          set((state) => { 
            state.error = '获取标签列表失败'; 
            state.loading = false;
          });
        }
      },

      /**
       * 获取分类列表
       */
      fetchCategoryList: async () => {
        try {
          set((state) => { state.loading = true; });
          const response = await axios.get('/category');
          const { setCategoryList } = get();
          setCategoryList(response.data || []);
        } catch (error) {
          console.error('获取分类列表失败:', error);
          set((state) => { 
            state.error = '获取分类列表失败'; 
            state.loading = false;
          });
        }
      },
    })),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 只持久化分类、标签和筛选偏好
        categoryList: state.categoryList,
        tagList: state.tagList,
        filters: state.filters,
        sorting: state.sorting,
        pagination: {
          pageSize: state.pagination.pageSize, // 只保存pageSize设置
        },
      }),
    }
  )
);