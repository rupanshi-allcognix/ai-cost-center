'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { taggingStats } from '@/lib/mock-data'

const pieData = [
  { name: 'Tagged', value: taggingStats.tagged },
  { name: 'Untagged', value: taggingStats.untagged },
]

const COLORS = ['#10B981', '#EF4444']

export default function TagsPage() {
  const complianceRate = Math.round((taggingStats.tagged / (taggingStats.tagged + taggingStats.untagged)) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tagging Compliance</h2>
        <p className="text-sm text-muted-foreground">Resource tagging coverage across all providers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-center">
              <span className="text-2xl font-bold">{complianceRate}%</span>
              <span className="text-sm text-muted-foreground ml-2">compliance rate</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Untagged Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taggingStats.resources.filter((r) => r.tags === 0).map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.team}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">0 tags</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}