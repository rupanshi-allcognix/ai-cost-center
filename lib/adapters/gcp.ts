import type { ICloudProviderAdapter, CostSummary, ResourceUsage, AnomalyResult } from './types'

export class GCPAdapter implements ICloudProviderAdapter {
  name = 'GCP'

  async getCostSummary(startDate: string, endDate: string): Promise<CostSummary> {
    // TODO: Use GCP BigQuery billing export or Cloud Billing API
    // const billing = new CloudBillingClient()
    // const [accounts] = await billing.listBillingAccounts()
    throw new Error('GCP SDK not configured — set GOOGLE_APPLICATION_CREDENTIALS')
  }

  async getResources(): Promise<ResourceUsage[]> {
    throw new Error('GCP SDK not configured')
  }

  async detectAnomalies(days: number): Promise<AnomalyResult[]> {
    throw new Error('GCP SDK not configured')
  }
}
