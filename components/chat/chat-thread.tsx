'use client'

import { useState } from 'react'
import { MessageRenderer } from './message-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { chatMessages, getSuggestedPrompts } from '@/lib/mock-data'
import { Send } from 'lucide-react'

export function ChatThread() {
  const [input, setInput] = useState('')
  const suggestions = getSuggestedPrompts()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {chatMessages.map((msg) => (
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
              onClick={() => setInput(prompt)}
              className="rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your cloud costs..." className="flex-1" />
          <Button size="icon" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  )
}
