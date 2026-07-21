'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils'
import { downloadCSV } from '@/utils/csv'
import { savingsData } from '@/utils/mock-data'
import { Download } from 'lucide-react'

const recommendations = [
  { id: 's1', name: 'Rightsizing i-0234 (EC2)', savings: 120, status: 'applied', date: '2 days ago' },
  { id: 's2', name: 'S3 lifecycle policy - logs-bucket', savings: 90, status: 'applied', date: '5 days ago' },
  { id: 's3', name: 'Reserved instance for EC2 fleet', savings: 1200, status: 'applied', date: '1 week ago' },
  { id: 's4', name: 'Idle EBS volume cleanup', savings: 340, status: 'pending', date: '2 days ago' },
  { id: 's5', name: 'RDS rightsizing recommendation', savings: 180, status: 'pending', date: '3 days ago' },
]

export default function SavingsPage() {
  const totalRealized = savingsData.reduce((s, d) => s + d.realized, 0)
  const totalPending = recommendations.filter((r) => r.status === 'pending').reduce((s, r) => s + r.savings, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Savings Realized</h2>
          <p className="text-sm text-muted-foreground">Track cost savings from optimization recommendations</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(savingsData as unknown as Record<string, unknown>[], 'savings-realized')}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Realized (YTD)</p>
            <p className="text-4xl font-bold tabular-nums mt-2 text-success">{formatCurrency(totalRealized)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Savings</p>
            <p className="text-4xl font-bold tabular-nums mt-2 text-warning">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendations.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-success">+{formatCurrency(r.savings)}/mo</span>
                  <Badge variant={r.status === 'applied' ? 'success' : 'warning'} className="text-xs capitalize">{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}