# 安装yarn
npm install -g yarn 

# yarn 设置淘宝源
yarn config set registry https://registry.npmmirror.com/

# 安装PM2
yarn global add pm2 

# 安装依赖
yarn install

# 打包并启动前端
nohup yarn serve -s build -l 4356 &  

# 启动后端
cd ./server && pm2 start app.js --name "blog_server" --watch

# 配置 MySQL 用户
service mysql start
mysql -u root -e "CREATE USER 'testuser'@'localhost' IDENTIFIED BY '12345678';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'testuser'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"

# 导入数据库
mysql -u testuser -p12345678 < ./server/db/test.sql && echo "数据库导入成功"