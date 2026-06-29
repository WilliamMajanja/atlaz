"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BusinessMetrics from "@/components/dashboard/BusinessMetrics";
import DealPipeline from "@/components/dashboard/DealPipeline";
import Concierge from "@/components/dashboard/Concierge";
import CRMModule from "@/components/dashboard/CRMModule";
import POSModule from "@/components/dashboard/POSModule";
import ERPModule from "@/components/dashboard/ERPModule";
import SalesAnalytics from "@/components/dashboard/SalesAnalytics";
import IntelligenceDashboard from "@/components/dashboard/IntelligenceDashboard";
import EnhancedSpeculation from "@/components/dashboard/EnhancedSpeculation";
import OpportunityNavigator from "@/components/dashboard/OpportunityNavigator";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import SpeculationPanel from "@/components/dashboard/SpeculationPanel";
import LayerToggle from "@/components/map/LayerToggle";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import Disclaimer from "@/components/ui/Disclaimer";

const GoogleEarthMap = dynamic(() => import("@/components/map/GoogleEarthMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full" style={{ background: "#0f1525" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <div className="text-slate-600 text-[12px] font-medium">Loading Google Earth...</div>
      </div>
    </div>
  ),
});

type TabType = "map" | "operations" | "crm" | "sales" | "intel" | "speculation" | "erp";

const tabIcons: Record<TabType, string> = {
  map: "🗺️",
  operations: "📊",
  crm: "👥",
  sales: "💰",
  intel: "🧠",
  speculation: "💹",
  erp: "⚡",
};

const tabLabels: Record<TabType, string> = {
  map: "Map View",
  operations: "Operations",
  crm: "CRM",
  sales: "Sales",
  intel: "Intelligence",
  speculation: "Speculation",
  erp: "ERP",
};

function SalesTabContent() {
  return (
    <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
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
  );
}

function IntelTabContent() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <IntelligenceDashboard />
      </div>
    </div>
  );
}

function SpeculationTabContent() {
  return (
    <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <EnhancedSpeculation />
          <QuickActions />
        </div>
        <div className="space-y-4">
          <SpeculationPanel />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("map");

  return (
    <div className="h-full flex flex-col" style={{ background: "#080c18" }}>
      <header
        className="px-4 lg:px-6 py-2.5 flex items-center justify-between shrink-0 gap-2"
        style={{
          background: "linear-gradient(180deg, rgba(8, 12, 24, 0.98), rgba(10, 14, 26, 0.9))",
          borderBottom: "1px solid rgba(26, 37, 64, 0.4)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {(Object.keys(tabIcons) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-2.5 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-[11px] font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                background: activeTab === tab ? "rgba(6, 182, 212, 0.1)" : "rgba(26, 37, 64, 0.2)",
                border: `1px solid ${activeTab === tab ? "rgba(6, 182, 212, 0.15)" : "rgba(26, 37, 64, 0.3)"}`,
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              <span className="mr-1">{tabIcons[tab]}</span>
              <span className="hidden sm:inline">{tabLabels[tab]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab === "map" && (
            <>
              <div
                className="text-[10px] text-slate-600 px-3 py-1.5 rounded-lg hidden sm:block"
                style={{
                  background: "rgba(26, 37, 64, 0.3)",
                  border: "1px solid rgba(26, 37, 64, 0.4)",
                }}
              >
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
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.12)",
            }}
          >
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
                <GoogleEarthMap />
              </div>
              <div className="px-4 pb-3 pt-2 shrink-0 animate-fade-in overflow-y-auto max-h-[320px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <OpportunityNavigator />
                  <RecentActivity />
                </div>
              </div>
            </div>
            {showRightDrawer && (
              <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowRightDrawer(false)} />
            )}
            <div
              className={`${showRightDrawer ? "fixed inset-y-0 right-0 z-30 w-[85vw] max-w-[380px] shadow-2xl" : "hidden"} lg:relative lg:block lg:w-[320px] xl:w-[340px] flex flex-col overflow-hidden shrink-0`}
              style={{
                borderLeft: "1px solid rgba(26, 37, 64, 0.4)",
                background: "rgba(8, 12, 24, 0.96)",
              }}
            >
              <div className="flex lg:hidden items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(26, 37, 64, 0.4)" }}>
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Tools</span>
                <button
                  onClick={() => setShowRightDrawer(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <LayerToggle />
                <QuickActions />
                <SpeculationPanel />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <CRMModule />
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <POSModule />
                  <SalesAnalytics />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sales" && <SalesTabContent />}

        {activeTab === "intel" && <IntelTabContent />}

        {activeTab === "speculation" && <SpeculationTabContent />}

        {activeTab === "erp" && (
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <ERPModule />
              <div className="lg:col-span-2 flex flex-col gap-4">
                <BusinessMetrics />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
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
