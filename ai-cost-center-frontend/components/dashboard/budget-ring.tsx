'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils'

import type { BudgetData } from '@/utils/types'
export function BudgetRing({ data }: { data: BudgetData }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (data.percentage / 100) * circumference
  const isOverBudget = data.percentage > 90

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Budget Utilization
        </p>
        <div className="relative">
          <svg width="120" height="120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={isOverBudget ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold tabular-nums">{data.percentage}%</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>Spent: {formatCurrency(data.spent)}</span>
          <span>Budget: {formatCurrency(data.budget)}</span>
        </div>
      </CardContent>
    </Card>
  )
}