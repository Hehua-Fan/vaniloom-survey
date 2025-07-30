import { NextResponse } from 'next/server'
import { resetAllAccounts } from '@/lib/beta-accounts'

export async function POST() {
  try {
    const success = await resetAllAccounts()
    
    if (success) {
      return NextResponse.json(
        { 
          success: true,
          message: 'All account states have been reset'
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { 
          error: 'Reset failed',
          message: 'Failed to reset account states'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error resetting account states:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to reset account states'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not supported' },
    { status: 405 }
  )
} 