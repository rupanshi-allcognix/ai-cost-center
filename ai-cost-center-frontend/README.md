# AI Cost Center — Frontend

Cloud cost intelligence dashboard with a conversational AI agent. Built with Next.js 14, shadcn/ui, and Recharts.

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo login: `demo@finops.ai` / `demo1234`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Authentication (credentials provider) |
| `/overview` | KPI cards, spend trend, budget ring, top cost drivers, activity feed |
| `/costs` | Cost data with CSV export |
| `/resources` | Resource list with search, provider/status filters |
| `/anomalies` | Anomaly detection results |
| `/forecast` | Spend forecast |
| `/savings` | Savings recommendations with CSV export |
| `/tags` | Tag management |
| `/tokens` | Token usage metrics |
| `/settings` | Notifications, adapter config |
| `/chat` | Conversational AI agent UI |

## Architecture

- **Auth**: NextAuth v5 with Credentials provider
- **State**: Zustand store
- **Charts**: Recharts (AreaChart, BarChart)
- **UI**: shadcn/ui components, CSS variable theming
- **Animations**: Framer Motion
- **API stubs**: `app/api/` routes simulate backend when running standalone
- **Cloud adapters**: `lib/adapters/` — MockAdapter (default), AWSAdapter, AzureAdapter, GCPAdapter

## Environment

```
AUTH_SECRET=         # Required — generate with: openssl rand -hex 32
AUTH_URL=http://localhost:3000
BACKEND_URL=https://api-costcenter.omnineura.com   # Backend URL
```

## Validation

```bash
npm run lint && npm run typecheck && npm run build
```
