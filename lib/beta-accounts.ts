import { supabase, BetaAccountRow } from './supabase'

export interface BetaAccount {
  id: string
  username: string
  password: string
  isAssigned: boolean
  assignedTo?: string
  assignedAt?: Date
}

// 转换数据库行为应用层对象
function convertRowToAccount(row: BetaAccountRow): BetaAccount {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    isAssigned: row.is_assigned,
    assignedTo: row.assigned_to || undefined,
    assignedAt: row.assigned_at ? new Date(row.assigned_at) : undefined,
  }
}

// 转换应用层对象为数据库行
function convertAccountToRow(account: BetaAccount): Partial<BetaAccountRow> {
  return {
    id: account.id,
    username: account.username,
    password: account.password,
    is_assigned: account.isAssigned,
    assigned_to: account.assignedTo || null,
    assigned_at: account.assignedAt ? account.assignedAt.toISOString() : null,
    updated_at: new Date().toISOString(),
  }
}

// 获取下一个可用的内测账号
export async function getNextAvailableAccount(): Promise<BetaAccount | null> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .eq('is_assigned', false)
      .order('id', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到未分配的账号
        return null
      }
      throw error
    }

    return convertRowToAccount(data)
  } catch (error) {
    console.error('获取可用账号失败:', error)
    return null
  }
}

// 分配账号给用户
export async function assignAccount(accountId: string, userEmail: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('beta_accounts')
      .update({
        is_assigned: true,
        assigned_to: userEmail,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId)
      .eq('is_assigned', false) // 确保只更新未分配的账号

    if (error) {
      console.error('分配账号失败:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('分配账号失败:', error)
    return false
  }
}

// 检查邮箱是否已经分配过账号
export async function isEmailAlreadyAssigned(email: string): Promise<BetaAccount | null> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .eq('assigned_to', email)
      .eq('is_assigned', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到已分配给该邮箱的账号
        return null
      }
      throw error
    }

    return convertRowToAccount(data)
  } catch (error) {
    console.error('检查邮箱分配状态失败:', error)
    return null
  }
}

// 获取可用账号数量
export async function getAvailableAccountsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('beta_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('is_assigned', false)

    if (error) {
      console.error('获取可用账号数量失败:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('获取可用账号数量失败:', error)
    return 0
  }
}

// 获取所有账号状态（管理员功能）
export async function getAllAccounts(): Promise<BetaAccount[]> {
  try {
    const { data, error } = await supabase
      .from('beta_accounts')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('获取所有账号失败:', error)
      return []
    }

    return data.map(convertRowToAccount)
  } catch (error) {
    console.error('获取所有账号失败:', error)
    return []
  }
}

// 重置账号状态（管理员功能）
export async function resetAccountsState(): Promise<void> {
  try {
    const { error } = await supabase
      .from('beta_accounts')
      .update({
        is_assigned: false,
        assigned_to: null,
        assigned_at: null,
        updated_at: new Date().toISOString(),
      })
      .neq('id', '0') // 更新所有记录

    if (error) {
      console.error('重置账号状态失败:', error)
      throw error
    }

    console.log('所有账号状态已重置')
  } catch (error) {
    console.error('重置账号状态失败:', error)
    throw error
  }
} 