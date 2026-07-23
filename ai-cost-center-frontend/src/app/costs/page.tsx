'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils'
import { downloadCSV } from '@/utils/csv'
import { useAppStore } from '@/store'
import { getAWSStatus, getAWSCosts, type AWSCostSummary } from '@/services/aws-client'
import { Download, Cloud, Loader2 } from 'lucide-react'
import { costTrendData } from '@/utils/mock-data'

export default function CostsPage() {
  const { awsConnected, setAWSConnected } = useAppStore()
  const [costs, setCosts] = useState<AWSCostSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkedStatus, setCheckedStatus] = useState(false)

  useEffect(() => {
    getAWSStatus()
      .then((status) => {
        setAWSConnected(status.connected, status.account_id ?? null, status.account_alias || null)
        if (status.connected) {
          setLoading(true)
          return getAWSCosts()
        }
      })
      .then((data) => {
        if (data) setCosts(data)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch costs')
      })
      .finally(() => {
        setLoading(false)
        setCheckedStatus(true)
      })
  }, [setAWSConnected])

  const mockTotalSpend = costTrendData.reduce((s, d) => s + (d.actual || 0), 0)

  const totalSpend = costs?.total_monthly_cost ?? mockTotalSpend
  const avgDaily = costs?.total_daily_cost ?? mockTotalSpend / 30
  const projectedEOM = costs ? costs.total_monthly_cost * 1.05 : mockTotalSpend * 1.15

  const instanceChartData = costs
    ? costs.instances.map((inst) => ({
        name: inst.name || inst.instance_id,
        cost: inst.monthly_cost,
      }))
    : null

  const totalSpendCSV = costs
    ? costs.instances.map((inst) => ({
        instance_id: inst.instance_id,
        instance_type: inst.instance_type,
        name: inst.name,
        region: inst.region,
        state: inst.state,
        monthly_cost: inst.monthly_cost,
        daily_cost: inst.daily_cost,
      }))
    : costTrendData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Cost Spend</h2>
          <p className="text-sm text-muted-foreground">
            {costs ? `EC2 instance costs ${costs.period}` : 'Detailed cost breakdown across all services'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {costs && (
            <Badge variant="success" className="text-xs">
              <Cloud className="mr-1 h-3 w-3" /> Live AWS Data
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => downloadCSV(totalSpendCSV as unknown as Record<string, unknown>[], 'cost-data')}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
          </Button>
        </div>
      </div>

      {checkedStatus && !awsConnected && (
        <Card className="border-dashed">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Connect your AWS account</p>
                <p className="text-xs text-muted-foreground">View real EC2 instance costs and spending data</p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm">Connect AWS</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching AWS instance costs...
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Spend (MTD)</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">{formatCurrency(totalSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Daily</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">{formatCurrency(avgDaily)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Projected EOM</p>
            <p className="text-3xl font-semibold tabular-nums mt-2">{formatCurrency(projectedEOM)}</p>
          </CardContent>
        </Card>
      </div>

      {costs && instanceChartData && (
        <Card>
          <CardHeader>
            <CardTitle>Instance Costs (Top {instanceChartData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={instanceChartData}>
                  <defs>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="cost" stroke="#4F46E5" strokeWidth={2} fill="url(#costGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {!costs && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costTrendData}>
                  <defs>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={2} fill="url(#costGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {costs && costs.instances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Instances ({costs.instances.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Instance ID</th>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Region</th>
                    <th className="pb-2 font-medium">State</th>
                    <th className="pb-2 font-medium text-right">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.instances.map((inst) => (
                    <tr key={inst.instance_id} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{inst.instance_id}</td>
                      <td className="py-2">{inst.name || '-'}</td>
                      <td className="py-2 text-muted-foreground">{inst.instance_type}</td>
                      <td className="py-2 text-muted-foreground">{inst.region}</td>
                      <td className="py-2">
                        <Badge variant={inst.state === 'running' ? 'success' : inst.state === 'stopped' ? 'destructive' : 'secondary'} className="text-xs">
                          {inst.state}
                        </Badge>
                      </td>
                      <td className="py-2 text-right tabular-nums font-medium">{formatCurrency(inst.monthly_cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
