'use client'

import { Server, Database, Zap, Container, HardDrive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils'

import type { ServiceCost } from '@/utils/types'
const iconMap: Record<string, React.ElementType> = {
  Server,
  Database,
  Zap,
  Container,
  HardDrive,
}

export function TopCostDrivers({ data }: { data: ServiceCost[] }) {
  const maxAmount = Math.max(...data.map((d) => d.amount))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Top 5 Cost Drivers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((driver) => {
          const Icon = iconMap[driver.icon] || Server
          return (
            <div key={driver.service} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{driver.service}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(driver.amount)}</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/60 transition-all"
                  style={{ width: `${(driver.amount / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}