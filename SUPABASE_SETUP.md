# Supabase 设置指南

本项目已迁移到使用 Supabase 作为后端数据库，用于存储内测账号信息。

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建账号
2. 创建新项目
3. 等待项目初始化完成

## 2. 获取项目配置信息

在 Supabase 项目仪表板中：

1. 进入 **Settings** > **API**
2. 复制以下信息：
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件，添加以下配置：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email Configuration (保持现有配置)
EMAIL_FROM=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_ENABLED=true
```

## 4. 创建数据库表

在 Supabase 项目中：

1. 进入 **SQL Editor**
2. 复制并执行 `supabase-schema.sql` 文件中的 SQL 代码
3. 这将创建 `beta_accounts` 表及相关索引和安全策略

## 5. 插入账号数据

您需要手动将内测账号数据插入到数据库表中。可以通过以下方式：

### 方式1：SQL Editor 批量插入
在 Supabase 的 SQL Editor 中执行插入语句：

```sql
INSERT INTO public.beta_accounts (id, username, password, is_assigned, assigned_to, assigned_at, created_at, updated_at) VALUES
('1', 'Vanitest01', '123456', false, null, null, now(), now()),
('2', 'Vanitest02', '654321', false, null, null, now(), now()),
('3', 'Vanitest03', '789012', false, null, null, now(), now());
-- ... 继续添加更多账号
```

### 方式2：Table Editor 手动添加
1. 进入 Supabase 项目的 **Table Editor**
2. 选择 `beta_accounts` 表
3. 点击 **Insert row** 手动添加账号记录

## 6. 验证设置

1. 启动项目：`npm run dev`
2. 访问管理页面：`http://localhost:3000/admin`
3. 确认能够看到账号列表

## 数据库表结构

```sql
beta_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_assigned BOOLEAN NOT NULL DEFAULT false,
  assigned_to TEXT,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

## 安全注意事项

1. **RLS (Row Level Security)**: 已启用行级安全策略
2. **API Keys**: 确保不要在客户端代码中暴露 service_role key
3. **环境变量**: 不要将 `.env.local` 提交到版本控制

## 迁移说明

- 原有的 `accounts-state.json` 文件系统已被移除
- 所有账号状态现在存储在 Supabase 数据库中
- API 接口保持不变，只是底层存储机制发生改变
- 账号数据需要手动插入到数据库中

## 故障排除

### 连接问题
- 检查 Supabase URL 和 API Key 是否正确
- 确认项目已正确初始化

### 权限问题
- 确认 RLS 策略已正确设置
- 检查 API Key 权限

### 数据问题
- 确认已手动插入账号数据到数据库表中
- 检查表结构是否正确创建 