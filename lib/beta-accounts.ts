export interface BetaAccount {
  id: string
  username: string
  password: string
  isAssigned: boolean
  assignedTo?: string
  assignedAt?: Date
}

// 内测账号列表
export const betaAccounts: BetaAccount[] = [
  {
    id: '1',
    username: 'beta_user_001',
    password: 'VaniB2024!',
    isAssigned: false,
  },
  {
    id: '2',
    username: 'beta_user_002',
    password: 'VaniB2024@',
    isAssigned: false,
  },
  {
    id: '3',
    username: 'beta_user_003',
    password: 'VaniB2024#',
    isAssigned: false,
  },
  {
    id: '4',
    username: 'beta_user_004',
    password: 'VaniB2024$',
    isAssigned: false,
  },
  {
    id: '5',
    username: 'beta_user_005',
    password: 'VaniB2024%',
    isAssigned: false,
  },
  {
    id: '6',
    username: 'beta_user_006',
    password: 'VaniB2024^',
    isAssigned: false,
  },
  {
    id: '7',
    username: 'beta_user_007',
    password: 'VaniB2024&',
    isAssigned: false,
  },
  {
    id: '8',
    username: 'beta_user_008',
    password: 'VaniB2024*',
    isAssigned: false,
  },
  {
    id: '9',
    username: 'beta_user_009',
    password: 'VaniB2024+',
    isAssigned: false,
  },
  {
    id: '10',
    username: 'beta_user_010',
    password: 'VaniB2024=',
    isAssigned: false,
  },
  {
    id: '11',
    username: 'beta_user_011',
    password: 'VaniB2024?',
    isAssigned: false,
  },
  {
    id: '12',
    username: 'beta_user_012',
    password: 'VaniB2024<',
    isAssigned: false,
  },
  {
    id: '13',
    username: 'beta_user_013',
    password: 'VaniB2024>',
    isAssigned: false,
  },
  {
    id: '14',
    username: 'beta_user_014',
    password: 'VaniB2024[',
    isAssigned: false,
  },
  {
    id: '15',
    username: 'beta_user_015',
    password: 'VaniB2024]',
    isAssigned: false,
  },
  {
    id: '16',
    username: 'beta_user_016',
    password: 'VaniB2024{',
    isAssigned: false,
  },
  {
    id: '17',
    username: 'beta_user_017',
    password: 'VaniB2024}',
    isAssigned: false,
  },
  {
    id: '18',
    username: 'beta_user_018',
    password: 'VaniB2024|',
    isAssigned: false,
  },
  {
    id: '19',
    username: 'beta_user_019',
    password: 'VaniB2024~',
    isAssigned: false,
  },
  {
    id: '20',
    username: 'beta_user_020',
    password: 'VaniB2024`',
    isAssigned: false,
  },
]

// 获取下一个可用的内测账号
export function getNextAvailableAccount(): BetaAccount | null {
  return betaAccounts.find(account => !account.isAssigned) || null
}

// 分配账号给用户
export function assignAccount(accountId: string, userEmail: string): boolean {
  const account = betaAccounts.find(acc => acc.id === accountId)
  if (account && !account.isAssigned) {
    account.isAssigned = true
    account.assignedTo = userEmail
    account.assignedAt = new Date()
    return true
  }
  return false
}

// 检查邮箱是否已经分配过账号
export function isEmailAlreadyAssigned(email: string): BetaAccount | null {
  return betaAccounts.find(account => account.assignedTo === email) || null
}

// 获取可用账号数量
export function getAvailableAccountsCount(): number {
  return betaAccounts.filter(account => !account.isAssigned).length
} 