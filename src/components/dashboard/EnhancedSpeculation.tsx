"use client";

import { useState } from "react";
import { useSpeculationStore } from "@/lib/store";
import { neighbourhoods } from "@/data/seed/zanzibar";
import { EntryExitSignal, SpeculationBrief } from "@/types";

export default function EnhancedSpeculation() {
  const { briefs, selectedZone, setSelectedZone, isGenerating, setIsGenerating, addBrief } = useSpeculationStore();
  const [aiBrief, setAiBrief] = useState<string | null>(null);

  const handleGenerateBrief = async (zoneName: string) => {
    setSelectedZone(zoneName);
    setIsGenerating(true);
    setAiBrief(null);

    const existing = briefs.find(b => b.zone === zoneName);
    if (existing) {
      setAiBrief(existing.aiNarrative);
      setIsGenerating(false);
      return;
    }

    await new Promise(r => setTimeout(r, 2000));
    const zone = neighbourhoods.find(n => n.name === zoneName);
    const brief = zone ? generateSpecBrief(zone) : null;
    if (brief) {
      addBrief(brief);
      setAiBrief(brief.aiNarrative);
    }
    setIsGenerating(false);
  };

  return (
    <div className="rounded-xl overflow-hidden card-premium h-full flex flex-col">
      <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(217, 119, 6, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">Speculation Intelligence</h3>
            <p className="text-[9px] text-slate-500">AI-powered entry/exit signals</p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-1.5 overflow-y-auto flex-1">
        {neighbourhoods.map((zone) => {
          const existing = briefs.find(b => b.zone === zone.name);
          const isSelected = selectedZone === zone.name;
          const momentumLabel = zone.developmentMomentum >= 70 ? "Strong Momentum" : zone.developmentMomentum >= 50 ? "Stable" : "Weak";
          const momentumColor = zone.developmentMomentum >= 70 ? "#34d399" : zone.developmentMomentum >= 50 ? "#fbbf24" : "#fb7185";

          return (
            <div key={zone.id} className="rounded-xl p-3 transition-all duration-200 cursor-pointer hover:scale-[1.01]" style={{
              background: isSelected ? "linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))" : "rgba(10, 14, 26, 0.4)",
              border: isSelected ? "1px solid rgba(6, 182, 212, 0.2)" : "1px solid rgba(26, 37, 64, 0.5)",
            }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-white">{zone.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{
                    background: `${momentumColor}15`,
                    color: momentumColor,
                    border: `1px solid ${momentumColor}30`,
                  }}>
                    {momentumLabel}
                  </span>
                </div>
                {!existing ? (
                  <button
                    onClick={() => handleGenerateBrief(zone.name)}
                    disabled={isGenerating && isSelected}
                    className="text-[9px] font-medium px-2.5 py-1 rounded-lg transition-all text-white"
                    style={{
                      background: isGenerating && isSelected ? "rgba(245, 158, 11, 0.3)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                    }}
                  >
                    {isGenerating && isSelected ? "..." : "Brief"}
                  </button>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium text-emerald-400" style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}>
                    {existing.rating}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[9px] text-slate-500 mb-1.5">
                <span>Tourism {zone.tourismScore}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>Infra {zone.infrastructureScore}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>${zone.pricePerSqmMin}-${zone.pricePerSqmMax}/sqm</span>
              </div>

              {existing && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1.5">
                    {existing.signals.slice(0, 2).map((s, i) => (
                      <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded font-medium uppercase ${
                        s.action === "strong_buy" || s.action === "buy" ? "text-emerald-400 bg-emerald-500/10" :
                        s.action === "sell" || s.action === "strong_sell" ? "text-rose-400 bg-rose-500/10" :
                        "text-amber-400 bg-amber-500/10"
                      }`}>
                        {s.action.replace("_", " ")}
                      </span>
                    ))}
                    {existing.priceTargets && (
                      <span className="text-[8px] text-cyan-400/80">
                        Target: ${(existing.priceTargets.mediumTerm.price / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${existing.riskReward.rewardScore}%`,
                        background: "linear-gradient(90deg, #06b6d4, #10b981)",
                      }} />
                    </div>
                    <span className="text-[8px] text-slate-500 shrink-0">R:R {existing.riskReward.ratio.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {isSelected && aiBrief && (
                <div className="mt-3 pt-3 animate-fade-in" style={{ borderTop: "1px solid rgba(26, 37, 64, 0.5)" }}>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{aiBrief}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function generateSpecBrief(zone: { name: string; tourismScore: number; infrastructureScore: number; floodSensitivity: number; developmentMomentum: number; pricePerSqmMin: number; pricePerSqmMax: number; strategicNote: string }): SpeculationBrief {
  const avgPrice = (zone.pricePerSqmMin + zone.pricePerSqmMax) / 2;
  const momentumScore = zone.developmentMomentum;
  const tourismScore = zone.tourismScore;
  const infraScore = zone.infrastructureScore;
  const floodRisk = zone.floodSensitivity;

  const overallScore = (momentumScore * 0.35 + tourismScore * 0.3 + infraScore * 0.2 + (100 - floodRisk) * 0.15);

  const rating: SpeculationBrief["rating"] = overallScore >= 75 ? "overweight" : overallScore >= 55 ? "neutral" : "underweight";
  const entryTiming: SpeculationBrief["entryTiming"] = overallScore >= 70 ? "immediate" : overallScore >= 50 ? "accumulate" : "wait";

  const currentPrice = avgPrice;
  const shortTarget = currentPrice * (1 + (momentumScore / 100) * 0.08);
  const medTarget = currentPrice * (1 + (momentumScore / 100) * 0.2);
  const longTarget = currentPrice * (1 + (momentumScore / 100) * 0.4);

  const brief: SpeculationBrief = {
    zone: zone.name,
    rating,
    entryTiming,
    priceTargets: {
      zone: zone.name,
      current: currentPrice,
      shortTerm: { price: shortTarget, confidence: Math.round(momentumScore * 0.8), timeframe: "6-12 months" },
      mediumTerm: { price: medTarget, confidence: Math.round(overallScore), timeframe: "12-24 months" },
      longTerm: { price: longTarget, confidence: Math.round(overallScore * 0.85), timeframe: "36-60 months" },
      keyDrivers: ["Tourism growth", "Infrastructure pipeline", "Foreign investment"],
    },
    riskReward: {
      zone: zone.name,
      riskScore: Math.round(floodRisk * 0.5 + (100 - infraScore) * 0.3 + (100 - momentumScore) * 0.2),
      rewardScore: Math.round(overallScore),
      ratio: +(overallScore / Math.max(floodRisk * 0.5 + (100 - infraScore) * 0.3 + (100 - momentumScore) * 0.2, 1)).toFixed(2),
      maxDrawdown: Math.round(30 - overallScore * 0.2),
      upsidePotential: Math.round((medTarget / currentPrice - 1) * 100),
      recommendedAllocation: Math.round(overallScore * 0.4),
      thesis: `${zone.name} offers a ${momentumScore >= 70 ? "compelling" : "selective"} risk-reward profile for ${momentumScore >= 70 ? "growth-oriented" : "value-focused"} investors.`,
    },
    signals: [] as SpeculationBrief["signals"],
    aiNarrative: zone.strategicNote,
    generatedAt: new Date().toISOString(),
  };

  const addSignal = (action: EntryExitSignal["action"], price: number, sl: number, horizon: string, catalysts: string[], risks: string[], rationale: string) => {
    brief.signals.push({
      zone: zone.name, action, confidence: Math.round(overallScore), entryPrice: currentPrice, targetPrice: price, stopLoss: sl,
      timeHorizon: horizon, catalysts, risks, aiRationale: rationale,
    });
  };

  if (overallScore >= 75) {
    addSignal("strong_buy", medTarget, currentPrice * 0.85, "12-24 months",
      ["Tourism recovery", "Infrastructure investment"], ["Flood exposure", "Regulatory changes"],
      `${zone.name} shows strong development momentum with tourism demand at ${tourismScore}/100.`);
  } else {
    const action: EntryExitSignal["action"] = overallScore >= 60 ? "buy" : "hold";
    addSignal(action, medTarget, currentPrice * 0.85, "12-24 months",
      ["Tourism recovery", "Infrastructure investment"], ["Flood exposure", "Regulatory changes"],
      `${zone.name} shows ${momentumScore >= 70 ? "strong" : "moderate"} development momentum with tourism demand at ${tourismScore}/100.`);
  }
  const longAction: EntryExitSignal["action"] = overallScore >= 70 ? "buy" : "hold";
  addSignal(longAction, longTarget, currentPrice * 0.75, "36-60 months",
    ["Long-term appreciation", "Land scarcity"], ["Market cycle", "Political risk"],
    `Long-term outlook remains ${overallScore >= 60 ? "positive" : "neutral"} driven by Zanzibar's structural demand growth.`);

  return brief;
}
