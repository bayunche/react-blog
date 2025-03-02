# 使用 Node.js 作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 复制证书
COPY ./cert ./cert

# 安装 nginx 和 MySQL
RUN apt-get update && apt-get install -y nginx 

# 设置端口
EXPOSE 80
EXPOSE 443

# 设置容器名称
LABEL name="blog"

# 设置 nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# 复制项目文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 以 root 权限启动 install.sh
RUN chmod +x install.sh && ./install.sh

# 启动 nginx 和 MySQL
CMD ["sh", "-c", "service mysql start && nginx -g 'daemon off;'"]



