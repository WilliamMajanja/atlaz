"use client";

import { useState } from "react";
import { useCRMStore } from "@/lib/store";
import { LeadStatus, LeadSource, Communication } from "@/types";

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "New", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.2)" },
  contacted: { label: "Contacted", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.2)" },
  qualified: { label: "Qualified", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.08)", border: "rgba(6, 182, 212, 0.2)" },
  proposal: { label: "Proposal", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)" },
  negotiation: { label: "Negotiation", color: "#f97316", bg: "rgba(249, 115, 22, 0.08)", border: "rgba(249, 115, 22, 0.2)" },
  won: { label: "Won", color: "#10b981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
  lost: { label: "Lost", color: "#64748b", bg: "rgba(100, 116, 139, 0.08)", border: "rgba(100, 116, 139, 0.2)" },
};

const sourceIcons: Record<LeadSource, string> = {
  referral: "🤝", website: "🌐", concierge: "✨", event: "📅", outreach: "📡", partner: "🏢",
};

function LeadCard({ lead, onSelect, isSelected }: { lead: { id: string; name: string; company: string; source: LeadSource; status: LeadStatus; score: number; budget: string; interest: string; lastActivity: string }; onSelect: () => void; isSelected: boolean }) {
  const cfg = statusConfig[lead.status];
  return (
    <div
      onClick={onSelect}
      className="rounded-xl p-3.5 transition-all duration-200 cursor-pointer group"
      style={{
        background: isSelected ? "linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))" : "rgba(10, 14, 26, 0.4)",
        border: isSelected ? "1px solid rgba(6, 182, 212, 0.2)" : "1px solid rgba(26, 37, 64, 0.5)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold" style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            color: "#22d3ee",
          }}>
            {lead.name.charAt(0)}
          </div>
          <div>
            <span className="text-[12px] font-semibold text-white block">{lead.name}</span>
            <span className="text-[9px] text-slate-500">{lead.company}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold" style={{ color: lead.score >= 80 ? "#34d399" : lead.score >= 60 ? "#fbbf24" : "#94a3b8" }}>
          {lead.score}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-2">
        <span>{sourceIcons[lead.source]} {lead.source}</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{lead.budget}</span>
      </div>
      <p className="text-[10px] text-slate-400 mb-2.5 line-clamp-1">{lead.interest}</p>
      <div className="flex items-center justify-between">
        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          {cfg.label}
        </span>
        <span className="text-[8px] text-slate-600">{lead.lastActivity}</span>
      </div>
    </div>
  );
}

export default function CRMModule() {
  const { leads, selectedLead, setSelectedLead, updateLeadStatus } = useCRMStore();
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="rounded-xl overflow-hidden card-premium h-full flex flex-col">
      <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(6, 182, 212, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.1))",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}>
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">CRM</h3>
            <p className="text-[9px] text-slate-500">{leads.length} leads · {leads.filter(l => l.status === "won").length} won</p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full text-[11px] px-3 py-2 rounded-lg outline-none transition-all"
            style={{ background: "rgba(10, 14, 26, 0.5)", border: "1px solid rgba(26, 37, 64, 0.5)", color: "#f0f4f8" }}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {(["all", "new", "contacted", "qualified", "proposal", "negotiation", "won"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-[9px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all"
              style={filter === s ? {
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                color: "#22d3ee",
              } : {
                background: "rgba(26, 37, 64, 0.3)",
                border: "1px solid rgba(26, 37, 64, 0.3)",
                color: "#64748b",
              }}
            >
              {s === "all" ? "All" : statusConfig[s]?.label ?? s} {s !== "all" && statusCounts[s] ? `(${statusCounts[s]})` : `(${leads.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-2">
        {filtered.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            isSelected={selectedLead?.id === lead.id}
            onSelect={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[11px] text-slate-500">No leads match this filter</p>
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="shrink-0 p-3 animate-slide-up" style={{
          borderTop: "1px solid rgba(26, 37, 64, 0.5)",
          background: "rgba(10, 14, 26, 0.6)",
        }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Quick Actions</span>
            <button onClick={() => setSelectedLead(null)} className="text-[9px] text-slate-500 hover:text-white">Close</button>
          </div>
          <div className="flex gap-1.5">
            {(["contacted", "qualified", "proposal", "negotiation", "won", "lost"] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateLeadStatus(selectedLead.id, s)}
                className="text-[8px] px-2 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: statusConfig[s].bg,
                  border: `1px solid ${statusConfig[s].border}`,
                  color: statusConfig[s].color,
                }}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
