type Resource = {
  resource_id: string
  type: string
  region: string
  cloud: string
  monthly_cost: number
  utilization?: number
  recommendation?: string
}

export function CostTable({ data = [] }: { data?: Resource[] }) {
  if (data.length === 0) return <p className="text-sm text-muted-foreground py-4 text-center">No cost data available</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="pb-2 font-medium">Resource</th>
            <th className="pb-2 font-medium">Type</th>
            <th className="pb-2 font-medium">Region</th>
            <th className="pb-2 font-medium">Cloud</th>
            <th className="pb-2 font-medium">Monthly Cost</th>
            <th className="pb-2 font-medium">Utilization</th>
            <th className="pb-2 font-medium">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.resource_id} className="border-b last:border-0 transition-colors hover:bg-muted/50">
              <td className="py-2 font-medium">{r.resource_id}</td>
              <td className="py-2 text-muted-foreground">{r.type}</td>
              <td className="py-2 text-muted-foreground">{r.region}</td>
              <td className="py-2 text-muted-foreground">{r.cloud}</td>
              <td className="py-2 font-medium tabular-nums">${r.monthly_cost.toFixed(2)}</td>
              <td className="py-2 text-muted-foreground">{r.utilization ?? '-'}%</td>
              <td className="py-2 text-muted-foreground">{r.recommendation ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
