import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      {Icon && <Icon className="mb-3 h-8 w-8" />}
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground/70">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
