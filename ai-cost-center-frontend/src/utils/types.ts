export interface CostDataPoint {
  date: string
  actual: number
  forecast?: number
}

export interface KpiMetric {
  label: string
  value: number
  previousValue: number
  format: 'currency' | 'number' | 'percent'
  trend: number
  sparklineData: { date: string; value: number }[]
}

export interface ServiceCost {
  service: string
  icon: string
  amount: number
  percentage: number
}

export interface SavingsEntry {
  month: string
  realized: number
  identified: number
}

export interface AgentActivity {
  id: string
  type: 'info' | 'success' | 'warning'
  message: string
  amount: string
  timestamp: string
  icon: string
}

export interface Anomaly {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  amount: number
  resource: string
  timestamp: string
}

export interface Resource {
  id: string
  name: string
  type: string
  provider: 'AWS' | 'Azure' | 'GCP'
  region: string
  monthlySpend: number
  utilization: number
  status: 'healthy' | 'idle' | 'over-provisioned'
  owner: string
  tags: Record<string, string>
}

export interface CloudProvider {
  id: string
  name: string
  logo: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
  richContent?: ChatRichContent
  reasoning?: string
  sources?: string[]
}

export interface ChatRichContent {
  type: 'chart' | 'table' | 'kpi'
  data: Record<string, unknown>
}

export interface TokenUsage {
  date: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

export interface ForecastData {
  date: string
  predicted: number
  upperBound: number
  lowerBound: number
  actual?: number
}

export interface TaggingStats {
  tagged: number
  untagged: number
  resources: { name: string; team: string; tags: number }[]
}

export interface BudgetData {
  budget: number
  spent: number
  remaining: number
  percentage: number
}

export type NavItem = {
  label: string
  href: string
  icon: string
  pinned?: boolean
  isBottom?: boolean
}

export type CloudProviderFilter = 'all' | 'AWS' | 'Azure' | 'GCP'

export type Theme = 'light' | 'dark' | 'system'