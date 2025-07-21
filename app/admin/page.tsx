'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { betaAccounts, getAvailableAccountsCount } from '@/lib/beta-accounts'

export default function AdminPage() {
  const [accounts, setAccounts] = useState(betaAccounts)
  const [refreshKey, setRefreshKey] = useState(0)

  const assignedAccounts = accounts.filter(account => account.isAssigned)
  const availableAccounts = accounts.filter(account => !account.isAssigned)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setAccounts([...betaAccounts])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vaniloom 内测账号管理</h1>
            <p className="text-gray-600 mt-2">查看和管理内测账号分配情况</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {accounts.length}
              </CardTitle>
              <CardDescription>总账号数</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {assignedAccounts.length}
              </CardTitle>
              <CardDescription>已分配账号</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-orange-600">
                {availableAccounts.length}
              </CardTitle>
              <CardDescription>可用账号</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 分配进度 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>分配进度</CardTitle>
            <CardDescription>
              已分配 {assignedAccounts.length} / {accounts.length} 个账号
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(assignedAccounts.length / accounts.length) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((assignedAccounts.length / accounts.length) * 100).toFixed(1)}% 完成
            </p>
          </CardContent>
        </Card>

        {/* 账号列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 已分配账号 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                已分配账号 ({assignedAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {assignedAccounts.map((account) => (
                  <div 
                    key={account.id} 
                    className="border border-gray-200 rounded-lg p-4 bg-green-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {account.username}
                      </code>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        已分配
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>邮箱: {account.assignedTo}</p>
                      <p>分配时间: {account.assignedAt?.toLocaleString('zh-CN')}</p>
                    </div>
                  </div>
                ))}
                {assignedAccounts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">暂无已分配账号</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 可用账号 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                可用账号 ({availableAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableAccounts.map((account) => (
                  <div 
                    key={account.id} 
                    className="border border-gray-200 rounded-lg p-4 bg-orange-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {account.username}
                      </code>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        可用
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>密码: <code className="bg-white px-1 rounded">{account.password}</code></p>
                    </div>
                  </div>
                ))}
                {availableAccounts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">所有账号已分配完毕</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 警告提示 */}
        {availableAccounts.length <= 5 && availableAccounts.length > 0 && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-orange-800">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="font-medium">
                  警告: 可用账号不足，仅剩 {availableAccounts.length} 个账号
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {availableAccounts.length === 0 && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium">
                  所有内测账号已分配完毕，需要添加更多账号
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 