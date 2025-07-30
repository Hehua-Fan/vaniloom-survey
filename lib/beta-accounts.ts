import { supabase, BetaAccountRow } from './supabase'

export interface BetaAccount {
  id: string
  username: string
  password: string
  isAssigned: boolean
  assignedTo: string | null
  assignedAt: Date | null
}

// Convert database row to application layer object
function convertRowToAccount(row: BetaAccountRow): BetaAccount {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    isAssigned: row.is_assigned,
    assignedTo: row.assigned_to,
    assignedAt: row.assigned_at ? new Date(row.assigned_at) : null,
  }
}

// Convert application layer object to database row
function convertAccountToRow(account: Partial<BetaAccount>): Partial<BetaAccountRow> {
  return {
    id: account.id,
    username: account.username,
    password: account.password,
    is_assigned: account.isAssigned,
    assigned_to: account.assignedTo,
    assigned_at: account.assignedAt?.toISOString() || null,
  }
}

// Get next available beta account
export async function getNextAvailableAccount(): Promise<BetaAccount | null> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .eq('is_assigned', false)
      .order('id', { ascending: true })
      .limit(1)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      // No unassigned accounts found
      return null
    }

    return convertRowToAccount(data[0])
  } catch (error) {
    console.error('Failed to get available account:', error)
    return null
  }
}

// Assign account to user
export async function assignAccount(accountId: string, email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('beta_accounts')
      .update({
        is_assigned: true,
        assigned_to: email,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId)
      .eq('is_assigned', false) // Ensure only unassigned accounts are updated

    if (error) {
      console.error('Failed to assign account:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to assign account:', error)
    return false
  }
}

// Check if email has already been assigned an account
export async function isEmailAlreadyAssigned(email: string): Promise<BetaAccount | null> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .eq('assigned_to', email)
      .eq('is_assigned', true)
      .limit(1)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      // No account assigned to this email found
      return null
    }

    return convertRowToAccount(data[0])
  } catch (error) {
    console.error('Failed to check email assignment status:', error)
    return null
  }
}

// Get available account count
export async function getAvailableAccountsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('beta_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('is_assigned', false)

    if (error) {
      console.error('Failed to get available account count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Failed to get available account count:', error)
    return 0
  }
}

// Get all account status (admin function)
export async function getAllAccounts(): Promise<BetaAccount[]> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Failed to get all accounts:', error)
      return []
    }

    return data ? data.map(convertRowToAccount) : []
  } catch (error) {
    console.error('Failed to get all accounts:', error)
    return []
  }
}

// Reset account status (admin function)
export async function resetAllAccounts(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('beta_accounts')
      .update({
        is_assigned: false,
        assigned_to: null,
        assigned_at: null,
        updated_at: new Date().toISOString()
      })
      .neq('id', '0') // Update all records

    if (error) {
      console.error('Failed to reset account status:', error)
      return false
    }

    console.log('All account statuses have been reset')
    return true
  } catch (error) {
    console.error('Failed to reset account status:', error)
    return false
  }
} 