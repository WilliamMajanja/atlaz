"use client";

const activities = [
  {
    type: "analysis",
    title: "Plot Analysis Run",
    description: "Stone Town - Risk: Medium, Opportunity: Prime",
    timestamp: "2 min ago",
    icon: (
      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    type: "scenario",
    title: "Growth Scenario Simulated",
    description: "Road Upgrade Projection - 5 year outlook generated",
    timestamp: "15 min ago",
    icon: (
      <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    type: "report",
    title: "Due Diligence Report",
    description: "Paje beachfront parcel - report ready for review",
    timestamp: "1 hour ago",
    icon: (
      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    type: "anomaly",
    title: "Anomaly Detected",
    description: "Pricing anomaly in Matemwe - below market average",
    timestamp: "3 hours ago",
    icon: (
      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function RecentActivity() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.95))",
        border: "1px solid rgba(30, 41, 59, 0.6)",
      }}
    >
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
          background: "rgba(6, 182, 212, 0.03)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.08))",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Recent Activity</h3>
        </div>
        <span className="text-[10px] text-slate-500">Live feed</span>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(30, 41, 59, 0.4)" }}>
        {activities.map((activity, i) => (
          <div
            key={i}
            className="px-5 py-3 flex items-start gap-3 transition-all duration-200 hover:bg-white/[0.02]"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
              background: "rgba(30, 41, 59, 0.4)",
            }}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-white truncate">{activity.title}</span>
                <span className="text-[9px] text-slate-600 shrink-0">{activity.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
