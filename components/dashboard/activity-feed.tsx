import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, HardDrive, FileText, Info } from 'lucide-react'
import type { AgentActivity } from '@/lib/types/index'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  AlertTriangle,
  HardDrive,
  FileText,
  Info,
}

const typeStyles = {
  info: 'border-l-blue-500/50 bg-blue-500/5',
  success: 'border-l-success/50 bg-success/5',
  warning: 'border-l-warning/50 bg-warning/5',
}

const typeBadge = {
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' as const,
  success: 'bg-success/10 text-success' as const,
  warning: 'bg-warning/10 text-warning' as const,
}

export function ActivityFeed({ activities }: { activities: AgentActivity[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Agent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map((activity) => {
          const Icon = iconMap[activity.icon] || Info
          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border-l-2 p-3 transition-colors hover:bg-accent/50',
                typeStyles[activity.type]
              )}
            >
              <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', typeBadge[activity.type])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-snug">{activity.message}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-success">{activity.amount}</span>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}