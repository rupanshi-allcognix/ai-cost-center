'use client'

import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  if (pathname === '/login') return <>{children}</>

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
      >
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}