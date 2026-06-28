"use client";

import { usePipelineStore } from "@/lib/store";

const metrics = [
  {
    key: "totalValue",
    label: "Pipeline Value",
    format: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "dealCount",
    label: "Active Deals",
    format: (v: number) => `${v}`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    key: "avgDealSize",
    label: "Avg Deal Size",
    format: (v: number) => `$${(v / 1000).toFixed(0)}K`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    key: "conversionRate",
    label: "Conversion Rate",
    format: (v: number) => `${v}%`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    key: "wonDeals",
    label: "Closed Won",
    format: (v: number) => `${v}`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "avgDaysToClose",
    label: "Avg Days to Close",
    format: (v: number) => `${v}d`,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function BusinessMetrics() {
  const { metrics: data } = usePipelineStore();

  return (
    <div className="grid grid-cols-6 gap-3">
      {metrics.map((m, i) => {
        const value = data[m.key as keyof typeof data] as number;
        return (
          <div
            key={m.key}
            className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] card-premium stagger-${i + 1}"
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-cyan-400 blur-3xl" />
            </div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                {m.label}
              </span>
              <span className="text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
                {m.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white tracking-tight">{m.format(value)}</span>
            </div>
            <div className="mt-2 h-[2px] rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
              <div className="h-full w-3/4 rounded-full" style={{
                background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.3)",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
