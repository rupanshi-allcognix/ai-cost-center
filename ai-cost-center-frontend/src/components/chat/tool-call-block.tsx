export function ToolCallBlock({ toolName, payload }: { toolName: string; payload: any }) {
  return (
    <div className="rounded-lg border bg-muted/50 p-2 my-2">
      <p className="text-xs font-semibold text-muted-foreground">{toolName}</p>
      <pre className="text-xs mt-1 overflow-auto text-muted-foreground">{JSON.stringify(payload, null, 2)}</pre>
    </div>
  )
}
