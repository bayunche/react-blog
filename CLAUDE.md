# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于React + Koa.js的全栈博客系统，集成了Live2D看板娘、音乐播放器等功能。项目采用前后端分离架构。

## 常用开发命令

### 前端 (React)
```bash
# 开发环境启动
yarn dev
# 或
npm run start

# 生产构建
yarn build
# 或
npm run build

# 运行测试
yarn test
# 或
npm run test

# 构建DLL文件(优化构建速度)
yarn dll
# 或
npm run dll
```

### 后端 (Koa.js)
```bash
cd server

# 开发环境启动(需要先安装依赖)
npm install
npm run dev

# 生产环境启动
node app.js

# 或使用forever管理进程
forever start app.js
```

### 数据库 (MySQL)
```bash
# 启动MySQL容器
cd mysql_docker
docker-compose up -d

# 数据库备份
./backup_db.sh
```

### Word拆分微服务 (Python FastAPI)
```bash
cd word-split-service
pip install -r requirements.txt
python main.py  # 启动在8000端口
```

## 项目架构

### 前端架构 (src/)
- **React 16.9** + **Redux** + **React Router** 单页应用
- **Ant Design 4.x** UI框架
- **Less** 样式预处理器
- **Live2D** 看板娘集成 (multiple models in Resources/)
- **Markdown编辑器** 支持文章编写和导入
- **音乐播放器** 集成aplayer
- **响应式设计** 支持移动端

### 后端架构 (server/)
- **Koa.js 2.x** Web框架
- **Sequelize ORM** + **MySQL** 数据库
- **JWT** 用户认证
- **GitHub OAuth** 第三方登录
- **Nodemailer** 邮件通知功能
- **Socket.IO** 实时通信

### 数据库模型
- **User**: 用户管理
- **Article**: 文章管理
- **Comment/Reply**: 评论回复系统
- **Tag/Category**: 标签分类
- **Fragment**: 片段管理

### 部署架构
- **Nginx** 反向代理和静态文件服务
- **Docker** 容器化部署
- **SSL/TLS** HTTPS支持
- **Word拆分微服务** FastAPI独立服务

## 重要配置文件

### 前端配置
- `src/config.js` - 前端个性化配置(API地址、侧边栏信息、GitHub配置等)
- `config/webpack.config.js` - Webpack构建配置
- `public/index.html` - HTML模板

### 后端配置
- `server/config/index.js` - 后端配置(数据库、邮件、GitHub OAuth等)
- `server/models/` - 数据库模型定义
- `server/router/` - API路由定义

### 部署配置
- `nginx.conf` - Nginx配置
- `Dockerfile` - Docker构建配置
- `mysql_docker/docker-compose.yaml` - MySQL容器配置

## Live2D模型

项目包含多个Live2D模型:
- **Haru/Hiyori/Mark/Natori/Rice** - Live2D 3.x模型
- **Aqua** - 高质量看板娘模型
- **Miku** - 初音未来模型
- **bilibili-22** - B站看板娘

模型文件位置: `Resources/` 和 `public/Resources/`

## 开发注意事项

### 安全配置
- 生产环境必须修改 `server/config/index.js` 中的敏感信息
- GitHub OAuth需要配置正确的client_id和client_secret
- 数据库密码和JWT密钥需要使用强密码
- 邮件服务需要配置正确的SMTP信息

### 构建优化
- 使用DLL预构建优化开发体验: `npm run dll`
- 生产构建会自动进行代码分割和压缩
- Live2D模型文件较大，注意CDN配置

### 数据库管理
- 初始化数据通过 `server/initData.js`
- 数据库备份脚本: `backup_db.sh`
- 表结构自动同步，但生产环境建议手动管理

### API接口
- 前端API基础地址配置在 `src/config.js` 的 `API_BASE_URL`
- 后端服务默认运行在6060端口
- Word拆分服务运行在8000端口

## 常见问题

1. **端口冲突**: 检查80、6060、3306、8000端口占用
2. **Live2D不显示**: 检查模型文件路径和权限
3. **GitHub登录失败**: 检查OAuth配置和网络连接
4. **邮件通知失败**: 检查SMTP配置和授权码
5. **数据库连接失败**: 检查MySQL服务状态和连接参数