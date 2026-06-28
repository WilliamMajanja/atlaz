"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import BusinessMetrics from "@/components/dashboard/BusinessMetrics";
import DealPipeline from "@/components/dashboard/DealPipeline";
import Concierge from "@/components/dashboard/Concierge";
import CRMModule from "@/components/dashboard/CRMModule";
import POSModule from "@/components/dashboard/POSModule";
import ERPModule from "@/components/dashboard/ERPModule";
import SalesAnalytics from "@/components/dashboard/SalesAnalytics";
import EnhancedSpeculation from "@/components/dashboard/EnhancedSpeculation";
import OpportunityNavigator from "@/components/dashboard/OpportunityNavigator";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import SpeculationPanel from "@/components/dashboard/SpeculationPanel";
import LayerToggle from "@/components/map/LayerToggle";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import Disclaimer from "@/components/ui/Disclaimer";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full" style={{ background: "#0f1525" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <div className="text-slate-600 text-[12px] font-medium">Loading map...</div>
      </div>
    </div>
  ),
});

type TabType = "map" | "operations" | "crm" | "sales" | "intel" | "erp";

const tabIcons: Record<TabType, string> = {
  map: "🗺️",
  operations: "📊",
  crm: "👥",
  sales: "💰",
  intel: "🧠",
  erp: "⚡",
};

const tabLabels: Record<TabType, string> = {
  map: "Map View",
  operations: "Operations",
  crm: "CRM",
  sales: "Sales",
  intel: "Intelligence",
  erp: "ERP",
};

export default function DashboardPage() {
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("map");

  return (
    <div className="h-full flex flex-col" style={{ background: "#080c18" }}>
      <header
        className="px-6 py-2.5 flex items-center justify-between shrink-0"
        style={{
          background: "linear-gradient(180deg, rgba(8, 12, 24, 0.98), rgba(10, 14, 26, 0.9))",
          borderBottom: "1px solid rgba(26, 37, 64, 0.4)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex gap-1">
          {(Object.keys(tabIcons) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              style={activeTab === tab ? {
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.15)",
              } : {
                background: "rgba(26, 37, 64, 0.2)",
                border: "1px solid rgba(26, 37, 64, 0.3)",
              }}
            >
              <span className="mr-1.5">{tabIcons[tab]}</span>
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === "map" && (
            <>
              <div className="text-[10px] text-slate-600 px-3 py-1.5 rounded-lg hidden sm:block" style={{
                background: "rgba(26, 37, 64, 0.3)",
                border: "1px solid rgba(26, 37, 64, 0.4)",
              }}>
                Click map to drop pin
              </div>
              <button
                onClick={() => setShowRightDrawer(!showRightDrawer)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 lg:hidden"
                style={{
                  background: showRightDrawer ? "rgba(6, 182, 212, 0.1)" : "rgba(26, 37, 64, 0.3)",
                  border: `1px solid ${showRightDrawer ? "rgba(6, 182, 212, 0.2)" : "rgba(26, 37, 64, 0.4)"}`,
                  color: showRightDrawer ? "#22d3ee" : "#94a3b8",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Tools
              </button>
            </>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.12)",
          }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400">Live</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "map" && (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 pt-3 pb-0 shrink-0 animate-fade-in">
                <BusinessMetrics />
              </div>
              <div className="flex-1 relative p-4 pt-2 pb-0 animate-fade-in">
                <MapComponent />
              </div>
              <div className="px-4 pb-3 pt-2 shrink-0 animate-fade-in">
                <div className="grid grid-cols-3 gap-3">
                  <OpportunityNavigator />
                  <div className="col-span-2">
                    <RecentActivity />
                  </div>
                </div>
              </div>
            </div>
            <div className={`${showRightDrawer ? "block" : "hidden"} lg:block w-[340px] flex flex-col overflow-hidden shrink-0`} style={{
              borderLeft: "1px solid rgba(26, 37, 64, 0.4)",
              background: "rgba(8, 12, 24, 0.6)",
            }}>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <QuickActions />
                <SpeculationPanel />
                <LayerToggle />
                <AnalysisPanel />
              </div>
              <div className="p-3" style={{ borderTop: "1px solid rgba(26, 37, 64, 0.4)" }}>
                <Disclaimer />
              </div>
            </div>
          </>
        )}

        {activeTab === "operations" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-fade-in">
            <BusinessMetrics />
            <DealPipeline />
          </div>
        )}

        {activeTab === "crm" && (
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4 h-full">
              <CRMModule />
              <div className="col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <POSModule />
                  <SalesAnalytics />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <BusinessMetrics />
                <DealPipeline />
              </div>
              <div className="space-y-4">
                <SalesAnalytics />
                <div className="card-premium rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5" style={{
                    borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(6, 182, 212, 0.02))",
                  }}>
                    <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Quick Actions</h3>
                  </div>
                  <div className="p-4">
                    <QuickActions />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "intel" && (
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="space-y-4">
                <OpportunityNavigator />
                <SpeculationPanel />
              </div>
              <div className="space-y-4">
                <EnhancedSpeculation />
              </div>
              <div className="space-y-4">
                <div className="card-premium rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5" style={{
                    borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(59, 130, 246, 0.02))",
                  }}>
                    <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Market Overview</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Market Phase", value: "Rapid Growth", color: "text-emerald-400" },
                        { label: "Risk Level", value: "Moderate", color: "text-amber-400" },
                        { label: "Zones Tracked", value: "10", color: "text-cyan-400" },
                        { label: "Data Sources", value: "12 Live", color: "text-blue-400" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg p-3 text-center" style={{
                          background: "rgba(10, 14, 26, 0.4)",
                          border: "1px solid rgba(26, 37, 64, 0.4)",
                        }}>
                          <span className="text-[9px] text-slate-500 uppercase block mb-1">{s.label}</span>
                          <span className={`text-[13px] font-bold ${s.color}`}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Zanzibar's real estate market is in a rapid growth phase driven by tourism recovery, infrastructure investment, and the new Golden Visa program. Coastal zones continue to outperform with 8-12% annual appreciation.
                    </p>
                  </div>
                </div>
                <div className="card-premium rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5" style={{
                    borderBottom: "1px solid rgba(26, 37, 64, 0.5)",
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(217, 119, 6, 0.02))",
                  }}>
                    <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Key Signals</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { signal: "BUY", zone: "Paje", reason: "High tourism demand, strong rental yields" },
                      { signal: "BUY", zone: "Fumba", reason: "Infrastructure investment driving appreciation" },
                      { signal: "WATCH", zone: "Stone Town", reason: "Premium pricing, limited inventory" },
                      { signal: "HOLD", zone: "Chwaka", reason: "High flood risk, low momentum" },
                    ].map((s) => (
                      <div key={s.zone} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(10, 14, 26, 0.4)" }}>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          s.signal === "BUY" ? "text-emerald-400 bg-emerald-500/10" :
                          s.signal === "WATCH" ? "text-amber-400 bg-amber-500/10" :
                          "text-slate-400 bg-slate-500/10"
                        }`}>{s.signal}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-semibold text-white block">{s.zone}</span>
                          <span className="text-[9px] text-slate-500">{s.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <RecentActivity />
              </div>
            </div>
          </div>
        )}

        {activeTab === "erp" && (
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4 h-full">
              <ERPModule />
              <div className="col-span-2 flex flex-col gap-4">
                <BusinessMetrics />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <POSModule />
                  <SalesAnalytics />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Concierge />
    </div>
  );
}
