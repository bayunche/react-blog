const devMode = process.env.NODE_ENV === 'development'
const config = {
  PORT: 6060, // 启动端口
  ADMIN_GITHUB_LOGIN_NAME: '1035010167@qq.com', // 博主的 github 登录的账户名 user
  GITHUB: {
    client_id: '87a4f88b943adaafd44a',
    client_secret: '5339d20f5b1488aeeb8d853a004cb749153790af',
    access_token_url: 'https://github.com/login/oauth/authorize',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/user' // fetch user url https://api.github.com/users/gershonv
  },
  EMAIL_NOTICE: {
    // 邮件通知服务
    // detail: https://nodemailer.com/
    enable: true, // 开关
    transporterConfig: {
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '1035010167@qq.com', // generated ethereal user
        pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
      }
    },
    subject: 'bayunche的博客 - 您的评论获得新的回复！', // 主题
    text: '您的评论获得新的回复！',
    WEB_HOST: 'http://www.hasunemiku.top' // email callback url
  },
  TOKEN: {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token 有效期
  },
  DATABASE: {
    database: 'test',
    user: 'testuser',
    password: '12345678',
    options: {
      host: 'mysql', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  }
}

// 部署的环境变量设置
if (!devMode) {
  console.log('env production....')

  // ==== 配置数据库
  config.DATABASE = {
    database: 'test',
    user: 'testuser',
    password: '12345678',
    options: {
      host: 'mysql', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  }

  // 配置 github 授权
  config.GITHUB.client_id = 'Ov23liUWC0ufLK84Cl0D'
  config.GITHUB.client_secret = '5339d20f5b1488aeeb8d853a004cb749153790af'

  // ==== 配置 token 密钥
  config.TOKEN = {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token 有效期
  }

  // ==== 配置邮箱

  // config.EMAIL_NOTICE.enable = true
  config.EMAIL_NOTICE.transporterConfig.auth = {
    user: '1035010167@qq.com', // generated ethereal user
    pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
  }
  config.EMAIL_NOTICE.WEB_HOST = 'https://hasunemiku.top' // email callback url
}

module.exports = config
