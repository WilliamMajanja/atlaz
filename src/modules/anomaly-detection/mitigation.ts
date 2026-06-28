import { SiteAnalysisFull } from "../../types";
import { MitigationAction, AnomalyMitigationPlan } from "../../types";
import { Anomaly } from "./index";
import { generateMitigationPlan } from "../../lib/ollama";

function generateFallbackMitigation(anomaly: Anomaly): AnomalyMitigationPlan {
  const severityEffortMap: Record<string, { effort: "low" | "medium" | "high"; timeline: string }> = {
    critical: { effort: "high", timeline: "Begin within 1 week, complete within 3 months" },
    high: { effort: "medium", timeline: "Begin within 2 weeks, complete within 6 months" },
    medium: { effort: "low", timeline: "Address within 1-3 months" },
    low: { effort: "low", timeline: "Monitor and address within 6 months" },
  };

  const config = severityEffortMap[anomaly.severity] ?? { effort: "medium" as const, timeline: "Address within 3 months" };

  const baseActions: Record<string, MitigationAction[]> = {
    price: [
      {
        priority: "immediate",
        title: "Commission Independent Valuation",
        description: "Engage a certified Zanzibar valuer to provide an independent market assessment of the property.",
        effort: "low",
        impact: "high",
        timeline: "1-2 weeks",
      },
      {
        priority: "short_term",
        title: "Analyze Recent Comparables",
        description: "Review all comparable sales within 2km radius transacted in the last 6 months.",
        effort: "medium",
        impact: "high",
        timeline: "2-4 weeks",
      },
      {
        priority: "medium_term",
        title: "Price Negotiation Framework",
        description: "Develop a negotiation strategy based on valuation gap analysis with 15-25% buffer.",
        effort: "low",
        impact: "medium",
        timeline: "Before offer submission",
      },
    ],
    risk: [
      {
        priority: "immediate",
        title: "Full Environmental Impact Assessment",
        description: "Commission a comprehensive EIA from a qualified Zanzibar environmental consultant.",
        effort: "high",
        impact: "high",
        timeline: "4-8 weeks",
      },
      {
        priority: "short_term",
        title: "Flood Mitigation Design Review",
        description: "Engage structural engineer to design elevated foundations, drainage systems, and flood barriers.",
        effort: "medium",
        impact: "high",
        timeline: "3-6 weeks",
      },
      {
        priority: "medium_term",
        title: "Insurance Risk Assessment",
        description: "Obtain quotes from multiple insurers for flood and climate risk coverage. Evaluate premiums vs. risk.",
        effort: "low",
        impact: "medium",
        timeline: "2-4 weeks",
      },
    ],
    score: [
      {
        priority: "short_term",
        title: "Multi-Source Data Cross-Reference",
        description: "Validate scoring assumptions against ZANSIS, ZanSDI, and field survey data.",
        effort: "medium",
        impact: "high",
        timeline: "3-6 weeks",
      },
      {
        priority: "medium_term",
        title: "Scenario Sensitivity Analysis",
        description: "Run best-case, base-case, and worst-case scenarios adjusting key scoring variables.",
        effort: "medium",
        impact: "medium",
        timeline: "2-4 weeks",
      },
    ],
    geographic: [
      {
        priority: "immediate",
        title: "Site Visit & Physical Inspection",
        description: "Conduct an in-person site visit to verify geographic characteristics and micro-location factors.",
        effort: "low",
        impact: "high",
        timeline: "1-2 weeks",
      },
      {
        priority: "short_term",
        title: "GPS Survey & Boundary Verification",
        description: "Commission a licensed surveyor to verify plot boundaries, elevation, and access points.",
        effort: "medium",
        impact: "high",
        timeline: "2-4 weeks",
      },
    ],
    environmental: [
      {
        priority: "immediate",
        title: "Historical Climate Data Review",
        description: "Analyze 10-year historical flood, storm surge, and rainfall data for the specific location.",
        effort: "low",
        impact: "high",
        timeline: "1-2 weeks",
      },
      {
        priority: "short_term",
        title: "Ecosystem & Biodiversity Survey",
        description: "Engage marine/coastal ecologist to assess impact on mangroves, coral reefs, or seagrass beds.",
        effort: "high",
        impact: "medium",
        timeline: "4-8 weeks",
      },
      {
        priority: "medium_term",
        title: "Climate Adaptation Plan",
        description: "Develop comprehensive climate adaptation strategy including elevated construction, water management, and renewable energy.",
        effort: "high",
        impact: "high",
        timeline: "2-3 months",
      },
    ],
    data: [
      {
        priority: "short_term",
        title: "Data Source Audit",
        description: "Audit all data sources feeding into the analysis. Flag stale, conflicting, or low-confidence data points.",
        effort: "low",
        impact: "high",
        timeline: "1-2 weeks",
      },
      {
        priority: "medium_term",
        title: "Supplementary Data Collection",
        description: "Commission field surveys or purchase additional data to fill identified gaps in coverage.",
        effort: "medium",
        impact: "medium",
        timeline: "4-8 weeks",
      },
    ],
  };

  const categoryActions = anomaly.category === "environmental" ? baseActions.environmental :
    anomaly.category === "price" ? baseActions.price :
    anomaly.category === "risk" ? baseActions.risk :
    anomaly.category === "score" ? baseActions.score :
    anomaly.category === "geographic" ? baseActions.geographic :
    baseActions.data;

  return {
    anomalyId: anomaly.id,
    anomalyTitle: anomaly.title,
    severity: anomaly.severity,
    category: anomaly.category,
    aiAssessment: `This anomaly indicates a ${anomaly.severity}-severity ${anomaly.category} issue: ${anomaly.description}. ${anomaly.recommendation}`,
    mitigationActions: categoryActions.map((a, i) => ({
      ...a,
      priority: i === 0 ? "immediate" : i === 1 ? "short_term" : "medium_term",
    })),
    costEstimate: {
      low: anomaly.severity === "critical" ? 15000 : anomaly.severity === "high" ? 8000 : 3000,
      high: anomaly.severity === "critical" ? 50000 : anomaly.severity === "high" ? 25000 : 10000,
      currency: "USD",
    },
    riskResidual: anomaly.severity === "critical" ? "high" : anomaly.severity === "high" ? "medium" : "low",
  };
}

export async function generateAnomalyMitigation(
  analysis: SiteAnalysisFull,
  anomalies: Anomaly[]
): Promise<AnomalyMitigationPlan[]> {
  const plans: AnomalyMitigationPlan[] = [];

  for (const anomaly of anomalies) {
    try {
      const aiPlan = await generateMitigationPlan(analysis, anomaly);
      plans.push(aiPlan);
    } catch {
      plans.push(generateFallbackMitigation(anomaly));
    }
  }

  return plans.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity as keyof typeof order] ?? 99) - (order[b.severity as keyof typeof order] ?? 99);
  });
}

export function generateLocalMitigation(
  anomalies: Anomaly[]
): AnomalyMitigationPlan[] {
  return anomalies.map((a) => generateFallbackMitigation(a)).sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity as keyof typeof order] ?? 99) - (order[b.severity as keyof typeof order] ?? 99);
  });
}
