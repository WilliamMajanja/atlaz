"use client";

import { useState, useEffect } from "react";
import { useMapStore } from "@/lib/store";
import { MarketSignalsResult, ComparableAnalysisResult, SignalType } from "@/types";

const signalColors: Record<SignalType, { bg: string; text: string; border: string }> = {
  buy: { bg: "rgba(16, 185, 129, 0.1)", text: "text-emerald-400", border: "rgba(16, 185, 129, 0.25)" },
  sell: { bg: "rgba(244, 63, 94, 0.1)", text: "text-rose-400", border: "rgba(244, 63, 94, 0.25)" },
  hold: { bg: "rgba(245, 158, 11, 0.1)", text: "text-amber-400", border: "rgba(245, 158, 11, 0.25)" },
  watch: { bg: "rgba(59, 130, 246, 0.1)", text: "text-blue-400", border: "rgba(59, 130, 246, 0.25)" },
};

export default function SpeculationPanel() {
  const { selectedPoint } = useMapStore();
  const [signals, setSignals] = useState<MarketSignalsResult | null>(null);
  const [comparables, setComparables] = useState<ComparableAnalysisResult | null>(null);
  const [isLoadingSignals, setIsLoadingSignals] = useState(false);
  const [isLoadingComparables, setIsLoadingComparables] = useState(false);

  useEffect(() => {
    const fetchSignals = async () => {
      setIsLoadingSignals(true);
      try {
        const res = await fetch("/api/signals");
        if (res.ok) setSignals(await res.json());
      } catch {
      } finally {
        setIsLoadingSignals(false);
      }
    };
    fetchSignals();
  }, []);

  const handleComparables = async () => {
    if (!selectedPoint) return;
    setIsLoadingComparables(true);
    try {
      const res = await fetch("/api/valuation/comparables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPoint),
      });
      if (res.ok) setComparables(await res.json());
    } catch {
    } finally {
      setIsLoadingComparables(false);
    }
  };

  const phaseColors: Record<string, string> = {
    rapid_growth: "text-emerald-400",
    early_growth: "text-blue-400",
    maturity: "text-amber-400",
    correction: "text-rose-400",
    uncertain: "text-slate-400",
  };

  const phaseLabels: Record<string, string> = {
    rapid_growth: "Rapid Growth",
    early_growth: "Early Growth",
    maturity: "Mature Market",
    correction: "Correction Phase",
    uncertain: "Uncertain",
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.95))",
        border: "1px solid rgba(30, 41, 59, 0.6)",
      }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(217, 119, 6, 0.02))",
        }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        }}>
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Speculation Intelligence</h3>
          <p className="text-[9px] text-slate-500">Market signals &amp; comparable analysis</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoadingSignals ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-1/2 rounded bg-slate-700/50" />
            <div className="h-2 w-full rounded bg-slate-700/30" />
            <div className="h-2 w-3/4 rounded bg-slate-700/30" />
          </div>
        ) : signals ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Market Phase</span>
              <span className={`text-[11px] font-semibold ${phaseColors[signals.marketPhase] ?? "text-slate-400"}`}>
                {phaseLabels[signals.marketPhase] ?? signals.marketPhase}
              </span>
            </div>

            <div className="flex gap-1.5">
              {(["buy", "watch", "hold", "sell"] as const).map((type) => {
                const count = signals.signals.filter((s) => s.type === type).length;
                if (count === 0) return null;
                const colors = signalColors[type];
                return (
                  <span
                    key={type}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${colors.text}`}
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    {count} {type}
                  </span>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-300 leading-relaxed rounded-lg p-3" style={{
              background: "rgba(6, 182, 212, 0.03)",
              border: "1px solid rgba(6, 182, 212, 0.1)",
            }}>
              {signals.overarchingThesis}
            </div>

            <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
              {signals.signals.slice(0, 5).map((signal) => {
                const colors = signalColors[signal.type];
                return (
                  <div
                    key={signal.zone}
                    className="rounded-lg p-2.5 transition-all duration-200 hover:bg-white/[0.02]"
                    style={{ background: "rgba(10, 14, 26, 0.3)", border: `1px solid rgba(30, 41, 59, 0.4)` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-white">{signal.zone}</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${colors.text}`} style={{
                          background: colors.bg, border: `1px solid ${colors.border}`,
                        }}>
                          {signal.type}
                        </span>
                        <span className="text-[9px] text-slate-500">{signal.strength}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400">{signal.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {signal.indicators.slice(0, 3).map((ind) => (
                        <span key={ind.name} className="text-[8px] px-1.5 py-0.5 rounded" style={{
                          background: "rgba(30, 41, 59, 0.4)",
                          color: ind.direction === "up" ? "#34d399" : ind.direction === "down" ? "#fb7185" : "#94a3b8",
                        }}>
                          {ind.name}: {ind.value}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div style={{ borderTop: "1px solid rgba(30, 41, 59, 0.4)" }} className="pt-3">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Comparable Sales</span>
            <button
              onClick={handleComparables}
              disabled={!selectedPoint || isLoadingComparables}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all text-white disabled:opacity-30"
              style={{
                background: isLoadingComparables ? "rgba(59, 130, 246, 0.3)" :
                  !selectedPoint ? "rgba(30, 41, 59, 0.3)" :
                  "linear-gradient(135deg, #3b82f6, #2563eb)",
              }}
            >
              {isLoadingComparables ? "Loading..." : selectedPoint ? "Analyze" : "Drop a pin first"}
            </button>
          </div>

          {comparables ? (
            <div className="space-y-2 animate-fade-in">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "Low", value: `$${comparables.estimatedValueRange.low}/sqm` },
                  { label: "Mid", value: `$${comparables.estimatedValueRange.mid}/sqm` },
                  { label: "High", value: `$${comparables.estimatedValueRange.high}/sqm` },
                ].map((v) => (
                  <div key={v.label} className="rounded-lg p-2 text-center" style={{
                    background: "rgba(10, 14, 26, 0.4)",
                    border: "1px solid rgba(30, 41, 59, 0.4)",
                  }}>
                    <span className="text-[9px] text-slate-500 block">{v.label}</span>
                    <span className="text-[11px] font-bold text-white">{v.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Confidence</span>
                <span className="font-medium text-white">{comparables.estimatedValueRange.confidence}%</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${comparables.estimatedValueRange.confidence}%`,
                  background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                  boxShadow: "0 0 6px rgba(6, 182, 212, 0.3)",
                }} />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-500">Trend:</span>
                <span className={`text-[10px] font-medium ${
                  comparables.marketTrend === "appreciating" ? "text-emerald-400" :
                  comparables.marketTrend === "declining" ? "text-rose-400" : "text-amber-400"
                }`}>
                  {comparables.marketTrend.replace("_", " ")}
                </span>
              </div>

              {comparables.comparables.length > 0 && (
                <div className="space-y-1 max-h-[140px] overflow-y-auto">
                  {comparables.comparables.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg" style={{
                      background: "rgba(10, 14, 26, 0.3)",
                    }}>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-slate-300 truncate block">{c.title}</span>
                        <span className="text-[8px] text-slate-500">{c.distance}m away</span>
                      </div>
                      <span className="text-[11px] font-medium text-white shrink-0">${c.pricePerSqm}/sqm</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[10px] text-slate-500">Click Analyze to get comparable sales data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
