'use client'

import { create } from 'zustand'
import type { CloudProviderFilter, NavItem } from '@/utils/types'

interface AppState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  activeProvider: CloudProviderFilter
  setActiveProvider: (provider: CloudProviderFilter) => void
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  toggleChat: () => void
  isMobile: boolean
  setIsMobile: (mobile: boolean) => void
  awsConnected: boolean
  awsAccountId: string | null
  awsAccountAlias: string | null
  setAWSConnected: (connected: boolean, accountId?: string | null, alias?: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeProvider: 'all',
  setActiveProvider: (provider) => set({ activeProvider: provider }),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  awsConnected: false,
  awsAccountId: null,
  awsAccountAlias: null,
  setAWSConnected: (connected, accountId = null, alias = null) =>
    set({ awsConnected: connected, awsAccountId: accountId, awsAccountAlias: alias }),
}))

export const navItems: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: 'LayoutDashboard' },
  { label: 'Token Analysis', href: '/tokens', icon: 'Binary' },
  { label: 'Cost Spend', href: '/costs', icon: 'DollarSign' },
  { label: 'Resources', href: '/resources', icon: 'Server' },
  { label: 'Anomalies & Alerts', href: '/anomalies', icon: 'AlertTriangle' },
  { label: 'Forecasting', href: '/forecast', icon: 'TrendingUp' },
  { label: 'Savings Realized', href: '/savings', icon: 'Wallet' },
  { label: 'Tagging Compliance', href: '/tags', icon: 'Tags' },
  { label: 'Chat Assistant', href: '/chat', icon: 'MessageSquare', pinned: true },
  { label: 'Settings', href: '/settings', icon: 'Settings', isBottom: true },
]

interface ChatState {
  messages: import('@/utils/types').ChatMessage[]
  isStreaming: boolean
  addMessage: (message: import('@/utils/types').ChatMessage) => void
  setStreaming: (streaming: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  clearMessages: () => set({ messages: [] }),
}))