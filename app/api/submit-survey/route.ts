import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  getNextAvailableAccount, 
  assignAccount, 
  isEmailAlreadyAssigned,
  getAvailableAccountsCount 
} from '@/lib/beta-accounts'
import { sendBetaAccountEmail } from '@/lib/email'
import { supabase, SurveyResponse } from '@/lib/supabase'

// Survey form data validation schema
const surveySchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  contact: z.string().min(1, 'Please enter your phone number or WeChat'),
  age: z.string().min(1, 'Please select your age'),
  gender: z.string().min(1, 'Please select your gender'),
  orientation: z.string().min(1, 'Please select your sexual orientation'),
  ao3Content: z.string().optional(),
  favoriteCpTags: z.string().optional(),
  identity: z.array(z.string()).min(1, 'Please select at least one identity'),
  otherIdentity: z.string().optional(),
  acceptFollowUp: z.string().min(1, 'Please select whether you accept follow-up interviews'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validationResult = surveySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Form data validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // Check if email has already been assigned an account
    const existingAccount = await isEmailAlreadyAssigned(formData.email)
    if (existingAccount) {
      return NextResponse.json(
        { 
          error: 'This email has already received a beta account',
          message: 'Each email can only apply for one beta account. Please contact customer service if you have any questions'
        },
        { status: 409 }
      )
    }

    // Check if there are available beta accounts
    const availableCount = await getAvailableAccountsCount()
    if (availableCount === 0) {
      return NextResponse.json(
        { 
          error: 'All beta accounts have been assigned',
          message: 'Sorry, all beta accounts have been assigned. Please follow our announcements for updates'
        },
        { status: 410 }
      )
    }

    // Get next available account
    const availableAccount = await getNextAvailableAccount()
    if (!availableAccount) {
      return NextResponse.json(
        { 
          error: 'Failed to get beta account',
          message: 'System error, please try again later'
        },
        { status: 500 }
      )
    }

    // Assign account
    const assignSuccess = await assignAccount(availableAccount.id, formData.email)
    if (!assignSuccess) {
      return NextResponse.json(
        { 
          error: 'Failed to assign account',
          message: 'System error, please try again later'
        },
        { status: 500 }
      )
    }

    // Save survey response to database
    const surveyData: Omit<SurveyResponse, 'id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      age: formData.age,
      gender: formData.gender,
      orientation: formData.orientation,
      ao3_content: formData.ao3Content || undefined,
      favorite_cp_tags: formData.favoriteCpTags || undefined,
      identity: formData.identity,
      other_identity: formData.otherIdentity || undefined,
      accept_follow_up: formData.acceptFollowUp,
      assigned_account_id: availableAccount.id,
    }

    const { data: surveyResponse, error: surveyError } = await supabase
      .from('survey_responses')
      .insert([surveyData])
      .select()

    if (surveyError) {
      console.error('Failed to save survey response:', surveyError)
      // Don't fail the entire process if survey saving fails, but log it
    }

    // Send user email
    const userEmailSent = await sendBetaAccountEmail(
      formData.email,
      formData.name,
      availableAccount
    )

    // Return response based on email sending result
    if (!userEmailSent) {
      console.error('User email failed to send:', {
        email: formData.email,
        account: availableAccount.username
      })
      
      return NextResponse.json(
        { 
          error: 'User email sending failed',
          message: 'Your beta account has been assigned, but email sending failed. Please contact customer service for account information.',
          account: {
            username: availableAccount.username,
            password: availableAccount.password
          }
        },
        { status: 207 } // Multi-Status: partial success
      )
    }

    // Log submission information
    console.log('Survey submitted successfully:', {
      timestamp: new Date().toISOString(),
      email: formData.email,
      name: formData.name,
      assignedAccount: availableAccount.username,
      remainingAccounts: await getAvailableAccountsCount(),
      userEmailSent,
      surveyResponseId: surveyResponse?.[0]?.id || 'failed_to_save'
    })

    return NextResponse.json(
      { 
        success: true,
        message: 'Survey submitted successfully! Beta account has been sent to your email',
        accountInfo: {
          username: availableAccount.username,
          // For security reasons, don't return password in response
        },
        remainingAccounts: await getAvailableAccountsCount()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing survey submission:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'System temporarily experiencing issues, please try again later'
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