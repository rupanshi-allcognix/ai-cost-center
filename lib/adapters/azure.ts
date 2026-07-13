import type { ICloudProviderAdapter, CostSummary, ResourceUsage, AnomalyResult } from './types'

export class AzureAdapter implements ICloudProviderAdapter {
  name = 'Azure'

  async getCostSummary(startDate: string, endDate: string): Promise<CostSummary> {
    // TODO: Use @azure/arm-costmanagement SDK
    // const client = new CostManagementClient(credentials, subscriptionId)
    // const result = await client.query.usage(scope, { ... })
    throw new Error('Azure SDK not configured — set AZURE_SUBSCRIPTION_ID and AZURE_TENANT_ID')
  }

  async getResources(): Promise<ResourceUsage[]> {
    throw new Error('Azure SDK not configured')
  }

  async detectAnomalies(days: number): Promise<AnomalyResult[]> {
    throw new Error('Azure SDK not configured')
  }
}
