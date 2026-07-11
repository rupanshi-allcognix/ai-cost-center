'use client'

import { useState, useRef } from 'react'
import { MessageRenderer } from './message-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSuggestedPrompts } from '@/lib/mock-data'
import { useChatStore } from '@/lib/store'
import { Send, Loader2 } from 'lucide-react'

export function ChatThread() {
  const [input, setInput] = useState('')
  const { messages, isStreaming, addMessage, setStreaming } = useChatStore()
  const suggestions = getSuggestedPrompts()
  const abortRef = useRef<AbortController | null>(null)

  async function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return

    setInput('')
    addMessage({ id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date().toISOString() })
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Failed to send message')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let reasoning = ''
      let sources: string[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'token' && event.content) {
              fullContent += event.content
            } else if (event.type === 'final') {
              if (event.content) fullContent = event.content
              if (event.metadata?.reasoning) reasoning = event.metadata.reasoning
              if (event.metadata?.sources) sources = event.metadata.sources
            } else if (event.type === 'node_start' && event.node) {
              reasoning += `[${event.node}] ${event.content || ''}\n`
            }
          } catch { /* skip parse errors */ }
        }
      }

      addMessage({
        id: `a-${Date.now()}`,
        role: 'agent',
        content: fullContent || 'I processed your request. No specific findings to report.',
        timestamp: new Date().toISOString(),
        reasoning: reasoning || undefined,
        sources: sources.length > 0 ? sources : undefined,
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        addMessage({
          id: `e-${Date.now()}`,
          role: 'agent',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date().toISOString(),
        })
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-sm">Ask me anything about your cloud costs.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}>
              <MessageRenderer content={msg.content} metadata={{ reasoning: msg.reasoning, citations: msg.sources?.map(s => ({ source: s })) }} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t p-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => { setInput(prompt) }}
              className="rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your cloud costs..."
            className="flex-1"
            disabled={isStreaming}
          />
          <Button size="icon" disabled={!input.trim() || isStreaming} onClick={handleSend}>
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
