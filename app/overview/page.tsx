'use client'

import { motion } from 'framer-motion'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { TrendChart } from '@/components/charts/trend-chart'
import { TopCostDrivers } from '@/components/dashboard/top-cost-drivers'
import { SavingsRealizedCard } from '@/components/dashboard/savings-realized-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { BudgetRing } from '@/components/dashboard/budget-ring'
import {
  kpiMetrics,
  costTrendData,
  topCostDrivers,
  savingsData,
  agentActivities,
  budgetData,
} from '@/lib/mock-data'

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Cloud cost intelligence summary for June 2026
        </p>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {kpiMetrics.slice(0, 3).map((metric, i) => (
          <KpiCard key={metric.label} metric={metric} index={i} />
        ))}
        <BudgetRing data={budgetData} />
      </motion.div>

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="lg:col-span-2">
          <TrendChart data={costTrendData} />
        </div>
        <TopCostDrivers data={topCostDrivers} />
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