"use client";

import { usePipelineStore } from "@/lib/store";
import { DealStage, Deal } from "@/types";
import { useState } from "react";

const stageConfig: Record<DealStage, { label: string; color: string; bg: string; border: string; icon: string }> = {
  discovery: { label: "Discovery", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.2)", icon: "🔍" },
  due_diligence: { label: "Due Diligence", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)", icon: "📋" },
  negotiation: { label: "Negotiation", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.2)", icon: "🤝" },
  closing: { label: "Closing", color: "#10b981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)", icon: "✅" },
  won: { label: "Won", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.08)", border: "rgba(6, 182, 212, 0.2)", icon: "🏆" },
  lost: { label: "Lost", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.08)", border: "rgba(244, 63, 94, 0.2)", icon: "📉" },
};

const priorityColors: Record<string, string> = {
  high: "#f43f5e",
  medium: "#f59e0b",
  low: "#64748b",
};

const stageOrder: DealStage[] = ["discovery", "due_diligence", "negotiation", "closing", "won"];

function DealCard({ deal, onMove }: { deal: Deal; onMove: (id: string, toStage: DealStage) => void }) {
  const [expanded, setExpanded] = useState(false);
  const currentIdx = stageOrder.indexOf(deal.stage);

  return (
    <div className="rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer" style={{ background: "rgba(10, 14, 26, 0.4)" }}>
      <div onClick={() => setExpanded(!expanded)} className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityColors[deal.priority], boxShadow: `0 0 6px ${priorityColors[deal.priority]}40` }} />
            <span className="text-[11px] font-semibold text-white truncate">{deal.title}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 shrink-0 ml-2">${(deal.value / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>{deal.clientName}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>{deal.zone}</span>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 space-y-2 animate-fade-in" style={{ borderTop: "1px solid rgba(26, 37, 64, 0.5)" }}>
            <p className="text-[10px] text-slate-400 leading-relaxed">{deal.notes}</p>
            <div className="flex flex-wrap gap-1">
              {deal.tags.map((tag) => (
                <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-full text-slate-400" style={{
                  background: "rgba(26, 37, 64, 0.5)",
                  border: "1px solid rgba(26, 37, 64, 0.5)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-600">
              <span>Assigned to {deal.assignee}</span>
              <span>{deal.updatedAt}</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 flex gap-1">
        {currentIdx > 0 && (
          <button
            onClick={() => onMove(deal.id, stageOrder[currentIdx - 1])}
            className="flex-1 text-[8px] font-medium py-1 rounded-lg text-slate-500 hover:text-white transition-all"
            style={{ background: "rgba(26, 37, 64, 0.3)", border: "1px solid rgba(26, 37, 64, 0.3)" }}
          >
            ← Back
          </button>
        )}
        {currentIdx < stageOrder.length - 1 && (
          <button
            onClick={() => onMove(deal.id, stageOrder[currentIdx + 1])}
            className="flex-1 text-[8px] font-medium py-1 rounded-lg text-white transition-all"
            style={{
              background: `${stageConfig[deal.stage].color}20`,
              border: `1px solid ${stageConfig[deal.stage].border}`,
            }}
          >
            Advance →
          </button>
        )}
      </div>
    </div>
  );
}

export default function DealPipeline() {
  const { deals, moveDeal, metrics } = usePipelineStore();
  const [showAll, setShowAll] = useState(false);

  const displayDeals = showAll ? deals : deals.filter(d => d.stage !== "won" && d.stage !== "lost");

  return (
    <div
      className="rounded-xl overflow-hidden card-premium"
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(59, 130, 246, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}>
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m0 0v.375c0 .621-.504 1.125-1.125 1.125H3.75" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">Deal Pipeline</h3>
            <p className="text-[10px] text-slate-500">{metrics.dealCount} active deals · ${(metrics.totalPipelineValue / 1000000).toFixed(1)}M pipeline</p>
          </div>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[10px] font-medium px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
          style={{ border: "1px solid rgba(26, 37, 64, 0.5)" }}
        >
          {showAll ? "Active Only" : "All Deals"}
        </button>
      </div>

      <div className="flex gap-3 p-4 overflow-x-auto">
        {stageOrder.map((stage) => {
          const cfg = stageConfig[stage];
          const stageDeals = displayDeals.filter(d => d.stage === stage);
          if (!showAll && (stage === "won" || stage === "lost")) return null;

          return (
              <div key={stage} className="flex-1 min-w-[180px] md:min-w-[220px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">{cfg.icon}</span>
                  <span className="text-[11px] font-semibold text-white">{cfg.label}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  color: cfg.color,
                }}>
                  {stageDeals.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageDeals.length > 0 ? (
                  stageDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onMove={moveDeal} />
                  ))
                ) : (
                  <div className="rounded-xl p-4 text-center" style={{
                    background: "rgba(10, 14, 26, 0.2)",
                    border: "1px dashed rgba(26, 37, 64, 0.4)",
                  }}>
                    <p className="text-[10px] text-slate-600">No deals</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
