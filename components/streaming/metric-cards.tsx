import { Card, CardContent } from '@/components/ui/card'

export function MetricCards({ metrics = {} as any }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Spend</p>
          <p className="text-xl font-bold tabular-nums mt-1">${metrics.total ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Savings Realized</p>
          <p className="text-xl font-bold tabular-nums mt-1">${metrics.savings ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Anomalies</p>
          <p className="text-xl font-bold tabular-nums mt-1">{metrics.anomaliesCount ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Tagging Compliance</p>
          <p className="text-xl font-bold tabular-nums mt-1">{metrics.tagCompliance ?? 0}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
