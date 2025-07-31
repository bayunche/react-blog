# 项目配置说明

## 概述

本文档详细说明了如何配置您的博客系统，包括个人信息、数据库连接、第三方服务等关键配置项。

## 🔧 必须配置的项目

### 1. 个人信息配置

#### 1.1 关于页面信息 (`src/views/web/about/MyInfo.jsx`)

请根据您的实际情况修改以下信息：

```jsx
// 第54-63行
<li>姓名：[您的姓名]</li>
<li>学历：[您的学历信息]</li>
<li>
  联系方式：
  <QqOutline /> [您的QQ号]
  <Divider type='vertical' />
  <SvgIcon type='iconemail' style={{ marginRight: 5, transform: 'translateY(2px)' }} />
  <a href='mailto:[您的邮箱]'>[您的邮箱]</a>
</li>
<li>工作地：[您的工作地点]</li>
```

#### 1.2 技能展示配置

在同一文件中，您可以修改 `skills` 数组来展示您的技能：

```jsx
const skills = [
  {
    label: '您的技能描述',
    rate: 5  // 1-5星评级
  },
  // 添加更多技能...
]
```

### 2. 前端配置 (`src/config.js`)

#### 2.1 基本信息配置

```javascript
// 博客名称
export const HEADER_BLOG_NAME = '您的博客名称'

// 侧边栏配置
export const SIDEBAR = {
  avatar: require('@/assets/images/avatar.jpg'), // 替换为您的头像
  title: '您的博客名称',
  subTitle: '您的个人简介',
  homepages: {
    github: {
      link: 'https://github.com/your-username', // 您的GitHub地址
      icon: <GithubFill className='homepage-icon' />,
    },
  },
}
```

#### 2.2 API地址配置

```javascript
// 开发环境
export const API_BASE_URL = 'http://127.0.0.1:6060'

// 生产环境
export const API_BASE_URL = 'https://your-domain.com/api'
```

#### 2.3 GitHub OAuth配置

```javascript
export const GITHUB = {
  enable: true,
  client_id: 'your_github_client_id', // 从GitHub OAuth应用获取
  url: 'https://github.com/login/oauth/authorize',
}
```

### 3. 后端配置 (`server/config/index.js`)

#### 3.1 管理员配置

```javascript
const config = {
  PORT: 6060, // 服务器端口
  ADMIN_GITHUB_LOGIN_NAME: 'your_github_username', // 管理员GitHub用户名
}
```

#### 3.2 数据库配置

```javascript
DATABASE: {
  database: 'your_database_name',
  user: 'your_username',
  password: 'your_password',
  options: {
    host: 'localhost', // 数据库地址
    dialect: 'mysql',
    // ... 其他配置
  }
}
```

#### 3.3 GitHub OAuth配置

```javascript
GITHUB: {
  client_id: 'your_github_client_id',
  client_secret: 'your_github_client_secret',
  access_token_url: 'https://github.com/login/oauth/authorize',
  fetch_user_url: 'https://api.github.com/user',
  fetch_user: 'https://api.github.com/user'
}
```

#### 3.4 邮件服务配置

```javascript
EMAIL_NOTICE: {
  enable: true, // 是否启用邮件通知
  transporterConfig: {
    host: 'smtp.qq.com', // SMTP服务器
    port: 465,
    secure: true,
    auth: {
      user: 'your_email@example.com', // 发送邮箱
      pass: 'your_email_authorization_code' // 邮箱授权码
    }
  },
  subject: '您的博客 - 您的评论获得新的回复！',
  text: '您的评论获得新的回复！',
  WEB_HOST: 'http://your-domain.com' // 网站地址
}
```

#### 3.5 JWT配置

```javascript
TOKEN: {
  secret: 'your_jwt_secret_key', // 建议使用复杂的随机字符串
  expiresIn: '720h' // token有效期
}
```

## 🔐 环境变量配置（推荐）

为了安全起见，建议将敏感信息配置为环境变量：

### 前端环境变量 (`.env`)

```bash
# GitHub OAuth
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id

# API地址
REACT_APP_API_BASE_URL=https://your-domain.com/api

# 加密密钥
REACT_APP_ENCRYPTION_KEY=your_encryption_key
REACT_APP_ENCRYPTION_IV=your_encryption_iv
```

### 后端环境变量

```bash
# 数据库配置
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT密钥
JWT_SECRET=your_jwt_secret_key

# 邮箱配置
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_authorization_code

# 网站地址
WEB_HOST=https://your-domain.com
```

## 📁 资源文件配置

### 头像更换

将您的头像文件替换 `src/assets/images/avatar.jpg`

推荐尺寸：200x200像素，格式：JPG/PNG

### 背景图片

- 主页背景：`src/assets/images/background.jpg`
- 欢迎页背景：`src/assets/images/welcome.jpg`

## 🛠️ GitHub OAuth应用设置

1. 访问 GitHub Settings > Developer settings > OAuth Apps
2. 点击 "New OAuth App"
3. 填写应用信息：
   - Application name: 您的博客名称
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/github
4. 获取 Client ID 和 Client Secret
5. 将这些信息配置到前后端配置文件中

## 📧 QQ邮箱SMTP配置

1. 登录QQ邮箱
2. 设置 > 账户 > POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
3. 开启SMTP服务
4. 获取授权码
5. 在配置文件中使用授权码而不是QQ密码

## 🗄️ 数据库初始化

1. 创建MySQL数据库
2. 运行后端服务器，Sequelize会自动创建表结构
3. 首次运行会执行 `server/initData.js` 创建初始数据

## 🚀 部署配置

### 开发环境

```bash
# 前端
npm start

# 后端
cd server
npm run dev
```

### 生产环境

```bash
# 前端构建
npm run build

# 使用serve托管静态文件
npm install -g serve
serve -s build -l 80

# 后端部署
cd server
npm install -g forever
forever start app.js
```

## ⚠️ 安全注意事项

1. **绝不要**将敏感信息（如密钥、密码）提交到Git仓库
2. 生产环境必须使用HTTPS
3. 定期更换JWT密钥
4. 使用强密码策略
5. 启用XSS防护（参考REFACTOR.md）

## 🔍 故障排除

### 常见问题

1. **GitHub登录失败**
   - 检查Client ID和Client Secret是否正确
   - 确认回调URL配置正确

2. **邮件发送失败**
   - 检查SMTP配置
   - 确认使用的是授权码而不是密码

3. **数据库连接失败**
   - 检查数据库配置信息
   - 确认数据库服务已启动

4. **跨域问题**
   - 检查后端CORS配置
   - 确认API地址配置正确

### 日志查看

- 前端：浏览器开发者工具 Console
- 后端：服务器控制台输出
- 数据库：MySQL错误日志

## 📞 技术支持

如遇到配置问题，请：

1. 检查控制台错误信息
2. 确认配置文件语法正确
3. 参考REFACTOR.md中的安全配置
4. 查看项目GitHub Issues

配置完成后，请重启前后端服务以使配置生效。