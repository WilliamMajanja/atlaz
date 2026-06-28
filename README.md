# Atlaz — Land Intelligence & Business Operations

Capital allocation intelligence for frontier real estate markets. Zanzibar serves as the initial geography, with an architecture designed for global expansion.

Atlaz combines interactive GIS mapping, AI-powered analysis, deal pipeline management, CRM, point-of-sale, ERP, and speculation intelligence into a single platform for investors, developers, and land professionals operating in complex frontier markets.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [License](#license)

---

## Features

### Geospatial Intelligence
- **Interactive Map** — Multi-layer Leaflet-based map with satellite imagery, flood risk zones, infrastructure assets, land use classifications, and development area boundaries
- **Plot Intelligence** — Algorithmic risk, opportunity, and capital scoring on a 0–10 scale per plot, derived from proximity analysis, zoning data, and market signals
- **Anomaly Detection** — Automated identification of price spikes, rapid construction activity, legal flags, and other irregularities, with generated mitigation plans
- **Growth Simulation** — Walk-forward scenario modelling with configurable parameters (infrastructure investment, GDP projections, visa policy changes, tourism growth)

### Business Operations
- **CRM** — Lead management pipeline with seven status stages, configurable lead scoring (0–100), multi-attribute filtering, and activity tracking
- **Deal Pipeline** — Kanban board across five stages: Discovery, Qualification, Proposal, Negotiation, and Closed Won/Lost
- **Point of Sale** — Transaction ledger with invoice generation, payment tracking, and status management (Draft, Sent, Paid, Overdue, Cancelled)
- **ERP** — Task management with priority-status matrix, team utilisation tracking, and property inventory management

### AI & Decision Support
- **AI Concierge** — Guided conversational interface that adapts recommendations based on user goals (invest, develop, reside, explore) through a structured discovery workflow
- **Speculation Engine** — Zone-level entry and exit signals, price targets, risk-reward profiles, and AI-generated speculation briefs
- **Sales Analytics** — Pipeline distribution charts, conversion funnels, win-rate metrics, and client performance dashboards

---

## Architecture

The application follows a client-heavy architecture with server-side API routes for data processing and AI inference.

```
┌─────────────────────────────────────────────────┐
│                  Next.js 16 App                  │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Map View │  │Dashboard │  │ Analysis      │  │
│  │  (Leaflet)│  │(6 Tabs)  │  │ / Reports     │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│         │            │               │           │
│  ┌──────┴────────────┴───────────────┴──────┐   │
│  │          Zustand Stores (Client)          │   │
│  │  Map  Analysis  Pipeline  CRM  POS  ERP   │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                            │
│  ┌──────────────────┴───────────────────────┐   │
│  │           API Routes (Server)             │   │
│  │  Analysis  /  Simulation  /  Speculation  │   │
│  │  Anomaly Detection  /  Mitigation         │   │
│  └──────────────────┬───────────────────────┘   │
│                     │                            │
│  ┌──────────────────┴───────────────────────┐   │
│  │         Ollama (Optional, Local)          │   │
│  │     Speculation brief generation          │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

- **State Management**: All client state is managed via Zustand stores. The demo operates entirely in-memory with pre-seeded sample data — no database connection required.
- **AI Inference**: Speculation briefs and anomaly analysis optionally use a local Ollama instance. When unavailable, the system falls back to deterministic local generation with identical output structure.
- **Mapping**: Rendered client-side using Leaflet with configurable tile layers (satellite, OpenStreetMap) and GeoJSON overlay sources.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 |
| Mapping | Leaflet, react-leaflet |
| Database ORM | Prisma 6 (SQLite, optional) |
| AI | Ollama (local inference, optional) |
| Linting | ESLint 9 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/WilliamMajanja/atlaz.git
cd atlaz
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The application loads with pre-seeded sample data covering all ten Zanzibar zones (Stone Town, Paje, Nungwi, Fumba, Kendwa, Matemwe, Jambiani, Bwejuu, Kiwengwa, Michamvi).

### Production Build

```bash
npm run build
npm start
```

### Environment Configuration

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env.local
```

Key configuration options:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | No | Application name (default: Atlaz) |
| `NEXT_PUBLIC_APP_URL` | No | Public deployment URL |
| `OLLAMA_ENDPOINT` | No | Ollama server URL (default: http://localhost:11434) |
| `OLLAMA_MODEL` | No | Ollama model name (default: llama3.2) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox access token for satellite tiles |

No database setup or environment configuration is required for the demo — the application works immediately after `npm install && npm run dev`.

### Optional: Local AI Inference

```bash
# Install Ollama (https://ollama.com)
ollama pull llama3.2
```

The application auto-detects Ollama at the default endpoint. If unavailable, all AI features degrade gracefully using local generation.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout with dark theme
│   ├── dashboard/page.tsx         # Main dashboard (6-tab interface)
│   ├── analysis/page.tsx          # Plot intelligence & anomaly detection
│   ├── simulation/page.tsx        # Growth scenario modelling
│   ├── reports/page.tsx           # Due diligence report generation
│   ├── admin/page.tsx             # Data catalogue browser
│   └── api/                       # Server-side API routes
│       ├── analysis/route.ts
│       ├── anomaly-detection/route.ts
│       ├── cumulative-assessment/route.ts
│       ├── mitigation/route.ts
│       ├── signals/route.ts
│       ├── simulations/route.ts
│       ├── sites/route.ts
│       ├── speculation/route.ts
│       └── valuation/comparables/route.ts
├── components/
│   ├── dashboard/
│   │   ├── Concierge.tsx          # AI Concierge interface
│   │   ├── CRMModule.tsx          # Lead management
│   │   ├── POSModule.tsx          # Point-of-sale & invoices
│   │   ├── ERPModule.tsx          # Tasks, team, inventory
│   │   ├── DealPipeline.tsx       # Kanban pipeline
│   │   ├── BusinessMetrics.tsx    # KPI summary cards
│   │   ├── SalesAnalytics.tsx     # Charts and funnel
│   │   └── EnhancedSpeculation.tsx # Speculation briefs
│   ├── analysis/                  # Analysis page components
│   ├── map/                       # Map and layer controls
│   └── ui/                        # Shared UI primitives
├── lib/
│   ├── store.ts                   # Zustand state stores
│   ├── config/index.ts            # Application configuration
│   ├── ollama/index.ts            # Ollama client
│   ├── scoring/index.ts           # Scoring algorithms
│   └── validation.ts              # Input validation
├── modules/
│   ├── anomaly-detection/         # Anomaly detection & mitigation
│   ├── simulation/                # Growth simulation engine
│   ├── valuation/                 # Property valuation
│   ├── signals/                   # Market signal detection
│   └── reports/                   # Report generation
├── types/
│   ├── index.ts                   # Core type definitions
│   └── opendata.ts                # Open data type definitions
└── data/seed/                     # Zanzibar sample data
    ├── zanzibar.ts
    └── opendata.ts
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | List all mapped sites with scores |
| POST | `/api/analysis` | Run plot intelligence analysis |
| POST | `/api/anomaly-detection` | Detect anomalies for a site |
| POST | `/api/mitigation` | Generate mitigation plans |
| POST | `/api/cumulative-assessment` | Run cumulative zone assessment |
| POST | `/api/simulations` | Run growth scenario simulation |
| POST | `/api/signals` | Get market signals |
| POST | `/api/speculation` | Generate speculation brief (AI or local) |
| GET | `/api/valuation/comparables` | Get comparable property valuations |

---

## Configuration

### Map Defaults

| Parameter | Value |
|-----------|-------|
| Centre | -6.1659, 39.2026 (Zanzibar Archipelago) |
| Zoom | 11 |
| Layers | Satellite, Flood Risk, Infrastructure, Land Use, Development Zones |

### Sample Data Coverage

The seed dataset covers ten zones across Unguja and Pemba islands with property listings, infrastructure assets, neighbourhood profiles, development zones, market signals, and open data references.

---

## License

Proprietary. All rights reserved.
