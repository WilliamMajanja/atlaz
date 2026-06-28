import { GeoPoint, ComparableSale, ComparableAnalysisResult } from "../../types";
import { neighbourhoods, sampleListings } from "../../data/seed/zanzibar";
import { haversineDistance } from "../../lib/distance";

function findNearestNeighbourhood(point: GeoPoint): { name: string; id: string } | null {
  let nearest: { name: string; id: string } | null = null;
  let minDist = Infinity;

  for (const n of neighbourhoods) {
    const dist = haversineDistance(point, { latitude: n.latitude, longitude: n.longitude });
    if (dist < minDist) {
      minDist = dist;
      nearest = { name: n.name, id: n.id };
    }
  }

  return nearest;
}

function findComparableListings(
  point: GeoPoint,
  zoneName: string | null,
  radiusKm: number = 10
): ComparableSale[] {
  const comparables: ComparableSale[] = [];

  for (const listing of sampleListings) {
    const distance = haversineDistance(point, {
      latitude: listing.latitude,
      longitude: listing.longitude,
    });

    if (distance > radiusKm * 1000) continue;

    const distanceKm = distance / 1000;
    const relevance = Math.round(Math.max(0, 100 - distanceKm * 15));

    comparables.push({
      id: listing.id,
      title: listing.title,
      location: { latitude: listing.latitude, longitude: listing.longitude },
      zone: zoneName ?? "Unknown",
      distance: Math.round(distance),
      priceUsd: listing.priceUsd,
      areaSqm: listing.areaSqm,
      pricePerSqm: listing.pricePerSqm,
      propertyType: listing.listingType,
      relevance,
    });
  }

  return comparables.sort((a, b) => b.relevance - a.relevance);
}

function estimateValueRange(comparables: ComparableSale[]): {
  low: number;
  mid: number;
  high: number;
  confidence: number;
} {
  if (comparables.length === 0) {
    return { low: 0, mid: 0, high: 0, confidence: 0 };
  }

  const prices = comparables.map((c) => c.pricePerSqm);
  prices.sort((a, b) => a - b);

  const n = prices.length;
  const mean = prices.reduce((s, p) => s + p, 0) / n;
  const variance = prices.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  const q1 = prices[Math.floor(n * 0.25)];
  const q3 = prices[Math.floor(n * 0.75)];

  const confidence = Math.min(90, Math.round(40 + n * 10));

  return {
    low: Math.round(Math.max(0, q1 - stdDev)),
    mid: Math.round(mean),
    high: Math.round(q3 + stdDev),
    confidence,
  };
}

function determineMarketTrend(comparables: ComparableSale[]): "appreciating" | "stable" | "declining" | "insufficient_data" {
  if (comparables.length < 3) return "insufficient_data";

  const avgPricePerSqm = comparables.reduce((s, c) => s + c.pricePerSqm, 0) / comparables.length;
  const zonePrices = neighbourhoods.map((n) => (n.pricePerSqmMin + n.pricePerSqmMax) / 2);
  const marketAvgPricePerSqm = zonePrices.reduce((s, p) => s + p, 0) / zonePrices.length;

  const ratio = avgPricePerSqm / marketAvgPricePerSqm;

  if (ratio > 1.15) return "appreciating";
  if (ratio > 0.85) return "stable";
  return "declining";
}

export function runComparableAnalysis(point: GeoPoint): ComparableAnalysisResult {
  const neighbourhood = findNearestNeighbourhood(point);
  const zoneName = neighbourhood?.name ?? null;

  const comparables = findComparableListings(point, zoneName);
  const estimatedValueRange = estimateValueRange(comparables);
  const marketTrend = determineMarketTrend(comparables);

  const keyFactors: string[] = [];

  if (comparables.length >= 3) {
    keyFactors.push(`${comparables.length} comparable ${comparables.length === 1 ? "sale" : "sales"} identified within radius`);
  } else {
    keyFactors.push("Limited comparable sales data — exercise caution in valuation");
  }

  const highEnd = comparables.filter((c) => c.pricePerSqm > estimatedValueRange.mid * 1.2);
  const lowEnd = comparables.filter((c) => c.pricePerSqm < estimatedValueRange.mid * 0.8);

  if (highEnd.length > 0) keyFactors.push(`${highEnd.length} premium ${highEnd.length === 1 ? "listing" : "listings"} above market average`);
  if (lowEnd.length > 0) keyFactors.push(`${lowEnd.length} value ${lowEnd.length === 1 ? "listing" : "listings"} below market average`);

  const zonePrices = neighbourhoods.map((n) => (n.pricePerSqmMin + n.pricePerSqmMax) / 2);
  const marketAvgPricePerSqm = zonePrices.reduce((s, p) => s + p, 0) / zonePrices.length;
  keyFactors.push(`Zone average: $${(neighbourhoods.reduce((s, n) => s + n.pricePerSqmMin + n.pricePerSqmMax, 0) / (neighbourhoods.length * 2)).toFixed(0)}/sqm, Market avg: $${marketAvgPricePerSqm.toFixed(0)}/sqm`);

  if (marketTrend === "appreciating") keyFactors.push("Market showing appreciation — favorable for acquisition");
  else if (marketTrend === "declining") keyFactors.push("Market showing decline — exercise caution");

  return {
    subjectLocation: point,
    subjectZone: zoneName,
    comparables,
    estimatedValueRange,
    marketTrend,
    keyFactors,
  };
}
