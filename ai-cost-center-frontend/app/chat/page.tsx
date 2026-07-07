'use client'

import { ChatThread } from '@/components/chat/chat-thread'
import { StreamingCostPanel } from '@/components/streaming/streaming-cost-panel'
import { CopilotSidebar } from '@/components/copilot/copilot-sidebar'

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-6 p-6">
      <div className="flex flex-1 flex-col rounded-lg border bg-card">
        <ChatThread />
      </div>
      <div className="hidden w-80 shrink-0 lg:block">
        <StreamingCostPanel />
      </div>
      <CopilotSidebar />
    </div>
  )
}
