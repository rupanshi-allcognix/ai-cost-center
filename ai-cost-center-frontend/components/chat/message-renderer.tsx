import { AgentTrace } from './agent-trace'
import { ToolCallBlock } from './tool-call-block'

function extractReasoningFromContent(content: string) {
  const matches = content.match(/```reasoning\n([\s\S]*?)```/)
  if (!matches) return null
  try { return JSON.parse(matches[1]) } catch { return matches[1] }
}

export function MessageRenderer({ content = '', metadata = {} }: { content?: string; metadata?: any }) {
  const reasoning = metadata.reasoning ?? metadata.node_traces ?? extractReasoningFromContent(content)
  const citations = metadata.citations ?? []
  const toolResult = metadata.tool_result
  const toolCalls = metadata.tool_calls ?? metadata.tools ?? []

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />

      {reasoning && (
        <details className="mt-2 rounded-lg border bg-muted/50 p-2">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Agent reasoning</summary>
          <pre className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{typeof reasoning === 'string' ? reasoning : JSON.stringify(reasoning, null, 2)}</pre>
        </details>
      )}

      {citations.length > 0 && (
        <div className="mt-2 space-y-1">
          {citations.map((c: any, i: number) => (
            <div key={i} className="rounded border bg-card p-2 text-xs text-muted-foreground">
              {c.source && <p>Source: {c.source}</p>}
              {c.href && <a className="text-primary underline" href={c.href} target="_blank" rel="noreferrer">{c.href}</a>}
              {c.snippet && <p className="mt-0.5 text-muted-foreground/70">{c.snippet}</p>}
            </div>
          ))}
        </div>
      )}

      {toolResult && (
        <div className="mt-2 rounded-lg border bg-muted/50 p-2">
          <p className="text-xs font-medium text-muted-foreground">Tool Result</p>
          <pre className="mt-1 whitespace-pre-wrap text-xs">{JSON.stringify(toolResult, null, 2)}</pre>
        </div>
      )}

      {toolCalls.map((t: any, i: number) => (
        <ToolCallBlock key={i} toolName={t.name ?? t.tool} payload={t.payload ?? t} />
      ))}

      {metadata.node_traces && <AgentTrace traces={metadata.node_traces} />}
    </div>
  )
}
