# AI Cost Center

## Commands (run in order)
- `npm run dev` — dev server on :3000
- `npm run lint` → `npm run typecheck` → `npm run build` — validation pipeline
- No test framework configured (mock-data only)

## Project Structure
- `app/` — Next.js App Router pages (11 routes: /overview, /costs, /chat, /settings, etc.)
- `components/ui/` — shadcn/ui primitives (button, card, etc.)
- `components/layout/` — AppShell, Sidebar, TopBar
- `components/dashboard/`, `components/charts/`, `components/chat/` — feature components
- `lib/store.ts` — Zustand (useAppStore + useChatStore)
- `lib/mock-data.ts` — all mock data; swap imports to real API later
- `lib/types/index.ts` — TypeScript interfaces
- `lib/utils.ts` — cn(), formatCurrency(), formatPercent(), getTrendColor()
- `ai-cost-center-backend/` — FastAPI backend (Docker + LangGraph)

## Conventions
- `@/*` path alias maps to project root (e.g. `import { cn } from '@/lib/utils'`)
- NavItem.icon values are Lucide icon name strings (not JSX)
- CSS variables for colors including `success` and `warning` (shadcn custom)
- Dark mode via `next-themes` with `class` strategy
- `'use client'` required in components using state/effects/interactivity
- No project `.prettierrc` — `prettier-plugin-tailwindcss` available but unconfigured
- Stale `.next/` cache can cause build errors — delete it before rebuild if pages fail
