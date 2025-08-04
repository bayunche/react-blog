import React, { useEffect, useState } from 'react'
import { SIDEBAR } from '@/config.jsx'
import axios from '@/utils/axios'
import { useArticleStore } from '@/stores'
import Player from '@/components/musicPlayer/Player'

// components
import { Link } from 'react-router-dom'
import Href from '@/components/Href'
import { Divider, Tag, Card, Row, Col, Avatar, Space, Typography, Alert } from 'antd'

import { ANNOUNCEMENT } from '@/config.jsx'

import useFetchList from '@/hooks/useFetchList'
import './index.less'

const { Title, Text } = Typography

function TopCard(props) {
  const tagList = useArticleStore(state => state.tagList || [])

  // 获取热门文章
  const { dataList: popularArticles } = useFetchList({
    withLoading: false,
    requestUrl: '/article/list',
    queryParams: {
      order: 'viewCount DESC',
      page: 1,
      pageSize: 5,
      type: true,
    },
  })

  // 获取最新文章
  const { dataList: latestArticles } = useFetchList({
    withLoading: false,
    requestUrl: '/article/list',
    queryParams: {
      order: 'createdAt DESC',
      page: 1,
      pageSize: 5,
      type: true,
    },
  })

  return (
    <div className='top-card-container'>
      <Row gutter={[24, 0]} className='main-content-row'>
        {/* 左侧：个人介绍卡片 */}
        <Col xs={24} lg={8}>
          <div className='profile-section glass-card'>
            <div className='profile-content'>
              <div className='profile-header'>
                <Avatar 
                  size={100} 
                  src={SIDEBAR.avatar} 
                  className='profile-avatar'
                />
                <div className='profile-info'>
                  <Title level={3} className='profile-title'>{SIDEBAR.title}</Title>
                  <Text className='profile-subtitle'>{SIDEBAR.subTitle}</Text>
                </div>
              </div>
              
              <div className='social-links'>
                {Object.entries(SIDEBAR.homepages).map(([linkName, item]) => (
                  <div key={linkName} className='social-link'>
                    {item.icon}
                    <Href href={item.link}>{linkName}</Href>
                  </div>
                ))}
              </div>

              {/* 标签云展示 */}
              <div className='profile-tags'>
                <Title level={5} className='section-title'>技能标签</Title>
                <div className='tags-container'>
                  {tagList.slice(0, 8).map((tag, i) => (
                    <Tag key={i} color={tag.color} className='tag-item'>
                      <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧：文章和链接区域 */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]} className='content-grid'>
            {/* 最新文章 */}
            <Col xs={24} md={12}>
              <Card title="最新文章" className='latest-articles-card glass-card'>
                <div className='article-list'>
                  {latestArticles.map(d => (
                    <div key={d.id} className='article-item'>
                      <Link to={`/article/${d.id}`}>{d.title}</Link>
                      <Text className='article-meta'>📅 {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '最新发布'}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* 热门文章 */}
            <Col xs={24} md={12}>
              <Card title="热门文章" className='popular-articles-card glass-card'>
                <div className='article-list'>
                  {popularArticles.map(d => (
                    <div key={d.id} className='article-item'>
                      <Link to={`/article/${d.id}`}>{d.title}</Link>
                      <Text className='article-meta'>🔥 阅读量 {d.viewCount || 0}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* 友情链接 */}
            <Col xs={24}>
              <Card title="友情链接" className='friends-card glass-card'>
                <div className='friends-grid'>
                  {Object.entries(SIDEBAR.friendslink).map(([linkName, item]) => (
                    <div key={linkName} className='friend-item'>
                      <Avatar size={32} src={item.img} className='friend-avatar' />
                      <div className='friend-info'>
                        <Href href={item.link} className='friend-name'>{linkName}</Href>
                        <Text className='friend-desc'>优秀的技术博客</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 公告栏 */}
      {ANNOUNCEMENT.enable && (
        <div className='announcement-section'>
          <Alert 
            message={ANNOUNCEMENT.content} 
            type='info' 
            className='announcement-alert'
            showIcon
          />
        </div>
      )}
    </div>
  )
}

export default TopCard