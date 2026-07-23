'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { TopCostDrivers } from '@/components/dashboard/top-cost-drivers'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils'
import { Cloud, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store'
import { getAWSStatus, getAWSCosts, type AWSCostSummary } from '@/services/aws-client'
import {
  kpiMetrics,
  costTrendData,
  topCostDrivers,
  savingsData,
  agentActivities,
  budgetData,
} from '@/utils/mock-data'
import type { KpiMetric, ServiceCost, BudgetData } from '@/utils/types'

const TrendChart = dynamic(() => import('@/components/charts/trend-chart').then((m) => m.TrendChart), { ssr: false })
const SavingsRealizedCard = dynamic(() => import('@/components/dashboard/savings-realized-card').then((m) => m.SavingsRealizedCard), { ssr: false })
const BudgetRing = dynamic(() => import('@/components/dashboard/budget-ring').then((m) => m.BudgetRing), { ssr: false })

export default function OverviewPage() {
  const { awsConnected, setAWSConnected } = useAppStore()
  const [costs, setCosts] = useState<AWSCostSummary | null>(null)
  const [loadingCosts, setLoadingCosts] = useState(false)
  const [checkedStatus, setCheckedStatus] = useState(false)

  useEffect(() => {
    getAWSStatus()
      .then((status) => {
        setAWSConnected(status.connected, status.account_id ?? null, status.account_alias || null)
        if (status.connected) {
          setLoadingCosts(true)
          return getAWSCosts()
        }
      })
      .then((data) => {
        if (data) setCosts(data)
      })
      .catch(() => {})
      .finally(() => {
        setLoadingCosts(false)
        setCheckedStatus(true)
      })
  }, [setAWSConnected])

  const realKpiMetrics = costs
    ? [
        {
          label: 'Total Monthly Cost',
          value: costs.total_monthly_cost,
          previousValue: costs.total_monthly_cost,
          format: 'currency' as const,
          trend: 0,
          sparklineData: costs.instances.slice(0, 8).map((inst, i) => ({
            date: `d${i}`,
            value: inst.monthly_cost,
          })),
        },
        {
          label: 'Active Instances',
          value: costs.instance_count,
          previousValue: costs.instance_count,
          format: 'number' as const,
          trend: 0,
          sparklineData: [],
        },
        {
          label: 'Avg Cost/Instance',
          value: costs.instance_count > 0 ? costs.total_monthly_cost / costs.instance_count : 0,
          previousValue: costs.instance_count > 0 ? costs.total_monthly_cost / costs.instance_count : 0,
          format: 'currency' as const,
          trend: 0,
          sparklineData: costs.instances.slice(0, 8).map((inst, i) => ({
            date: `d${i}`,
            value: inst.daily_cost * 30,
          })),
        },
      ]
    : null

  const realTopCostDrivers = costs
    ? costs.instances.slice(0, 5).map((inst) => ({
        service: inst.name || inst.instance_id,
        icon: 'Server',
        amount: inst.monthly_cost,
        percentage: costs.total_monthly_cost > 0 ? (inst.monthly_cost / costs.total_monthly_cost) * 100 : 0,
      }))
    : null

  const realBudgetData: BudgetData | null = costs
    ? {
        spent: costs.total_monthly_cost,
        budget: costs.total_monthly_cost * 1.2,
        remaining: costs.total_monthly_cost * 0.2,
        percentage: (costs.total_monthly_cost / (costs.total_monthly_cost * 1.2)) * 100,
      }
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Cloud cost intelligence summary for June 2026
        </p>
      </div>

      {!checkedStatus && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking AWS connection...
        </div>
      )}

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

      {loadingCosts && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching AWS instance costs...
        </div>
      )}

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {(realKpiMetrics || kpiMetrics.slice(0, 3)).map((metric, i) => (
          <KpiCard key={metric.label} metric={metric} index={i} />
        ))}
        <BudgetRing data={realBudgetData || budgetData} />
      </motion.div>

      {costs && costs.instances.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium mb-4">Instance Cost Breakdown</h3>
              <div className="space-y-3">
                {costs.instances.slice(0, 8).map((inst) => (
                  <div key={inst.instance_id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground">{inst.instance_id}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {inst.name || inst.instance_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">{inst.region}</span>
                      <span className="font-medium tabular-nums">{formatCurrency(inst.monthly_cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="lg:col-span-2">
          <TrendChart data={costTrendData} />
        </div>
        <TopCostDrivers data={(realTopCostDrivers || topCostDrivers) as ServiceCost[]} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <SavingsRealizedCard data={savingsData} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <ActivityFeed activities={agentActivities} />
      </motion.div>
    </div>
  )
}
