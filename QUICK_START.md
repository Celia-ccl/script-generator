# 快速启动指南

## 1. 配置 API Key

编辑 `.env` 文件，填入你的 API Key：

```bash
nano .env
```

至少配置一个：

```env
# 智谱 AI GLM-4 API Key（推荐）
GLM_API_KEY=your_glm_api_key_here

# 或 DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

获取 API Key：
- [智谱 AI](https://open.bigmodel.cn/) - 免费额度充足
- [DeepSeek](https://platform.deepseek.com/) - 高性能大模型

## 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 3. 生成第一个脚本

1. 选择 AI 模型（GLM-4 或 DeepSeek-V3）
2. 填写脚本信息：
   - 博主 ID 和主页链接（可选，AI 会参考风格）
   - 主题、口播风格、预计时长
   - 上传 Brief 文档（可选）
3. 如果上传了文档，AI 会自动生成内容植入方向建议，选择一个
4. 点击"生成脚本"
5. 查看生成的脚本，可以单独重新生成某个片段
6. 导出 Excel 文件

## 4. 部署到 Vercel

```bash
# 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

然后在 [vercel.com](https://vercel.com) 导入项目，配置环境变量即可。

## 常见问题

### Q: 没有显示可用模型？

A: 检查 `.env` 文件中的 API Key 是否正确配置。

### Q: 文件上传失败？

A: 文件大小不能超过 10MB，支持的格式：图片、PDF、Word 文档。

### Q: 如何切换模型？

A: 在页面右上角选择不同的模型。

## 技术支持

- 查看 [README.md](./README.md) 了解详细功能
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署方式
