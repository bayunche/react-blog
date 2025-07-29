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

# 导入数据库
mysql -h "${DATABASE_HOST:-mysql}" -u testuser -p12345678 test < ./db/test.sql && echo "数据库导入成功"

# ============ 添加定时任务 ============
# 1. 确保备份脚本有执行权限
chmod +x /app/backup_db.sh

# 2. 创建系统级定时任务
echo "0 2 * * * root /app/backup_db.sh >/app/log/backup_db.log 2>&1" > /etc/cron.d/blog_backup
chmod 644 /etc/cron.d/blog_backup

# 3. 启动cron服务
if [ -f /etc/init.d/cron ]; then
    service cron start
elif [ -f /usr/sbin/cron ]; then
    /usr/sbin/cron
fi

echo "项目初始化完成"