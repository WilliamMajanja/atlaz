import { NextRequest, NextResponse } from "next/server";
import { neighbourhoods } from "@/data/seed/zanzibar";
import { checkOllamaHealth, generateSpeculationBrief } from "@/lib/ollama";
import { EntryExitSignal, PriceTarget, RiskRewardProfile, SpeculationBrief } from "@/types";

function generateLocalBrief(zoneId: string): SpeculationBrief | null {
  const zone = neighbourhoods.find((n) => n.id === zoneId);
  if (!zone) return null;

  const avgPrice = (zone.pricePerSqmMin + zone.pricePerSqmMax) / 2;
  const momentum = zone.developmentMomentum;
  const tourism = zone.tourismScore;
  const infra = zone.infrastructureScore;
  const flood = zone.floodSensitivity;
  const overallScore = momentum * 0.35 + tourism * 0.3 + infra * 0.2 + (100 - flood) * 0.15;

  const rating = overallScore >= 75 ? "overweight" as const : overallScore >= 55 ? "neutral" as const : "underweight" as const;
  const entryTiming = overallScore >= 70 ? "immediate" as const : overallScore >= 50 ? "accumulate" as const : "wait" as const;
  const shortTarget = avgPrice * (1 + (momentum / 100) * 0.08);
  const medTarget = avgPrice * (1 + (momentum / 100) * 0.2);
  const longTarget = avgPrice * (1 + (momentum / 100) * 0.4);

  const signals: EntryExitSignal[] = [
    {
      zone: zone.name,
      action: overallScore >= 75 ? "strong_buy" : overallScore >= 60 ? "buy" : overallScore >= 40 ? "hold" : "sell",
      confidence: Math.round(overallScore),
      entryPrice: avgPrice,
      targetPrice: medTarget,
      stopLoss: avgPrice * 0.85,
      timeHorizon: "12-24 months",
      catalysts: ["Tourism demand growth", "Infrastructure pipeline", "Foreign investment inflow"],
      risks: flood > 60 ? ["Flood exposure", "Climate risk"] : ["Market volatility", "Regulatory change"],
      aiRationale: `${zone.name} scores ${Math.round(overallScore)}/100 driven by tourism (${tourism}), momentum (${momentum}), and infrastructure (${infra}).`,
    },
  ];

  const priceTargets: PriceTarget = {
    zone: zone.name,
    current: avgPrice,
    shortTerm: { price: shortTarget, confidence: Math.round(momentum * 0.8), timeframe: "6-12 months" },
    mediumTerm: { price: medTarget, confidence: Math.round(overallScore), timeframe: "12-24 months" },
    longTerm: { price: longTarget, confidence: Math.round(overallScore * 0.85), timeframe: "36-60 months" },
    keyDrivers: ["Tourism recovery", "Infrastructure development", "Foreign direct investment"],
  };

  const riskScore = Math.round(flood * 0.5 + (100 - infra) * 0.3 + (100 - momentum) * 0.2);
  const rewardScore = Math.round(overallScore);

  const riskReward: RiskRewardProfile = {
    zone: zone.name,
    riskScore,
    rewardScore,
    ratio: +(rewardScore / Math.max(riskScore, 1)).toFixed(2),
    maxDrawdown: Math.round(30 - overallScore * 0.2),
    upsidePotential: Math.round((medTarget / avgPrice - 1) * 100),
    recommendedAllocation: Math.round(overallScore * 0.4),
    thesis: `${zone.name} offers a ${rewardScore >= 70 ? "compelling" : "selective"} risk-reward for ${momentum >= 65 ? "growth" : "value"} investors in Zanzibar.`,
  };

  return {
    zone: zone.name,
    rating,
    entryTiming,
    priceTargets,
    riskReward,
    signals,
    aiNarrative: zone.strategicNote,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zoneId, useAI } = body;

    if (!zoneId) {
      return NextResponse.json({ error: "zoneId is required" }, { status: 400 });
    }

    const zone = neighbourhoods.find((n) => n.id === zoneId);
    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    if (useAI) {
      const isHealthy = await checkOllamaHealth();
      if (isHealthy) {
        try {
          const aiBrief = await generateSpeculationBrief(zone.name, {
            location: { latitude: zone.latitude, longitude: zone.longitude },
            neighbourhood: zone.name,
            riskScore: { floodRisk: zone.floodSensitivity, coastalExposure: 50, densityPressure: 50, infrastructureRisk: 100 - zone.infrastructureScore, overallRisk: Math.round(zone.floodSensitivity * 0.4 + (100 - zone.infrastructureScore) * 0.3 + 20), riskBand: zone.floodSensitivity > 60 ? "High" : "Medium" },
            opportunityScore: { tourismDemand: zone.tourismScore, infrastructureAccess: zone.infrastructureScore, developmentMomentum: zone.developmentMomentum, marketLiquidity: 60, overallOpportunity: Math.round((zone.tourismScore + zone.developmentMomentum) / 2), opportunityBand: "High" },
            capitalScore: Math.round((zone.tourismScore + zone.developmentMomentum + zone.infrastructureScore) / 3),
            suggestedStrategy: "mixed_use",
            badges: [],
            recommendedActions: [],
            disclaimer: "",
          });
          const local = generateLocalBrief(zoneId);
          if (local) {
            return NextResponse.json({ ...local, aiNarrative: aiBrief, source: "ai" });
          }
        } catch {
        }
      }
    }

    const brief = generateLocalBrief(zoneId);
    if (!brief) {
      return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
    }
    return NextResponse.json({ ...brief, source: "local" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate speculation brief" }, { status: 500 });
  }
}
