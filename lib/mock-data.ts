import {
  KpiMetric,
  CostDataPoint,
  ServiceCost,
  SavingsEntry,
  AgentActivity,
  Anomaly,
  Resource,
  ChatMessage,
  TokenUsage,
  ForecastData,
  TaggingStats,
  BudgetData,
} from '@/lib/types/index'

const now = new Date()
const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(now)
  d.setDate(d.getDate() - (29 - i))
  return d.toISOString().split('T')[0]
})

export const kpiMetrics: KpiMetric[] = [
  {
    label: 'Total Spend (MTD)',
    value: 284500,
    previousValue: 312000,
    format: 'currency',
    trend: -8.8,
    sparklineData: days.map((date, i) => ({
      date,
      value: 8000 + Math.random() * 4000 + i * 200,
    })),
  },
  {
    label: 'Savings Identified',
    value: 45200,
    previousValue: 38000,
    format: 'currency',
    trend: 18.9,
    sparklineData: days.map((date, i) => ({
      date,
      value: 500 + Math.random() * 1000 + i * 50,
    })),
  },
  {
    label: 'Active Anomalies',
    value: 7,
    previousValue: 12,
    format: 'number',
    trend: -41.7,
    sparklineData: days.map((date) => ({
      date,
      value: Math.floor(Math.random() * 20) + 3,
    })),
  },
  {
    label: 'Budget Utilization',
    value: 68,
    previousValue: 72,
    format: 'percent',
    trend: -5.6,
    sparklineData: days.map((date, i) => ({
      date,
      value: 40 + (i / 29) * 35 + Math.random() * 5,
    })),
  },
]

export const costTrendData: CostDataPoint[] = days.map((date, i) => ({
  date,
  actual: 8000 + Math.random() * 3000 + i * 150,
  forecast:
    i > 20
      ? 8000 + Math.random() * 3000 + i * 150 + 1000
      : undefined,
}))

export const topCostDrivers: ServiceCost[] = [
  { service: 'EC2', icon: 'Server', amount: 98500, percentage: 34.6 },
  { service: 'S3', icon: 'Database', amount: 42700, percentage: 15.0 },
  { service: 'Lambda', icon: 'Zap', amount: 31200, percentage: 11.0 },
  { service: 'RDS', icon: 'Database', amount: 28500, percentage: 10.0 },
  { service: 'EKS', icon: 'Container', amount: 19800, percentage: 7.0 },
]

export const savingsData: SavingsEntry[] = [
  { month: 'Jan', realized: 12000, identified: 18000 },
  { month: 'Feb', realized: 15000, identified: 22000 },
  { month: 'Mar', realized: 18000, identified: 25000 },
  { month: 'Apr', realized: 22000, identified: 30000 },
  { month: 'May', realized: 26000, identified: 38000 },
  { month: 'Jun', realized: 31000, identified: 45000 },
]

export const agentActivities: AgentActivity[] = [
  {
    id: '1',
    type: 'info',
    message: 'Agent flagged idle EBS volume',
    amount: '$340/mo',
    timestamp: '2h ago',
    icon: 'HardDrive',
  },
  {
    id: '2',
    type: 'success',
    message: 'Rightsizing applied to i-0234',
    amount: '$120/mo',
    timestamp: '5h ago',
    icon: 'CheckCircle',
  },
  {
    id: '3',
    type: 'warning',
    message: 'Unusual spend spike detected in us-east-1',
    amount: '+$2,400',
    timestamp: '8h ago',
    icon: 'AlertTriangle',
  },
  {
    id: '4',
    type: 'info',
    message: 'S3 lifecycle policy recommended for logs-bucket',
    amount: '$90/mo',
    timestamp: '1d ago',
    icon: 'FileText',
  },
  {
    id: '5',
    type: 'success',
    message: 'Reserved instance applied to EC2 fleet',
    amount: '$1,200/mo',
    timestamp: '2d ago',
    icon: 'CheckCircle',
  },
]

export const anomalies: Anomaly[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'EC2 spend spike in us-east-1',
    description: 'Cost increased 340% vs rolling 7-day average. 4 new instances launched without tags.',
    amount: 8400,
    resource: 'i-0abcd1234',
    timestamp: '2026-06-22T10:30:00Z',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Unused RDS instance detected',
    description: 'db.r5.large running idle for 14 days with 0 connections.',
    amount: 3200,
    resource: 'database-prod-01',
    timestamp: '2026-06-21T14:00:00Z',
  },
  {
    id: 'a3',
    severity: 'info',
    title: 'Cross-region data transfer increasing',
    description: 'Data transfer costs between regions up 45% this week.',
    amount: 1200,
    resource: 'N/A',
    timestamp: '2026-06-20T09:00:00Z',
  },
]

export const resources: Resource[] = [
  { id: 'r1', name: 'web-server-prod-01', type: 'EC2', provider: 'AWS', region: 'us-east-1', monthlySpend: 2400, utilization: 78, status: 'healthy', owner: 'platform', tags: { env: 'prod', team: 'platform' } },
  { id: 'r2', name: 'db-main-prod', type: 'RDS', provider: 'AWS', region: 'us-east-1', monthlySpend: 3800, utilization: 45, status: 'over-provisioned', owner: 'backend', tags: { env: 'prod', team: 'backend' } },
  { id: 'r3', name: 'cache-cluster-01', type: 'ElastiCache', provider: 'AWS', region: 'us-west-2', monthlySpend: 1200, utilization: 22, status: 'idle', owner: 'platform', tags: { env: 'staging' } },
  { id: 'r4', name: 'ml-training-pool', type: 'ECS', provider: 'AWS', region: 'us-east-1', monthlySpend: 8900, utilization: 92, status: 'healthy', owner: 'data-science', tags: { env: 'prod', team: 'data-science' } },
  { id: 'r5', name: 'logging-cluster', type: 'EKS', provider: 'AWS', region: 'eu-west-1', monthlySpend: 5400, utilization: 65, status: 'healthy', owner: 'infra', tags: { env: 'prod', team: 'infra' } },
]

export const tokenUsageData: TokenUsage[] = days.map((date, i) => ({
  date,
  promptTokens: Math.floor(500000 + Math.random() * 300000 + i * 15000),
  completionTokens: Math.floor(300000 + Math.random() * 200000 + i * 10000),
  totalTokens: 0,
  cost: 0,
}))

tokenUsageData.forEach((d) => {
  d.totalTokens = d.promptTokens + d.completionTokens
  d.cost = d.promptTokens * 0.000003 + d.completionTokens * 0.000015
})

const forecastDays = Array.from({ length: 45 }, (_, i) => {
  const d = new Date(now)
  d.setDate(d.getDate() - (29 - i))
  return d.toISOString().split('T')[0]
})

export const forecastData: ForecastData[] = forecastDays.map((date, i) => {
  const base = 10000 + i * 100
  return {
    date,
    predicted: base + Math.random() * 2000,
    upperBound: base + Math.random() * 2000 + 3000,
    lowerBound: base + Math.random() * 2000 - 2000,
    actual: i < 30 ? base + Math.random() * 1500 : undefined,
  }
})

export const taggingStats: TaggingStats = {
  tagged: 342,
  untagged: 128,
  resources: [
    { name: 'web-server-prod-01', team: 'platform', tags: 4 },
    { name: 'analytics-bucket', team: 'data', tags: 0 },
    { name: 'ml-training-pool', team: 'data-science', tags: 3 },
    { name: 'legacy-db-01', team: 'platform', tags: 0 },
    { name: 'cdn-distribution', team: 'infra', tags: 2 },
  ],
}

export const budgetData: BudgetData = {
  budget: 420000,
  spent: 284500,
  remaining: 135500,
  percentage: 68,
}

const suggestedPrompts = [
  'Why did spend spike yesterday?',
  'Show idle resources',
  'Forecast next month',
  'Top 5 cost drivers this week',
  'Which services have lowest utilization?',
]

export const chatMessages: ChatMessage[] = [
  {
    id: 'c1',
    role: 'agent',
    content: "Hello! I'm your AI Cost Center assistant. I can help you analyze cloud costs, identify savings opportunities, and forecast future spend. What would you like to explore?",
    timestamp: '2026-06-22T12:00:00Z',
    reasoning: 'Greeting the user with available capabilities.',
    sources: [],
  },
  {
    id: 'c2',
    role: 'user',
    content: 'Why did our spend spike yesterday?',
    timestamp: '2026-06-22T12:01:00Z',
  },
  {
    id: 'c3',
    role: 'agent',
    content: "I found a **$2,400 cost spike** in us-east-1 yesterday. The increase was driven by:\n\n- **EC2**: +$1,800 (4 new instances launched)\n- **Data Transfer**: +$450 (cross-region egress)\n- **RDS**: +$150 (backup storage increase)\n\nThe new EC2 instances are missing cost allocation tags and appear to be for a temporary testing environment. Would you like me to:\n1. Apply a budget alert to these instances\n2. Recommend rightsizing\n3. Show the detailed breakdown",
    timestamp: '2026-06-22T12:01:30Z',
    richContent: {
      type: 'chart',
      data: { chartType: 'bar', labels: ['EC2', 'Data Transfer', 'RDS', 'Lambda', 'S3'], values: [1800, 450, 150, 80, 50] },
    },
    reasoning: 'I queried the cost data for the last 48 hours and compared it against the rolling 7-day average. I identified the top services contributing to the increase and cross-referenced with resource metadata to find untagged instances.',
    sources: ['AWS Cost Explorer (us-east-1, last 7 days)', 'Resource Tagging API', 'CloudTrail (instance launch events)'],
  },
]

export function getSuggestedPrompts(): string[] {
  return suggestedPrompts
}

export function getAgentResponse(userMessage: string): ChatMessage {
  return {
    id: `c${Date.now()}`,
    role: 'agent',
    content: `I analyzed your question about "${userMessage.slice(0, 50)}..." and found the following insights based on your current cloud infrastructure data. This is a simulated response from the AI Cost Center agent.`,
    timestamp: new Date().toISOString(),
    reasoning: 'This is a mock response. In production, this would call Claude/GPT via LangGraph with tool-calling to query actual cost data.',
    sources: ['Mock Data Layer (Phase 1-3)'],
  }
}