# 安装yarn
if ! command -v yarn &> /dev/null; then
    npm install -g yarn 
fi

# yarn 设置淘宝源
yarn config set registry https://registry.npmmirror.com/

# 安装PM2
yarn global add pm2 

# 安装依赖
yarn install

yarn add serve 


timeout 600 yarn build || {
    echo "构建15分钟自动结束，继续执行后续命令"
    # 这里可以添加清理或重试逻辑
}


# 启动前端
nohup yarn serve -s build -l 4356 &  

# 启动后端
cd ./server  

yarn install && pm2 start app.js --name "blog_server" --watch

chmod +x /usr/local/bin/backup_db.sh


# 导入数据库
mysql -h "${DATABASE_HOST:-mysql}" -u testuser -p12345678 test < ./db/test.sql && echo "数据库导入成功"

# ============ 添加定时任务 ============
# 备份数据库
(crontab -l ; echo "0 2 * * * ./backup_db.sh") | crontab -

echo "项目初始化完成"