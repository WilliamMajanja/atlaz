# Atlaz — Land Intelligence & Business Operations

Capital allocation intelligence for frontier real estate markets. Zanzibar is the first geography — built to expand globally.

**Built for investors, developers, and land professionals who need interactive mapping, AI-powered analysis, deal pipeline management, CRM, POS, ERP, and speculation intelligence in one platform.**

---

## Demo Walkthrough (Investor Presentation)

Launch the app, then follow this flow:

| Step | What to Click | What You'll See |
|------|--------------|----------------|
| **1** | Open http://localhost:3000 | Premium landing page with feature cards and stats |
| **2** | Click **"Enter the Command Center"** or **"Launch Dashboard"** | 6-tab dashboard: Map / Operations / CRM / Sales / Intelligence / ERP |
| **3** | Click the **Map** tab | Interactive Zanzibar map with clickable pins. Click any pin for plot intelligence (risk, opportunity, capital scores) |
| **4** | Click **Operations** | Deal pipeline Kanban (5 stages: Discovery → Qualification → Proposal → Negotiation → Closed) + KPI bar (Pipeline Value, Active Deals, Win Rate, etc.) |
| **5** | Hover the **AI Concierge** button (bottom-right) | "The Atlaz Method" — guided 4-step journey (Welcome → Discover → Match → Review → Act). Designed for non-tech-savvy users. |
| **6** | Click **CRM** | Lead pipeline (7 statuses), lead scoring, filtering/search, quick status actions |
| **7** | Click **Sales** | Pipeline-by-stage chart, conversion funnel, top clients, win rate analytics |
| **8** | Click **Intelligence** | Zone-level speculation briefs with entry/exit signals, price targets, risk-reward ratios, and AI-generated narratives |
| **9** | Click **ERP** | Task management (priority/status), team utilization, property inventory |
| **10** | Visit **/analysis** | Full plot intelligence: risk/opportunity/capital scoring, anomaly detection with AI mitigation plans |
| **11** | Visit **/simulation** | Walk-forward growth scenario modeling (test road upgrades, visa programs, tourism growth) |
| **12** | Visit **/reports** | Generate due diligence reports from analysis data |

---

## The Atlaz Method

The platform's signature guided experience — a conversational AI Concierge that walks non-technical users through:

1. **Welcome** — "Find your perfect property match"
2. **Discover** — "What brings you to Zanzibar?" (Invest / Develop / Live / Explore)
3. **Match** — Personalized property recommendations based on your goal + budget
4. **Review & Act** — Summary card with matched zones, next steps, and direct links

No technical knowledge required. Just answer 3 questions.

---

## Features

### Mapping & Intelligence
- **Interactive Map** — Leaflet-based with satellite, flood risk, infrastructure, land use, and development zone layers
- **Plot Intelligence** — AI-powered risk, opportunity, and capital scores (0–10 scale)
- **Anomaly Detection** — Flags unusual patterns (price spikes, rapid construction, legal flags) with automated mitigation plans
- **Growth Simulation** — Walk-forward scenario modeling with configurable inputs (infrastructure, GDP, visa, tourism)

### Business Operations
- **CRM** — Full lead management: 7-status pipeline, lead scoring (0–100), filtering, activity tracking
- **Deal Pipeline** — Kanban board: Discovery → Qualification → Proposal → Negotiation → Closed Won/Lost
- **POS** — Transaction ledger, invoice management with status tracking (Draft/Sent/Paid/Overdue/Cancelled)
- **ERP** — Task management (priority × status matrix), team utilization tracking, property inventory

### AI & Speculation
- **AI Concierge** — Guided discovery for non-technical users (flaghip feature)
- **Speculation Engine** — Zone-level entry/exit signals, price targets, risk-reward profiles, AI-generated briefs
- **Ollama Integration** — Local AI for speculation briefs (falls back gracefully with local generation)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| State | Zustand 5 |
| Mapping | Leaflet + react-leaflet |
| Database | Prisma 6 + SQLite (optional — demo works entirely client-side) |
| AI | Ollama (local, optional, graceful fallback) |
| UI | Custom design system with glass morphism, gradient accents, animations |

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd atlaz
npm install

# 2. Configure environment (optional — app works out of the box)
cp .env.example .env.local

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

**No database setup required.** The demo uses in-memory Zustand stores with comprehensive sample data covering all 10 Zanzibar zones (Stone Town, Paje, Nungwi, Fumba, Kendwa, Matemwe, Jambiani, Bwejuu, Kiwengwa, Michamvi).

### Optional: Enable Ollama AI

```bash
# Install Ollama (https://ollama.com) then:
ollama pull llama3.2
# The app auto-connects at http://localhost:11434
```

If Ollama is unavailable, the speculation engine generates local briefs with identical structure — no broken UI.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (dark theme, metadata)
│   ├── dashboard/page.tsx    # Main dashboard (6-tab)
│   ├── analysis/page.tsx     # Plot intelligence + anomaly detection
│   ├── simulation/page.tsx   # Growth scenario modeling
│   ├── reports/page.tsx      # Due diligence reports
│   ├── admin/page.tsx        # Data catalog
│   └── api/speculation/route.ts  # Ollama speculation endpoint
├── components/
│   ├── dashboard/
│   │   ├── Concierge.tsx     # AI Concierge (flagship feature)
│   │   ├── CRMModule.tsx     # Lead management
│   │   ├── POSModule.tsx     # Point-of-sale & invoices
│   │   ├── ERPModule.tsx     # Tasks, team, inventory
│   │   ├── DealPipeline.tsx  # Kanban pipeline
│   │   ├── BusinessMetrics.tsx # KPI cards
│   │   ├── SalesAnalytics.tsx # Charts & funnel
│   │   └── EnhancedSpeculation.tsx # Speculation briefs
│   └── ui/                   # Shared UI primitives
├── lib/
│   ├── store.ts              # All Zustand stores
│   └── config/index.ts       # Brand config
├── types/index.ts            # All TypeScript types
└── data/seed/                # Zanzibar sample data
```

---

## Default Map View

- **Center:** -6.1659, 39.2026 (Zanzibar Archipelago)
- **Zoom:** 11
- **Layers:** Satellite, Flood Risk, Infrastructure, Land Use, Development Zones

---

## License

Proprietary.
