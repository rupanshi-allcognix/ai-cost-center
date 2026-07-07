export interface CostDataPoint {
  date: string
  amount: number
  service: string
  region: string
  tags?: Record<string, string>
}

export interface ResourceUsage {
  id: string
  name: string
  type: string
  region: string
  monthlyCost: number
  utilization: number
  status: 'healthy' | 'idle' | 'over-provisioned'
  tags: Record<string, string>
}

export interface AnomalyResult {
  resourceId: string
  metric: string
  observed: number
  expected: number
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
}

export interface CostSummary {
  total: number
  byService: { service: string; amount: number; percentage: number }[]
  byRegion: { region: string; amount: number }[]
  trend: { date: string; amount: number }[]
}

export interface ICloudProviderAdapter {
  name: string
  getCostSummary(startDate: string, endDate: string): Promise<CostSummary>
  getResources(): Promise<ResourceUsage[]>
  detectAnomalies(days: number): Promise<AnomalyResult[]>
}
