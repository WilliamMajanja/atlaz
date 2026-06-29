import { create } from "zustand";
import { GeoPoint, SiteAnalysisFull, GrowthScenario, WalkForwardProjection, Deal, DealStage, PipelineMetrics, Lead, LeadStatus, TaskStatus, Communication, Invoice, Payment, POSTransaction, Task, TeamMember, PropertyInventory, SalesAnalytics, SpeculationBrief } from "../types";

interface MapState {
  center: GeoPoint;
  zoom: number;
  activeLayers: string[];
  selectedPoint: GeoPoint | null;

  setCenter: (center: GeoPoint) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layerId: string) => void;
  setSelectedPoint: (point: GeoPoint | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { latitude: -6.1659, longitude: 39.2026 },
  zoom: 11,
  activeLayers: ["coastal-zones", "development-zones", "listings", "satellite"],
  selectedPoint: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layerId)
        ? state.activeLayers.filter((l) => l !== layerId)
        : [...state.activeLayers, layerId],
    })),
  setSelectedPoint: (point) => set({ selectedPoint: point }),
}));

interface AnalysisState {
  currentAnalysis: SiteAnalysisFull | null;
  savedAnalyses: SiteAnalysisFull[];
  isAnalyzing: boolean;

  setCurrentAnalysis: (analysis: SiteAnalysisFull | null) => void;
  saveAnalysis: (analysis: SiteAnalysisFull) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  savedAnalyses: [],
  isAnalyzing: false,

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  saveAnalysis: (analysis) =>
    set((state) => ({
      savedAnalyses: [...state.savedAnalyses, analysis],
      currentAnalysis: analysis,
    })),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));

interface SimulationState {
  selectedScenario: GrowthScenario | null;
  projections: WalkForwardProjection[];
  isRunning: boolean;

  setSelectedScenario: (scenario: GrowthScenario | null) => void;
  setProjections: (projections: WalkForwardProjection[]) => void;
  setIsRunning: (running: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  selectedScenario: null,
  projections: [],
  isRunning: false,

  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setProjections: (projections) => set({ projections }),
  setIsRunning: (running) => set({ isRunning: running }),
}));

interface PipelineState {
  deals: Deal[];
  metrics: PipelineMetrics;
  stageFilter: DealStage | "all";
  addDeal: (deal: Deal) => void;
  moveDeal: (dealId: string, toStage: DealStage) => void;
  removeDeal: (dealId: string) => void;
  setStageFilter: (stage: DealStage | "all") => void;
}

const mockDeals: Deal[] = [
  { id: "d1", title: "Paje Beachfront Resort", clientName: "James Mwangi", propertyType: "Resort", zone: "Paje", value: 2500000, stage: "negotiation", priority: "high", assignee: "Sarah K.", createdAt: "2026-05-10", updatedAt: "2026-06-27", notes: "Client visiting next week for site inspection", tags: ["beachfront", "eco-resort"] },
  { id: "d2", title: "Stone Town Heritage Villa", clientName: "Emma Watson", propertyType: "Villa", zone: "Stone Town", value: 850000, stage: "due_diligence", priority: "high", assignee: "Sarah K.", createdAt: "2026-05-22", updatedAt: "2026-06-25", notes: "Legal verification in progress", tags: ["heritage", "premium"] },
  { id: "d3", title: "Nungwi Boutique Hotel", clientName: "Omar Hassan", propertyType: "Hotel", zone: "Nungwi", value: 1800000, stage: "discovery", priority: "medium", assignee: "John D.", createdAt: "2026-06-15", updatedAt: "2026-06-26", notes: "Initial site research completed", tags: ["tourism", "coastal"] },
  { id: "d4", title: "Fumba Eco-Community", clientName: "Green Development Ltd", propertyType: "Mixed Use", zone: "Fumba", value: 4200000, stage: "discovery", priority: "medium", assignee: "John D.", createdAt: "2026-06-01", updatedAt: "2026-06-24", notes: "Exploring partnership model", tags: ["eco", "community"] },
  { id: "d5", title: "Kendwa Luxury Villa Plot", clientName: "Anna Petrova", propertyType: "Villa", zone: "Kendwa", value: 520000, stage: "closing", priority: "high", assignee: "Sarah K.", createdAt: "2026-04-10", updatedAt: "2026-06-28", notes: "Closing scheduled for July 5th", tags: ["luxury", "beachfront"] },
  { id: "d6", title: "Michamvi Resort Expansion", clientName: "Blue Ocean Hospitality", propertyType: "Resort", zone: "Michamvi", value: 3100000, stage: "negotiation", priority: "low", assignee: "John D.", createdAt: "2026-05-05", updatedAt: "2026-06-20", notes: "Awaiting revised proposal", tags: ["expansion", "resort"] },
  { id: "d7", title: "Jambiani Land Parcel", clientName: "Carlos Ruiz", propertyType: "Land", zone: "Jambiani", value: 180000, stage: "due_diligence", priority: "medium", assignee: "Sarah K.", createdAt: "2026-06-10", updatedAt: "2026-06-28", notes: "Survey completed, awaiting title search", tags: ["land", "investment"] },
  { id: "d8", title: "Matemwe Eco-Lodge Site", clientName: "Eco Retreats Inc.", propertyType: "Land", zone: "Matemwe", value: 950000, stage: "discovery", priority: "low", assignee: "John D.", createdAt: "2026-06-20", updatedAt: "2026-06-26", notes: "Initial analysis report shared", tags: ["eco", "lodge"] },
];

function calculateMetrics(deals: Deal[]): PipelineMetrics {
  const won = deals.filter(d => d.stage === "won");
  const total = deals.length;
  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const stageBreakdown = { discovery: 0, due_diligence: 0, negotiation: 0, closing: 0, won: 0, lost: 0 } as Record<DealStage, number>;
  deals.forEach(d => { stageBreakdown[d.stage]++; });
  return {
    totalPipelineValue: totalValue,
    dealCount: total,
    wonDeals: won.length,
    conversionRate: total > 0 ? Math.round((won.length / total) * 100) : 0,
    avgDealSize: total > 0 ? Math.round(totalValue / total) : 0,
    avgDaysToClose: 45,
    stageBreakdown,
  };
}

export const usePipelineStore = create<PipelineState>((set) => ({
  deals: mockDeals,
  metrics: calculateMetrics(mockDeals),
  stageFilter: "all",
  addDeal: (deal) =>
    set((state) => {
      const deals = [...state.deals, deal];
      return { deals, metrics: calculateMetrics(deals) };
    }),
  moveDeal: (dealId, toStage) =>
    set((state) => {
      const deals = state.deals.map((d) =>
        d.id === dealId ? { ...d, stage: toStage, updatedAt: new Date().toISOString().split("T")[0] } : d
      );
      return { deals, metrics: calculateMetrics(deals) };
    }),
  removeDeal: (dealId) =>
    set((state) => {
      const deals = state.deals.filter((d) => d.id !== dealId);
      return { deals, metrics: calculateMetrics(deals) };
    }),
  setStageFilter: (stage) => set({ stageFilter: stage }),
}));

interface ConciergeStateType {
  isOpen: boolean;
  currentStep: "welcome" | "discover" | "match" | "review" | "act";
  answers: { goal: string | null; budget: string | null; timeline: string | null; experience: string | null };
  toggleConcierge: () => void;
  setStep: (step: ConciergeStateType["currentStep"]) => void;
  setAnswer: (key: string, value: string) => void;
  reset: () => void;
}

export const useConciergeStore = create<ConciergeStateType>((set) => ({
  isOpen: false,
  currentStep: "welcome",
  answers: { goal: null, budget: null, timeline: null, experience: null },
  toggleConcierge: () => set((s) => ({ isOpen: !s.isOpen, currentStep: s.isOpen ? "welcome" : s.currentStep })),
  setStep: (step) => set({ currentStep: step }),
  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),
  reset: () => set({ isOpen: false, currentStep: "welcome", answers: { goal: null, budget: null, timeline: null, experience: null } }),
}));

const mockLeads: Lead[] = [
  { id: "l1", name: "Richard Branson", email: "richard@virgin.com", phone: "+44 7700 900123", company: "Virgin Group", source: "referral", status: "negotiation", score: 95, budget: "$5M+", interest: "Eco-resort development", notes: "VIP client, direct referral from Ministry of Tourism", assignedTo: "Sarah K.", lastActivity: "2026-06-28", createdAt: "2026-05-01", communications: [] },
  { id: "l2", name: "Sophie Laurent", email: "sophie@luxuryretreats.co.za", phone: "+27 82 555 0101", company: "Luxury Retreats Africa", source: "website", status: "qualified", score: 78, budget: "$2M-$5M", interest: "Boutique hotel in Nungwi", notes: "Submitted inquiry via concierge. Looking for 15+ room property.", assignedTo: "Sarah K.", lastActivity: "2026-06-25", createdAt: "2026-06-10", communications: [] },
  { id: "l3", name: "Ahmed Al Mansouri", email: "ahmed@almanar.ae", phone: "+971 50 123 4567", company: "Al Manar Investments", source: "partner", status: "proposal", score: 85, budget: "$2M-$5M", interest: "Mixed-use development in Fumba", notes: "Interested in Fumba master plan. Requested full feasibility study.", assignedTo: "John D.", lastActivity: "2026-06-27", createdAt: "2026-05-20", communications: [] },
  { id: "l4", name: "Maria Santos", email: "maria@ecoventures.com", phone: "+1 305 555 7890", company: "EcoVentures Inc.", source: "event", status: "contacted", score: 62, budget: "$500K-$2M", interest: "Land banking in Michamvi", notes: "Met at Africa Real Estate Forum. Followed up via email.", assignedTo: "John D.", lastActivity: "2026-06-22", createdAt: "2026-06-15", communications: [] },
  { id: "l5", name: "Kenji Tanaka", email: "kenji@tokyoproperty.jp", phone: "+81 90 1234 5678", company: "Tokyo Property Group", source: "outreach", status: "new", score: 45, budget: "$500K-$2M", interest: "Villa investment in Paje", notes: "Cold outreach. Sent market overview.", assignedTo: "Sarah K.", lastActivity: "2026-06-20", createdAt: "2026-06-18", communications: [] },
];

interface CRMState {
  leads: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  addCommunication: (leadId: string, comm: Communication) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLeadScore: (leadId: string, score: number) => void;
}

export const useCRMStore = create<CRMState>((set) => ({
  leads: mockLeads,
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  addCommunication: (leadId, comm) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId
          ? { ...l, communications: [...l.communications, comm], lastActivity: comm.timestamp }
          : l
      ),
    })),
  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
    })),
  updateLeadScore: (leadId, score) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === leadId ? { ...l, score } : l)),
    })),
}));

const mockInvoices: Invoice[] = [
  { id: "inv-001", dealId: "d5", clientId: "c1", clientName: "Anna Petrova", amount: 520000, currency: "USD", status: "sent", issueDate: "2026-06-20", dueDate: "2026-07-20", items: [{ description: "Kendwa Luxury Villa Plot", quantity: 1, unitPrice: 520000, total: 520000 }], notes: "Full payment due on closing" },
  { id: "inv-002", dealId: "d2", clientId: "c2", clientName: "Emma Watson", amount: 85000, currency: "USD", status: "paid", issueDate: "2026-06-01", dueDate: "2026-06-15", paidDate: "2026-06-12", items: [{ description: "Due Diligence Fee - Stone Town Villa", quantity: 1, unitPrice: 85000, total: 85000 }], notes: "Deposit for legal verification" },
  { id: "inv-003", dealId: "d1", clientId: "c3", clientName: "James Mwangi", amount: 250000, currency: "USD", status: "draft", issueDate: "2026-06-25", dueDate: "2026-07-25", items: [{ description: "Reservation Fee - Paje Beachfront", quantity: 1, unitPrice: 250000, total: 250000 }], notes: "10% reservation fee" },
];

const mockTransactions: POSTransaction[] = [
  { id: "pos-001", sessionId: "s1", type: "sale", description: "Kendwa Villa Plot - Full Payment", amount: 520000, method: "bank_transfer", clientName: "Anna Petrova", propertyRef: "KND-001", date: "2026-06-28", status: "completed", reference: "WIRE-2026-06-28-001" },
  { id: "pos-002", sessionId: "s1", type: "deposit", description: "Due Diligence Fee - Stone Town", amount: 85000, method: "credit_card", clientName: "Emma Watson", propertyRef: "STN-001", date: "2026-06-12", status: "completed", reference: "CC-2026-06-12-002" },
  { id: "pos-003", sessionId: "s1", type: "fee", description: "Consulting Fee - Market Analysis", amount: 15000, method: "transfer", clientName: "Al Manar Investments", propertyRef: "ADM-001", date: "2026-06-25", status: "completed", reference: "INV-2026-06-25-003" },
];

interface POSState {
  transactions: POSTransaction[];
  invoices: Invoice[];
  addTransaction: (tx: POSTransaction) => void;
  addInvoice: (inv: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
}

export const usePOSStore = create<POSState>((set) => ({
  transactions: mockTransactions,
  invoices: mockInvoices,
  addTransaction: (tx) => set((s) => ({ transactions: [...s.transactions, tx] })),
  addInvoice: (inv) => set((s) => ({ invoices: [...s.invoices, inv] })),
  updateInvoiceStatus: (id, status) =>
    set((s) => ({
      invoices: s.invoices.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
}));

const mockTasks: Task[] = [
  { id: "t1", title: "Site inspection - Paje Resort", description: "Coordinate with client and surveyor for Paje beachfront inspection", category: "site_visit", priority: "urgent", status: "in_progress", assignedTo: "Sarah K.", dueDate: "2026-07-02", createdAt: "2026-06-25", estimatedHours: 6 },
  { id: "t2", title: "Title search - Stone Town Villa", description: "Submit documents to COLA for title verification", category: "legal", priority: "high", status: "in_progress", assignedTo: "Sarah K.", dueDate: "2026-07-05", createdAt: "2026-06-20", estimatedHours: 8 },
  { id: "t3", title: "Feasibility report - Fumba", description: "Complete feasibility study for Al Manar Investments", category: "report", priority: "high", status: "todo", assignedTo: "John D.", dueDate: "2026-07-10", createdAt: "2026-06-22", estimatedHours: 16 },
  { id: "t4", title: "Client meeting - EcoVentures", description: "Virtual meeting to discuss Michamvi land banking strategy", category: "client", priority: "medium", status: "todo", assignedTo: "John D.", dueDate: "2026-07-03", createdAt: "2026-06-28", estimatedHours: 2 },
  { id: "t5", title: "Kendwa closing documents", description: "Prepare all closing documents for Anna Petrova transaction", category: "deal", priority: "urgent", status: "review", assignedTo: "Sarah K.", dueDate: "2026-07-01", createdAt: "2026-06-15", estimatedHours: 10 },
];

const mockTeam: TeamMember[] = [
  { id: "tm1", name: "Sarah K.", role: "Senior Advisor", email: "sarah@atlaz.co.tz", phone: "+255 777 123 456", activeDeals: 4, activeTasks: 3, utilization: 85, specialties: ["luxury", "legal", "eco-resort"] },
  { id: "tm2", name: "John D.", role: "Investment Analyst", email: "john@atlaz.co.tz", phone: "+255 777 789 012", activeDeals: 3, activeTasks: 2, utilization: 70, specialties: ["analysis", "feasibility", "valuation"] },
  { id: "tm3", name: "Aisha M.", role: "Client Relations", email: "aisha@atlaz.co.tz", phone: "+255 777 345 678", activeDeals: 5, activeTasks: 4, utilization: 90, specialties: ["crm", "client-care", "logistics"] },
];

const mockInventory: PropertyInventory[] = [
  { id: "pinv-1", title: "Paje Beachfront Plot A", zone: "Paje", type: "land", status: "available", price: 2500000, areaSqm: 5000, pricePerSqm: 500, features: ["beachfront", "road access", "utilities"], owner: "Private", listedAt: "2026-01-15", documents: ["title_deed", "survey"] },
  { id: "pinv-2", title: "Stone Town Heritage Villa", zone: "Stone Town", type: "villa", status: "under_offer", price: 850000, areaSqm: 400, pricePerSqm: 2125, features: ["heritage", "renovated", "courtyard"], owner: "Estate of A. Salim", listedAt: "2026-03-01", documents: ["title_deed", "renovation_permit"] },
  { id: "pinv-3", title: "Fumba Townhouse Lot 7", zone: "Fumba", type: "land", status: "available", price: 120000, areaSqm: 300, pricePerSqm: 400, features: ["master plan", "utilities", "road access"], owner: "Fumba Development Ltd", listedAt: "2026-04-10", documents: ["master_plan", "title_deed"] },
];

interface ERPState {
  tasks: Task[];
  team: TeamMember[];
  inventory: PropertyInventory[];
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateInventoryStatus: (id: string, status: PropertyInventory["status"]) => void;
}

export const useERPStore = create<ERPState>((set) => ({
  tasks: mockTasks,
  team: mockTeam,
  inventory: mockInventory,
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTaskStatus: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status, completedAt: status === "done" ? new Date().toISOString() : t.completedAt } : t)),
    })),
  updateInventoryStatus: (id, status) =>
    set((s) => ({
      inventory: s.inventory.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
}));

interface SpeculationState {
  briefs: SpeculationBrief[];
  selectedZone: string | null;
  isGenerating: boolean;
  setSelectedZone: (zone: string | null) => void;
  setIsGenerating: (g: boolean) => void;
  addBrief: (brief: SpeculationBrief) => void;
}

export const useSpeculationStore = create<SpeculationState>((set) => ({
  briefs: [],
  selectedZone: null,
  isGenerating: false,
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setIsGenerating: (g) => set({ isGenerating: g }),
  addBrief: (brief) => set((s) => ({ briefs: [...s.briefs, brief] })),
}));
