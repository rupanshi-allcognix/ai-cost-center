import type { ICloudProviderAdapter } from './types'
import { MockAdapter } from './mock'
import { AWSAdapter } from './aws'
import { AzureAdapter } from './azure'
import { GCPAdapter } from './gcp'

export function getProviderAdapter(provider: 'aws' | 'azure' | 'gcp' | 'mock'): ICloudProviderAdapter {
  switch (provider) {
    case 'aws': return new AWSAdapter()
    case 'azure': return new AzureAdapter()
    case 'gcp': return new GCPAdapter()
    default: return new MockAdapter()
  }
}

export type { ICloudProviderAdapter, CostSummary, ResourceUsage, AnomalyResult } from './types'
