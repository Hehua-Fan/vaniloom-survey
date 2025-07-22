import { NextResponse } from 'next/server'
import { getAllAccounts } from '@/lib/beta-accounts'

export async function GET() {
  try {
    const accounts = await getAllAccounts()
    
    return NextResponse.json(
      { 
        success: true,
        accounts,
        message: '获取账号数据成功'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取账号数据时发生错误:', error)
    
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        message: '获取账号数据失败'
      },
      { status: 500 }
    )
  }
}

// 处理不支持的HTTP方法
export async function POST() {
  return NextResponse.json(
    { error: '方法不被支持' },
    { status: 405 }
  )
} 