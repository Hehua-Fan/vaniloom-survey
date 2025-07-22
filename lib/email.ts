import { BetaAccount } from './beta-accounts'
import nodemailer from 'nodemailer'

export interface EmailData {
  to: string
  subject: string
  html: string
}

// 表单数据接口
export interface SurveyFormData {
  name: string
  email: string
  contact: string
  age: string
  gender: string
  orientation: string
  ao3Content: string
  favoriteCpTags: string
  identity: string[]
}

// 生成内测账号邮件HTML模板
export function generateBetaAccountEmail(account: BetaAccount, userName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Vaniloom Beta Access</title>
      <style>
        body {
          background-color: #f5f7fa;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #cd76d8;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .credentials {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .credentials td {
          padding: 10px;
          border: 1px solid #e0e0e0;
        }
        .credentials .label {
          background-color: #f0f2f5;
          font-weight: bold;
          width: 30%;
        }
        .footer {
          background-color: #f0f2f5;
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to the Vaniloom Beta!</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Thank you for joining Vaniloom as an early beta tester! Let's build a world where even the rarest ships get their happily-ever-after. 😊</p>
          <p>Your beta account credentials are:</p>
          <table class="credentials">
            <tr>
              <td class="label">Email</td>
              <td>${account.username}</td>
            </tr>
            <tr>
              <td class="label">Password</td>
              <td>${account.password}</td>
            </tr>
          </table>
          <p>Note: Vaniloom is currently available as an English‑language product for North American users.</p>
          <p>Please keep your credentials safe and do not share them.</p>
        </div>
        <div class="footer">
          &copy; 2025 Vaniloom Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `
}

// 生成表单内容邮件HTML模板（发送给管理员）
export function generateSurveyFormEmail(formData: SurveyFormData, assignedAccount: BetaAccount): string {
  // 格式化身份数组
  const identityText = formData.identity.length > 0 ? formData.identity.join(', ') : '未选择'
  
  // 年龄选项映射
  const ageMap: { [key: string]: string } = {
    'under-12': '12岁以下',
    '12-17': '12-17岁',
    '18-22': '18-22岁',
    '23-28': '23-28岁',
    '29-34': '29-34岁',
    '35-plus': '35岁及以上',
    'prefer-not-say': '不愿透露'
  }
  
  // 性别选项映射
  const genderMap: { [key: string]: string } = {
    'female': '女',
    'male': '男',
    'other': '其他'
  }
  
  // 性取向选项映射
  const orientationMap: { [key: string]: string } = {
    'male': '男',
    'female': '女',
    'both': '双',
    'other': '其他'
  }

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>新的内测申请 - Vaniloom</title>
      <style>
        body {
          background-color: #f5f7fa;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 700px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #2563eb;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .form-section {
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 15px;
        }
        .form-section:last-child {
          border-bottom: none;
        }
        .field {
          margin-bottom: 12px;
        }
        .field-label {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .field-value {
          background-color: #f9fafb;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          white-space: pre-wrap;
        }
        .account-info {
          background-color: #dbeafe;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
          margin-top: 20px;
        }
        .account-info h3 {
          margin: 0 0 10px 0;
          color: #1e40af;
        }
        .footer {
          background-color: #f0f2f5;
          text-align: center;
          font-size: 12px;
          color: #777777;
          padding: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>新的内测申请</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Vaniloom Beta Survey Submission</p>
        </div>
        <div class="content">
          <p><strong>提交时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
          
          <div class="form-section">
            <h3 style="color: #1f2937; margin-top: 0;">基本信息</h3>
            <div class="field">
              <div class="field-label">称呼</div>
              <div class="field-value">${formData.name}</div>
            </div>
            <div class="field">
              <div class="field-label">邮箱</div>
              <div class="field-value">${formData.email}</div>
            </div>
            <div class="field">
              <div class="field-label">联系方式</div>
              <div class="field-value">${formData.contact}</div>
            </div>
            <div class="field">
              <div class="field-label">年龄</div>
              <div class="field-value">${ageMap[formData.age] || formData.age}</div>
            </div>
            <div class="field">
              <div class="field-label">性别</div>
              <div class="field-value">${genderMap[formData.gender] || formData.gender}</div>
            </div>
            <div class="field">
              <div class="field-label">性取向</div>
              <div class="field-value">${orientationMap[formData.orientation] || formData.orientation}</div>
            </div>
          </div>

          <div class="form-section">
            <h3 style="color: #1f2937; margin-top: 0;">内容偏好</h3>
            <div class="field">
              <div class="field-label">最近在ao3上看的内容和时间</div>
              <div class="field-value">${formData.ao3Content}</div>
            </div>
            <div class="field">
              <div class="field-label">喜欢的cp和tags</div>
              <div class="field-value">${formData.favoriteCpTags}</div>
            </div>
          </div>

          <div class="form-section">
            <h3 style="color: #1f2937; margin-top: 0;">身份信息</h3>
            <div class="field">
              <div class="field-label">身份类型</div>
              <div class="field-value">${identityText}</div>
            </div>
          </div>

          <div class="account-info">
            <h3>已分配账号信息</h3>
            <p><strong>用户名：</strong>${assignedAccount.username}</p>
            <p><strong>密码：</strong>${assignedAccount.password}</p>
            <p><strong>账号ID：</strong>${assignedAccount.id}</p>
          </div>
        </div>
        <div class="footer">
          Vaniloom 内测管理系统自动发送
        </div>
      </div>
    </body>
    </html>
  `
}

// 创建邮件传输器（专用于Vaniloom邮件服务器）
function createTransporter() {
  const emailFrom = process.env.EMAIL_FROM
  const emailPass = process.env.EMAIL_PASS
  const emailHost = process.env.EMAIL_HOST
  const emailPort = parseInt(process.env.EMAIL_PORT || '465')
  const emailSecure = process.env.EMAIL_SECURE !== 'false' // 默认为true

  if (!emailFrom || !emailPass) {
    throw new Error('邮件配置不完整：缺少 EMAIL_FROM 或 EMAIL_PASS')
  }

  const transporterConfig = {
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    auth: {
      user: emailFrom,
      pass: emailPass
    }
  }

  return nodemailer.createTransport(transporterConfig)
}

// 真实的邮件发送函数
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // 检查是否启用邮件发送
    if (process.env.EMAIL_ENABLED === 'false') {
      console.log('=== 模拟邮件发送（EMAIL_ENABLED=false）===')
      console.log('收件人:', emailData.to)
      console.log('主题:', emailData.subject)
      console.log('内容长度:', emailData.html.length, '字符')
      console.log('=====================================')
      
      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }

    // 创建传输器
    const transporter = createTransporter()

    // 验证邮件配置
    await transporter.verify()
    console.log('邮件服务器连接成功')

    // 发送邮件
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    })

    console.log('邮件发送成功:', {
      to: emailData.to,
      messageId: result.messageId,
      response: result.response
    })

    return true
  } catch (error) {
    console.error('邮件发送失败:', {
      error: error instanceof Error ? error.message : error,
      to: emailData.to,
      subject: emailData.subject
    })
    
    // 如果是配置错误，提供详细信息
    if (error instanceof Error && error.message.includes('配置')) {
      console.error('请检查环境变量配置：')
      console.error('- EMAIL_FROM: 发送邮箱地址')
      console.error('- EMAIL_PASS: 邮箱密码')
      console.error('- EMAIL_HOST: SMTP服务器地址')
    }
    
    return false
  }
}

// 发送内测账号邮件（给用户）
export async function sendBetaAccountEmail(
  userEmail: string,
  userName: string,
  account: BetaAccount
): Promise<boolean> {
  const emailData: EmailData = {
    to: userEmail,
    subject: 'Welcome to Vaniloom Beta - Your Account is Ready!',
    html: generateBetaAccountEmail(account, userName)
  }
  
  return await sendEmail(emailData)
}

// 发送表单内容邮件（给管理员）
export async function sendSurveyFormToAdmin(
  formData: SurveyFormData,
  assignedAccount: BetaAccount,
  adminEmail: string = 'X18168010727@outlook.com'
): Promise<boolean> {
  const emailData: EmailData = {
    to: adminEmail,
    subject: `新的内测申请 - ${formData.name} (${formData.email})`,
    html: generateSurveyFormEmail(formData, assignedAccount)
  }
  
  return await sendEmail(emailData)
} 