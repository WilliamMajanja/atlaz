"use client";

import { useState } from "react";
import { useERPStore } from "@/lib/store";
import { TaskStatus, TaskPriority, TaskCategory } from "@/types";

const priorityConfig: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  urgent: { color: "#fb7185", bg: "rgba(244, 63, 94, 0.1)", label: "Urgent" },
  high: { color: "#fb923c", bg: "rgba(249, 115, 22, 0.1)", label: "High" },
  medium: { color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)", label: "Medium" },
  low: { color: "#94a3b8", bg: "rgba(100, 116, 139, 0.1)", label: "Low" },
};

const statusConfig: Record<TaskStatus, { color: string; bg: string; label: string }> = {
  todo: { color: "#64748b", bg: "rgba(100, 116, 139, 0.1)", label: "To Do" },
  in_progress: { color: "#60a5fa", bg: "rgba(59, 130, 246, 0.1)", label: "In Progress" },
  review: { color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)", label: "Review" },
  done: { color: "#34d399", bg: "rgba(16, 185, 129, 0.1)", label: "Done" },
};

const categoryIcons: Record<TaskCategory, string> = {
  client: "👤", deal: "💰", legal: "⚖️", site_visit: "📍", report: "📊", admin: "⚙️", compliance: "✅",
};

export default function ERPModule() {
  const { tasks, team, inventory, updateTaskStatus, updateInventoryStatus } = useERPStore();
  const [tab, setTab] = useState<"tasks" | "team" | "inventory">("tasks");

  const urgentCount = tasks.filter(t => t.priority === "urgent" && t.status !== "done").length;
  const availableInventory = inventory.filter(i => i.status === "available").length;

  return (
    <div className="rounded-xl overflow-hidden card-premium h-full flex flex-col">
      <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.03), rgba(6, 182, 212, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1))",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}>
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">ERP</h3>
            <p className="text-[9px] text-slate-500">{tasks.length} tasks · {urgentCount > 0 && `${urgentCount} urgent`} · {availableInventory} available</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(["tasks", "team", "inventory"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-[9px] px-2.5 py-1 rounded-lg font-medium capitalize transition-all"
              style={tab === t ? { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "#22d3ee" } : { background: "rgba(26, 37, 64, 0.3)", border: "1px solid rgba(26, 37, 64, 0.3)", color: "#64748b" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tab === "tasks" && (
          tasks.length > 0 ? (
            tasks.map((task) => {
              const pc = priorityConfig[task.priority];
              const sc = statusConfig[task.status];
              return (
                <div key={task.id} className="rounded-xl p-3.5 transition-all hover:bg-white/[0.02]" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.5)" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px]">{categoryIcons[task.category]}</span>
                      <span className="text-[12px] font-medium text-white truncate">{task.title}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: pc.bg, color: pc.color }}>{pc.label}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">{task.description}</p>
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{task.assignedTo}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="text-slate-500">{task.estimatedHours}h</span>
                    </div>
                    <span className="text-slate-500">Due: {task.dueDate}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {(["todo", "in_progress", "review", "done"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateTaskStatus(task.id, s)}
                        className={`text-[8px] px-1.5 py-0.5 rounded font-medium transition-all ${task.status === s ? "ring-1" : ""}`}
                        style={{
                          background: task.status === s ? statusConfig[s].bg : "rgba(26, 37, 64, 0.3)",
                          color: task.status === s ? statusConfig[s].color : "#64748b",
                          borderColor: task.status === s ? "currentColor" : "transparent",
                        }}
                      >
                        {statusConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ) : <div className="text-center py-8"><p className="text-[11px] text-slate-500">No tasks</p></div>
        )}

        {tab === "team" && (
          <div className="space-y-2">
            {team.map((m) => (
              <div key={m.id} className="rounded-xl p-3.5" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.5)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold" style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))",
                    border: "1px solid rgba(6, 182, 212, 0.2)",
                    color: "#22d3ee",
                  }}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <span className="text-[12px] font-semibold text-white block">{m.name}</span>
                    <span className="text-[9px] text-slate-500">{m.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-white block">{m.utilization}%</span>
                    <span className="text-[8px] text-slate-500">utilization</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[9px] text-slate-500 mb-2">
                  <span>{m.activeDeals} deals</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{m.activeTasks} tasks</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {m.specialties.map((s) => (
                    <span key={s} className="text-[8px] px-2 py-0.5 rounded-full" style={{ background: "rgba(6, 182, 212, 0.06)", border: "1px solid rgba(6, 182, 212, 0.1)", color: "#5eead4" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "inventory" && (
          <div className="space-y-2">
            {inventory.map((item) => (
              <div key={item.id} className="rounded-xl p-3.5" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.5)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-semibold text-white block">{item.title}</span>
                    <span className="text-[9px] text-slate-500">{item.zone} · {item.type}</span>
                  </div>
                  <span className="text-[11px] font-bold text-white shrink-0">${(item.price / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-2">
                  <span>{item.areaSqm} sqm</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>${item.pricePerSqm}/sqm</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {item.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[8px] px-1.5 py-0.5 rounded-full text-slate-400" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => updateInventoryStatus(item.id, item.status === "available" ? "reserved" : "available")}
                    className="text-[8px] px-2 py-0.5 rounded font-medium uppercase"
                    style={{
                      background: item.status === "available" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: item.status === "available" ? "#34d399" : "#fbbf24",
                      border: `1px solid ${item.status === "available" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                    }}
                  >
                    {item.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
