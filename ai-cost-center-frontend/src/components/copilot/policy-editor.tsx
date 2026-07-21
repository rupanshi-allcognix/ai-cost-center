'use client'

export function PolicyEditor({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Policy Rules</label>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        rows={4}
        placeholder="Enter policy rules..."
      />
    </div>
  )
}
