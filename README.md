# Script Generator

AI 驱动的 Vlog 脚本生成器，帮助视频博主快速创作专业脚本。

## ✨ 功能特性

- 🎯 **智能脚本生成**：支持多种主题和风格，一键生成完整 Vlog 脚本
- 🤖 **多模型支持**：集成 GLM-4、DeepSeek-V3 等国产大模型
- 📄 **文件解析**：支持图片（OCR）、PDF、Word 文档的 brief 识别
- 💡 **内容建议**：AI 自动生成 5+ 个内容植入方向建议
- 📝 **脚本预览**：直观展示脚本，支持部分/整体重新生成
- 📊 **Excel 导出**：导出可编辑的 Excel 脚本表格
- 🎨 **精美 UI**：基于 shadcn/ui 的现代化界面

## 🚀 快速开始

### 1. 克隆项目

```bash
cd script-generator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，并填入你的 API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 智谱 AI GLM-4 API Key（至少配置一个）
GLM_API_KEY=your_glm_api_key_here

# DeepSeek API Key（可选）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

获取 API Key：
- [智谱 AI](https://open.bigmodel.cn/)
- [DeepSeek](https://platform.deepseek.com/)

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 项目结构

```
script-generator/
├── app/
│   ├── api/              # API 路由
│   │   ├── generate/     # 生成脚本 API
│   │   ├── models/       # 获取模型列表 API
│   │   └── parse-file/   # 文件解析 API
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主页面
├── components/
│   ├── ui/               # UI 组件
│   ├── ModelSelector.tsx # 模型选择器
│   ├── FileUploader.tsx  # 文件上传器
│   ├── ScriptForm.tsx    # 脚本生成表单
│   └── ScriptPreview.tsx # 脚本预览
├── lib/
│   ├── ai/               # AI 服务层
│   │   ├── base.ts       # AI 基类
│   │   ├── glm.ts        # GLM-4 实现
│   │   └── deepseek.ts   # DeepSeek 实现
│   ├── file/
│   │   ├── parser.ts     # 文件解析工具
│   │   └── excel-exporter.ts # Excel 导出工具
│   └── utils.ts          # 工具函数
├── types/
│   └── script.ts         # 类型定义
└── package.json
```

## 🎯 使用指南

### 1. 选择 AI 模型

在页面右上角选择要使用的 AI 模型（GLM-4 或 DeepSeek-V3）。

### 2. 填写脚本信息

- **基本信息**：博主 ID、主页链接（AI 会参考你的历史风格）
- **Vlog 内容**：主题、口播风格、预计时长
- **Brief 文档**：上传图片、PDF 或 Word 文档，AI 会自动提取并建议内容方向
- **备注**：额外的要求或说明

### 3. 选择内容植入方向

如果上传了 Brief 文档，AI 会生成 5+ 个内容植入方向建议，选择一个即可。

### 4. 生成脚本

点击"生成脚本"按钮，AI 将创作完整的 Vlog 脚本。

### 5. 预览和调整

- 查看生成的脚本，包括开场、正文、结束等完整内容
- 如果不满意某个片段，可以单独重新生成
- 也可以提供反馈，让 AI 整体优化

### 6. 导出脚本

点击"导出 Excel"，获得可编辑的 Excel 脚本表格。

## 🔧 技术栈

- **前端**：Next.js 14 + React + TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **AI 集成**：GLM-4、DeepSeek-V3 API
- **文件处理**：Tesseract.js（OCR）、pdf-parse、mammoth
- **Excel 导出**：xlsx

## 📝 脚本输出格式

生成的脚本包含：

- **基本信息**：博主 ID、主页链接、合作产品、标题、总时长、封面
- **发布文案**：适合社交媒体的文案和标签
- **开场文案**：吸引观众的开场白
- **脚本正文**：
  - 镜号（阿拉伯数字）
  - 景别（远、中、近）
  - 片段预计时长（秒）
  - 镜头内容
  - 口播文案
  - 备注
- **结束文案**：总结升华，引导关注

## 🚀 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（GLM_API_KEY、DEEPSEEK_API_KEY）
4. 点击部署

### 其他平台

项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC

## 💡 未来计划

- [ ] 支持更多 AI 模型（GPT-4、Claude 等）
- [ ] 脚本模板库
- [ ] 历史脚本管理
- [ ] 团队协作功能
- [ ] 移动端适配
