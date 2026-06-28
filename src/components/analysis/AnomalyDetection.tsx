"use client";

import { useState, useCallback } from "react";
import { SiteAnalysisFull } from "@/types";
import { Anomaly, AnomalySeverity, AnomalyCategory, getAnomalySummary } from "@/modules/anomaly-detection";

interface AnomalyDetectionProps {
  analysis: SiteAnalysisFull;
}

interface DetectionState {
  isRunning: boolean;
  anomalies: Anomaly[];
  summary: ReturnType<typeof getAnomalySummary> | null;
  error: string | null;
  isExpanded: boolean;
}

const SEVERITY_CONFIG: Record<AnomalySeverity, { label: string; color: string; bg: string; border: string }> = {
  low: { label: "Low", color: "text-cyan-400", bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.25)" },
  medium: { label: "Medium", color: "text-amber-400", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)" },
  high: { label: "High", color: "text-orange-400", bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.25)" },
  critical: { label: "Critical", color: "text-rose-400", bg: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.25)" },
};

const CATEGORY_CONFIG: Record<AnomalyCategory, { label: string; icon: string }> = {
  price: { label: "Price", icon: "$" },
  risk: { label: "Risk", icon: "!" },
  score: { label: "Score", icon: "#" },
  geographic: { label: "Geographic", icon: "@" },
  data: { label: "Data", icon: "?" },
  environmental: { label: "Environmental", icon: "~" },
};

export default function AnomalyDetection({ analysis }: AnomalyDetectionProps) {
  const [state, setState] = useState<DetectionState>({
    isRunning: false,
    anomalies: [],
    summary: null,
    error: null,
    isExpanded: false,
  });

  const runDetection = useCallback(async () => {
    setState((prev) => ({ ...prev, isRunning: true, error: null }));
    try {
      const response = await fetch("/api/anomaly-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to run anomaly detection");
      const summary = getAnomalySummary(data.anomalies);
      setState({ isRunning: false, anomalies: data.anomalies, summary, error: null, isExpanded: true });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isRunning: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }));
    }
  }, [analysis]);

  return (
    <div className="card overflow-hidden">
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors"
        style={{
          background: "rgba(17, 24, 39, 0.4)",
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
        }}
        onClick={() => setState((prev) => ({ ...prev, isExpanded: !prev.isExpanded }))}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: state.anomalies.length > 0 ? "rgba(244, 63, 94, 0.1)" : "rgba(30, 41, 59, 0.5)",
            border: `1px solid ${state.anomalies.length > 0 ? "rgba(244, 63, 94, 0.2)" : "rgba(30, 41, 59, 0.6)"}`,
          }}>
            <span className={`text-[11px] font-bold ${state.anomalies.length > 0 ? "text-rose-400" : "text-slate-500"}`}>!</span>
          </div>
          <div>
            <h3 className="text-[12px] font-semibold text-white">Anomaly Detection</h3>
            <p className="text-[10px] text-slate-500">
              {state.anomalies.length > 0
                ? `${state.anomalies.length} anomal${state.anomalies.length === 1 ? "y" : "ies"} detected`
                : "Scan for data anomalies"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state.summary && (
            <div className="flex gap-1">
              {state.summary.hasCritical && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{
                  background: "rgba(244, 63, 94, 0.1)",
                  color: "#fb7185",
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                }}>Critical</span>
              )}
              {state.summary.bySeverity.high > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{
                  background: "rgba(249, 115, 22, 0.1)",
                  color: "#fb923c",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                }}>{state.summary.bySeverity.high} High</span>
              )}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); runDetection(); }}
            disabled={state.isRunning}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 text-white disabled:opacity-50"
            style={{
              background: state.isRunning ? "rgba(245, 158, 11, 0.3)" : "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: state.isRunning ? "none" : "0 0 16px -4px rgba(245, 158, 11, 0.4)",
            }}
          >
            {state.isRunning ? (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning...
              </span>
            ) : state.anomalies.length > 0 ? "Rescan" : "Scan"}
          </button>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${state.isExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {state.isExpanded && (
        <div className="p-4 animate-fade-in">
          {state.error && (
            <div className="rounded-lg p-3 mb-4" style={{
              background: "rgba(244, 63, 94, 0.08)",
              border: "1px solid rgba(244, 63, 94, 0.15)",
            }}>
              <p className="text-[11px] text-rose-300">{state.error}</p>
            </div>
          )}

          {state.anomalies.length === 0 && !state.error && !state.isRunning && (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}>
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[12px] text-slate-300 font-medium">No anomalies detected</p>
              <p className="text-[10px] text-slate-500 mt-1">All scoring dimensions are within expected ranges</p>
            </div>
          )}

          {state.summary && state.anomalies.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">By Severity</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(state.summary.bySeverity).map(([severity, count]) => {
                      if (count === 0) return null;
                      const config = SEVERITY_CONFIG[severity as AnomalySeverity];
                      return (
                        <span key={severity} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                          background: config.bg, color: config.color.replace("text-", "").includes("cyan") ? "#22d3ee" :
                            config.color.includes("amber") ? "#fbbf24" :
                            config.color.includes("orange") ? "#fb923c" : "#fb7185",
                          border: `1px solid ${config.border}`,
                        }}>{count} {config.label}</span>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">By Category</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(state.summary.byCategory).map(([category, count]) => {
                      if (count === 0) return null;
                      const config = CATEGORY_CONFIG[category as AnomalyCategory];
                      return (
                        <span key={category} className="text-[10px] px-2 py-0.5 rounded-full text-slate-300" style={{
                          background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(30, 41, 59, 0.6)",
                        }}>{config.icon} {count} {config.label}</span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {state.anomalies.map((anomaly) => {
                  const severityConfig = SEVERITY_CONFIG[anomaly.severity];
                  const categoryConfig = CATEGORY_CONFIG[anomaly.category];
                  const severityColor = anomaly.severity === "critical" ? "#fb7185" :
                    anomaly.severity === "high" ? "#fb923c" :
                    anomaly.severity === "medium" ? "#fbbf24" : "#22d3ee";
                  return (
                    <div key={anomaly.id} className="rounded-lg p-3" style={{
                      background: severityConfig.bg,
                      border: `1px solid ${severityConfig.border}`,
                    }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold" style={{ color: severityColor }}>{categoryConfig.icon}</span>
                          <span className="text-[12px] font-medium text-white">{anomaly.title}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                            background: severityConfig.bg, color: severityColor, border: `1px solid ${severityConfig.border}`,
                          }}>{severityConfig.label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full text-slate-400" style={{
                            background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(30, 41, 59, 0.6)",
                          }}>{categoryConfig.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-2">{anomaly.description}</p>
                      {anomaly.expected && anomaly.actual && (
                        <div className="rounded-lg p-2 mb-2" style={{ background: "rgba(10, 14, 26, 0.4)" }}>
                          <div className="flex gap-4 text-[10px]">
                            <span className="text-slate-500">Expected: <span className="text-slate-300">{anomaly.expected}</span></span>
                            <span className="text-slate-500">Actual: <span style={{ color: severityColor }}>{anomaly.actual}</span></span>
                          </div>
                        </div>
                      )}
                      <p className="text-[10px] text-cyan-400/80">
                        <span className="font-medium">Recommendation:</span> {anomaly.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
