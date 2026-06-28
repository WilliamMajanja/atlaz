"use client";

import { useState } from "react";
import { useAnalysisStore } from "@/lib/store";
import { detectAnomalies } from "@/modules/anomaly-detection";
import ScoreCard from "@/components/ui/ScoreCard";
import { BadgeList } from "@/components/ui/Badge";
import Disclaimer from "@/components/ui/Disclaimer";
import CumulativeAssessment from "@/components/analysis/CumulativeAssessment";
import AnomalyDetection from "@/components/analysis/AnomalyDetection";
import AnomalyMitigation from "@/components/analysis/AnomalyMitigation";
import Link from "next/link";

export default function AnalysisPage() {
  const { savedAnalyses, currentAnalysis } = useAnalysisStore();
  const analyses = currentAnalysis ? [currentAnalysis, ...savedAnalyses] : savedAnalyses;
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedAnalysis(expandedAnalysis === key ? null : key);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0a0e1a" }}>
      <header
        className="px-6 py-5"
        style={{
          background: "linear-gradient(180deg, rgba(10, 14, 26, 0.95), rgba(10, 14, 26, 0.8))",
          borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-bold text-white tracking-tight">Plot Intelligence</h1>
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "#60a5fa",
          }}>
            Deep Analysis
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Detailed plot intelligence with anomaly detection &amp; AI mitigation planning</p>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {analyses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(17, 24, 39, 0.5))",
              border: "1px solid rgba(30, 41, 59, 0.6)",
            }}>
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
              </svg>
            </div>
            <h3 className="text-[14px] text-slate-300 font-semibold mb-2">No analyses yet</h3>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[12px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-white hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 0 20px -4px rgba(59, 130, 246, 0.4)",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          analyses.map((analysis, index) => {
            const anomalies = detectAnomalies(analysis);
            const key = `${analysis.location.latitude}-${analysis.location.longitude}-${index}`;
            const isExpanded = expandedAnalysis === key;

            return (
              <div
                key={key}
                className="card overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="px-6 py-4 flex items-start justify-between cursor-pointer transition-colors hover:bg-white/[0.02]"
                  onClick={() => toggleExpand(key)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-bold text-white">
                        {analysis.neighbourhood ?? "Unknown Location"}
                      </h2>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        analysis.opportunityScore.opportunityBand === "Prime" ? "text-violet-300 bg-violet-500/10 border-violet-500/20" :
                        analysis.opportunityScore.opportunityBand === "High" ? "text-blue-300 bg-blue-500/10 border-blue-500/20" :
                        "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      }`} style={{ border: "1px solid" }}>
                        {analysis.opportunityScore.opportunityBand}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      {analysis.location.latitude.toFixed(5)}, {analysis.location.longitude.toFixed(5)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BadgeList badges={analysis.badges.slice(0, 3)} />
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <ScoreCard
                      label="Risk Score"
                      value={analysis.riskScore.overallRisk}
                      band={analysis.riskScore.riskBand}
                      color={analysis.riskScore.riskBand === "High" ? "red" : analysis.riskScore.riskBand === "Medium" ? "yellow" : "green"}
                    />
                    <ScoreCard
                      label="Opportunity"
                      value={analysis.opportunityScore.overallOpportunity}
                      band={analysis.opportunityScore.opportunityBand}
                      color={analysis.opportunityScore.opportunityBand === "Prime" ? "purple" : analysis.opportunityScore.opportunityBand === "High" ? "blue" : "cyan"}
                    />
                    <ScoreCard
                      label="Capital Score"
                      value={analysis.capitalScore}
                      color="emerald"
                    />
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 animate-fade-in border-t pt-4" style={{ borderColor: "rgba(30, 41, 59, 0.4)" }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Risk Factors</h3>
                          <div className="space-y-2">
                            {[
                              { label: "Flood Risk", value: analysis.riskScore.floodRisk, color: "#f43f5e" },
                              { label: "Coastal Exposure", value: analysis.riskScore.coastalExposure, color: "#f97316" },
                              { label: "Density Pressure", value: analysis.riskScore.densityPressure, color: "#f59e0b" },
                              { label: "Infrastructure Risk", value: analysis.riskScore.infrastructureRisk, color: "#eab308" },
                            ].map((item) => (
                              <div key={item.label}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-[11px] text-slate-400">{item.label}</span>
                                  <span className="text-[11px] text-slate-300 font-medium">{Math.round(item.value)}/100</span>
                                </div>
                                <div className="h-1.5 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                                  <div className="h-full rounded-full transition-all duration-500" style={{
                                    width: `${item.value}%`, background: item.color,
                                    boxShadow: `0 0 8px ${item.color}33`,
                                  }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Opportunity Drivers</h3>
                          <div className="space-y-2">
                            {[
                              { label: "Tourism Demand", value: analysis.opportunityScore.tourismDemand, color: "#06b6d4" },
                              { label: "Infrastructure Access", value: analysis.opportunityScore.infrastructureAccess, color: "#3b82f6" },
                              { label: "Development Momentum", value: analysis.opportunityScore.developmentMomentum, color: "#8b5cf6" },
                              { label: "Market Liquidity", value: analysis.opportunityScore.marketLiquidity, color: "#10b981" },
                            ].map((item) => (
                              <div key={item.label}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-[11px] text-slate-400">{item.label}</span>
                                  <span className="text-[11px] text-slate-300 font-medium">{Math.round(item.value)}/100</span>
                                </div>
                                <div className="h-1.5 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                                  <div className="h-full rounded-full transition-all duration-500" style={{
                                    width: `${item.value}%`, background: item.color,
                                    boxShadow: `0 0 8px ${item.color}33`,
                                  }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommended Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {analysis.recommendedActions.map((action, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{
                              background: "rgba(10, 14, 26, 0.3)",
                            }}>
                              <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold" style={{
                                background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4",
                                border: "1px solid rgba(6, 182, 212, 0.2)",
                              }}>{i + 1}</span>
                              <span className="text-[11px] text-slate-300">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {analysis.badges.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Intelligence Badges</h3>
                          <BadgeList badges={analysis.badges} />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <AnomalyDetection analysis={analysis} />
                        <AnomalyMitigation anomalies={anomalies} />
                      </div>

                      <CumulativeAssessment analysis={analysis} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
