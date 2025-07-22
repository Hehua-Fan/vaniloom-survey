import { NextResponse } from 'next/server'
import { resetAccountsState } from '@/lib/beta-accounts'

export async function POST() {
  try {
    await resetAccountsState()
    
    return NextResponse.json(
      { 
        success: true,
        message: '所有账号状态已重置'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('重置账号状态时发生错误:', error)
    
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        message: '重置账号状态失败'
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