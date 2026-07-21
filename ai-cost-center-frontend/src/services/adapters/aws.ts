import type { ICloudProviderAdapter, CostSummary, ResourceUsage, AnomalyResult } from './types'

export class AWSAdapter implements ICloudProviderAdapter {
  name = 'AWS'

  async getCostSummary(startDate: string, endDate: string): Promise<CostSummary> {
    // TODO: Use AWS SDK CostExplorer client
    // const ce = new CostExplorerClient({ region: 'us-east-1' })
    // const command = new GetCostAndUsageCommand({ ... })
    throw new Error('AWS SDK not configured — set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY')
  }

  async getResources(): Promise<ResourceUsage[]> {
    // TODO: Use AWS SDK ResourceGroupsTaggingAPI + EC2/RDS/Lambda describe calls
    throw new Error('AWS SDK not configured')
  }

  async detectAnomalies(days: number): Promise<AnomalyResult[]> {
    throw new Error('AWS SDK not configured')
  }
}
