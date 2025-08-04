import React, { useState, useEffect } from 'react'
import { useArticleStore } from '@/stores'

// hooks
import useMount from '@/hooks/useMount'

// components
import SignModal from '@/components/Public/SignModal'
import UploadModal from '@/components/Public/UploadModal'

/**
 * @component Public 公共组件，挂在在 APP.jsx 中，用于存放初始化的组件/方法 或者公用的 modal 等
 */
function PublicComponent(props) {
  const fetchTagList = useArticleStore(state => state.fetchTagList)
  const fetchCategoryList = useArticleStore(state => state.fetchCategoryList)

  useMount(() => {
    fetchTagList()
    fetchCategoryList()
  })

  return (
    <>
      <SignModal />
      <UploadModal />
    </>
  )
}

export default PublicComponent
