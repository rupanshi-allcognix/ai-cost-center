'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { anomalies } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

const severityIcon = { critical: AlertCircle, warning: AlertTriangle, info: Info }
const severityVariant = { critical: 'destructive' as const, warning: 'warning' as const, info: 'secondary' as const }

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Anomalies & Alerts</h2>
        <p className="text-sm text-muted-foreground">Unusual cost patterns and detected anomalies</p>
      </div>

      <div className="space-y-3">
        {anomalies.map((a) => {
          const Icon = severityIcon[a.severity]
          return (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    a.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                    a.severity === 'warning' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{a.title}</h4>
                      <Badge variant={severityVariant[a.severity]} className="text-xs capitalize">{a.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{formatCurrency(a.amount)}</span>
                      <span>{a.resource}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}