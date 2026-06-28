"use client";

import { useMapStore, useAnalysisStore } from "@/lib/store";
import { runFullSiteAnalysis } from "@/lib/scoring";
import ScoreCard from "@/components/ui/ScoreCard";
import { BadgeList } from "@/components/ui/Badge";
import AnomalyDetection from "./AnomalyDetection";

export default function AnalysisPanel() {
  const { selectedPoint } = useMapStore();
  const { currentAnalysis, setCurrentAnalysis, saveAnalysis, isAnalyzing, setIsAnalyzing } = useAnalysisStore();

  const handleRunAnalysis = async () => {
    if (!selectedPoint) return;
    setIsAnalyzing(true);
    const analysis = runFullSiteAnalysis(selectedPoint);
    setCurrentAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    if (!currentAnalysis) return;
    saveAnalysis(currentAnalysis);
  };

  return (
    <div className="card overflow-hidden">
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{
          borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
          background: "rgba(59, 130, 246, 0.03)",
        }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}>
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider">Plot Intelligence</h3>
          <p className="text-[9px] text-slate-500">AI-powered site analysis</p>
        </div>
      </div>

      <div className="p-4">
        {selectedPoint ? (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-xl p-3" style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))",
              border: "1px solid rgba(6, 182, 212, 0.12)",
            }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Selected Location</p>
              </div>
              <p className="text-[13px] text-white font-mono font-medium">
                {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
              </p>
            </div>

            {!currentAnalysis ? (
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full rounded-xl text-[12px] font-semibold py-3 px-4 transition-all duration-200 text-white disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: isAnalyzing
                    ? "rgba(59, 130, 246, 0.3)"
                    : "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: isAnalyzing ? "none" : "0 0 24px -4px rgba(59, 130, 246, 0.4)",
                }}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
                    </svg>
                    Run Analysis
                  </span>
                )}
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {currentAnalysis.neighbourhood && (
                  <div className="rounded-xl p-3" style={{
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(168, 85, 247, 0.04))",
                    border: "1px solid rgba(139, 92, 246, 0.12)",
                  }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nearest Zone</p>
                    <p className="text-[13px] text-white font-semibold">{currentAnalysis.neighbourhood}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <ScoreCard
                    label="Risk"
                    value={currentAnalysis.riskScore.overallRisk}
                    band={currentAnalysis.riskScore.riskBand}
                    color={currentAnalysis.riskScore.riskBand === "High" ? "red" : currentAnalysis.riskScore.riskBand === "Medium" ? "yellow" : "green"}
                  />
                  <ScoreCard
                    label="Opportunity"
                    value={currentAnalysis.opportunityScore.overallOpportunity}
                    band={currentAnalysis.opportunityScore.opportunityBand}
                    color={currentAnalysis.opportunityScore.opportunityBand === "Prime" ? "purple" : currentAnalysis.opportunityScore.opportunityBand === "High" ? "blue" : "cyan"}
                  />
                </div>

                <ScoreCard
                  label="Land Opportunity Score"
                  value={currentAnalysis.capitalScore}
                  color="emerald"
                />

                <AnomalyDetection analysis={currentAnalysis} />

                <div className="rounded-xl p-3" style={{
                  background: "rgba(17, 24, 39, 0.5)",
                  border: "1px solid rgba(30, 41, 59, 0.5)",
                }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Suggested Strategy</p>
                  <p className="text-[12px] text-slate-200 leading-relaxed">{currentAnalysis.suggestedStrategy}</p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Intelligence Badges</p>
                  <BadgeList badges={currentAnalysis.badges} />
                </div>

                <div className="rounded-xl p-3" style={{
                  background: "rgba(17, 24, 39, 0.5)",
                  border: "1px solid rgba(30, 41, 59, 0.5)",
                }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Risk Breakdown</p>
                  <div className="space-y-2">
                    {[
                      { label: "Flood Risk", value: currentAnalysis.riskScore.floodRisk, color: "#f43f5e" },
                      { label: "Coastal Exposure", value: currentAnalysis.riskScore.coastalExposure, color: "#f97316" },
                      { label: "Density Pressure", value: currentAnalysis.riskScore.densityPressure, color: "#f59e0b" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-slate-400">{item.label}</span>
                          <span className="text-[11px] text-slate-300 font-medium">{item.value}/100</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                          <div className="h-full rounded-full transition-all duration-500" style={{
                            width: `${item.value}%`,
                            background: item.color,
                            boxShadow: `0 0 8px ${item.color}33`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-3" style={{
                  background: "rgba(17, 24, 39, 0.5)",
                  border: "1px solid rgba(30, 41, 59, 0.5)",
                }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Opportunity Breakdown</p>
                  <div className="space-y-2">
                    {[
                      { label: "Tourism Demand", value: currentAnalysis.opportunityScore.tourismDemand, color: "#06b6d4" },
                      { label: "Infrastructure Access", value: currentAnalysis.opportunityScore.infrastructureAccess, color: "#3b82f6" },
                      { label: "Development Momentum", value: currentAnalysis.opportunityScore.developmentMomentum, color: "#8b5cf6" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-slate-400">{item.label}</span>
                          <span className="text-[11px] text-slate-300 font-medium">{item.value}/100</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                          <div className="h-full rounded-full transition-all duration-500" style={{
                            width: `${item.value}%`,
                            background: item.color,
                            boxShadow: `0 0 8px ${item.color}33`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-3" style={{
                  background: "rgba(17, 24, 39, 0.5)",
                  border: "1px solid rgba(30, 41, 59, 0.5)",
                }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Recommended Actions</p>
                  <ul className="space-y-2">
                    {currentAnalysis.recommendedActions.map((action, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold" style={{
                          background: "rgba(6, 182, 212, 0.1)",
                          color: "#06b6d4",
                          border: "1px solid rgba(6, 182, 212, 0.2)",
                        }}>
                          {i + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-xl text-[12px] font-semibold py-2.5 px-3 transition-all duration-200 text-white hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 0 20px -4px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    Save Analysis
                  </button>
                  <button
                    onClick={() => setCurrentAnalysis(null)}
                    className="rounded-xl text-[12px] font-medium py-2.5 px-3 transition-all duration-200 text-slate-400 hover:text-white"
                    style={{
                      background: "rgba(30, 41, 59, 0.3)",
                      border: "1px solid rgba(30, 41, 59, 0.5)",
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(17, 24, 39, 0.5))",
              border: "1px solid rgba(30, 41, 59, 0.6)",
            }}>
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <p className="text-[13px] text-slate-300 font-medium mb-1">Drop a pin on the map</p>
            <p className="text-[11px] text-slate-500">Then run a Plot Intelligence Analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
