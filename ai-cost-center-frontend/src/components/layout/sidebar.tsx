'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils'
import { useAppStore, navItems } from '@/store'
import {
  LayoutDashboard,
  Binary,
  DollarSign,
  Server,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Tags,
  MessageSquare,
  Settings,
  ChevronLeft,
  PanelRightClose,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Binary,
  DollarSign,
  Server,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Tags,
  MessageSquare,
  Settings,
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card"
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className={cn('flex h-14 items-center border-b px-4', sidebarCollapsed ? 'justify-center' : 'justify-between')}>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xs font-bold text-primary-foreground">C</span>
                </div>
                <span className="text-sm font-semibold">AI Cost Center</span>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">C</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-4 rounded-full border bg-card p-0.5 text-muted-foreground shadow-sm hover:text-foreground"
              aria-label="Expand sidebar"
            >
              <PanelRightClose className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {navItems
            .filter((item) => !item.isBottom)
            .map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const isPinned = item.pinned

              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  <div className="relative">
                    <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2.5 : 2} />
                    {isPinned && !sidebarCollapsed && (
                      <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {link}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }
              return <div key={item.href} className="relative">{link}</div>
            })}
        </nav>

        <div className="border-t p-2">
          {navItems
            .filter((item) => item.isBottom)
            .map((item) => {
              const Icon = iconMap[item.icon] || Settings
              const isActive = pathname === item.href

              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {link}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }
              return <div key={item.href}>{link}</div>
            })}
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}