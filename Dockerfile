# 使用 Node.js 作为基础镜像
FROM node:16

# 更新 apt 并安装 nginx、mysql-server、mysql-client 和 dos2unix
RUN apt-get update && apt-get install -y \
    nginx \
    dos2unix \
    default-mysql-client \
    cron \
  && rm -rf /var/lib/apt/lists/*

  
# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 复制证书
COPY ./cert ./cert



# 设置端口
EXPOSE 80
EXPOSE 443
EXPOSE 6060


# 设置容器名称
LABEL name="blog"

# 设置 nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# 复制项目文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 将 initProject.sh 转换为 Unix 格式
RUN dos2unix ./initProject.sh

# 移除构建阶段启动 MySQL 和执行 initProject.sh 的步骤
# COPY entrypoint.sh 并赋予执行权限
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh



# 使用 entrypoint 脚本启动容器
CMD ["/app/entrypoint.sh"]