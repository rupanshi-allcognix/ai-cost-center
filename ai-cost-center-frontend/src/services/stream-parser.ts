export type LangGraphEvent = {
  type: 'node_start' | 'node_end' | 'token' | 'tool_call' | 'tool_result' | 'final'
  node: string
  content?: string
  metadata?: { tokens?: number; cost_usd?: number; latency_ms?: number }
}

export function parseSSELine(line: string): LangGraphEvent | null {
  try { return JSON.parse(line) as LangGraphEvent } catch { return null }
}
