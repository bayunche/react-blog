# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目架构

这是一个基于 React + Koa 的全栈博客系统，采用前后端分离架构：

### 前端架构 (React)
- **框架**: React 16.9 + Redux + React Router
- **UI 库**: Ant Design 4.x
- **构建工具**: Webpack 4.x (自定义配置)
- **样式**: Less + CSS Modules
- **特色功能**: Live2D 人物、音乐播放器、Markdown 编辑器、代码高亮

### 后端架构 (Koa)
- **框架**: Koa 2.x + Koa Router
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT + GitHub OAuth
- **实时通信**: Socket.io
- **邮件服务**: Nodemailer

### 目录结构
```
src/
├── components/     # 公共组件
├── views/         # 页面组件
│   ├── web/       # 前台页面 (博客主页、文章、分类等)
│   └── admin/     # 后台管理页面
├── layout/        # 布局组件
├── routes/        # 路由配置
├── redux/         # 状态管理
├── hooks/         # 自定义Hooks
├── utils/         # 工具函数
└── config.js      # 前端配置文件

server/
├── controllers/   # 控制器
├── models/       # 数据模型
├── router/       # 路由配置
├── middlewares/  # 中间件
├── utils/        # 工具函数
└── config/       # 后端配置
```

## 常用开发命令

### 前端开发
```bash
# 安装依赖
yarn install

# 启动开发服务器 (默认端口 3000)
yarn start
# 或
yarn dev

# 构建生产版本
yarn build

# 运行测试
yarn test

# 构建 DLL 文件 (优化开发体验)
yarn dll
```

### 后端开发
```bash
# 进入服务器目录
cd server

# 安装依赖
npm install

# 启动开发服务器 (默认端口 6060)
npm run dev

# 生产环境启动 (需要 forever)
forever start app.js
```

### 生产环境部署
```bash
# 前端构建并启动 (端口 80)
cd src
yarn build
nohup serve -s build -l 80 &

# 后端启动
cd server
forever start app.js
```

## 关键配置文件

### 前端配置 (`src/config.js`)
- `API_BASE_URL`: 后端 API 地址
- `HEADER_BLOG_NAME`: 博客标题
- `SIDEBAR`: 侧边栏配置 (头像、个人信息、友链)
- `GITHUB`: GitHub OAuth 配置
- `ABOUT`: 关于页面配置
- `ANNOUNCEMENT`: 公告配置

### 后端配置 (`server/config/index.js`)
- `PORT`: 服务器端口
- `DATABASE`: 数据库连接配置
- `GITHUB`: GitHub OAuth 密钥
- `EMAIL_NOTICE`: 邮件通知配置
- `TOKEN`: JWT 配置

## 路由结构

### Web 路由 (用户前台)
- `/home` - 首页
- `/article/:id` - 文章详情
- `/article/share/:uuid` - 分享文章
- `/archives` - 归档页面
- `/categories` - 分类页面
- `/tags/:name` - 标签页面
- `/about` - 关于页面
- `/fragment` - 碎片页面

### Admin 路由 (管理后台)
- `/admin` - 管理首页
- `/admin/article/manager` - 文章管理
- `/admin/article/add` - 添加文章
- `/admin/article/edit/:id` - 编辑文章
- `/admin/fragment/manager` - 碎片管理
- `/admin/user` - 用户管理
- `/admin/monitor` - 监控面板

## 数据模型关系

- **User**: 用户表，支持 GitHub 登录
- **Article**: 文章表，支持 Markdown，关联 Category 和 Tag
- **Category**: 分类表
- **Tag**: 标签表
- **Comment**: 评论表，支持嵌套回复
- **Fragment**: 碎片/说说功能

## 开发注意事项

### 权限控制
- 管理后台需要用户 role = 1 (在 `App.jsx` 中检查)
- GitHub 登录用户名需要在 `server/config/index.js` 中的 `ADMIN_GITHUB_LOGIN_NAME` 配置

### 样式开发
- 使用 Less 作为 CSS 预处理器
- 全局样式在 `src/styles/` 目录
- 组件样式使用同名 `.less` 文件

### API 开发
- 后端 API 遵循 RESTful 规范
- 使用 Joi 进行参数验证
- 统一的错误处理和响应格式

### Live2D 功能
- 使用 `oh-my-live2d` 库
- 模型文件在 `public/Resources/` 和 `Resources/` 目录
- 支持多个角色模型切换

### 构建优化
- 使用 DLL 插件预构建第三方库
- 支持代码分割和懒加载
- 生产环境启用压缩和优化

### 代码规范
- 使用 ESLint 和 Prettier 进行代码检查和格式化
- 参考airbnb的代码规范：https://aitexiaoy.github.io/Airbnd-rules-zh/react.html

