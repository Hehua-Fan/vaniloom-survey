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
  otherIdentity?: string // 新增：其他身份的具体描述
  acceptFollowUp: string // 新增：是否接受回访
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
        * {
          box-sizing: border-box;
        }
        
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        
        .email-wrapper {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          max-width: 640px;
          margin: 0 auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .container {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          position: relative;
        }
        
        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #cd76d8, #a855c9, #9333ea, #7c3aed);
          background-size: 300% 100%;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .header {
          background: linear-gradient(135deg, #cd76d8 0%, #a855c9 50%, #9333ea 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(-10px, -10px) rotate(0deg); }
          50% { transform: translate(10px, 10px) rotate(180deg); }
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .welcome-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .content {
          padding: 40px 30px;
          color: #374151;
          line-height: 1.7;
          font-size: 16px;
        }
        
        .greeting {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .message {
          background: linear-gradient(135deg, #fef3ff 0%, #f3e8ff 100%);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #cd76d8;
          margin: 25px 0;
          position: relative;
        }
        
        .message::before {
          content: '✨';
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 20px;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .credentials-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        
        .credentials-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .credentials-title::before {
          content: '🔑';
          font-size: 20px;
        }
        
        .credentials {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }
        
        .credentials td {
          padding: 15px;
          border: none;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .credentials tr:last-child td {
          border-bottom: none;
        }
        
        .credentials .label {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          font-weight: 600;
          width: 30%;
          color: #374151;
          border-radius: 8px 0 0 8px;
        }
        
        .credentials .value {
          background: #ffffff;
          font-family: 'Courier New', monospace;
          color: #1f2937;
          font-weight: 500;
          border-radius: 0 8px 8px 0;
        }
        
        .login-section {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          padding: 20px;
          border-radius: 12px;
          margin: 25px 0;
          text-align: center;
          border: 1px solid #a7f3d0;
        }
        
        .login-text {
          font-size: 17px;
          font-weight: 500;
          color: #065f46;
          margin-bottom: 15px;
        }
        
        .vaniloom-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          position: relative;
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #cd76d8 0%, #a855c9 100%);
          border-radius: 25px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(205, 118, 216, 0.3);
          font-size: 16px;
        }
        
        .vaniloom-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #a855c9 0%, #9333ea 100%);
          border-radius: 25px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .vaniloom-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(205, 118, 216, 0.4);
        }
        
        .vaniloom-link:hover::before {
          opacity: 1;
        }
        
        .vaniloom-link span {
          position: relative;
          z-index: 1;
        }
        
        .note {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          color: #92400e;
        }
        
        .note::before {
          content: '⚠️ ';
          font-weight: bold;
        }
        
        .security-note {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          color: #991b1b;
        }
        
        .security-note::before {
          content: '🔒 ';
          font-weight: bold;
        }
        
        .footer {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          text-align: center;
          font-size: 13px;
          color: #64748b;
          padding: 25px 20px;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-logo {
          font-size: 24px;
          margin-bottom: 10px;
          color: #cd76d8;
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
          .email-wrapper {
            padding: 10px;
            margin: 10px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .credentials .label {
            width: 40%;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <span class="welcome-icon">🌟</span>
            <h1>Welcome to the Vaniloom Beta!</h1>
          </div>
          <div class="content">
            <div class="greeting">Dear ${userName},</div>
            
            <div class="message">
              <p>Thank you for joining Vaniloom as an early beta tester! Let's build a world where even the rarest ships get their happily-ever-after. 😊</p>
            </div>
            
            <div class="credentials-section">
              <div class="credentials-title">Your Beta Account Credentials</div>
              <table class="credentials">
                <tr>
                  <td class="label">Email</td>
                  <td class="value">${account.username}</td>
                </tr>
                <tr>
                  <td class="label">Password</td>
                  <td class="value">${account.password}</td>
                </tr>
              </table>
            </div>
            
            <div class="login-section">
              <div class="login-text">Ready to start your journey?</div>
              <a href="https://vaniloom.com" class="vaniloom-link" target="_blank">
                <span>🚀 Launch Vaniloom</span>
              </a>
            </div>
            
            <div class="note">
              <strong>Regional Notice:</strong> Vaniloom is currently available as an English‑language product for North American users.
            </div>
            
            <div class="security-note">
              <strong>Security Reminder:</strong> Please keep your credentials safe and do not share them with anyone.
            </div>
          </div>
          <div class="footer">
            <div class="footer-logo">💜</div>
            <div>&copy; 2025 Vaniloom Inc. All rights reserved.</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// 生成表单内容邮件HTML模板（发送给管理员）
export function generateSurveyFormEmail(formData: SurveyFormData, assignedAccount: BetaAccount): string {
  // 格式化身份数组，如果有otherIdentity则加上具体描述
  let identityText = formData.identity.length > 0 ? formData.identity.join(', ') : '未选择'
  
  // 如果选择了"其他"或"相关从业者"且填写了具体内容，则添加详细描述
  if (formData.otherIdentity && formData.otherIdentity.trim()) {
    if (formData.identity.includes('other')) {
      identityText = identityText.replace('其他（请填写）', `其他（${formData.otherIdentity}）`)
    }
    if (formData.identity.includes('professional')) {
      identityText = identityText.replace('相关从业者（请填写职位）', `相关从业者（${formData.otherIdentity}）`)
    }
  }
  
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
              <div class="field-value">${formData.ao3Content || '未填写'}</div>
            </div>
            <div class="field">
              <div class="field-label">喜欢的cp和tags</div>
              <div class="field-value">${formData.favoriteCpTags || '未填写'}</div>
            </div>
          </div>

          <div class="form-section">
            <h3 style="color: #1f2937; margin-top: 0;">身份信息</h3>
            <div class="field">
              <div class="field-label">身份类型</div>
              <div class="field-value">${identityText}</div>
            </div>
            <div class="field">
              <div class="field-label">是否愿意接受线上回访</div>
              <div class="field-value">${formData.acceptFollowUp === 'yes' ? '是，愿意接受回访' : '否，不愿意接受回访'}</div>
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