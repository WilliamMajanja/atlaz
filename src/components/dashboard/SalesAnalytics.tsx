"use client";

import { usePipelineStore } from "@/lib/store";

export default function SalesAnalytics() {
  const { deals, metrics } = usePipelineStore();

  const wonTotal = deals.filter(d => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const pipelineTotal = deals.reduce((s, d) => s + d.value, 0);
  const wonCount = deals.filter(d => d.stage === "won").length;
  const activeCount = deals.filter(d => !["won", "lost"].includes(d.stage)).length;
  const winRate = deals.length > 0 ? Math.round((wonCount / deals.length) * 100) : 0;

  const stageData = [
    { stage: "Discovery", count: deals.filter(d => d.stage === "discovery").length, value: deals.filter(d => d.stage === "discovery").reduce((s, d) => s + d.value, 0), color: "#3b82f6" },
    { stage: "Due Diligence", count: deals.filter(d => d.stage === "due_diligence").length, value: deals.filter(d => d.stage === "due_diligence").reduce((s, d) => s + d.value, 0), color: "#f59e0b" },
    { stage: "Negotiation", count: deals.filter(d => d.stage === "negotiation").length, value: deals.filter(d => d.stage === "negotiation").reduce((s, d) => s + d.value, 0), color: "#8b5cf6" },
    { stage: "Closing", count: deals.filter(d => d.stage === "closing").length, value: deals.filter(d => d.stage === "closing").reduce((s, d) => s + d.value, 0), color: "#10b981" },
  ];

  const maxValue = Math.max(...stageData.map(s => s.value), 1);

  return (
    <div className="rounded-xl overflow-hidden card-premium h-full flex flex-col">
      <div className="px-5 py-3.5" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(217, 119, 6, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">Sales Analytics</h3>
            <p className="text-[9px] text-slate-500">{activeCount} active · {wonCount} won · {winRate}% win rate</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Pipeline", value: `$${(pipelineTotal / 1000000).toFixed(1)}M`, color: "#22d3ee" },
            { label: "Won", value: `$${(wonTotal / 1000000).toFixed(1)}M`, color: "#34d399" },
            { label: "Win Rate", value: `${winRate}%`, color: "#fbbf24" },
            { label: "Avg Deal", value: `$${(metrics.avgDealSize / 1000).toFixed(0)}K`, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.4)" }}>
              <span className="text-[8px] text-slate-500 uppercase block mb-0.5">{s.label}</span>
              <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Pipeline by Stage</p>
          <div className="space-y-2">
            {stageData.map((s) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-slate-400">{s.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{s.count} deals</span>
                    <span className="font-medium text-white">${(s.value / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${(s.value / maxValue) * 100}%`,
                    background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`,
                    boxShadow: `0 0 6px ${s.color}40`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-3" style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(59, 130, 246, 0.02))",
          border: "1px solid rgba(6, 182, 212, 0.1)",
        }}>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Conversion Funnel</p>
          <div className="flex items-end justify-between gap-1 h-16">
            {stageData.map((s, i) => {
              const height = maxValue > 0 ? (s.value / maxValue) * 100 : 0;
              return (
                <div key={s.stage} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-medium" style={{ color: s.color }}>{s.count}</span>
                  <div className="w-full rounded-t transition-all duration-500" style={{
                    height: `${Math.max(height, 8)}%`,
                    background: `linear-gradient(180deg, ${s.color}, ${s.color}88)`,
                    borderRadius: "4px 4px 0 0",
                  }} />
                  <span className="text-[7px] text-slate-600">{s.stage.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(26, 37, 64, 0.4)" }} className="pt-3">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Top Clients</p>
          <div className="space-y-1.5">
            {[
              { name: "Anna Petrova", value: 520000, deals: 1 },
              { name: "James Mwangi", value: 2500000, deals: 1 },
              { name: "Blue Ocean Hospitality", value: 3100000, deals: 1 },
              { name: "Emma Watson", value: 850000, deals: 1 },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg" style={{ background: "rgba(10, 14, 26, 0.3)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-white">{c.name}</span>
                  <span className="text-[8px] text-slate-500">{c.deals} deal{c.deals > 1 ? "s" : ""}</span>
                </div>
                <span className="text-[10px] font-medium text-white">${(c.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
