import { MarketEntropy, EntropySummary } from "../../types";
import { haversineDistance } from "../../lib/distance";
import { getDataSource } from "../../lib/data-source";

const ds = getDataSource();
const neighbourhoods = ds.getNeighbourhoods();
const sampleListings = ds.getListings();

function shannonEntropy(probabilities: number[]): number {
  const total = probabilities.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  return -probabilities
    .map((p) => p / total)
    .reduce((sum, p) => {
      if (p <= 0) return sum;
      return sum + p * Math.log2(p);
    }, 0);
}

function normalizeEntropy(raw: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  return Math.min(1, raw / maxPossible);
}

function calculatePriceEntropy(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0;

  const zoneListings = sampleListings.filter((l) => {
    const dist = haversineDistance(
      { latitude: l.latitude, longitude: l.longitude },
      { latitude: zone.latitude, longitude: zone.longitude }
    );
    return dist < 5000 && l.priceUsd && l.areaSqm;
  });

  if (zoneListings.length < 3) {
    const range = zone.pricePerSqmMax - zone.pricePerSqmMin;
    return normalizeEntropy(Math.log2(1 + range / 100), 4);
  }

  const pricesPerSqm = zoneListings.map((l) => l.priceUsd! / l.areaSqm!);
  const maxPrice = Math.max(...pricesPerSqm);
  const minPrice = Math.min(...pricesPerSqm);
  const binCount = Math.max(3, Math.min(8, Math.round(Math.sqrt(pricesPerSqm.length))));
  const binSize = (maxPrice - minPrice) / binCount || 1;

  const bins = new Array(binCount).fill(0);
  for (const p of pricesPerSqm) {
    const idx = Math.min(binCount - 1, Math.floor((p - minPrice) / binSize));
    bins[idx]++;
  }

  const raw = shannonEntropy(bins);
  return normalizeEntropy(raw, Math.log2(binCount));
}

function calculateSpatialEntropy(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0;

  const zoneListings = sampleListings.filter((l) => {
    const dist = haversineDistance(
      { latitude: l.latitude, longitude: l.longitude },
      { latitude: zone.latitude, longitude: zone.longitude }
    );
    return dist < 5000;
  });

  if (zoneListings.length < 2) return 0.3;

  const quadrants = [
    { latMin: zone.latitude - 0.05, latMax: zone.latitude, lngMin: zone.longitude - 0.05, lngMax: zone.longitude },
    { latMin: zone.latitude - 0.05, latMax: zone.latitude, lngMin: zone.longitude, lngMax: zone.longitude + 0.05 },
    { latMin: zone.latitude, latMax: zone.latitude + 0.05, lngMin: zone.longitude - 0.05, lngMax: zone.longitude },
    { latMin: zone.latitude, latMax: zone.latitude + 0.05, lngMin: zone.longitude, lngMax: zone.longitude + 0.05 },
  ];

  const quadCounts = quadrants.map((q) =>
    zoneListings.filter(
      (l) =>
        l.latitude >= q.latMin && l.latitude <= q.latMax &&
        l.longitude >= q.lngMin && l.longitude <= q.lngMax
    ).length
  );

  return normalizeEntropy(shannonEntropy(quadCounts), Math.log2(4));
}

function calculateSignalEntropy(zoneName: string): number {
  const zone = neighbourhoods.find((n) => n.name === zoneName);
  if (!zone) return 0;

  const metrics = [
    zone.tourismScore,
    zone.infrastructureScore,
    zone.developmentMomentum,
    100 - zone.floodSensitivity,
  ];

  const directions = metrics.map((m) => (m >= 70 ? 1 : m >= 45 ? 0 : -1));
  const posCount = directions.filter((d) => d === 1).length;
  const negCount = directions.filter((d) => d === -1).length;
  const neuCount = directions.filter((d) => d === 0).length;

  return normalizeEntropy(shannonEntropy([posCount, negCount, neuCount]), Math.log2(3));
}

function calculateCompositeEntropy(price: number, spatial: number, signal: number): number {
  return price * 0.35 + spatial * 0.35 + signal * 0.3;
}

function entropyLabel(value: number, thresholds: number[], labels: string[]): string {
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) return labels[i];
  }
  return labels[labels.length - 1];
}

const priceLabels = ["very_low", "low", "moderate", "high", "very_high"];
const priceThresholds = [0.2, 0.4, 0.6, 0.8];

const spatialLabels = ["concentrated", "moderate", "dispersed"];
const spatialThresholds = [0.3, 0.6];

const signalLabels = ["unanimous", "mixed", "conflicted"];
const signalThresholds = [0.3, 0.6];

const compositeLabels = ["predictable", "moderate", "uncertain"];
const compositeThresholds = [0.3, 0.6];

export function calculateZoneEntropy(zoneName: string): MarketEntropy {
  const priceEntropy = calculatePriceEntropy(zoneName);
  const spatialEntropy = calculateSpatialEntropy(zoneName);
  const signalEntropy = calculateSignalEntropy(zoneName);

  return {
    zone: zoneName,
    priceEntropy: Math.round(priceEntropy * 100) / 100,
    priceEntropyLabel: entropyLabel(priceEntropy, priceThresholds, priceLabels) as MarketEntropy["priceEntropyLabel"],
    spatialEntropy: Math.round(spatialEntropy * 100) / 100,
    spatialEntropyLabel: entropyLabel(spatialEntropy, spatialThresholds, spatialLabels) as MarketEntropy["spatialEntropyLabel"],
    signalEntropy: Math.round(signalEntropy * 100) / 100,
    signalEntropyLabel: entropyLabel(signalEntropy, signalThresholds, signalLabels) as MarketEntropy["signalEntropyLabel"],
    compositeEntropy: Math.round(calculateCompositeEntropy(priceEntropy, spatialEntropy, signalEntropy) * 100) / 100,
    compositeLabel: entropyLabel(
      calculateCompositeEntropy(priceEntropy, spatialEntropy, signalEntropy),
      compositeThresholds,
      compositeLabels
    ) as MarketEntropy["compositeLabel"],
  };
}

export function calculateEntropySummary(): EntropySummary {
  const zoneEntropies = neighbourhoods.map((z) => calculateZoneEntropy(z.name));

  const overallMarketEntropy =
    zoneEntropies.reduce((s, e) => s + e.compositeEntropy, 0) / zoneEntropies.length;

  const sorted = [...zoneEntropies].sort((a, b) => a.compositeEntropy - b.compositeEntropy);

  const rollingAverages = zoneEntropies.map((_, i, arr) => {
    const window = arr.slice(Math.max(0, i - 2), i + 1);
    return window.reduce((s, e) => s + e.compositeEntropy, 0) / window.length;
  });

  const trend = rollingAverages.length >= 3
    ? rollingAverages[rollingAverages.length - 1] > rollingAverages[0]
      ? ("increasing" as const)
      : rollingAverages[rollingAverages.length - 1] < rollingAverages[0]
        ? ("decreasing" as const)
        : ("stable" as const)
    : ("stable" as const);

  return {
    zoneEntropies,
    overallMarketEntropy: Math.round(overallMarketEntropy * 100) / 100,
    mostPredictableZone: sorted[0]?.zone ?? "",
    mostUncertainZone: sorted[sorted.length - 1]?.zone ?? "",
    entropyTrend: trend,
  };
}
