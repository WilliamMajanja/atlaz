"use client";

import { useState } from "react";
import { defaultScenarios, runSimulation } from "@/modules/simulation";
import { GrowthScenario, WalkForwardProjection } from "@/types";

export default function SimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState<GrowthScenario | null>(null);
  const [projections, setProjections] = useState<WalkForwardProjection[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = async () => {
    if (!selectedScenario) return;
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const results = runSimulation(selectedScenario);
    setProjections(results);
    setIsRunning(false);
  };

  const uniqueZones = [...new Set(projections.map((p) => p.zoneId))];
  const years = [...new Set(projections.map((p) => p.year))].sort();

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0a0e1a" }}>
      <header
        className="px-6 py-5"
        style={{
          background: "linear-gradient(180deg, rgba(10, 14, 26, 0.95), rgba(10, 14, 26, 0.8))",
          borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1 className="text-[15px] font-bold text-white tracking-tight">Simulation</h1>
        <p className="text-[11px] text-slate-500 mt-0.5">Walk-forward growth modelling and scenario analysis</p>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.1))",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}>
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </div>
            <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider">Select Growth Scenario</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {defaultScenarios.map((scenario) => {
              const scenarioId = scenario.name.toLowerCase().replace(/\s+/g, "-");
              const isSelected = selectedScenario?.name === scenario.name;
              return (
                <button
                  key={scenarioId}
                  onClick={() => { setSelectedScenario(scenario); setProjections([]); }}
                  className="text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.06))"
                      : "rgba(17, 24, 39, 0.5)",
                    border: isSelected
                      ? "1px solid rgba(59, 130, 246, 0.3)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                    boxShadow: isSelected ? "0 0 20px -4px rgba(59, 130, 246, 0.2)" : "none",
                  }}
                >
                  <h3 className="text-[13px] font-semibold text-white mb-1">{scenario.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{scenario.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-slate-300" style={{
                      background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(30, 41, 59, 0.6)",
                    }}>
                      {scenario.timeHorizonYears}Y horizon
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-slate-300" style={{
                      background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(30, 41, 59, 0.6)",
                    }}>
                      {scenario.affectedZones.length} zones
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedScenario && (
          <div className="flex justify-center">
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="rounded-xl text-[13px] font-semibold py-3 px-10 transition-all duration-200 text-white disabled:opacity-50"
              style={{
                background: isRunning ? "rgba(59, 130, 246, 0.3)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: isRunning ? "none" : "0 0 24px -4px rgba(59, 130, 246, 0.4)",
              }}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Simulation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Run Walk-Forward Projection
                </span>
              )}
            </button>
          </div>
        )}

        {projections.length > 0 && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider">
                Projected Impact — {selectedScenario?.name}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <th className="text-left py-2.5 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Zone</th>
                    {years.map((year) => (
                      <th key={year} className="text-center py-2.5 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {2025 + year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueZones.map((zoneId) => (
                    <tr key={zoneId} style={{ borderBottom: "1px solid rgba(30, 41, 59, 0.3)" }}>
                      <td className="py-2.5 px-3 text-[12px] text-white font-medium capitalize">{zoneId.replace("-", " ")}</td>
                      {years.map((year) => {
                        const proj = projections.find((p) => p.zoneId === zoneId && p.year === year);
                        if (!proj) return <td key={year} className="py-2.5 px-3 text-[11px] text-slate-700">-</td>;
                        return (
                          <td key={year} className="py-2.5 px-3 text-center">
                            <div className="space-y-0.5">
                              <div className="text-[11px] text-cyan-400 font-medium">D:{proj.projectedDemandIndex}</div>
                              <div className="text-[11px] text-emerald-400 font-medium">P:{proj.projectedPriceIndex}</div>
                              <div className="text-[11px] text-amber-400 font-medium">R:{proj.projectedRiskIndex}</div>
                              <div className="text-[10px] text-slate-500">{proj.confidence}%</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex gap-4 text-[10px] text-slate-500">
                <span>D = Demand Index</span>
                <span>P = Price Index</span>
                <span>R = Risk Index</span>
                <span>% = Confidence</span>
              </div>
            </div>
          </div>
        )}

        {selectedScenario && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 179, 8, 0.1))",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}>
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider">Scenario Assumptions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {selectedScenario.assumptions.map((assumption, i) => (
                <div key={i} className="rounded-xl p-4" style={{
                  background: "rgba(17, 24, 39, 0.5)",
                  border: "1px solid rgba(30, 41, 59, 0.5)",
                }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{assumption.parameter}</p>
                  <p className="text-[18px] font-bold text-white">{assumption.value}x</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{assumption.description}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Affected Zones</p>
              <div className="flex gap-2 flex-wrap">
                {selectedScenario.affectedZones.map((zone) => (
                  <span key={zone} className="text-[11px] px-2.5 py-1 rounded-full font-medium text-slate-300 capitalize" style={{
                    background: "rgba(30, 41, 59, 0.4)",
                    border: "1px solid rgba(30, 41, 59, 0.5)",
                  }}>
                    {zone.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl p-4" style={{
          background: "rgba(17, 24, 39, 0.3)",
          border: "1px solid rgba(30, 41, 59, 0.3)",
        }}>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Note:</strong> Simulation projections use deterministic models with mock data for MVP.
            Future versions will incorporate Monte Carlo simulations, real market data, and ML-based forecasting.
          </p>
        </div>
      </div>
    </div>
  );
}
