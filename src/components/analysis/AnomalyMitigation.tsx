"use client";

import { useState } from "react";
import type { Anomaly } from "@/modules/anomaly-detection";
import { AnomalyMitigationPlan } from "@/types";

interface AnomalyMitigationProps {
  anomalies: Anomaly[];
}

const effortColors: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const priorityColors: Record<string, string> = {
  immediate: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  short_term: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  medium_term: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  ongoing: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const residualColors: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

export default function AnomalyMitigation({ anomalies }: AnomalyMitigationProps) {
  const [mitigations, setMitigations] = useState<AnomalyMitigationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mitigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anomalies }),
      });
      if (!response.ok) throw new Error("Failed to generate mitigation plans");
      const data = await response.json();
      setMitigations(data.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate mitigation plans");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(16, 185, 129, 0.03)",
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}>
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.14 2.57 2.57-5.14 8.28-8.28a2.828 2.828 0 114 4l-8.28 8.28-5.14 2.57zM12 3v3m0 12v3m-9-9h3m12 0h3" />
            </svg>
          </div>
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Anomaly Mitigation</h3>
            <p className="text-[9px] text-slate-500">AI-powered mitigation planning</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 text-white disabled:opacity-50"
          style={{
            background: isLoading ? "rgba(16, 185, 129, 0.3)" : "linear-gradient(135deg, #10b981, #059669)",
            boxShadow: isLoading ? "none" : "0 0 16px -4px rgba(16, 185, 129, 0.4)",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : mitigations.length > 0 ? "Regenerate" : "Generate Plan"}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="rounded-lg p-3" style={{
            background: "rgba(244, 63, 94, 0.08)",
            border: "1px solid rgba(244, 63, 94, 0.15)",
          }}>
            <p className="text-[11px] text-rose-300">{error}</p>
          </div>
        )}

        {!isLoading && mitigations.length === 0 && !error && (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{
              background: "rgba(30, 41, 59, 0.3)",
              border: "1px solid rgba(30, 41, 59, 0.5)",
            }}>
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.14 2.57 2.57-5.14 8.28-8.28a2.828 2.828 0 114 4l-8.28 8.28-5.14 2.57z" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-300 font-medium mb-1">Generate mitigation plans</p>
            <p className="text-[10px] text-slate-500">AI-powered action plans for each detected anomaly</p>
          </div>
        )}

        {isLoading && mitigations.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg p-4 animate-pulse" style={{
                background: "rgba(17, 24, 39, 0.5)",
                border: "1px solid rgba(30, 41, 59, 0.5)",
              }}>
                <div className="h-3 w-1/3 rounded bg-slate-700/50 mb-3" />
                <div className="h-2 w-full rounded bg-slate-700/30 mb-2" />
                <div className="h-2 w-2/3 rounded bg-slate-700/30" />
              </div>
            ))}
          </div>
        )}

        {mitigations.map((plan) => (
          <div
            key={plan.anomalyId}
            className="rounded-lg overflow-hidden animate-fade-in"
            style={{
              background: "rgba(17, 24, 39, 0.5)",
              border: `1px solid ${
                plan.severity === "critical" ? "rgba(244, 63, 94, 0.3)" :
                plan.severity === "high" ? "rgba(249, 115, 22, 0.3)" :
                plan.severity === "medium" ? "rgba(245, 158, 11, 0.3)" :
                "rgba(30, 41, 59, 0.5)"
              }`,
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{
              borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
            }}>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-white">{plan.anomalyTitle}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-medium uppercase" style={{
                  background: plan.severity === "critical" ? "rgba(244, 63, 94, 0.15)" :
                    plan.severity === "high" ? "rgba(249, 115, 22, 0.15)" :
                    "rgba(245, 158, 11, 0.15)",
                  color: plan.severity === "critical" ? "#fb7185" :
                    plan.severity === "high" ? "#fb923c" : "#fbbf24",
                }}>
                  {plan.severity}
                </span>
              </div>
              <span className={`text-[10px] font-medium ${residualColors[plan.riskResidual] ?? "text-slate-400"}`}>
                Residual: {plan.riskResidual}
              </span>
            </div>

            {plan.aiAssessment && (
              <div className="px-4 py-2.5 text-[11px] text-slate-300 leading-relaxed" style={{
                borderBottom: "1px solid rgba(30, 41, 59, 0.3)",
                background: "rgba(6, 182, 212, 0.03)",
              }}>
                {plan.aiAssessment}
              </div>
            )}

            <div className="px-4 py-3 space-y-2">
              {plan.mitigationActions.map((action, i) => (
                <div key={i} className="rounded-lg p-2.5 transition-all duration-200 hover:bg-white/[0.02]" style={{
                  background: "rgba(10, 14, 26, 0.3)",
                }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase ${priorityColors[action.priority] ?? "text-slate-400"}`}>
                        {action.priority.replace("_", " ")}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${effortColors[action.effort] ?? "text-slate-400"}`}>
                        {action.effort}
                      </span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${effortColors[action.impact] ?? "text-slate-400"}`}>
                      {action.impact} impact
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-white mb-0.5">{action.title}</p>
                  <p className="text-[10px] text-slate-400">{action.description}</p>
                  <p className="text-[9px] text-cyan-400/70 mt-1">Timeline: {action.timeline}</p>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 flex items-center justify-between" style={{
              borderTop: "1px solid rgba(30, 41, 59, 0.3)",
              background: "rgba(10, 14, 26, 0.2)",
            }}>
              <span className="text-[9px] text-slate-500">Estimated Cost</span>
              <span className="text-[11px] font-medium text-white">
                ${plan.costEstimate.low.toLocaleString()} – ${plan.costEstimate.high.toLocaleString()} {plan.costEstimate.currency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
