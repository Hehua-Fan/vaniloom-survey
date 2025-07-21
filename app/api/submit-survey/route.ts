import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  getNextAvailableAccount, 
  assignAccount, 
  isEmailAlreadyAssigned,
  getAvailableAccountsCount 
} from '@/lib/beta-accounts'
import { sendBetaAccountEmail } from '@/lib/email'

// 验证表单数据的schema
const surveySchema = z.object({
  name: z.string().min(1, '请输入您的称呼'),
  email: z.string().email('请输入有效的邮箱地址'),
  contact: z.string().min(1, '请输入您的手机号或微信号'),
  age: z.string().min(1, '请选择您的年龄'),
  gender: z.string().min(1, '请选择您的性别'),
  orientation: z.string().min(1, '请选择您的性取向'),
  ao3Content: z.string().min(1, '请填写您在ao3上的观看内容和时间'),
  favoriteCpTags: z.string().min(1, '请填写您喜欢的cp和tags'),
  identity: z.array(z.string()).min(1, '请至少选择一个身份'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validationResult = surveySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: '表单数据验证失败', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // 检查邮箱是否已经分配过账号
    const existingAccount = isEmailAlreadyAssigned(formData.email)
    if (existingAccount) {
      return NextResponse.json(
        { 
          error: '该邮箱已经获得过内测账号',
          message: '每个邮箱只能申请一次内测账号，如有疑问请联系客服'
        },
        { status: 409 }
      )
    }

    // 检查是否还有可用的内测账号
    const availableCount = getAvailableAccountsCount()
    if (availableCount === 0) {
      return NextResponse.json(
        { 
          error: '内测账号已全部分配完毕',
          message: '非常抱歉，当前内测账号已全部分配完毕，请关注我们的后续公告'
        },
        { status: 410 }
      )
    }

    // 获取下一个可用账号
    const availableAccount = getNextAvailableAccount()
    if (!availableAccount) {
      return NextResponse.json(
        { 
          error: '获取内测账号失败',
          message: '系统错误，请稍后重试'
        },
        { status: 500 }
      )
    }

    // 分配账号
    const assignSuccess = assignAccount(availableAccount.id, formData.email)
    if (!assignSuccess) {
      return NextResponse.json(
        { 
          error: '分配账号失败',
          message: '系统错误，请稍后重试'
        },
        { status: 500 }
      )
    }

    // 发送邮件
    const emailSent = await sendBetaAccountEmail(
      formData.email,
      formData.name,
      availableAccount
    )

    if (!emailSent) {
      console.error('邮件发送失败，但账号已分配:', {
        email: formData.email,
        account: availableAccount.username
      })
      
      return NextResponse.json(
        { 
          error: '邮件发送失败',
          message: '您的内测账号已分配，但邮件发送失败。请联系客服获取账号信息。',
          account: {
            username: availableAccount.username,
            password: availableAccount.password
          }
        },
        { status: 207 } // Multi-Status: 部分成功
      )
    }

    // 记录提交信息（在实际项目中，你可能想要保存到数据库）
    console.log('问卷提交成功:', {
      timestamp: new Date().toISOString(),
      email: formData.email,
      name: formData.name,
      assignedAccount: availableAccount.username,
      remainingAccounts: getAvailableAccountsCount()
    })

    return NextResponse.json(
      { 
        success: true,
        message: '问卷提交成功！内测账号已发送到您的邮箱',
        accountInfo: {
          username: availableAccount.username,
          // 出于安全考虑，在响应中不返回密码
        },
        remainingAccounts: getAvailableAccountsCount()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('处理问卷提交时发生错误:', error)
    
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        message: '系统暂时出现问题，请稍后重试'
      },
      { status: 500 }
    )
  }
}

// 处理不支持的HTTP方法
export async function GET() {
  return NextResponse.json(
    { error: '方法不被支持' },
    { status: 405 }
  )
} 