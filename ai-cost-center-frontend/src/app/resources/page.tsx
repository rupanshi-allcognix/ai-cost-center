'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resources } from '@/utils/mock-data'
import { formatCurrency } from '@/utils'
import { downloadCSV } from '@/utils/csv'
import { Search, Cloud, Download } from 'lucide-react'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  healthy: 'success',
  idle: 'warning',
  'over-provisioned': 'destructive',
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
      if (provider !== 'all' && r.provider !== provider) return false
      if (status !== 'all' && r.status !== status) return false
      return true
    })
  }, [search, provider, status])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Resources</h2>
          <p className="text-sm text-muted-foreground">Filterable inventory of all cloud resources</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(filtered as unknown as Record<string, unknown>[], 'resources')}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Resources ({filtered.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 pl-8"
                />
              </div>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Providers</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="GCP">GCP</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="idle">Idle</option>
                <option value="over-provisioned">Over-provisioned</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Cloud className="mb-2 h-8 w-8" />
              <p className="text-sm font-medium">No resources match your filters</p>
              <button onClick={() => { setSearch(''); setProvider('all'); setStatus('all') }} className="mt-2 text-xs text-primary underline underline-offset-2">Clear filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Monthly Spend</th>
                    <th className="pb-3 font-medium">Utilization</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 transition-colors hover:bg-muted/50">
                      <td className="py-3 font-medium">{r.name}</td>
                      <td className="py-3 text-muted-foreground">{r.type}</td>
                      <td className="py-3">
                        <Badge variant="secondary" className="text-xs">{r.provider}</Badge>
                      </td>
                      <td className="py-3 font-medium tabular-nums">{formatCurrency(r.monthlySpend)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.utilization > 80 ? 'bg-success' : r.utilization > 40 ? 'bg-primary' : 'bg-warning'}`}
                              style={{ width: `${r.utilization}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">{r.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariant[r.status]} className="text-xs">{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
