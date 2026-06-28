import { neighbourhoods } from "../../data/seed/zanzibar";
import { VolatilityMetrics, VolatilityAnalysis, MarketRegime } from "../../types";
import { sampleListings } from "../../data/seed/zanzibar";
import { haversineDistance } from "../../lib/distance";

function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function calculatePriceVolatility(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0.3;

  const baseVol = calculateCoefficientOfVariation([
    zone.pricePerSqmMin,
    zone.pricePerSqmMax,
    (zone.pricePerSqmMin + zone.pricePerSqmMax) / 2,
  ]);

  const adjusted = Math.min(1, baseVol * 2);
  return Math.round(adjusted * 100) / 100;
}

function calculateMomentumVolatility(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0.3;

  const values = [
    zone.developmentMomentum,
    zone.tourismScore,
    zone.infrastructureScore,
    100 - zone.floodSensitivity,
  ];

  const cv = calculateCoefficientOfVariation(values);
  return Math.round(Math.min(1, cv) * 100) / 100;
}

function calculateSignalVolatility(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0.3;

  const zoneListings = sampleListings.filter((l) => {
    const dist = haversineDistance(
      { latitude: l.latitude, longitude: l.longitude },
      { latitude: zone.latitude, longitude: zone.longitude }
    );
    return dist < 5000;
  });

  const count = zoneListings.length;
  const activityRate = count / 5;
  const rawVol = Math.abs(0.5 - 1 / (1 + Math.exp(-(activityRate - 1))));
  return Math.round(Math.min(1, rawVol) * 100) / 100;
}

function determineRegime(
  volatility: number,
  momentumScore: number,
  priceVol: number
): MarketRegime {
  if (momentumScore > 65 && volatility < 0.4) return "bull";
  if (momentumScore > 50 && volatility < 0.5) return "stable";
  if (volatility > 0.6 && momentumScore > 50) return "transition";
  if (volatility > 0.5 && momentumScore < 40) return "correction";
  if (momentumScore < 35) return "bear";
  return "stable";
}

function volatilityLabel(value: number): VolatilityMetrics["priceVolatilityLabel"] {
  if (value <= 0.15) return "very_low";
  if (value <= 0.3) return "low";
  if (value <= 0.5) return "moderate";
  if (value <= 0.7) return "high";
  return "very_high";
}

function compositeLabel(value: number): VolatilityMetrics["compositeLabel"] {
  if (value <= 0.3) return "stable";
  if (value <= 0.55) return "moderate";
  return "volatile";
}

export function calculateZoneVolatility(zoneName: string): VolatilityMetrics {
  const priceVol = calculatePriceVolatility(zoneName);
  const momentumVol = calculateMomentumVolatility(zoneName);
  const signalVol = calculateSignalVolatility(zoneName);
  const composite = priceVol * 0.4 + momentumVol * 0.35 + signalVol * 0.25;

  const zone = neighbourhoods.find((n) => n.name === zoneName);
  const momentumScore = zone ? (zone.developmentMomentum * 0.4 + zone.tourismScore * 0.35 + zone.infrastructureScore * 0.25) : 50;

  return {
    zone: zoneName,
    priceVolatility: Math.round(priceVol * 100) / 100,
    priceVolatilityLabel: volatilityLabel(priceVol),
    momentumVolatility: Math.round(momentumVol * 100) / 100,
    signalVolatility: Math.round(signalVol * 100) / 100,
    compositeVolatility: Math.round(composite * 100) / 100,
    compositeLabel: compositeLabel(composite),
    regime: determineRegime(composite, momentumScore, priceVol),
  };
}

export function calculateVolatilityAnalysis(): VolatilityAnalysis {
  const zoneVolatilities = neighbourhoods.map((z) => calculateZoneVolatility(z.name));

  const overallMarketVolatility =
    zoneVolatilities.reduce((s, v) => s + v.compositeVolatility, 0) / zoneVolatilities.length;

  const sorted = [...zoneVolatilities].sort((a, b) => a.compositeVolatility - b.compositeVolatility);

  const regimeCounts: Record<MarketRegime, number> = {
    bull: 0, bear: 0, stable: 0, correction: 0, transition: 0,
  };
  for (const v of zoneVolatilities) {
    regimeCounts[v.regime]++;
  }

  const dominantRegime = (Object.entries(regimeCounts) as [MarketRegime, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  const regimeConfidence = Math.round((regimeCounts[dominantRegime] / zoneVolatilities.length) * 100);

  return {
    zoneVolatilities,
    overallMarketVolatility: Math.round(overallMarketVolatility * 100) / 100,
    mostStableZone: sorted[0]?.zone ?? "",
    mostVolatileZone: sorted[sorted.length - 1]?.zone ?? "",
    dominantRegime,
    regimeConfidence,
  };
}
