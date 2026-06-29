import { MarketSignal, MarketSignalsResult, SignalType, SignalStrength, NeighbourhoodProfile } from "../../types";
import { getDataSource } from "../../lib/data-source";

const ds = getDataSource();
const neighbourhoods = ds.getNeighbourhoods();

function calculateZoneSignal(zone: NeighbourhoodProfile): {
  type: SignalType;
  strength: SignalStrength;
  score: number;
  indicators: { name: string; value: string; direction: "up" | "down" | "neutral" }[];
} {
  const indicators: { name: string; value: string; direction: "up" | "down" | "neutral" }[] = [];
  let score = 50;

  if (zone.developmentMomentum > 70) {
    score += 15;
    indicators.push({ name: "Development Momentum", value: `${zone.developmentMomentum}/100`, direction: "up" });
  } else if (zone.developmentMomentum > 50) {
    score += 5;
    indicators.push({ name: "Development Momentum", value: `${zone.developmentMomentum}/100`, direction: "neutral" });
  } else {
    score -= 10;
    indicators.push({ name: "Development Momentum", value: `${zone.developmentMomentum}/100`, direction: "down" });
  }

  const tourismRatio = zone.tourismScore / 100;
  if (tourismRatio > 0.8) {
    score += 12;
    indicators.push({ name: "Tourism Demand", value: `${zone.tourismScore}/100`, direction: "up" });
  } else if (tourismRatio > 0.5) {
    score += 4;
    indicators.push({ name: "Tourism Demand", value: `${zone.tourismScore}/100`, direction: "neutral" });
  } else {
    score -= 8;
    indicators.push({ name: "Tourism Demand", value: `${zone.tourismScore}/100`, direction: "down" });
  }

  const infraRatio = zone.infrastructureScore / 100;
  if (infraRatio > 0.6) {
    score += 8;
    indicators.push({ name: "Infrastructure", value: `${zone.infrastructureScore}/100`, direction: "up" });
  } else if (infraRatio > 0.4) {
    score += 2;
    indicators.push({ name: "Infrastructure", value: `${zone.infrastructureScore}/100`, direction: "neutral" });
  } else {
    score -= 5;
    indicators.push({ name: "Infrastructure", value: `${zone.infrastructureScore}/100`, direction: "down" });
  }

  const floodRatio = zone.floodSensitivity / 100;
  if (floodRatio > 0.6) {
    score -= 12;
    indicators.push({ name: "Flood Risk", value: `${zone.floodSensitivity}/100`, direction: "down" });
  } else if (floodRatio > 0.3) {
    score -= 3;
    indicators.push({ name: "Flood Risk", value: `${zone.floodSensitivity}/100`, direction: "neutral" });
  } else {
    score += 8;
    indicators.push({ name: "Flood Risk", value: `${zone.floodSensitivity}/100`, direction: "up" });
  }

  const valueScore = 100 - ((zone.pricePerSqmMin + zone.pricePerSqmMax) / 2 / 10);
  if (valueScore > 70) {
    score += 10;
    indicators.push({ name: "Value Entry Point", value: `$${zone.pricePerSqmMin}-${zone.pricePerSqmMax}/sqm`, direction: "up" });
  } else if (valueScore > 40) {
    score += 2;
    indicators.push({ name: "Value Entry Point", value: `$${zone.pricePerSqmMin}-${zone.pricePerSqmMax}/sqm`, direction: "neutral" });
  } else {
    score -= 5;
    indicators.push({ name: "Value Entry Point", value: `$${zone.pricePerSqmMin}-${zone.pricePerSqmMax}/sqm`, direction: "down" });
  }

  let type: SignalType;
  let strength: SignalStrength;

  if (score >= 75) {
    type = "buy";
    strength = score >= 85 ? "strong" : "moderate";
  } else if (score >= 55) {
    type = "hold";
    strength = score >= 65 ? "moderate" : "weak";
  } else if (score >= 35) {
    type = "watch";
    strength = score >= 45 ? "moderate" : "weak";
  } else {
    type = "sell";
    strength = "strong";
  }

  return { type, strength, score, indicators };
}

function determineMarketPhase(signals: MarketSignal[]): MarketSignalsResult["marketPhase"] {
  const buyCount = signals.filter((s) => s.type === "buy").length;
  const sellCount = signals.filter((s) => s.type === "sell").length;
  const watchCount = signals.filter((s) => s.type === "watch").length;
  const total = signals.length;

  if (buyCount / total > 0.5) return "rapid_growth";
  if (buyCount / total > 0.3) return "early_growth";
  if (sellCount / total > 0.3) return "correction";
  if (watchCount / total > 0.4) return "uncertain";
  return "maturity";
}

function determineRiskLevel(signals: MarketSignal[]): "low" | "moderate" | "high" {
  const sellSignals = signals.filter((s) => s.type === "sell");
  if (sellSignals.length > 3) return "high";
  if (sellSignals.length > 1) return "moderate";
  return "low";
}

export function generateMarketSignals(): MarketSignalsResult {
  const signals: MarketSignal[] = [];

  for (const zone of neighbourhoods) {
    const signal = calculateZoneSignal(zone);

    const titleMap: Record<SignalType, string> = {
      buy: `${zone.name} — Strong Acquisition Opportunity`,
      sell: `${zone.name} — Consider Reducing Exposure`,
      hold: `${zone.name} — Maintain Current Position`,
      watch: `${zone.name} — Monitor for Entry Point`,
    };

    const descriptionMap: Record<SignalType, string> = {
      buy: `${zone.name} shows strong fundamentals with development momentum (${zone.developmentMomentum}/100) and tourism demand (${zone.tourismScore}/100). Current pricing offers favorable entry within the Zanzibar market context.`,
      sell: `${zone.name} faces headwinds including elevated flood sensitivity (${zone.floodSensitivity}/100) and weaker infrastructure (${zone.infrastructureScore}/100). Consider rebalancing exposure.`,
      hold: `${zone.name} presents a balanced profile with stable tourism demand (${zone.tourismScore}/100) and moderate development activity (${zone.developmentMomentum}/100). Maintain current positioning.`,
      watch: `${zone.name} has emerging characteristics worth monitoring. Development momentum (${zone.developmentMomentum}/100) and infrastructure trends may create future entry opportunities.`,
    };

    signals.push({
      type: signal.type,
      strength: signal.strength,
      zone: zone.name,
      title: titleMap[signal.type],
      description: descriptionMap[signal.type],
      indicators: signal.indicators,
      confidence: Math.min(90, 50 + Math.abs(signal.score - 50)),
      generatedAt: new Date().toISOString(),
    });
  }

  signals.sort((a, b) => {
    const order: Record<SignalType, number> = { buy: 0, watch: 1, hold: 2, sell: 3 };
    return order[a.type] - order[b.type];
  });

  const buySignals = signals.filter((s) => s.type === "buy");
  const topZones = buySignals.slice(0, 3).map((s) => s.zone);

  const overarchingThesis = buySignals.length >= 3
    ? `Zanzibar's land market shows a bullish bias with ${buySignals.length} buy signals. Priority zones: ${topZones.join(", ")}. Development momentum and tourism demand are key positive drivers across the island.`
    : buySignals.length >= 1
    ? `Selective opportunities exist in ${topZones.join(", ")}. Overall market sentiment is mixed with specific zone-level differentiation driving returns.`
    : "Market signals suggest a cautious approach. Few zones meet buy criteria — focus on due diligence and wait for improved entry points.";

  const marketPhase = determineMarketPhase(signals);
  const riskLevel = determineRiskLevel(signals);

  return {
    signals,
    overarchingThesis,
    marketPhase,
    riskLevel,
  };
}
