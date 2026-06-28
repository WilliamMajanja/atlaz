"use client";

import { useState, useMemo } from "react";
import { calculateCompositeIntelligence } from "@/modules/intelligence";
import { CompositeIntelligence } from "@/types";

type IntelTab = "overview" | "entropy" | "correlation" | "volatility" | "clusters" | "momentum";

const tabs: { key: IntelTab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "entropy", label: "Entropy", icon: "🎲" },
  { key: "correlation", label: "Correlation", icon: "🔗" },
  { key: "volatility", label: "Volatility", icon: "📈" },
  { key: "clusters", label: "Clusters", icon: "🔘" },
  { key: "momentum", label: "Momentum", icon: "⚡" },
];

function EntropyBadge({ value, label }: { value: number; label: string }) {
  const color = value <= 0.3 ? "#34d399" : value <= 0.55 ? "#fbbf24" : "#fb7185";
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{
      background: `${color}15`, color, border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}

function VolRegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    bull: "#34d399", stable: "#60a5fa", transition: "#fbbf24",
    correction: "#fb7185", bear: "#ef4444",
  };
  const c = colors[regime] || "#94a3b8";
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase" style={{
      background: `${c}15`, color: c, border: `1px solid ${c}30`,
    }}>
      {regime}
    </span>
  );
}

function MomentumBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    accelerating: "#34d399", strong: "#22d3ee", stable: "#60a5fa",
    decelerating: "#fbbf24", weak: "#fb7185",
  };
  const c = colors[label] || "#94a3b8";
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{
      background: `${c}15`, color: c, border: `1px solid ${c}30`,
    }}>
      {label}
    </span>
  );
}

function MetricBar({ value, color: barColor }: { value: number; color?: string }) {
  const c = barColor || (value >= 65 ? "#34d399" : value >= 45 ? "#fbbf24" : "#fb7185");
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{
          width: `${Math.min(100, value)}%`,
          background: `linear-gradient(90deg, ${c}88, ${c})`,
        }} />
      </div>
      <span className="text-[9px] text-slate-400 w-8 text-right">{Math.round(value)}</span>
    </div>
  );
}

export default function IntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<IntelTab>("overview");

  const intel: CompositeIntelligence = useMemo(() => calculateCompositeIntelligence(), []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-4 pt-3 pb-2 shrink-0 overflow-x-auto" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.3)",
      }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === t.key ? "text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            style={activeTab === t.key ? {
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.15)",
            } : {
              background: "rgba(26, 37, 64, 0.2)",
              border: "1px solid rgba(26, 37, 64, 0.3)",
            }}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && <OverviewTab intel={intel} />}
        {activeTab === "entropy" && <EntropyTab intel={intel} />}
        {activeTab === "correlation" && <CorrelationTab intel={intel} />}
        {activeTab === "volatility" && <VolatilityTab intel={intel} />}
        {activeTab === "clusters" && <ClustersTab intel={intel} />}
        {activeTab === "momentum" && <MomentumTab intel={intel} />}
      </div>
    </div>
  );
}

function OverviewTab({ intel }: { intel: CompositeIntelligence }) {
  const { entropy, volatility, momentum, clustering } = intel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Market Entropy</span>
          <div className="text-[22px] font-bold text-white mt-1">
            {entropy.overallMarketEntropy.toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-400">
            Most predictable: {entropy.mostPredictableZone}
          </span>
          <span className="text-[9px] text-slate-500 block">Trend: {entropy.entropyTrend}</span>
        </div>

        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Market Volatility</span>
          <div className="text-[22px] font-bold text-white mt-1">
            {(volatility.overallMarketVolatility * 100).toFixed(0)}%
          </div>
          <VolRegimeBadge regime={volatility.dominantRegime} />
          <span className="text-[9px] text-slate-500 block mt-1">
            Most stable: {volatility.mostStableZone}
          </span>
        </div>

        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Market Momentum</span>
          <MomentumBadge label={momentum.overallMarketMomentum} />
          <div className="mt-2 space-y-1">
            {momentum.topMomentumZones.length > 0 && (
              <span className="text-[9px] text-emerald-400 block">
                Top: {momentum.topMomentumZones.join(", ")}
              </span>
            )}
            {momentum.weakeningZones.length > 0 && (
              <span className="text-[9px] text-amber-400 block">
                Weakening: {momentum.weakeningZones.join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Zone Clusters</span>
          <div className="text-[22px] font-bold text-white mt-1">{clustering.clusters.length}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {clustering.clusters.map((c) => (
              <span key={c.id} className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                background: "rgba(6, 182, 212, 0.1)",
                color: "#22d3ee",
                border: "1px solid rgba(6, 182, 212, 0.2)",
              }}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 card-premium">
          <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Zone Entropy Rankings</h3>
          <div className="space-y-1.5">
            {entropy.zoneEntropies.sort((a, b) => a.compositeEntropy - b.compositeEntropy).map((z) => (
              <div key={z.zone} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white">{z.zone}</span>
                  <EntropyBadge value={z.compositeEntropy} label={z.compositeLabel} />
                </div>
                <span className="text-[10px] text-slate-400">{z.compositeEntropy.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 card-premium">
          <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Zone Momentum</h3>
          <div className="space-y-1.5">
            {momentum.zoneMomenta.sort((a, b) => b.momentumScore - a.momentumScore).map((z) => (
              <div key={z.zone} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white">{z.zone}</span>
                  <MomentumBadge label={z.momentumLabel} />
                </div>
                <span className="text-[10px] text-slate-400">{z.momentumScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 card-premium">
        <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Leading Indicator Summary</h3>
        <p className="text-[11px] text-slate-300 leading-relaxed">{momentum.leadingIndicatorSummary}</p>
      </div>

      {clustering.outliers.length > 0 && (
        <div className="rounded-xl p-4 card-premium" style={{ borderColor: "rgba(251, 191, 36, 0.3)" }}>
          <h3 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Outlier Zones</h3>
          <div className="space-y-1.5">
            {clustering.outliers.map((z) => (
              <div key={z} className="flex items-start gap-2">
                <span className="text-[11px] font-medium text-white shrink-0">{z}</span>
                <span className="text-[10px] text-slate-400">{clustering.outlierReasons[z]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntropyTab({ intel }: { intel: CompositeIntelligence }) {
  const { entropy } = intel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 card-premium">
          <h4 className="text-[9px] text-slate-500 uppercase">Price Entropy</h4>
          <p className="text-[10px] text-slate-400 mt-1">Measures price dispersion within each zone. High entropy = wide price variation.</p>
        </div>
        <div className="rounded-xl p-4 card-premium">
          <h4 className="text-[9px] text-slate-500 uppercase">Spatial Entropy</h4>
          <p className="text-[10px] text-slate-400 mt-1">Measures geographic spread of listings. High entropy = dispersed activity.</p>
        </div>
        <div className="rounded-xl p-4 card-premium">
          <h4 className="text-[9px] text-slate-500 uppercase">Signal Entropy</h4>
          <p className="text-[10px] text-slate-400 mt-1">Measures consensus across market signals. High entropy = conflicting signals.</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden card-premium">
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
          <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider">Zone Entropy Matrix</h3>
        </div>
        <div className="p-3 space-y-1">
          <div className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-2 px-2 py-1 text-[8px] text-slate-500 uppercase tracking-wider">
            <span>Zone</span>
            <span className="text-center">Price</span>
            <span className="text-center">Spatial</span>
            <span className="text-center">Signal</span>
            <span className="text-center">Composite</span>
          </div>
          {entropy.zoneEntropies.sort((a, b) => b.compositeEntropy - a.compositeEntropy).map((z) => (
            <div key={z.zone} className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-2 items-center px-2 py-1.5 rounded-lg" style={{
              background: "rgba(10, 14, 26, 0.4)",
            }}>
              <span className="text-[11px] text-white font-medium">{z.zone}</span>
              <div className="flex justify-center">
                <EntropyBadge value={z.priceEntropy} label={z.priceEntropyLabel.replace(/_/g, " ")} />
              </div>
              <div className="flex justify-center">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  z.spatialEntropyLabel === "concentrated" ? "text-emerald-400 bg-emerald-500/10" :
                  z.spatialEntropyLabel === "dispersed" ? "text-amber-400 bg-amber-500/10" :
                  "text-blue-400 bg-blue-500/10"
                }`}>{z.spatialEntropyLabel}</span>
              </div>
              <div className="flex justify-center">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  z.signalEntropyLabel === "unanimous" ? "text-emerald-400 bg-emerald-500/10" :
                  z.signalEntropyLabel === "conflicted" ? "text-rose-400 bg-rose-500/10" :
                  "text-amber-400 bg-amber-500/10"
                }`}>{z.signalEntropyLabel}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[11px] text-white font-mono">{z.compositeEntropy.toFixed(2)}</span>
                <EntropyBadge value={z.compositeEntropy} label={z.compositeLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CorrelationTab({ intel }: { intel: CompositeIntelligence }) {
  const { correlation } = intel;
  const [showMetric, setShowMetric] = useState(true);

  const topCorrelations = correlation.zonePairs.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setShowMetric(true)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${showMetric ? "text-white" : "text-slate-500"}`}
          style={showMetric ? { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.15)" } : {}}
        >
          Cross-Metric
        </button>
        <button
          onClick={() => setShowMetric(false)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${!showMetric ? "text-white" : "text-slate-500"}`}
          style={!showMetric ? { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.15)" } : {}}
        >
          Zone Pairs
        </button>
      </div>

      {showMetric ? (
        <div className="rounded-xl overflow-hidden card-premium">
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
            <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider">Cross-Metric Correlations</h3>
          </div>
          <div className="p-3 space-y-1">
            <div className="grid grid-cols-[1fr_1fr_80px_60px] gap-2 px-2 py-1 text-[8px] text-slate-500 uppercase tracking-wider">
              <span>Metric A</span><span>Metric B</span><span className="text-center">Coeff</span><span className="text-center">Strength</span>
            </div>
            {correlation.crossMetric.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_60px] gap-2 items-center px-2 py-1.5 rounded-lg" style={{
                background: "rgba(10, 14, 26, 0.4)",
              }}>
                <span className="text-[11px] text-white">{m.metricA}</span>
                <span className="text-[11px] text-white">{m.metricB}</span>
                <span className={`text-[11px] text-center font-mono ${m.coefficient >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {m.coefficient.toFixed(2)}
                </span>
                <span className={`text-[9px] text-center px-1.5 py-0.5 rounded-full font-medium ${
                  m.strength === "strong" ? "text-emerald-400 bg-emerald-500/10" :
                  m.strength === "moderate" ? "text-amber-400 bg-amber-500/10" :
                  m.strength === "none" ? "text-slate-500 bg-slate-500/10" :
                  "text-blue-400 bg-blue-500/10"
                }`}>{m.strength}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden card-premium">
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
            <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider">Zone Pair Correlations</h3>
          </div>
          <div className="p-3 space-y-1">
            <div className="grid grid-cols-[1fr_1fr_70px_70px] gap-2 px-2 py-1 text-[8px] text-slate-500 uppercase tracking-wider">
              <span>Zone A</span><span>Zone B</span><span className="text-center">Coeff</span><span className="text-center">Relation</span>
            </div>
            {topCorrelations.map((z, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_70px_70px] gap-2 items-center px-2 py-1.5 rounded-lg" style={{
                background: "rgba(10, 14, 26, 0.4)",
              }}>
                <span className="text-[11px] text-white">{z.zoneA}</span>
                <span className="text-[11px] text-white">{z.zoneB}</span>
                <span className={`text-[11px] text-center font-mono ${z.coefficient >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {z.coefficient.toFixed(2)}
                </span>
                <span className={`text-[8px] text-center px-1.5 py-0.5 rounded-full font-medium ${
                  z.relationship === "peer" ? "text-emerald-400 bg-emerald-500/10" :
                  z.relationship === "divergent" ? "text-rose-400 bg-rose-500/10" :
                  z.relationship === "independent" ? "text-slate-500 bg-slate-500/10" :
                  "text-cyan-400 bg-cyan-500/10"
                }`}>{z.relationship}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 card-premium">
          <h4 className="text-[9px] text-slate-500 uppercase">Strongest Positive</h4>
          <p className="text-[12px] text-emerald-400 font-bold mt-1">
            {correlation.strongestPositive.pair || "N/A"}
          </p>
          {correlation.strongestPositive.coefficient !== 0 && (
            <span className="text-[10px] text-slate-400">
              r = {correlation.strongestPositive.coefficient.toFixed(2)}
            </span>
          )}
        </div>
        <div className="rounded-xl p-4 card-premium">
          <h4 className="text-[9px] text-slate-500 uppercase">Strongest Negative</h4>
          <p className="text-[12px] text-rose-400 font-bold mt-1">
            {correlation.strongestNegative.pair || "N/A"}
          </p>
          {correlation.strongestNegative.coefficient !== 0 && (
            <span className="text-[10px] text-slate-400">
              r = {correlation.strongestNegative.coefficient.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function VolatilityTab({ intel }: { intel: CompositeIntelligence }) {
  const { volatility } = intel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 card-premium">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: volatility.overallMarketVolatility <= 0.3 ? "#34d399" : volatility.overallMarketVolatility <= 0.55 ? "#fbbf24" : "#fb7185" }} />
            <span className="text-[9px] text-slate-500 uppercase">Market Volatility</span>
          </div>
          <span className="text-[20px] font-bold text-white">
            {(volatility.overallMarketVolatility * 100).toFixed(0)}%
          </span>
          <VolRegimeBadge regime={volatility.dominantRegime} />
          <span className="text-[9px] text-slate-500 block mt-1">Confidence: {volatility.regimeConfidence}%</span>
        </div>
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase">Most Stable</span>
          <p className="text-[14px] text-emerald-400 font-bold mt-1">{volatility.mostStableZone}</p>
        </div>
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase">Most Volatile</span>
          <p className="text-[14px] text-rose-400 font-bold mt-1">{volatility.mostVolatileZone}</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden card-premium">
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
          <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider">Zone Volatility Breakdown</h3>
        </div>
        <div className="p-3 space-y-1">
          <div className="grid grid-cols-[1fr_70px_70px_70px_70px_80px] gap-2 px-2 py-1 text-[8px] text-slate-500 uppercase tracking-wider">
            <span>Zone</span><span className="text-center">Price</span><span className="text-center">Momentum</span><span className="text-center">Signal</span><span className="text-center">Overall</span><span className="text-center">Regime</span>
          </div>
          {volatility.zoneVolatilities.sort((a, b) => b.compositeVolatility - a.compositeVolatility).map((v) => (
            <div key={v.zone} className="grid grid-cols-[1fr_70px_70px_70px_70px_80px] gap-2 items-center px-2 py-1.5 rounded-lg" style={{
              background: "rgba(10, 14, 26, 0.4)",
            }}>
              <span className="text-[11px] text-white font-medium">{v.zone}</span>
              <span className={`text-[10px] text-center font-mono ${v.priceVolatility <= 0.3 ? "text-emerald-400" : v.priceVolatility <= 0.55 ? "text-amber-400" : "text-rose-400"}`}>
                {(v.priceVolatility * 100).toFixed(0)}%
              </span>
              <span className={`text-[10px] text-center font-mono ${v.momentumVolatility <= 0.3 ? "text-emerald-400" : v.momentumVolatility <= 0.55 ? "text-amber-400" : "text-rose-400"}`}>
                {(v.momentumVolatility * 100).toFixed(0)}%
              </span>
              <span className={`text-[10px] text-center font-mono ${v.signalVolatility <= 0.3 ? "text-emerald-400" : v.signalVolatility <= 0.55 ? "text-amber-400" : "text-rose-400"}`}>
                {(v.signalVolatility * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-center font-mono text-white">{(v.compositeVolatility * 100).toFixed(0)}%</span>
              <div className="flex justify-center">
                <VolRegimeBadge regime={v.regime} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClustersTab({ intel }: { intel: CompositeIntelligence }) {
  const { clustering } = intel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {clustering.clusters.map((c) => (
          <div key={c.id} className="rounded-xl p-4 card-premium">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-bold text-white">{c.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium text-cyan-400" style={{
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
              }}>
                Score: {c.averageScore}
              </span>
            </div>
            <p className="text-[9px] text-slate-500 mb-2">{c.description}</p>
            <div className="flex flex-wrap gap-1">
              {c.zones.map((z) => (
                <span key={z} className="text-[9px] px-2 py-0.5 rounded-full" style={{
                  background: "rgba(26, 37, 64, 0.5)",
                  color: "#94a3b8",
                  border: "1px solid rgba(26, 37, 64, 0.4)",
                }}>
                  {z}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 card-premium">
        <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Peer Groups</h3>
        <div className="space-y-2">
          {clustering.peerGroups.map((pg) => (
            <div key={pg.anchorZone} className="rounded-lg p-3" style={{ background: "rgba(10, 14, 26, 0.4)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-white">{pg.anchorZone}</span>
                <span className="text-[9px] text-slate-400">→</span>
                {pg.peers.map((p) => (
                  <span key={p} className="text-[10px] text-slate-300">{p}</span>
                ))}
                <span className="text-[8px] text-slate-500 ml-auto">Similarity: {pg.similarityScore}%</span>
              </div>
              {pg.differentiators.length > 0 && (
                <p className="text-[8px] text-amber-400/70">Differentiators: {pg.differentiators.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {clustering.outliers.length > 0 && (
        <div className="rounded-xl p-4 card-premium" style={{ borderColor: "rgba(251, 191, 36, 0.3)" }}>
          <h3 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Outlier Zones</h3>
          <div className="space-y-1.5">
            {clustering.outliers.map((z) => (
              <div key={z} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(10, 14, 26, 0.4)" }}>
                <span className="text-[11px] font-medium text-white shrink-0 w-20">{z}</span>
                <span className="text-[10px] text-slate-400">{clustering.outlierReasons[z]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MomentumTab({ intel }: { intel: CompositeIntelligence }) {
  const { momentum } = intel;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase">Market Momentum</span>
          <MomentumBadge label={momentum.overallMarketMomentum} />
        </div>
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase">Strengthening</span>
          {momentum.topMomentumZones.length > 0 ? (
            <div className="mt-1 space-y-0.5">
              {momentum.topMomentumZones.map((z) => (
                <span key={z} className="text-[11px] text-emerald-400 block">{z}</span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">None detected</span>
          )}
        </div>
        <div className="rounded-xl p-4 card-premium">
          <span className="text-[9px] text-slate-500 uppercase">Weakening</span>
          {momentum.weakeningZones.length > 0 ? (
            <div className="mt-1 space-y-0.5">
              {momentum.weakeningZones.map((z) => (
                <span key={z} className="text-[11px] text-amber-400 block">{z}</span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">None detected</span>
          )}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden card-premium">
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
          <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider">Zone Momentum</h3>
        </div>
        <div className="p-3 space-y-1">
          <div className="grid grid-cols-[1fr_80px_80px_60px] gap-2 px-2 py-1 text-[8px] text-slate-500 uppercase tracking-wider">
            <span>Zone</span><span className="text-center">Score</span><span className="text-center">Accel</span><span className="text-center">Trend</span>
          </div>
          {momentum.zoneMomenta.sort((a, b) => b.momentumScore - a.momentumScore).map((z) => (
            <div key={z.zone} className="grid grid-cols-[1fr_80px_80px_60px] gap-2 items-center px-2 py-2 rounded-lg" style={{
              background: "rgba(10, 14, 26, 0.4)",
            }}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white font-medium">{z.zone}</span>
                <MomentumBadge label={z.momentumLabel} />
              </div>
              <div className="flex justify-center">
                <MetricBar value={z.momentumScore} />
              </div>
              <span className={`text-[10px] text-center font-mono ${z.acceleration > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {z.acceleration > 0 ? "+" : ""}{z.acceleration}
              </span>
              <div className="flex justify-center">
                <MetricBar value={z.trendStrength} color={z.trendStrength >= 50 ? "#34d399" : "#fbbf24"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 card-premium">
        <h3 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Leading vs Lagging Indicators</h3>
        {momentum.zoneMomenta.slice(0, 3).map((z) => (
          <div key={z.zone} className="mb-3">
            <h4 className="text-[10px] font-medium text-white mb-1.5">{z.zone}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[8px] text-cyan-400 uppercase tracking-wider mb-1">Leading</p>
                {z.leadingIndicators.map((i) => (
                  <div key={i.name} className="flex items-center gap-1.5 py-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      i.signal === "positive" ? "bg-emerald-500" :
                      i.signal === "negative" ? "bg-rose-500" : "bg-slate-500"
                    }`} />
                    <span className="text-[9px] text-slate-400">{i.name}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[8px] text-amber-400 uppercase tracking-wider mb-1">Lagging</p>
                {z.laggingIndicators.map((i) => (
                  <div key={i.name} className="flex items-center gap-1.5 py-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      i.signal === "positive" ? "bg-emerald-500" :
                      i.signal === "negative" ? "bg-rose-500" : "bg-slate-500"
                    }`} />
                    <span className="text-[9px] text-slate-400">{i.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
