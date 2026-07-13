type Trace = { node: string; tokens?: number; latency_ms?: number; cost_usd?: number }

export function AgentTrace({ traces }: { traces: Trace[] }) {
  if (!traces?.length) return null
  return (
    <div className="mt-2 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Agent Trace</p>
      <ul className="list-disc ml-5 space-y-0.5">
        {traces.map((t, idx) => (
          <li key={idx}>
            <strong className="text-foreground">{t.node}</strong> — {t.tokens ?? 0} tokens, {t.latency_ms ?? 0}ms, ${t.cost_usd ?? 0}
          </li>
        ))}
      </ul>
    </div>
  )
}
