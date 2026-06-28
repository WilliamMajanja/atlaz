"use client";

import Link from "next/link";

const actions = [
  {
    href: "/analysis",
    label: "View All Analyses",
    desc: "Browse saved plot intelligence reports",
    color: "#3b82f6",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
      </svg>
    ),
  },
  {
    href: "/simulation",
    label: "Run Simulation",
    desc: "Model growth scenarios and projections",
    color: "#8b5cf6",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "Generate Report",
    desc: "Create due diligence PDF reports",
    color: "#10b981",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Data Sources",
    desc: "Manage connectors and data layers",
    color: "#f59e0b",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.95))",
        border: "1px solid rgba(30, 41, 59, 0.6)",
      }}
    >
      <div
        className="px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
          background: "rgba(6, 182, 212, 0.03)",
        }}
      >
        <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(30, 41, 59, 0.4)" }}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="p-4 transition-all duration-200 hover:bg-white/[0.03] group"
            style={{ background: "transparent" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-200 group-hover:scale-110" style={{
              background: `${action.color}15`,
              border: `1px solid ${action.color}25`,
            }}>
              <span style={{ color: action.color }}>{action.icon}</span>
            </div>
            <span className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition-colors block">
              {action.label}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{action.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
