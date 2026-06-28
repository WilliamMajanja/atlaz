"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const stats = [
  { label: "Zones Tracked", value: "10", desc: "Across Unguja & Pemba" },
  { label: "Data Sources", value: "12+", desc: "Government, GIS, Satellite" },
  { label: "Pipeline Value", value: "$14.1M", desc: "Active deal pipeline" },
  { label: "AI Insights", value: "24/7", desc: "Real-time intelligence" },
];

const features = [
  { icon: "🗺️", title: "Interactive Mapping", desc: "Multi-layer GIS with satellite, flood risk, development zones, and infrastructure overlays. Drop a pin anywhere for instant intelligence." },
  { icon: "📊", title: "Plot Intelligence", desc: "AI-powered risk, opportunity, and capital scoring. Anomaly detection with automated mitigation planning." },
  { icon: "📈", title: "Growth Simulation", desc: "Walk-forward scenario modeling. Test road upgrades, visa programs, and infrastructure developments before they happen." },
  { icon: "👥", title: "CRM & Deal Pipeline", desc: "Track leads, manage relationships, and move deals through a Kanban pipeline from discovery to closing." },
  { icon: "💰", title: "POS & Invoicing", desc: "Process payments, manage invoices, and track revenue across all transactions and deal stages." },
  { icon: "⚡", title: "ERP & Task Management", desc: "Assign tasks, manage team utilization, and track property inventory across your portfolio." },
  { icon: "🤖", title: "AI Concierge", desc: "Guided discovery for non-technical users. Answer 3 questions and get personalized opportunities — no training required." },
  { icon: "🧠", title: "Speculation Engine", desc: "Entry/exit signals, price targets, risk-reward ratios, and AI-generated speculation briefs for every zone." },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#080c18" }}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }} />

      <header className="relative px-8 py-5 flex items-center justify-between" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.4)",
        background: "linear-gradient(180deg, rgba(8, 12, 24, 0.98), rgba(10, 14, 26, 0.9))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)",
            boxShadow: "0 0 24px rgba(6, 182, 212, 0.3)",
          }}>
            <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[16px] font-bold" style={{
              background: "linear-gradient(135deg, #f0f4f8, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Atlaz</h1>
            <p className="text-[9px] text-slate-600">Land Intelligence &amp; Business Operations</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[12px] font-semibold px-5 py-2.5 rounded-xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            boxShadow: "0 0 24px -4px rgba(6, 182, 212, 0.3)",
          }}
        >
          Launch Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </header>

      <div className="relative px-8 pt-20 pb-16 text-center" style={{
        background: "linear-gradient(180deg, rgba(6, 182, 212, 0.04) 0%, transparent 50%, transparent 100%)",
      }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium mb-6" style={{
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.15)",
            color: "#5eead4",
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Best-in-Class Land Intelligence Platform
          </div>
          <h1 className="text-[42px] font-bold leading-tight mb-4" style={{
            background: "linear-gradient(135deg, #f0f4f8 0%, #94a3b8 40%, #06b6d4 70%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Intelligence for Frontier<br />Real Estate Markets
          </h1>
          <p className="text-[15px] text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Atlaz combines interactive mapping, AI-powered analysis, deal pipeline management,<br />
            and business operations into one platform purpose-built for Zanzibar's land market.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 text-[13px] font-semibold px-7 py-3.5 rounded-xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)",
                boxShadow: "0 0 32px -6px rgba(6, 182, 212, 0.4)",
              }}
            >
              <span>✨</span>
              Enter the Command Center
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-[13px] font-medium px-6 py-3.5 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
              style={{ border: "1px solid rgba(26, 37, 64, 0.6)" }}
            >
              View Data Sources
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 py-12" style={{ borderTop: "1px solid rgba(26, 37, 64, 0.4)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-5 text-center card-premium">
                <span className="text-[28px] font-bold text-white block mb-1">{s.value}</span>
                <span className="text-[11px] font-medium text-slate-300 block">{s.label}</span>
                <span className="text-[9px] text-slate-600 mt-0.5 block">{s.desc}</span>
              </div>
            ))}
          </div>

          <h2 className="text-[22px] font-bold text-white text-center mb-10">Everything you need for land intelligence</h2>
          <div className="grid grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl p-5 card-premium group hover:scale-[1.02]">
                <span className="text-2xl block mb-3 group-hover:animate-float">{f.icon}</span>
                <h3 className="text-[13px] font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-12 text-center" style={{
        borderTop: "1px solid rgba(26, 37, 64, 0.4)",
        background: "linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.02))",
      }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-[20px] font-bold text-white mb-3">Ready to explore?</h2>
          <p className="text-[12px] text-slate-400 mb-6">No installation, no account needed. Everything is pre-loaded with sample data.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 text-[13px] font-semibold px-6 py-3 rounded-xl text-white transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              boxShadow: "0 0 24px -4px rgba(6, 182, 212, 0.3)",
            }}
          >
            🚀 Launch Dashboard
          </Link>
          <p className="text-[9px] text-slate-600 mt-4">
            The Atlaz Method — <span className="text-slate-500">Discover · Match · Analyze · Act</span>
          </p>
        </div>
      </div>
    </div>
  );
}
