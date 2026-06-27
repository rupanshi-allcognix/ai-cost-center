# Build Prompt — AI Cost Center Dashboard

Paste this into Cursor / VS Code Copilot Chat. Build it in phases (Phase 1 → 2 → 3) rather than all at once for better results.

---

## Context (give this to the AI first)

I'm building an **AI Cost Center** platform — a cloud-cost intelligence experience with a conversational AI agent (powered by Claude/GPT via tool-calling and LangGraph) that analyzes token usage, cost spend, resource utilization, and gives optimization recommendations across AWS/Azure/GCP/Kubernetes.

This is a portfolio + production-track project, so the UI needs to look like a real enterprise SaaS product — not a hackathon dashboard. Think **Stripe Dashboard, Linear, Vercel Dashboard, Retool** — clean, confident, data-dense but uncluttered, with restrained color and strong typographic hierarchy.

---

## Tech Stack

- **Next.js 14+ (App Router)** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for base components (button, card, dialog, dropdown, tabs, sheet)
- **Recharts** for charts (bar, line, area)
- **lucide-react** for icons
- **Framer Motion** for micro-interactions (subtle, not flashy)
- State: React hooks/Zustand (keep it simple, no Redux)
- Mock data layer first (JSON/TS objects) — backend wiring comes later

---

## Design Direction (critical — this is what makes it NOT look generic)

1. **Color**: Neutral base (white/very light gray `#FAFAFA` background, `#FFFFFF` cards), ONE accent color used sparingly (e.g., indigo `#4F46E5` or emerald `#10B981` for "savings"/positive numbers, red/amber reserved ONLY for cost alerts). Avoid rainbow dashboards — restraint = expensive-looking.
2. **Typography**: Inter or Geist font. Large, confident numbers for KPIs (think 32–40px font-weight 600 for hero metrics), smaller muted labels above/below them.
3. **Cards**: Subtle borders (`border-gray-200`), soft shadows only on hover, generous padding (24px+), rounded-xl corners, NOT heavy drop shadows.
4. **Spacing**: Generous whitespace. Don't cram — enterprise tools breathe.
5. **Data density done right**: Use sparklines next to KPI numbers, small trend arrows (↑12% in green/red), and tooltips on hover instead of cluttering the main view.
6. **Motion**: Numbers count up on load, charts animate in, panels slide rather than pop. Subtle — 200–300ms easing, nothing bouncy.
7. **Empty/loading states**: Skeleton loaders (not spinners) for cards and charts — this alone makes it feel like a real product.
8. **Dark mode**: Support it from the start using Tailwind's `dark:` classes — toggle in the top nav.

---

## Phase 1 — Shell & Navigation

Build the app shell first:

- **Left sidebar** (collapsible): Logo/product name at top, nav items with icons:
  - Overview
  - Token Analysis
  - Cost Spend
  - Resources
  - Anomalies & Alerts
  - Forecasting
  - Savings Realized
  - Tagging Compliance
  - Chat Assistant (highlighted/pinned — this is the hero feature)
  - Settings (bottom, separated)
- **Top bar**: Breadcrumb/page title on left, on right: cloud provider filter (AWS/Azure/GCP/All), date range picker, dark mode toggle, user avatar/dropdown
- **Main content area**: routes render here via Next.js App Router layout

Make the sidebar collapse to icons-only on a toggle, with smooth width transition.

---

## Phase 2 — Overview Page (the page that has to wow on first load)

Top row — 4 KPI cards in a grid:
- Total Spend (MTD) with sparkline + % vs last month
- Savings Identified (this month) — accent color, with a small "X recommendations pending" badge
- Active Anomalies — count, red/amber dot if >0
- Budget Utilization — circular progress ring, not just a bar

Second row:
- Large area chart: daily spend trend (30 days), with a dotted forecast line extending to end-of-month
- Side panel: "Top 5 cost drivers" — horizontal bar list with service icons (EC2, S3, etc.) and $ amounts

Third row:
- "Savings Realized vs Projected" — this is the killer stakeholder metric, give it a dedicated card with a running total and a small bar chart comparing realized vs identified, month over month

Fourth row:
- Recent Agent Activity feed — a clean timeline/list: "Agent flagged idle EBS volume — $340/mo · 2h ago", "Rightsizing applied to i-0234 — saved $120/mo · 5h ago" — each with an icon and subtle color coding (info/success/warning)

---

## Phase 3 — Chat Assistant Panel

This is the differentiator — make it feel native, not bolted on:

- Slide-out panel from the right (or dedicated `/chat` page) — width ~420px on desktop, full screen on mobile
- Message bubbles: user messages right-aligned, agent messages left-aligned with a small agent avatar/icon
- **Inline rich responses**: when the agent answers a cost question, render an actual small chart or table inline in the chat bubble, not just text — this is what makes it feel "smart"
- Suggested prompt pills above the input (e.g., "Why did spend spike yesterday?", "Show idle resources", "Forecast next month")
- Streaming text effect for responses (token-by-token reveal)
- A small "Agent reasoning" expandable section under responses — collapsed by default, shows which data sources/tools the agent used (builds trust, very enterprise-y)
- Input bar: text input + send button + small icon button for "attach context" (e.g., attach a specific resource or time range to the question)

---

## Phase 4 — Detail Pages (build after Phase 1–3 are solid)

For each of these, follow the same card/chart visual language established above:

- **Token Analysis**: bar chart of daily token usage, breakdown by LangGraph agent/node (this is your unique angle — make it prominent), cost-per-1k-tokens trend
- **Resources**: filterable/sortable table of all resources with utilization %, status badges (idle/healthy/over-provisioned), inline "Apply rightsizing" action button
- **Anomalies & Alerts**: list/feed view, severity badges, click to expand into a detail view with the rolling average chart that triggered the alert
- **Forecasting**: line chart with confidence band (shaded area) for projected spend, forecast accuracy tracker (last month's prediction vs actual)
- **Savings Realized**: running total hero number, table of accepted recommendations with $ saved per item
- **Tagging Compliance**: donut chart of tagged vs untagged %, table of untagged resources grouped by team

---

## Component & Code Quality Requirements

- Fully typed with TypeScript (no `any`)
- Componentize aggressively — `KpiCard`, `TrendChart`, `AgentActivityItem`, `ChatBubble`, etc., each in their own file under `/components`
- Mock data in `/lib/mock-data.ts`, typed with interfaces in `/lib/types.ts`, structured so it's a one-line swap to real API calls later
- Responsive: sidebar collapses to a bottom nav or hamburger on mobile, charts resize properly
- Accessibility: proper aria-labels on icon buttons, keyboard navigable nav

---

## What to ask me before/while building

If anything is ambiguous (e.g., exact color hex, whether to use App Router server components vs client components for charts, naming conventions), ask rather than guessing — I'd rather answer 3 quick questions than redo a phase.

Start with **Phase 1** and show me the shell before moving to Phase 2.
