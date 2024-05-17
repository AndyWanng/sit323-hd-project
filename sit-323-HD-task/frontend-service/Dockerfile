# 使用Node.js官方的基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目源代码
COPY . .

# 如果您的前端服务需要构建，请取消下面这行注释
# RUN npm run build

# 开放容器的端口号
EXPOSE 8080

# 项目启动命令
CMD [ "node", "server.js" ]
