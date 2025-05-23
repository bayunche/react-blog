import React, { useState, useEffect } from 'react'
import './index.less'

import { useMediaQuery } from 'react-responsive'
// methods
import axios from '@/utils/axios'
import { translateMarkdown, translateMarkdown2html, calcCommentsCount } from '@/utils'
import useAjaxLoading from '@/hooks/useAjaxLoading'

// components
import { Drawer, Divider, Spin } from 'antd'
import ArticleTag from '@/components/ArticleTag'
import SvgIcon from '@/components/SvgIcon'
import Navigation from './Navigation'
import Discuss from '@/components/Discuss'
import { MenuOutlined } from '@ant-design/icons'
function Article(props) {
  const [loading, withLoading] = useAjaxLoading()
  const [article, setArticle] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    comments: [],
    createdAt: '',
    viewCount: 0,
  })
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const hash = decodeURI(props.location.hash)

      const ele = document.querySelector(`a[href="${hash}"]`)
      ele && hash && ele.click() // 挂载时路由跳转到指定位置
    }, 800)
  }, [])
  // 给pre标签添加<div class="lang">`对应语言类型`</div>
  function addLanguageDiv(html) {
    // 使用正则表达式匹配整个pre标签内容
    return html.replace(
      /(<pre>)<code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g,
      (match, preTag, lang, content) => {
        return `<pre><div class="lang">${lang}</div><code class="language-${lang}">${content}</code></pre>`
      }
    )
  }
  useEffect(() => {
    if (props.match.params.id !== undefined) {
      withLoading(axios.get(`/article/${props.match.params.id}`))
        .then(res => {
          res.content = addLanguageDiv(translateMarkdown2html(res.content))
          setArticle(res)
        })
        .catch(e => {
          props.history.push('/404')
        })
    } else if (props.match.params.uuid !== undefined) {
      withLoading(axios.get(`/article/share/${props.match.params.uuid}`))
        .then(res => {
          res.content = translateMarkdown2html(res.content)
          // 将转换后的html使用正则匹配pre标签往pre标签中添加<div class="lang">`对应语言类型`</div>(对应语言类型在code标签的classname中)
          res.content = res.content.replace(/<pre>/g, '<div> class="lang">lang</div>')

          setArticle(res)
        })
        .catch(e => {
          props.history.push('/404')
        })
    }
  }, [props.match.params.id])

  function setCommentList(list) {
    setArticle({ ...article, comments: list })
  }

  const { title, content, tags, categories, comments, createdAt, viewCount } = article
  const articleId = parseInt(props.match.params.id)
  const isFoldNavigation = useMediaQuery({ query: '(max-width: 1300px)' })
  return (
    <Spin tip='Loading...' spinning={loading}>
      <article className='app-article' style={{ paddingRight: isFoldNavigation ? 0 : 275 }}>
        <div className='post-header'>
          <h1 className='post-title'>{title}</h1>

          <div className='article-desc'>
            <span className='post-time'>
              <SvgIcon type='iconpost' />
              &nbsp; Posted on &nbsp;
              <span>{createdAt.slice(0, 10)}</span>
            </span>
            <ArticleTag tagList={tags} categoryList={categories} />
            <Divider type='vertical' />
            <a className='comment-count' href='#discuss' style={{ color: 'inherit' }}>
              <SvgIcon type='iconcomment' />
              <span style={{ marginRight: 5 }}> {calcCommentsCount(comments)}</span>
            </a>
            <SvgIcon type='iconview' style={{ marginRight: 2 }} />
            <span>{viewCount}</span>
          </div>
        </div>
        <div className='article-detail' dangerouslySetInnerHTML={{ __html: content }} />
        {isFoldNavigation ? (
          <>
            <div className='drawer-btn' onClick={e => setDrawerVisible(true)}>
              <MenuOutlined className='nav-phone-icon' />
            </div>
            <Drawer
              title={title}
              placement='right'
              closable={false}
              onClose={e => setDrawerVisible(false)}
              visible={drawerVisible}
              getContainer={() => document.querySelector('.app-article')}>
              <div className='right-navigation'>
                <Navigation content={content} />
              </div>
            </Drawer>
          </>
        ) : (
          <nav className='article-navigation'>
            <Navigation content={content} />
          </nav>
        )}

        <Discuss articleId={articleId} commentList={comments} setCommentList={setCommentList} />
      </article>
    </Spin>
  )
}

export default Article
