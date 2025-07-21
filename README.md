# Vaniloom 内测用户调查问卷

这是一个为 Vaniloom 平台设计的内测用户调查问卷系统，用于收集用户信息并自动分配内测账号。

## 功能特点

- 📝 完整的调查问卷表单，包含用户基本信息和偏好调研
- 🔐 自动分配内测账号和密码
- 📧 邮件发送功能（可集成真实邮件服务）
- 👤 防重复提交（基于邮箱地址）
- 📊 管理后台查看账号分配情况
- 🎨 美观的现代化界面设计
- ⚡ 基于 Next.js 14 和 TypeScript

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **表单管理**: React Hook Form + Zod
- **通知系统**: Sonner
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 3. 访问应用

- 主页（调查问卷）: [http://localhost:3000](http://localhost:3000)
- 管理后台: [http://localhost:3000/admin](http://localhost:3000/admin)

## 项目结构

```
├── app/
│   ├── api/submit-survey/     # API路由：处理问卷提交
│   ├── admin/                 # 管理后台页面
│   └── page.tsx               # 主页：调查问卷
├── components/
│   ├── ui/                    # shadcn/ui 组件
│   └── survey-form.tsx        # 调查问卷表单组件
├── lib/
│   ├── beta-accounts.ts       # 内测账号数据管理
│   ├── email.ts               # 邮件发送功能
│   └── utils.ts               # 工具函数
```

## 配置说明

### 内测账号管理

内测账号在 `lib/beta-accounts.ts` 中管理：

- 默认提供 20 个内测账号
- 支持账号分配状态跟踪
- 防重复分配机制

### 邮件配置

现已支持真实邮件发送！请按以下步骤配置：

1. **复制环境变量配置文件：**
```bash
cp env.example .env.local
```

2. **编辑 `.env.local` 文件，选择邮件服务商：**

**Gmail（推荐）：**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@vaniloom.com
EMAIL_ENABLED=true
```

**QQ 邮箱：**
```env
EMAIL_SERVICE=
EMAIL_HOST=smtp.qq.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-authorization-code
EMAIL_FROM=noreply@vaniloom.com
EMAIL_ENABLED=true
```

3. **详细配置指南：** 
请查看 [EMAIL_SETUP.md](./EMAIL_SETUP.md) 获取完整的配置说明和故障排除指南。

4. **开发模式：** 
如果暂时不想配置真实邮件，设置 `EMAIL_ENABLED=false` 使用模拟发送。

### 表单字段说明

问卷包含以下字段：
- 用户称呼（必填）
- 邮箱地址（必填，用于发送账号）
- 联系方式（必填）
- 年龄段选择（必填）
- 性别（必填）
- 性取向（必填）
- AO3 使用情况（必填，文本域）
- 喜好内容标签（必填，文本域）
- 用户身份（多选，必填）

## API 接口

### POST /api/submit-survey

提交调查问卷并分配内测账号

**请求体**:
```json
{
  "name": "string",
  "email": "string",
  "contact": "string",
  "age": "string",
  "gender": "string",
  "orientation": "string",
  "ao3Content": "string",
  "favoriteCpTags": "string",
  "identity": ["string"]
}
```

**响应**:
```json
{
  "success": true,
  "message": "问卷提交成功！内测账号已发送到您的邮箱",
  "accountInfo": {
    "username": "beta_user_001"
  },
  "remainingAccounts": 19
}
```

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量（如需要邮件服务）
4. 部署完成

### 其他平台部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

## 管理功能

访问 `/admin` 路径查看：
- 账号分配统计
- 已分配账号列表
- 可用账号列表
- 分配进度条
- 账号不足警告

## 安全考虑

- 防止邮箱重复提交
- 前后端数据验证
- 密码仅在邮件中显示
- 管理页面建议增加身份验证

## 自定义

### 添加更多内测账号

编辑 `lib/beta-accounts.ts`，在 `betaAccounts` 数组中添加更多账号：

```typescript
{
  id: '21',
  username: 'beta_user_021',
  password: 'VaniB2024!',
  isAssigned: false,
}
```

### 修改表单字段

编辑 `components/survey-form.tsx`：
- 修改 `formSchema` 更新验证规则
- 修改表单 JSX 更新界面
- 修改 API 路由处理新字段

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
