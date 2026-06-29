"use client";

import { useAnalysisStore } from "@/lib/store";

const stats = [
  {
    label: "Total Portfolio Value",
    value: "$14.2M",
    change: "+12.3%",
    positive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Zones Under Analysis",
    value: "10",
    change: "Active",
    positive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    label: "High-Value Opportunities",
    value: "6",
    change: "+3 this quarter",
    positive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    label: "AI Insights Generated",
    value: "24",
    change: "Updated daily",
    positive: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.95))",
            border: "1px solid rgba(30, 41, 59, 0.6)",
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-cyan-400 blur-3xl" />
          </div>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className={`${stat.positive ? "text-cyan-400" : "text-rose-400"} opacity-60 group-hover:opacity-100 transition-opacity`}>
              {stat.icon}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            <span className={`text-[11px] font-medium ${stat.positive ? "text-emerald-400" : "text-rose-400"}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-2 h-0.5 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
            <div className="h-full w-3/4 rounded-full" style={{
              background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
              boxShadow: "0 0 8px rgba(6, 182, 212, 0.3)",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
