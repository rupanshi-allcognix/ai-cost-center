import React from 'react'

export const AssistantRuntimeProvider = ({ runtime, children }: { runtime: any; children: React.ReactNode }) => <>{children}</>

export const ThreadList = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

export const Thread = ({ messageRenderer }: { messageRenderer: (props: any) => React.ReactNode }) => (
  <div className="space-y-3">{messageRenderer({ content: 'Assistant UI stub thread. Send a message to start.', metadata: {} })}</div>
)

export const Composer = () => (
  <div className="rounded border border-dashed border-border p-3 text-sm text-muted-foreground">Composer placeholder</div>
)
