# AI Cost Center

## Project Structure
```
/
├── ai-cost-center-frontend/    # Next.js 14 App Router (React + shadcn/ui)
├── ai-cost-center-backend/     # FastAPI + LangGraph (Docker)
├── ai-cost-center-deployment/  # Chainlit debug deployment (Docker)
└── docker-compose.yml          # Orchestrates backend + deployment
```

## Commands
- `cd ai-cost-center-frontend && npm run dev` — dev server on :3000
- `cd ai-cost-center-frontend && npm run lint` → `npm run typecheck` → `npm run build` — validation pipeline
- `docker-compose up` — backend on :8000, deployment on :8001
- No test framework configured (mock-data only)

## Frontend Conventions
- `@/*` path alias (`tsconfig.json` in frontend dir)
- NavItem.icon values are Lucide icon name strings (not JSX)
- CSS variables for `success` and `warning` colors (shadcn custom)
- Dark mode via `next-themes` with `class` strategy
- `'use client'` required in interactive components
- No project `.prettierrc` — `prettier-plugin-tailwindcss` available but unconfigured
- Stale `.next/` cache can cause build errors — delete before rebuild if pages fail

## Key Directories (inside `ai-cost-center-frontend/`)
- `app/` — 11 pages + 5 API routes (Next.js App Router)
- `components/` — ui/ (shadcn), layout/, dashboard/, charts/, chat/, streaming/, copilot/
- `utils/` — helpers (utils, csv, mock-data, types, auth-config)
- `services/` — API clients & adapters (chat-client, assistant-runtime, cloud adapters)
- `store/` — Zustand stores
- `hooks/` — custom React hooks
- `seo/` — SEO metadata & site config
- `reducer/` — state slices
- `loaders/` — loading states
- `assest/` — images, icons, videos
- `scripts/` — build / SEO tooling
- `public/` — static assets (served as-is)
- `app/api/` — stub API routes for standalone dev (agent, anomaly, auth, notifications)
