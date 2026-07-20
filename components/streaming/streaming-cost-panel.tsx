'use client'

import { useState, useEffect } from 'react'
import { MetricCards } from './metric-cards'
import { CostTable } from './cost-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CostBreakdown = {
  services: { name: string; cost: number; currency: string; change_pct: number }[]
  total: number
  anomalies: { service: string; severity: string; delta: number }[]
}

export function StreamingCostPanel() {
  const [cost, setCost] = useState<CostBreakdown | null>(null)

  useEffect(() => {
    async function fetchCost() {
      try {
        const res = await fetch('/api/agent/chat/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
        if (!res.ok) return
        const reader = res.body?.getReader()
        if (!reader) return
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''
          for (const part of parts) {
            const line = part.replace(/^data: /, '').trim()
            try {
              const evt = JSON.parse(line)
              if (evt.type === 'object' || evt.type === 'partial') setCost(evt.value as CostBreakdown)
            } catch { /* skip */ }
          }
        }
      } catch { /* offline */ }
    }
    fetchCost()
  }, [])

  return (
    <div className="space-y-4">
      <MetricCards metrics={{ total: cost?.total ?? 0, savings: 0, anomaliesCount: cost?.anomalies?.length ?? 0, tagCompliance: 98 }} />
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Services</CardTitle></CardHeader>
        <CardContent>
          <CostTable data={cost?.services.map((s) => ({ resource_id: s.name, type: 'service', region: '-', cloud: '-', monthly_cost: s.cost, utilization: undefined, recommendation: '' })) ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
