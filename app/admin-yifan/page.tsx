'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, RefreshCw, Users, UserCheck, UserX } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BetaAccount {
  id: string
  username: string
  password: string
  isAssigned: boolean
  assignedTo?: string
  assignedAt?: string
}

interface AccountStats {
  total: number
  assigned: number
  available: number
  assignmentRate: number
}

export default function AdminPage() {
  const [accounts, setAccounts] = useState<BetaAccount[]>([])
  const [stats, setStats] = useState<AccountStats>({
    total: 0,
    assigned: 0,
    available: 0,
    assignmentRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 获取账号数据
  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/admin/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts)
        
        // 计算统计信息
        const total = data.accounts.length
        const assigned = data.accounts.filter((acc: BetaAccount) => acc.isAssigned).length
        const available = total - assigned
        const assignmentRate = total > 0 ? (assigned / total) * 100 : 0
        
        setStats({
          total,
          assigned,
          available,
          assignmentRate
        })
      } else {
        toast.error('获取账号数据失败')
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('获取账号数据失败')
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAccounts()
    setRefreshing(false)
    toast.success('数据已刷新')
  }

  // 重置所有账号状态
  const handleReset = async () => {
    if (!confirm('确定要重置所有账号状态吗？这将清除所有分配记录！')) {
      return
    }

    try {
      const response = await fetch('/api/admin/reset-accounts', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('账号状态已重置')
        await fetchAccounts()
      } else {
        toast.error('重置失败')
      }
    } catch (error) {
      console.error('Error resetting accounts:', error)
      toast.error('重置失败')
    }
  }

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  useEffect(() => {
    fetchAccounts().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">加载中...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">内测账号管理</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button 
            onClick={handleReset}
            variant="destructive"
          >
            重置所有账号
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总账号数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已分配</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.assigned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可用账号</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分配率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* 账号列表 */}
      <Card>
        <CardHeader>
          <CardTitle>账号详情</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>密码</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>分配给</TableHead>
                  <TableHead>分配时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.id}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell className="font-mono">{account.password}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={account.isAssigned ? "destructive" : "default"}
                      >
                        {account.isAssigned ? '已分配' : '可用'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {account.assignedTo || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(account.assignedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 