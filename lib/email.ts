import { BetaAccount } from './beta-accounts'
import nodemailer from 'nodemailer'

export interface EmailData {
  to: string
  subject: string
  html: string
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

// 发送内测账号邮件
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