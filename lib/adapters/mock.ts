import type { ICloudProviderAdapter, CostSummary, ResourceUsage, AnomalyResult } from './types'
import { resources } from '@/lib/mock-data'

export class MockAdapter implements ICloudProviderAdapter {
  name = 'Mock'

  async getCostSummary(): Promise<CostSummary> {
    const byService = [
      { service: 'EC2', amount: 98500, percentage: 34.6 },
      { service: 'S3', amount: 42700, percentage: 15.0 },
      { service: 'Lambda', amount: 31200, percentage: 11.0 },
      { service: 'RDS', amount: 28500, percentage: 10.0 },
      { service: 'EKS', amount: 19800, percentage: 7.0 },
    ]
    const total = byService.reduce((s, x) => s + x.amount, 0)
    const trend = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return { date: d.toISOString().split('T')[0], amount: 8000 + Math.random() * 3000 + i * 150 }
    })
    return { total, byService, byRegion: [{ region: 'us-east-1', amount: total * 0.6 }], trend }
  }

  async getResources(): Promise<ResourceUsage[]> {
    return resources.map((r) => ({
      id: r.id, name: r.name, type: r.type, region: r.region,
      monthlyCost: r.monthlySpend, utilization: r.utilization,
      status: r.status, tags: r.tags,
    }))
  }

  async detectAnomalies(): Promise<AnomalyResult[]> {
    return [
      { resourceId: 'i-0abcd1234', metric: 'cost', observed: 8400, expected: 2500, severity: 'critical', timestamp: new Date().toISOString() },
      { resourceId: 'database-prod-01', metric: 'utilization', observed: 0, expected: 45, severity: 'warning', timestamp: new Date().toISOString() },
    ]
  }
}
