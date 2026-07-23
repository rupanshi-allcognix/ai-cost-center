export interface AWSConnectResult {
  status: string
  account: {
    account_id: string
    arn: string
    account_alias: string
    user_id: string
  }
}

export interface AWSStatus {
  connected: boolean
  account_id?: string
  arn?: string
  account_alias?: string
}

export interface InstanceCost {
  instance_id: string
  instance_type: string
  region: string
  state: string
  monthly_cost: number
  daily_cost: number
  name: string
  launch_time: string
  tags: Record<string, string>
}

export interface AWSCostSummary {
  total_monthly_cost: number
  total_daily_cost: number
  instance_count: number
  instances: InstanceCost[]
  currency: string
  period: string
}

export interface AWSCostTrendPoint {
  date: string
  amount: number
}

export async function connectAWS(accessKey: string, secretKey: string): Promise<AWSConnectResult> {
  const res = await fetch('/api/aws/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: accessKey, secret_key: secretKey }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Connection failed')
  return data
}

export async function getAWSStatus(): Promise<AWSStatus> {
  const res = await fetch('/api/aws/status')
  return res.json()
}

export async function getAWSCosts(startDate?: string, endDate?: string): Promise<AWSCostSummary> {
  const params = new URLSearchParams()
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)
  const res = await fetch(`/api/aws/costs?${params.toString()}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch costs')
  return data
}

export async function getAWSCostTrend(days: number = 30): Promise<{ trend: AWSCostTrendPoint[] }> {
  const res = await fetch(`/api/aws/cost-trend?days=${days}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch trend')
  return data
}

export async function disconnectAWS(): Promise<{ status: string }> {
  const res = await fetch('/api/aws/disconnect', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Disconnect failed')
  return data
}
