import nodemailer from 'nodemailer'

type SMTPTransporter = nodemailer.Transporter

// Beta account interface
export interface BetaAccount {
  id: string
  username: string
  password: string
}

// Generate beta account email HTML template
function generateBetaAccountEmailHTML(name: string, account: BetaAccount): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Vaniloom Beta Account</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background-color: #f9fafb;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                color: #374151;
                margin-bottom: 24px;
            }
            
            .account-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border: 2px solid #0ea5e9;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                text-align: center;
            }
            
            .account-title {
                font-size: 20px;
                font-weight: 600;
                color: #0c4a6e;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .account-details {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 16px 0;
            }
            
            .credential {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                padding: 12px 16px;
                border-radius: 8px;
                border: 1px solid #e0f2fe;
            }
            
            .credential-label {
                font-weight: 600;
                color: #0c4a6e;
                font-size: 14px;
            }
            
            .credential-value {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                font-size: 16px;
                font-weight: 600;
                color: #1e40af;
                background: #eff6ff;
                padding: 4px 8px;
                border-radius: 4px;
                letter-spacing: 0.5px;
            }
            
            .website-link {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            
            .website-link:hover {
                transform: translateY(-1px);
            }
            
            .instructions {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                margin: 24px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .instructions h3 {
                color: #92400e;
                font-size: 16px;
                margin-bottom: 8px;
            }
            
            .instructions ul {
                color: #78350f;
                padding-left: 20px;
            }
            
            .instructions li {
                margin-bottom: 4px;
            }
            
            .footer {
                background: #f8fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            
            .footer-divider {
                height: 1px;
                background: #e5e7eb;
                margin: 20px 0;
            }
            
            .contact-info {
                margin-top: 16px;
                font-size: 13px;
            }
            
            .emoji {
                font-size: 24px;
                margin-right: 8px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 0 16px;
                }
                
                .header, .content, .footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }
                
                .credential {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .credential-value {
                    align-self: stretch;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><span class="emoji">🎉</span>Welcome to Vaniloom Beta!</h1>
                <p>Your personalized fanfiction platform account is ready</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hi ${name},
                </div>
                
                <p>Thank you for joining the Vaniloom beta test! We're excited to have you as part of our early community of creators and readers.</p>
                
                <div class="account-box">
                    <div class="account-title">
                        <span class="emoji">🔑</span>Your Beta Account
                    </div>
                    
                    <div class="account-details">
                        <div class="credential">
                            <span class="credential-label">Username:</span>
                            <span class="credential-value">${account.username}</span>
                        </div>
                        <div class="credential">
                            <span class="credential-label">Password:</span>
                            <span class="credential-value">${account.password}</span>
                        </div>
                    </div>
                    
                    <a href="https://vaniloom.com" class="website-link">
                        Start Exploring Vaniloom →
                    </a>
                </div>
                
                <div class="instructions">
                    <h3><span class="emoji">📋</span>Getting Started</h3>
                    <ul>
                        <li>Use the credentials above to log in to your account</li>
                        <li>Complete your profile to get personalized recommendations</li>
                        <li>Explore fanfiction from your favorite fandoms</li>
                        <li>Share feedback to help us improve the platform</li>
                        <li>Keep your login credentials safe and don't share them</li>
                    </ul>
                </div>
                
                <p><strong>Important:</strong> This is a beta test environment. Some features may be experimental, and we greatly value your feedback to help us improve.</p>
                
                <p>If you encounter any issues or have suggestions, please don't hesitate to reach out to our support team.</p>
                
                <p>Happy reading and creating!</p>
                
                <p><em>The Vaniloom Team</em></p>
            </div>
            
            <div class="footer">
                <div class="footer-divider"></div>
                <p>This email was sent to you because you signed up for the Vaniloom beta test.</p>
                <div class="contact-info">
                    <p>Questions? Contact us at <a href="mailto:support@vaniloom.com" style="color: #3b82f6;">support@vaniloom.com</a></p>
                    <p>© 2024 Vaniloom. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
}

// Create email transporter (dedicated to Vaniloom email server)
function createTransporter(): SMTPTransporter {
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com'
  const emailPort = parseInt(process.env.EMAIL_PORT || '587')
  const emailSecure = process.env.EMAIL_SECURE !== 'false' // Default to true

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration incomplete: missing EMAIL_FROM or EMAIL_PASS')
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Real email sending function
async function sendEmail(emailData: { to: string; subject: string; html: string }): Promise<boolean> {
  try {
    // Check if email sending is enabled
    if (process.env.EMAIL_ENABLED === 'false') {
      console.log('=== Simulated Email Sending (EMAIL_ENABLED=false) ===')
      console.log('Recipient:', emailData.to)
      console.log('Subject:', emailData.subject)
      console.log('Content length:', emailData.html.length, 'characters')
      console.log('========================================')
      
      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }

    // Create transporter
    const transporter = createTransporter()

    // Verify email configuration
    await transporter.verify()
    console.log('Email server connection successful')

    // Send email
    const info = await transporter.sendMail({
      from: `"Vaniloom Beta" <${process.env.EMAIL_FROM}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      recipient: emailData.to,
      subject: emailData.subject
    })
    
    return true
  } catch (error) {
    console.error('Email sending failed:', {
      recipient: emailData.to,
      subject: emailData.subject,
      error: error
    })
    
    // If it's a configuration error, provide detailed information
    if (error instanceof Error && error.message.includes('configuration')) {
      console.error('Please check environment variable configuration:')
      console.error('- EMAIL_FROM: Sender email address')
      console.error('- EMAIL_PASS: Email password')
      console.error('- EMAIL_HOST: SMTP server address')
    }
    
    return false
  }
}

// Send beta account email to user
export async function sendBetaAccountEmail(
  email: string,
  name: string,
  account: BetaAccount
): Promise<boolean> {
  const emailHTML = generateBetaAccountEmailHTML(name, account)
  
  return sendEmail({
    to: email,
    subject: '🎉 Your Vaniloom Beta Account is Ready!',
    html: emailHTML,
  })
} 