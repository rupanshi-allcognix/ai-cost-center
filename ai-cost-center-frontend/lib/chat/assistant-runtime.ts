import { createRuntime } from '@/lib/chat/stubs/assistant-ui-runtime'
import { parseSSELine } from './stream-parser'

type Options = { endpoint?: string }

export function createAssistantRuntime(opts: Options) {
  const endpoint = opts.endpoint ?? '/api/agent/chat'
  const runtime = createRuntime({
    sendMessage: async (msg: any, handlers: any) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: msg })
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          const line = part.replace(/^data: /, '').trim()
          const evt = parseSSELine(line)
          if (!evt) continue
          if (evt.type === 'token') handlers.onToken?.(evt.content)
          else if (evt.type === 'tool_call' || evt.type === 'tool_result') handlers.onTool?.({ name: evt.node, payload: evt.content, metadata: evt.metadata })
          else if (evt.type === 'node_start' || evt.type === 'node_end') handlers.onNodeTrace?.(evt)
          else if (evt.type === 'final') handlers.onComplete?.(evt.content)
        }
      }
    }
  } as any)
  return runtime
}

export default createAssistantRuntime
