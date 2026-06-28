"use client";

import { useState } from "react";
import { usePOSStore } from "@/lib/store";

const statusStyles: Record<string, { color: string; bg: string }> = {
  completed: { color: "#34d399", bg: "rgba(16, 185, 129, 0.1)" },
  pending: { color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)" },
  cancelled: { color: "#fb7185", bg: "rgba(244, 63, 94, 0.1)" },
  draft: { color: "#94a3b8", bg: "rgba(100, 116, 139, 0.1)" },
  sent: { color: "#60a5fa", bg: "rgba(59, 130, 246, 0.1)" },
  paid: { color: "#34d399", bg: "rgba(16, 185, 129, 0.1)" },
  overdue: { color: "#fb7185", bg: "rgba(244, 63, 94, 0.1)" },
};

export default function POSModule() {
  const { transactions, invoices } = usePOSStore();
  const [tab, setTab] = useState<"transactions" | "invoices">("transactions");

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pendingInvoices = invoices.filter(i => i.status === "sent" || i.status === "draft").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="rounded-xl overflow-hidden card-premium h-full flex flex-col">
      <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{
        borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(6, 182, 212, 0.02))",
      }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}>
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">POS & Finance</h3>
            <p className="text-[9px] text-slate-500">${(totalRevenue / 1000).toFixed(0)}K collected · ${(pendingInvoices / 1000).toFixed(0)}K pending</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setTab("transactions")}
            className="text-[9px] px-2.5 py-1 rounded-lg font-medium transition-all"
            style={tab === "transactions" ? { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "#22d3ee" } : { background: "rgba(26, 37, 64, 0.3)", border: "1px solid rgba(26, 37, 64, 0.3)", color: "#64748b" }}
          >
            TX
          </button>
          <button
            onClick={() => setTab("invoices")}
            className="text-[9px] px-2.5 py-1 rounded-lg font-medium transition-all"
            style={tab === "invoices" ? { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "#22d3ee" } : { background: "rgba(26, 37, 64, 0.3)", border: "1px solid rgba(26, 37, 64, 0.3)", color: "#64748b" }}
          >
            INV
          </button>
        </div>
      </div>

      <div className="px-4 pt-3 shrink-0">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: "#34d399" },
            { label: "Pending", value: `$${(pendingInvoices / 1000).toFixed(0)}K`, color: "#fbbf24" },
            { label: "Transactions", value: `${transactions.length}`, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.4)" }}>
              <span className="text-[8px] text-slate-500 uppercase block mb-0.5">{s.label}</span>
              <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-2">
        {tab === "transactions" ? (
          transactions.length > 0 ? (
            transactions.map((tx) => {
              const s = statusStyles[tx.status] || statusStyles.pending;
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.4)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-medium text-white">{tx.description}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: s.bg, color: s.color }}>{tx.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500">
                      <span>{tx.clientName}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{tx.method}</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-white shrink-0">${(tx.amount / 1000).toFixed(1)}K</span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8"><p className="text-[11px] text-slate-500">No transactions yet</p></div>
          )
        ) : (
          invoices.length > 0 ? (
            invoices.map((inv) => {
              const s = statusStyles[inv.status] || statusStyles.draft;
              return (
                <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(10, 14, 26, 0.4)", border: "1px solid rgba(26, 37, 64, 0.4)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-medium text-white">{inv.clientName}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: s.bg, color: s.color }}>{inv.status}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">
                      <span>Due: {inv.dueDate} · {inv.items.length} item(s)</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[12px] font-bold text-white">${(inv.amount / 1000).toFixed(1)}K</span>
                    {inv.paidDate && <p className="text-[8px] text-emerald-500">Paid {inv.paidDate}</p>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8"><p className="text-[11px] text-slate-500">No invoices yet</p></div>
          )
        )}
      </div>
    </div>
  );
}
