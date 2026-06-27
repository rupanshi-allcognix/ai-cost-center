'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'

export function CopilotSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg">
          <Bot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>AI Copilot</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>Selected cloud: <span className="font-medium text-foreground">AWS</span></p>
          <Button className="w-full" variant="secondary" onClick={() => console.log('Switch to AWS')}>Switch to AWS</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
