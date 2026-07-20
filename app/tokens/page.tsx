'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { tokenUsageData } from '@/lib/mock-data'

export default function TokensPage() {
  const totalTokens = tokenUsageData.reduce((s, d) => s + d.totalTokens, 0)
  const totalCost = tokenUsageData.reduce((s, d) => s + d.cost, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Token Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Daily token usage and cost breakdown by model
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Tokens (MTD)</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">{(totalTokens / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Cost</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">{formatCurrency(totalCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Cost / 1K Tokens</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">$0.008</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenUsageData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip />
                <Bar dataKey="promptTokens" stackId="a" fill="#4F46E5" name="Prompt" radius={[0, 0, 0, 0]} />
                <Bar dataKey="completionTokens" stackId="a" fill="#10B981" name="Completion" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}