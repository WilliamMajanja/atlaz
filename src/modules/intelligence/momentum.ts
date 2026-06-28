import { neighbourhoods, sampleListings } from "../../data/seed/zanzibar";
import { MomentumMetrics, MomentumAnalysis } from "../../types";
import { haversineDistance } from "../../lib/distance";

export function calculateZoneMomentum(zoneName: string): MomentumMetrics {
  const zone = neighbourhoods.find((n) => n.name === zoneName);

  const developmentMomentum = zone?.developmentMomentum ?? 50;
  const tourismScore = zone?.tourismScore ?? 50;
  const infraScore = zone?.infrastructureScore ?? 50;
  const floodSafety = 100 - (zone?.floodSensitivity ?? 50);

  const momentumScore =
    developmentMomentum * 0.35 +
    tourismScore * 0.3 +
    infraScore * 0.2 +
    floodSafety * 0.15;

  const leadingIndicators = [
    {
      name: "Tourism Growth Trajectory",
      value: tourismScore,
      signal: (tourismScore >= 65 ? "positive" : tourismScore >= 45 ? "neutral" : "negative") as "positive" | "neutral" | "negative",
    },
    {
      name: "Infrastructure Pipeline",
      value: infraScore,
      signal: (infraScore >= 60 ? "positive" : infraScore >= 40 ? "neutral" : "negative") as "positive" | "neutral" | "negative",
    },
    {
      name: "Development Approvals",
      value: developmentMomentum,
      signal: (developmentMomentum >= 65 ? "positive" : developmentMomentum >= 45 ? "neutral" : "negative") as "positive" | "neutral" | "negative",
    },
  ];

  const laggingIndicators = [
    {
      name: "Price Appreciation",
      value: Math.min(100, (zone?.pricePerSqmMax ?? 500) / 10),
      signal: ((zone?.pricePerSqmMax ?? 500) > (zone?.pricePerSqmMin ?? 300) * 1.3 ? "positive" : "neutral") as "positive" | "neutral" | "negative",
    },
    {
      name: "Market Activity",
      value: sampleListings.filter((l) => {
        if (!zone) return false;
        const dist = haversineDistance(
          { latitude: l.latitude, longitude: l.longitude },
          { latitude: zone.latitude, longitude: zone.longitude }
        );
        return dist < 5000;
      }).length * 20,
      signal: "neutral" as "positive" | "neutral" | "negative",
    },
    {
      name: "Flood Risk Impact",
      value: 100 - (zone?.floodSensitivity ?? 50),
      signal: ((zone?.floodSensitivity ?? 50) >= 60 ? "negative" : "neutral") as "positive" | "neutral" | "negative",
    },
  ];

  const leadingScore = leadingIndicators.reduce((s, i) => s + i.value, 0) / leadingIndicators.length;
  const laggingScore = laggingIndicators.reduce((s, i) => s + i.value, 0) / laggingIndicators.length;
  const acceleration = leadingScore - laggingScore;

  const trendStrength = developmentMomentum >= 60 && tourismScore >= 60
    ? Math.min(100, (developmentMomentum + tourismScore) / 2)
    : Math.max(0, momentumScore - 20);

  let momentumLabel: MomentumMetrics["momentumLabel"];
  if (acceleration > 10 && momentumScore > 60) momentumLabel = "accelerating";
  else if (momentumScore > 65) momentumLabel = "strong";
  else if (momentumScore > 45) momentumLabel = "stable";
  else if (momentumScore > 30) momentumLabel = "decelerating";
  else momentumLabel = "weak";

  return {
    zone: zoneName,
    momentumScore: Math.round(momentumScore * 10) / 10,
    momentumLabel,
    leadingIndicators,
    laggingIndicators,
    acceleration: Math.round(acceleration * 10) / 10,
    trendStrength: Math.round(trendStrength * 10) / 10,
  };
}

export function calculateMomentumAnalysis(): MomentumAnalysis {
  const zoneMomenta = neighbourhoods.map((z) => calculateZoneMomentum(z.name));

  const sortedByMomentum = [...zoneMomenta].sort((a, b) => b.momentumScore - a.momentumScore);

  const topMomentumZones = sortedByMomentum
    .filter((z) => z.momentumLabel === "accelerating" || z.momentumLabel === "strong")
    .slice(0, 3)
    .map((z) => z.zone);

  const weakeningZones = sortedByMomentum
    .filter((z) => z.momentumLabel === "decelerating" || z.momentumLabel === "weak")
    .slice(0, 3)
    .map((z) => z.zone);

  const avgMomentum = zoneMomenta.reduce((s, z) => s + z.momentumScore, 0) / zoneMomenta.length;
  const avgAccel = zoneMomenta.reduce((s, z) => s + z.acceleration, 0) / zoneMomenta.length;

  let overallMarketMomentum: MomentumAnalysis["overallMarketMomentum"];
  if (avgAccel > 3) overallMarketMomentum = "accelerating";
  else if (avgAccel < -3) overallMarketMomentum = "decelerating";
  else overallMarketMomentum = "stable";

  const posLeading = zoneMomenta.filter((z) => z.leadingIndicators.some((i) => i.signal === "positive")).length;
  const negLeading = zoneMomenta.filter((z) => z.leadingIndicators.some((i) => i.signal === "negative")).length;

  const leadingIndicatorSummary =
    posLeading > negLeading * 2
      ? "Leading indicators are broadly positive across most zones, suggesting continued growth momentum."
      : negLeading > posLeading * 2
        ? "Leading indicators show cautionary signals. Monitor for potential deceleration."
        : "Leading indicators present a mixed picture. Zone-level selection is critical.";

  return {
    zoneMomenta,
    topMomentumZones,
    weakeningZones,
    overallMarketMomentum,
    leadingIndicatorSummary,
  };
}
