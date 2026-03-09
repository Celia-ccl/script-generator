# 部署指南

## Vercel 部署（推荐）

### 1. 准备工作

- 将代码推送到 GitHub 仓库
- 获取 AI 模型的 API Key：
  - [智谱 AI](https://open.bigmodel.cn/) - GLM-4
  - [DeepSeek](https://platform.deepseek.com/) - DeepSeek-V3

### 2. 部署步骤

#### 方法一：通过 Vercel 网页界面

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 在 "Environment Variables" 中添加以下变量：
   - `GLM_API_KEY`：你的智谱 AI API Key（必填）
   - `DEEPSEEK_API_KEY`：你的 DeepSeek API Key（可选）
5. 点击 "Deploy"

#### 方法二：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
cd script-generator
vercel
```

4. 按照提示操作，设置环境变量

### 3. 环境变量配置

在 Vercel 项目设置中，添加以下环境变量：

| 变量名 | 说明 | 是否必填 |
|--------|------|----------|
| `GLM_API_KEY` | 智谱 AI 的 API Key | 是（至少配置一个） |
| `DEEPSEEK_API_KEY` | DeepSeek 的 API Key | 否 |

### 4. 域名设置（可选）

部署完成后，你可以：
- 使用 Vercel 提供的默认域名
- 在项目设置中添加自定义域名

## 其他部署方式

### Docker 部署

1. 创建 `Dockerfile`：
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. 构建镜像：
```bash
docker build -t script-generator .
```

3. 运行容器：
```bash
docker run -p 3000:3000 \
  -e GLM_API_KEY=your_key \
  script-generator
```

### 自有服务器部署

1. 克隆代码：
```bash
git clone <your-repo>
cd script-generator
npm install
```

2. 构建项目：
```bash
npm run build
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件
```

4. 启动服务：
```bash
npm start
```

5. 使用 PM2 管理进程（推荐）：
```bash
npm install -g pm2
pm2 start npm --name "script-generator" -- start
pm2 save
pm2 startup
```

## 注意事项

1. **API Key 安全**：
   - 不要将 API Key 提交到 Git
   - 使用环境变量存储敏感信息
   - 在 Vercel 等平台使用加密的环境变量

2. **资源限制**：
   - Vercel 免费版有函数执行时间限制（10秒）
   - 文件上传大小建议不超过 10MB
   - OCR 处理可能需要较长时间

3. **监控和日志**：
   - 在 Vercel Dashboard 中查看部署日志
   - 监控 API 调用次数和费用
   - 定期检查错误日志

## 常见问题

### Q: 部署后无法访问 API？

A: 检查环境变量是否正确配置，确保至少有一个模型的 API Key 已设置。

### Q: 文件上传失败？

A: 检查 Vercel 的请求体大小限制，默认为 4.5MB。如需更大限制，需升级计划。

### Q: OCR 处理超时？

A: Vercel 函数执行时间限制为 10秒（免费版）。建议升级到 Pro 版或使用其他部署方式。

### Q: 如何更新部署？

A: 推送新代码到 GitHub，Vercel 会自动重新部署。或手动在 Vercel Dashboard 中点击 "Redeploy"。
