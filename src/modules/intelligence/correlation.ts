import { neighbourhoods } from "../../data/seed/zanzibar";
import { CrossMetricCorrelation, ZoneCorrelation, CorrelationAnalysis } from "../../types";

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const meanX = x.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanY = y.slice(0, n).reduce((s, v) => s + v, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : Math.max(-1, Math.min(1, numerator / denom));
}

function correlationStrength(r: number): CrossMetricCorrelation["strength"] {
  const abs = Math.abs(r);
  if (abs >= 0.7) return "strong";
  if (abs >= 0.4) return "moderate";
  if (abs >= 0.15) return "weak";
  return "none";
}

function zoneCorrelationStrength(r: number): ZoneCorrelation["strength"] {
  const abs = Math.abs(r);
  if (abs >= 0.65) return "strong";
  if (abs >= 0.35) return "moderate";
  return "weak";
}

function determineRelationship(r: number, zoneA: string, zoneB: string): ZoneCorrelation["relationship"] {
  const abs = Math.abs(r);
  if (abs < 0.2) return "independent";
  if (r > 0.6) return "peer";

  const a = neighbourhoods.find((n) => n.name === zoneA);
  const b = neighbourhoods.find((n) => n.name === zoneB);
  if (!a || !b) return "independent";

  const aScore = a.developmentMomentum + a.tourismScore;
  const bScore = b.developmentMomentum + b.tourismScore;

  if (r > 0 && Math.abs(aScore - bScore) > 30) return "leading";
  if (r < -0.3) return "divergent";
  return "independent";
}

const metricsList = [
  "Tourism Demand",
  "Infrastructure",
  "Development Momentum",
  "Flood Sensitivity",
  "Price Level",
] as const;

function getZoneMetricValues(metric: string): number[] {
  return neighbourhoods.map((z) => {
    switch (metric) {
      case "Tourism Demand": return z.tourismScore;
      case "Infrastructure": return z.infrastructureScore;
      case "Development Momentum": return z.developmentMomentum;
      case "Flood Sensitivity": return z.floodSensitivity;
      case "Price Level": return (z.pricePerSqmMin + z.pricePerSqmMax) / 2;
      default: return 50;
    }
  });
}

export function calculateCrossMetricCorrelations(): CrossMetricCorrelation[] {
  const results: CrossMetricCorrelation[] = [];

  for (let i = 0; i < metricsList.length; i++) {
    for (let j = i + 1; j < metricsList.length; j++) {
      const x = getZoneMetricValues(metricsList[i]);
      const y = getZoneMetricValues(metricsList[j]);
      const r = pearsonCorrelation(x, y);

      results.push({
        metricA: metricsList[i],
        metricB: metricsList[j],
        coefficient: Math.round(r * 100) / 100,
        strength: correlationStrength(r),
        direction: r >= 0 ? "positive" : "negative",
      });
    }
  }

  return results.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));
}

export function calculateZoneCorrelations(): ZoneCorrelation[] {
  const results: ZoneCorrelation[] = [];

  for (let i = 0; i < neighbourhoods.length; i++) {
    for (let j = i + 1; j < neighbourhoods.length; j++) {
      const a = neighbourhoods[i];
      const b = neighbourhoods[j];

      const aMetrics = [a.tourismScore, a.infrastructureScore, a.developmentMomentum, 100 - a.floodSensitivity, (a.pricePerSqmMin + a.pricePerSqmMax) / 2];
      const bMetrics = [b.tourismScore, b.infrastructureScore, b.developmentMomentum, 100 - b.floodSensitivity, (b.pricePerSqmMin + b.pricePerSqmMax) / 2];

      const r = pearsonCorrelation(aMetrics, bMetrics);

      results.push({
        zoneA: a.name,
        zoneB: b.name,
        coefficient: Math.round(r * 100) / 100,
        strength: zoneCorrelationStrength(r),
        relationship: determineRelationship(r, a.name, b.name),
      });
    }
  }

  return results;
}

export function calculateCorrelationAnalysis(): CorrelationAnalysis {
  const crossMetric = calculateCrossMetricCorrelations();
  const zonePairs = calculateZoneCorrelations();

  const strongestPositive = [...zonePairs]
    .filter((z) => z.coefficient > 0)
    .sort((a, b) => b.coefficient - a.coefficient);
  const strongestNegative = [...zonePairs]
    .filter((z) => z.coefficient < 0)
    .sort((a, b) => a.coefficient - b.coefficient);

  const independentZones = zonePairs
    .filter((z) => z.relationship === "independent")
    .reduce((acc, z) => {
      if (!acc.includes(z.zoneA)) acc.push(z.zoneA);
      if (!acc.includes(z.zoneB)) acc.push(z.zoneB);
      return acc;
    }, [] as string[]);

  return {
    crossMetric,
    zonePairs: zonePairs.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient)),
    strongestPositive: strongestPositive.length > 0
      ? { pair: `${strongestPositive[0].zoneA} / ${strongestPositive[0].zoneB}`, coefficient: strongestPositive[0].coefficient }
      : { pair: "", coefficient: 0 },
    strongestNegative: strongestNegative.length > 0
      ? { pair: `${strongestNegative[0].zoneA} / ${strongestNegative[0].zoneB}`, coefficient: strongestNegative[0].coefficient }
      : { pair: "", coefficient: 0 },
    independentZones,
  };
}
