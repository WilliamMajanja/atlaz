import { SiteAnalysisFull, GeoPoint } from "../../types";
import { neighbourhoods, sampleListings } from "../../data/seed/zanzibar";
import { haversineDistance } from "../../lib/distance";

export type AnomalySeverity = "low" | "medium" | "high" | "critical";
export type AnomalyCategory = "price" | "risk" | "score" | "geographic" | "data" | "environmental";

export interface Anomaly {
  id: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  title: string;
  description: string;
  location?: GeoPoint;
  zone?: string;
  metric?: string;
  expected?: string;
  actual?: string;
  recommendation: string;
  detectedAt: string;
}

interface StatisticalStats {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
}

function calculateStats(values: number[]): StatisticalStats {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  return { mean, stdDev, min: sorted[0], max: sorted[sorted.length - 1], q1, q3, iqr };
}

function isStatisticalOutlier(value: number, stats: StatisticalStats, multiplier: number = 1.5): boolean {
  return value < stats.q1 - multiplier * stats.iqr || value > stats.q3 + multiplier * stats.iqr;
}

function generateAnomalyId(category: string): string {
  return `anomaly-${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function detectPriceAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const neighbourhood = analysis.neighbourhood;
  
  if (!neighbourhood) return anomalies;

  const zone = neighbourhoods.find((n) => n.name === neighbourhood);
  if (!zone) return anomalies;

  const zoneListings = sampleListings.filter((l) => {
    const dist = haversineDistance(
      { latitude: l.latitude, longitude: l.longitude },
      { latitude: zone.latitude, longitude: zone.longitude }
    );
    return dist < 5000;
  });

  if (zoneListings.length === 0) return anomalies;

  const pricesPerSqm = zoneListings
    .filter((l) => l.priceUsd && l.areaSqm)
    .map((l) => l.priceUsd! / l.areaSqm!);

  if (pricesPerSqm.length < 2) return anomalies;

  const stats = calculateStats(pricesPerSqm);
  const zoneAvgPricePerSqm = (zone.pricePerSqmMin + zone.pricePerSqmMax) / 2;

  if (Math.abs(stats.mean - zoneAvgPricePerSqm) / zoneAvgPricePerSqm > 0.3) {
    anomalies.push({
      id: generateAnomalyId("price"),
      category: "price",
      severity: "medium",
      title: "Zone Price Deviation",
      description: `Average price per sqm in ${neighbourhood} ($${stats.mean.toFixed(0)}/sqm) deviates significantly from zone profile ($${zoneAvgPricePerSqm.toFixed(0)}/sqm).`,
      location: analysis.location,
      zone: neighbourhood,
      metric: "Price per sqm",
      expected: `$${zone.pricePerSqmMin}-${zone.pricePerSqmMax}/sqm`,
      actual: `$${stats.mean.toFixed(0)}/sqm`,
      recommendation: "Verify current market conditions and recent comparable sales before relying on zone-level pricing.",
      detectedAt: new Date().toISOString(),
    });
  }

  for (const listing of zoneListings) {
    if (listing.priceUsd && listing.areaSqm) {
      const pricePerSqm = listing.priceUsd / listing.areaSqm;
      if (isStatisticalOutlier(pricePerSqm, stats, 2.0)) {
        anomalies.push({
          id: generateAnomalyId("price"),
          category: "price",
          severity: pricePerSqm > stats.q3 + 2 * stats.iqr ? "high" : "medium",
          title: "Outlier Listing Price",
          description: `"${listing.title}" has an unusual price per sqm ($${pricePerSqm.toFixed(0)}) compared to similar listings in the area.`,
          location: { latitude: listing.latitude, longitude: listing.longitude },
          zone: neighbourhood,
          metric: "Listing price per sqm",
          expected: `$${stats.q1.toFixed(0)}-${stats.q3.toFixed(0)}/sqm (interquartile range)`,
          actual: `$${pricePerSqm.toFixed(0)}/sqm`,
          recommendation: pricePerSqm > stats.mean
            ? "Verify premium features, title status, or development potential justifying the premium."
            : "Investigate potential title issues, encumbrances, or distress factors.",
          detectedAt: new Date().toISOString(),
        });
      }
    }
  }

  return anomalies;
}

function detectRiskAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const { riskScore } = analysis;

  if (riskScore.overallRisk > 75) {
    anomalies.push({
      id: generateAnomalyId("risk"),
      category: "risk",
      severity: "critical",
      title: "Extreme Risk Level",
      description: `Overall risk score of ${riskScore.overallRisk}/100 indicates critical risk factors that may make this location unsuitable for standard development.`,
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Overall Risk",
      expected: "< 60/100 for standard development",
      actual: `${riskScore.overallRisk}/100`,
      recommendation: "Commission a full environmental impact assessment and structural survey before any investment decision.",
      detectedAt: new Date().toISOString(),
    });
  }

  if (riskScore.floodRisk > 70 && riskScore.coastalExposure > 60) {
    anomalies.push({
      id: generateAnomalyId("environmental"),
      category: "environmental",
      severity: "high",
      title: "Compound Flood-Coastal Risk",
      description: "Location faces both high flood risk and high coastal exposure, creating compound environmental hazards.",
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Flood Risk + Coastal Exposure",
      expected: "At least one below 50",
      actual: `Flood: ${riskScore.floodRisk}, Coastal: ${riskScore.coastalExposure}`,
      recommendation: "Evaluate climate resilience measures, elevated construction, and insurance availability. Consider retreat from coastal zone.",
      detectedAt: new Date().toISOString(),
    });
  }

  if (riskScore.densityPressure > 80 && riskScore.infrastructureRisk > 60) {
    anomalies.push({
      id: generateAnomalyId("data"),
      category: "data",
      severity: "medium",
      title: "Infrastructure-Density Mismatch",
      description: "High density pressure combined with poor infrastructure suggests potential overdevelopment without adequate services.",
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Density vs Infrastructure",
      expected: "Balanced ratio",
      actual: `Density: ${riskScore.densityPressure}, Infrastructure Risk: ${riskScore.infrastructureRisk}`,
      recommendation: "Assess utility capacity, road access, and municipal service levels before development approval.",
      detectedAt: new Date().toISOString(),
    });
  }

  return anomalies;
}

function detectScoreAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const { opportunityScore, riskScore, capitalScore } = analysis;

  const scoreDifference = Math.abs(opportunityScore.overallOpportunity - riskScore.overallRisk);
  
  if (scoreDifference > 40) {
    anomalies.push({
      id: generateAnomalyId("score"),
      category: "score",
      severity: "medium",
      title: "Risk-Opportunity Divergence",
      description: `Significant gap between opportunity (${opportunityScore.overallOpportunity}) and risk (${riskScore.overallRisk}) scores suggests complex investment profile.`,
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Opportunity-Risk Gap",
      expected: "Within 30 points for balanced profiles",
      actual: `${scoreDifference} point gap`,
      recommendation: "This location may suit specialized investors with specific risk appetites. Document investment thesis carefully.",
      detectedAt: new Date().toISOString(),
    });
  }

  if (capitalScore > 70 && riskScore.overallRisk > 60) {
    anomalies.push({
      id: generateAnomalyId("score"),
      category: "score",
      severity: "high",
      title: "High Score with High Risk",
      description: "Location has a high capital score but also elevated risk, indicating potential overvaluation or hidden factors.",
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Capital Score vs Risk",
      expected: "Capital score inversely correlated with risk",
      actual: `Capital: ${capitalScore}, Risk: ${riskScore.overallRisk}`,
      recommendation: "Perform deeper due diligence. High returns may be compensating for elevated risk exposure.",
      detectedAt: new Date().toISOString(),
    });
  }

  if (opportunityScore.developmentMomentum > 75 && opportunityScore.infrastructureAccess < 40) {
    anomalies.push({
      id: generateAnomalyId("data"),
      category: "data",
      severity: "medium",
      title: "Momentum-Infrastructure Gap",
      description: "Strong development momentum with weak infrastructure access suggests speculative growth that may not be sustainable.",
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Momentum vs Infrastructure",
      expected: "Infrastructure supports momentum",
      actual: `Momentum: ${opportunityScore.developmentMomentum}, Infrastructure: ${opportunityScore.infrastructureAccess}`,
      recommendation: "Verify planned infrastructure investments. Speculative positions require longer time horizons.",
      detectedAt: new Date().toISOString(),
    });
  }

  return anomalies;
}

function detectGeographicAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const { location, neighbourhood } = analysis;

  if (!neighbourhood) return anomalies;

  const zone = neighbourhoods.find((n) => n.name === neighbourhood);
  if (!zone) return anomalies;

  const distance = haversineDistance(location, { latitude: zone.latitude, longitude: zone.longitude });

  if (distance > 10000) {
    anomalies.push({
      id: generateAnomalyId("geographic"),
      category: "geographic",
      severity: "low",
      title: "Location-Zone Distance",
      description: `Selected point is ${(distance / 1000).toFixed(1)}km from ${neighbourhood} centre. Zone characteristics may not fully apply.`,
      location: analysis.location,
      zone: neighbourhood,
      metric: "Distance from zone centre",
      expected: "< 5km for strong zone correlation",
      actual: `${(distance / 1000).toFixed(1)}km`,
      recommendation: "Verify zone-level data applicability. Consider micro-location factors at this specific point.",
      detectedAt: new Date().toISOString(),
    });
  }

  const isCoastal = location.longitude < 39.25;
  const isFloodZone = analysis.riskScore.floodRisk > 50;

  if (isCoastal && isFloodZone && !neighbourhood.toLowerCase().includes("paje")) {
    anomalies.push({
      id: generateAnomalyId("environmental"),
      category: "environmental",
      severity: "medium",
      title: "Coastal Flood Exposure",
      description: "Location is in a coastal area with elevated flood risk. May be subject to tidal flooding and storm surge.",
      location: analysis.location,
      zone: neighbourhood,
      metric: "Coastal position + flood risk",
      expected: "Coastal zones with flood mitigation",
      actual: "High exposure without confirmed mitigation",
      recommendation: "Review historical flood data, elevation above sea level, and local flood protection measures.",
      detectedAt: new Date().toISOString(),
    });
  }

  return anomalies;
}

function detectDataAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [];

  const allScores = [
    analysis.riskScore.floodRisk,
    analysis.riskScore.coastalExposure,
    analysis.riskScore.densityPressure,
    analysis.riskScore.infrastructureRisk,
    analysis.opportunityScore.tourismDemand,
    analysis.opportunityScore.infrastructureAccess,
    analysis.opportunityScore.developmentMomentum,
    analysis.opportunityScore.marketLiquidity,
  ];

  const zeroCount = allScores.filter((s) => s === 0).length;
  if (zeroCount > 2) {
    anomalies.push({
      id: generateAnomalyId("data"),
      category: "data",
      severity: "medium",
      title: "Incomplete Scoring Data",
      description: `${zeroCount} of 8 scoring dimensions returned zero values, suggesting missing or incomplete source data.`,
      location: analysis.location,
      zone: analysis.neighbourhood ?? undefined,
      metric: "Zero-value scores",
      expected: "All dimensions scored",
      actual: `${zeroCount} zero values`,
      recommendation: "Verify data sources and consider supplementary data collection for this location.",
      detectedAt: new Date().toISOString(),
    });
  }

  const inconsistentPairs = [
    { high: analysis.opportunityScore.tourismDemand, low: analysis.riskScore.overallRisk, label: "Tourism-Risk" },
    { high: analysis.opportunityScore.infrastructureAccess, low: analysis.riskScore.infrastructureRisk, label: "Infrastructure" },
  ];

  for (const pair of inconsistentPairs) {
    if (pair.high > 70 && pair.low > 60) {
      anomalies.push({
        id: generateAnomalyId("data"),
        category: "data",
        severity: "low",
        title: `Inconsistent ${pair.label} Signals`,
        description: `High opportunity and high risk in the ${pair.label.toLowerCase()} dimension suggests conflicting data signals.`,
        location: analysis.location,
        zone: analysis.neighbourhood ?? undefined,
        metric: pair.label,
        expected: "Consistent directional signals",
        actual: "High opportunity + high risk",
        recommendation: "Cross-reference with additional data sources to resolve conflicting signals.",
        detectedAt: new Date().toISOString(),
      });
    }
  }

  return anomalies;
}

export function detectAnomalies(analysis: SiteAnalysisFull): Anomaly[] {
  const anomalies: Anomaly[] = [
    ...detectPriceAnomalies(analysis),
    ...detectRiskAnomalies(analysis),
    ...detectScoreAnomalies(analysis),
    ...detectGeographicAnomalies(analysis),
    ...detectDataAnomalies(analysis),
  ];

  return anomalies.sort((a, b) => {
    const severityOrder: Record<AnomalySeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function getAnomalySummary(anomalies: Anomaly[]): {
  total: number;
  bySeverity: Record<AnomalySeverity, number>;
  byCategory: Record<AnomalyCategory, number>;
  hasCritical: boolean;
} {
  const bySeverity: Record<AnomalySeverity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  const byCategory: Record<AnomalyCategory, number> = { price: 0, risk: 0, score: 0, geographic: 0, data: 0, environmental: 0 };

  for (const anomaly of anomalies) {
    bySeverity[anomaly.severity]++;
    byCategory[anomaly.category]++;
  }

  return {
    total: anomalies.length,
    bySeverity,
    byCategory,
    hasCritical: bySeverity.critical > 0,
  };
}

export function formatSeverityColor(severity: AnomalySeverity): string {
  const colors: Record<AnomalySeverity, string> = {
    low: "text-blue-400 bg-blue-900/30 border-blue-800",
    medium: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
    high: "text-orange-400 bg-orange-900/30 border-orange-800",
    critical: "text-red-400 bg-red-900/30 border-red-800",
  };
  return colors[severity];
}

export function formatCategoryIcon(category: AnomalyCategory): string {
  const icons: Record<AnomalyCategory, string> = {
    price: "$",
    risk: "!",
    score: "#",
    geographic: "@",
    data: "?",
    environmental: "~",
  };
  return icons[category];
}
