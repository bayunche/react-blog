# 使用 Node.js 作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 复制证书
COPY ./cert ./cert

# 安装nginx 
RUN apt-get update && apt-get install -y nginx

# 安装PM2
RUN npm install -g pm2

# 设置端口
EXPOSE 4356

EXPOSE 80

EXPOSE 443

# 设置容器名称
LABEL name="blog"

# 设置nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# 安装依赖
RUN yarn install

# 复制项目文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 启动后端(使用PM2)
RUN cd ./server && pm2 start app.js --name "blog_server" 

# 启动前端 
RUN nohup yarn serve -s build -l 4356 &  


# 启动nginx

CMD ["nginx", "-g", "daemon off;"]



# 设置容器名称
LABEL name="blog"

