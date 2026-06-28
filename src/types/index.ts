export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoPolygon {
  coordinates: GeoPoint[];
  type: "polygon";
}

export interface GeoFeature {
  id: string;
  type: string;
  geometry: GeoPoint | GeoPolygon | GeoPoint[][];
  properties: Record<string, unknown>;
}

export interface GeoLayer {
  id: string;
  name: string;
  type: "point" | "polygon" | "line" | "heatmap";
  visible: boolean;
  features: GeoFeature[];
}

export interface GeoAnalysisInput {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  layerIds?: string[];
}

export interface GeoAnalysisResult {
  nearbyFeatures: GeoFeature[];
  nearestRoadDistance: number;
  nearestCoastlineDistance: number;
  nearbyBuildingCount: number;
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export type RiskBand = "Low" | "Medium" | "High";
export type OpportunityBand = "Low" | "Medium" | "High" | "Prime";

export interface RiskScore {
  floodRisk: number;
  coastalExposure: number;
  densityPressure: number;
  infrastructureRisk: number;
  overallRisk: number;
  riskBand: RiskBand;
}

export interface OpportunityScore {
  tourismDemand: number;
  infrastructureAccess: number;
  developmentMomentum: number;
  marketLiquidity: number;
  overallOpportunity: number;
  opportunityBand: OpportunityBand;
}

export type RiskTolerance = "conservative" | "balanced" | "opportunistic";
export type TimeHorizon = 2 | 5 | 10;
export type StrategyType = "land_bank" | "villa" | "apartments" | "hotel" | "mixed_use";

export interface InvestorProfile {
  budgetUsd: number;
  riskTolerance: RiskTolerance;
  timeHorizonYears: TimeHorizon;
  preferredStrategy: StrategyType;
}

export interface ZoneRecommendation {
  zoneId: string;
  zoneName: string;
  score: number;
  thesis: string;
  riskFactors: string[];
}

export interface CapitalAllocationRecommendation {
  recommendedZones: ZoneRecommendation[];
  avoidZones: ZoneRecommendation[];
  thesis: string;
  keyRisks: string[];
  nextActions: string[];
}

export interface GrowthScenario {
  name: string;
  description: string;
  assumptions: ScenarioAssumption[];
  affectedZones: string[];
  timeHorizonYears: number;
}

export interface ScenarioAssumption {
  parameter: string;
  value: number;
  description: string;
}

export interface WalkForwardProjection {
  zoneId: string;
  year: number;
  projectedDemandIndex: number;
  projectedPriceIndex: number;
  projectedRiskIndex: number;
  confidence: number;
}

export interface NeighbourhoodProfile {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  tourismScore: number;
  infrastructureScore: number;
  floodSensitivity: number;
  developmentMomentum: number;
  pricePerSqmMin: number;
  pricePerSqmMax: number;
  strategicNote: string;
}

export interface SiteAnalysisFull {
  location: GeoPoint;
  neighbourhood: string | null;
  riskScore: RiskScore;
  opportunityScore: OpportunityScore;
  capitalScore: number;
  suggestedStrategy: string;
  badges: BadgeType[];
  recommendedActions: string[];
  disclaimer: string;
}

export type BadgeType =
  | "Golden Visa Potential"
  | "Eco-Resort Potential"
  | "High Flood Caution"
  | "Land Bank Candidate"
  | "Infrastructure Watch"
  | "Prime Tourism Corridor"
  | "Needs Legal Verification";

export interface ComparableSale {
  id: string;
  title: string;
  location: GeoPoint;
  zone: string;
  distance: number;
  priceUsd: number;
  areaSqm: number;
  pricePerSqm: number;
  propertyType: string;
  relevance: number;
}

export interface ComparableAnalysisResult {
  subjectLocation: GeoPoint;
  subjectZone: string | null;
  comparables: ComparableSale[];
  estimatedValueRange: {
    low: number;
    mid: number;
    high: number;
    confidence: number;
  };
  marketTrend: "appreciating" | "stable" | "declining" | "insufficient_data";
  keyFactors: string[];
}

export type SignalType = "buy" | "sell" | "hold" | "watch";
export type SignalStrength = "strong" | "moderate" | "weak";

export interface MarketSignal {
  type: SignalType;
  strength: SignalStrength;
  zone: string;
  title: string;
  description: string;
  indicators: {
    name: string;
    value: string;
    direction: "up" | "down" | "neutral";
  }[];
  confidence: number;
  generatedAt: string;
}

export interface MarketSignalsResult {
  signals: MarketSignal[];
  overarchingThesis: string;
  marketPhase: "early_growth" | "rapid_growth" | "maturity" | "correction" | "uncertain";
  riskLevel: "low" | "moderate" | "high";
}

export interface MitigationAction {
  priority: "immediate" | "short_term" | "medium_term" | "ongoing";
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  timeline: string;
}

export interface AnomalyMitigationPlan {
  anomalyId: string;
  anomalyTitle: string;
  severity: string;
  category: string;
  aiAssessment: string;
  mitigationActions: MitigationAction[];
  costEstimate: {
    low: number;
    high: number;
    currency: string;
  };
  riskResidual: "low" | "medium" | "high";
}

export type DealStage = "discovery" | "due_diligence" | "negotiation" | "closing" | "won" | "lost";

export interface Deal {
  id: string;
  title: string;
  clientName: string;
  clientAvatar?: string;
  propertyType: string;
  zone: string;
  value: number;
  stage: DealStage;
  priority: "high" | "medium" | "low";
  assignee: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  tags: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: "investor" | "developer" | "buyer" | "partner";
  status: "active" | "lead" | "past";
  totalInvested: number;
  activeDeals: number;
  preferences: {
    budgetMin: number;
    budgetMax: number;
    riskTolerance: RiskTolerance;
    preferredZones: string[];
  };
  createdAt: string;
  lastContact: string;
}

export interface PipelineMetrics {
  totalPipelineValue: number;
  dealCount: number;
  wonDeals: number;
  conversionRate: number;
  avgDealSize: number;
  avgDaysToClose: number;
  stageBreakdown: Record<DealStage, number>;
}

export interface ConciergeState {
  isOpen: boolean;
  currentStep: "welcome" | "discover" | "match" | "review" | "act";
  answers: {
    goal: string | null;
    budget: string | null;
    timeline: string | null;
    experience: string | null;
  };
}

export type LeadSource = "referral" | "website" | "concierge" | "event" | "outreach" | "partner";
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  budget: string;
  interest: string;
  notes: string;
  assignedTo: string;
  lastActivity: string;
  createdAt: string;
  communications: Communication[];
}

export interface Communication {
  id: string;
  type: "email" | "call" | "meeting" | "site_visit" | "whatsapp" | "note";
  subject: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  createdBy: string;
}

export interface Invoice {
  id: string;
  dealId: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  notes: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: "bank_transfer" | "credit_card" | "cash" | "crypto" | "installment";
  status: "pending" | "completed" | "failed" | "refunded";
  date: string;
  reference: string;
  notes: string;
}

export interface POSSession {
  id: string;
  date: string;
  cashier: string;
  status: "open" | "closed";
  openingBalance: number;
  closingBalance: number;
  totalSales: number;
  transactionCount: number;
}

export interface POSTransaction {
  id: string;
  sessionId: string;
  type: "sale" | "deposit" | "fee" | "refund";
  description: string;
  amount: number;
  method: "cash" | "card" | "credit_card" | "bank_transfer" | "transfer" | "crypto" | "installment";
  clientName: string;
  propertyRef: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
  reference: string;
}

export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskCategory = "client" | "deal" | "legal" | "site_visit" | "report" | "admin" | "compliance";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  relatedTo?: { type: "deal" | "client" | "lead"; id: string };
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  estimatedHours: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  activeDeals: number;
  activeTasks: number;
  utilization: number;
  specialties: string[];
}

export interface PropertyInventory {
  id: string;
  title: string;
  zone: string;
  type: "land" | "villa" | "apartment" | "hotel" | "commercial";
  status: "available" | "under_offer" | "sold" | "reserved";
  price: number;
  areaSqm: number;
  pricePerSqm: number;
  features: string[];
  owner: string;
  listedAt: string;
  documents: string[];
}

export interface SalesAnalytics {
  totalRevenue: number;
  revenueTarget: number;
  revenueProgress: number;
  monthlyRevenue: { month: string; amount: number }[];
  dealsByStage: { stage: DealStage; count: number; value: number }[];
  topClients: { name: string; value: number; deals: number }[];
  teamPerformance: { name: string; deals: number; revenue: number; conversion: number }[];
  conversionFunnel: { stage: string; count: number; value: number }[];
  avgDealCycle: number;
  winRate: number;
}

export interface EntryExitSignal {
  zone: string;
  action: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeHorizon: string;
  catalysts: string[];
  risks: string[];
  aiRationale: string;
}

export interface PriceTarget {
  zone: string;
  current: number;
  shortTerm: { price: number; confidence: number; timeframe: string };
  mediumTerm: { price: number; confidence: number; timeframe: string };
  longTerm: { price: number; confidence: number; timeframe: string };
  keyDrivers: string[];
}

export interface RiskRewardProfile {
  zone: string;
  riskScore: number;
  rewardScore: number;
  ratio: number;
  maxDrawdown: number;
  upsidePotential: number;
  recommendedAllocation: number;
  thesis: string;
}

export interface SpeculationBrief {
  zone: string;
  rating: "overweight" | "neutral" | "underweight";
  entryTiming: "immediate" | "wait" | "accumulate";
  priceTargets: PriceTarget;
  riskReward: RiskRewardProfile;
  signals: EntryExitSignal[];
  aiNarrative: string;
  generatedAt: string;
}
