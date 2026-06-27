'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { KpiMetric } from '@/lib/types/index'
import { useEffect, useState } from 'react'

function Sparkline({ data }: { data: { value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min || 1
  const width = 80
  const height = 24
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((d.value - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} className="shrink-0">
      <path
        d={`M${points.join(' L')}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground/30"
      />
    </svg>
  )
}

function AnimatedNumber({ value, format }: { value: number; format: KpiMetric['format'] }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 800
    const start = performance.now()
    const from = 0
    const to = value

    function animate(time: number) {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(from + (to - from) * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value])

  if (format === 'currency') return <>{formatCurrency(displayValue)}</>
  if (format === 'percent') return <>{Math.round(displayValue)}%</>
  return <>{formatNumber(Math.round(displayValue))}</>
}

export function KpiCard({ metric, index }: { metric: KpiMetric; index: number }) {
  const TrendIcon = metric.trend > 0 ? TrendingUp : metric.trend < 0 ? TrendingDown : Minus
  const trendColor = metric.trend > 0 ? 'text-success' : metric.trend < 0 ? 'text-destructive' : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  <AnimatedNumber value={metric.value} format={metric.format} />
                </span>
                <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendColor)}>
                  <TrendIcon className="h-3 w-3" />
                  {formatPercent(metric.trend)}
                </span>
              </div>
            </div>
            <Sparkline data={metric.sparklineData} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}