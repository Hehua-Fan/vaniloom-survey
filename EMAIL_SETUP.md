# 📧 邮件服务配置指南

本指南将帮助您配置真实的邮件发送功能，以便用户提交问卷后能收到内测账号。

## 🚀 快速开始

### 1. 复制环境变量配置文件

```bash
cp env.example .env.local
```

### 2. 编辑 `.env.local` 文件

使用以下配置来启用真实的邮件发送：

## 📮 Vaniloom 邮件服务器配置

**官方配置（开箱即用）：**

```env
# Vaniloom 邮件服务器配置
EMAIL_HOST=smtp.qcloudmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_FROM=noreply@mail.vaniloom.com
EMAIL_PASS=VanilooM0617
EMAIL_ENABLED=true
VANILOOM_URL=https://vaniloom.com
```

这是Vaniloom官方的邮件服务器配置，已经预配置好所有必要参数，可以直接使用。

## ⚙️ 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `EMAIL_HOST` | 是 | SMTP 服务器地址（默认：smtp.qcloudmail.com）|
| `EMAIL_PORT` | 否 | SMTP 端口（默认：465）|
| `EMAIL_SECURE` | 否 | 是否使用 SSL/TLS（默认：true）|
| `EMAIL_FROM` | 是 | 发送邮箱地址 |
| `EMAIL_PASS` | 是 | 邮箱密码 |
| `EMAIL_ENABLED` | 否 | 是否启用邮件发送（默认：true）|
| `VANILOOM_URL` | 否 | Vaniloom 平台地址 |

## 🔧 测试邮件配置

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 填写测试问卷

访问 [http://localhost:3001](http://localhost:3001)，填写问卷并提交。

### 3. 查看日志

检查控制台输出：
- ✅ `邮件服务器连接成功` - 配置正确
- ✅ `邮件发送成功` - 发送成功
- ❌ `邮件发送失败` - 检查配置

## 🐛 常见问题

### 问题 1：Authentication failed（认证失败）

**原因：** 用户名或密码错误

**解决方案：**
- 检查 `EMAIL_FROM` 和 `EMAIL_PASS` 是否正确
- 确认使用的是Vaniloom提供的邮件服务器凭据
- 验证 `EMAIL_HOST` 设置为 `smtp.qcloudmail.com`

### 问题 2：Connection timeout（连接超时）

**原因：** 网络或服务器配置问题

**解决方案：**
- 检查 `EMAIL_HOST` 和 `EMAIL_PORT` 配置
- 尝试切换 `EMAIL_SECURE` 设置
- 检查防火墙设置

### 问题 3：Invalid login（无效登录）

**原因：** 邮箱用户名或密码错误

**解决方案：**
- 确认 EMAIL_FROM 和 EMAIL_PASS 配置正确
- 检查是否存在拼写错误
- 确保使用的是正确的Vaniloom邮件服务器凭据

### 问题 4：Mailbox unavailable（邮箱不可用）

**原因：** 发件人地址配置问题

**解决方案：**
- 确保 `EMAIL_FROM` 地址有效
- 某些服务商要求发件人地址与认证账户一致

## 🔒 安全建议

1. **永远不要将 `.env.local` 文件提交到版本控制**
2. **妥善保管Vaniloom邮件服务器凭据**
3. **定期检查邮件发送日志**
4. **确保只在授权的环境中使用**

## 🔄 开发模式

如果暂时不想配置真实邮件服务，可以设置：

```env
EMAIL_ENABLED=false
```

这样会使用模拟发送模式，在控制台显示邮件内容，但不会实际发送。

## 📞 技术支持

如果您在配置过程中遇到问题，请：

1. 检查控制台错误日志
2. 参考本文档的常见问题部分
3. 确认邮件服务商的 SMTP 设置要求 