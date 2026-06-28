"use client";

import { useAnalysisStore } from "@/lib/store";
import { generateReportFromAnalysis } from "@/lib/scoring";
import { BadgeList } from "@/components/ui/Badge";
import Disclaimer from "@/components/ui/Disclaimer";
import CumulativeAssessment from "@/components/analysis/CumulativeAssessment";
import AnomalyDetection from "@/components/analysis/AnomalyDetection";
import Link from "next/link";

export default function ReportsPage() {
  const { savedAnalyses } = useAnalysisStore();

  const reports = savedAnalyses.map((analysis) => ({
    analysis,
    report: generateReportFromAnalysis(analysis),
  }));

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0a0e1a" }}>
      <header
        className="px-6 py-5 flex items-center justify-between"
        style={{
          background: "linear-gradient(180deg, rgba(10, 14, 26, 0.95), rgba(10, 14, 26, 0.8))",
          borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <h1 className="text-[15px] font-bold text-white tracking-tight">Reports</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Generated intelligence reports for saved analyses</p>
        </div>
        <div className="flex gap-2">
          <button
            disabled
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg text-slate-600 cursor-not-allowed"
            style={{ background: "rgba(30, 41, 59, 0.3)", border: "1px solid rgba(30, 41, 59, 0.4)" }}
            title="PDF export coming soon"
          >
            Export PDF (Coming Soon)
          </button>
          <button
            disabled
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg text-slate-600 cursor-not-allowed"
            style={{ background: "rgba(30, 41, 59, 0.3)", border: "1px solid rgba(30, 41, 59, 0.4)" }}
            title="Print view coming soon"
          >
            Print View (Coming Soon)
          </button>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {reports.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(17, 24, 39, 0.5))",
              border: "1px solid rgba(30, 41, 59, 0.6)",
            }}>
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-[14px] text-slate-300 font-semibold mb-2">No reports generated yet</h3>
            <p className="text-[12px] text-slate-500 mb-5">Run an analysis on the Dashboard, then save it to generate a report</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[12px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-white"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 0 20px -4px rgba(59, 130, 246, 0.4)",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          reports.map(({ analysis, report }, index) => (
            <div
              key={`${analysis.location.latitude}-${analysis.location.longitude}-${index}`}
              className="card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="px-6 py-5" style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(59, 130, 246, 0.03))",
                borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
              }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[14px] font-bold text-white">{report.title}</h2>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Generated: {new Date(report.generatedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <BadgeList badges={report.badges} />
                </div>
              </div>

              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                  <div className="rounded-xl p-3" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <p className="text-[13px] text-white font-semibold">{report.neighbourhood ?? "Unknown"}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {report.location.latitude.toFixed(5)}, {report.location.longitude.toFixed(5)}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Summary</h3>
                  <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[22px] font-bold text-white">{report.riskSummary.overallRisk}</span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{
                        background: report.riskSummary.riskBand === "High" ? "rgba(244, 63, 94, 0.1)" :
                          report.riskSummary.riskBand === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        color: report.riskSummary.riskBand === "High" ? "#fb7185" :
                          report.riskSummary.riskBand === "Medium" ? "#fbbf24" : "#34d399",
                        border: `1px solid ${report.riskSummary.riskBand === "High" ? "rgba(244, 63, 94, 0.2)" :
                          report.riskSummary.riskBand === "Medium" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                      }}>
                        {report.riskSummary.riskBand} Risk
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>Flood Risk: {report.riskSummary.floodRisk}/100</div>
                      <div>Coastal Exposure: {report.riskSummary.coastalExposure}/100</div>
                    </div>
                    {report.riskSummary.keyConcerns.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(30, 41, 59, 0.4)" }}>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Key Concerns</p>
                        <ul className="space-y-1">
                          {report.riskSummary.keyConcerns.map((c, i) => (
                            <li key={i} className="text-[11px] text-rose-400/80 flex items-start gap-1.5">
                              <span className="mt-0.5">•</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Opportunity Summary</h3>
                  <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[22px] font-bold text-white">{report.opportunitySummary.overallOpportunity}</span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{
                        background: report.opportunitySummary.opportunityBand === "Prime" ? "rgba(139, 92, 246, 0.1)" :
                          report.opportunitySummary.opportunityBand === "High" ? "rgba(59, 130, 246, 0.1)" : "rgba(100, 116, 139, 0.1)",
                        color: report.opportunitySummary.opportunityBand === "Prime" ? "#a78bfa" :
                          report.opportunitySummary.opportunityBand === "High" ? "#60a5fa" : "#94a3b8",
                        border: `1px solid ${report.opportunitySummary.opportunityBand === "Prime" ? "rgba(139, 92, 246, 0.2)" :
                          report.opportunitySummary.opportunityBand === "High" ? "rgba(59, 130, 246, 0.2)" : "rgba(100, 116, 139, 0.2)"}`,
                      }}>
                        {report.opportunitySummary.opportunityBand}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>Tourism Demand: {report.opportunitySummary.tourismDemand}/100</div>
                      <div>Infrastructure Access: {report.opportunitySummary.infrastructureAccess}/100</div>
                    </div>
                    {report.opportunitySummary.keyStrengths.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(30, 41, 59, 0.4)" }}>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Key Strengths</p>
                        <ul className="space-y-1">
                          {report.opportunitySummary.keyStrengths.map((s, i) => (
                            <li key={i} className="text-[11px] text-emerald-400/80 flex items-start gap-1.5">
                              <span className="mt-0.5">•</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Capital Allocation</h3>
                  <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[22px] font-bold text-white">{report.capitalAllocation.score}</span>
                      <span className="text-[11px] text-slate-500">/100 Capital Score</span>
                    </div>
                    <p className="text-[13px] text-white font-medium mb-1">{report.capitalAllocation.suggestedStrategy}</p>
                    <p className="text-[11px] text-slate-400">{report.capitalAllocation.investmentThesis}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Diligence Checklist</h3>
                  <div className="rounded-xl p-4" style={{ background: "rgba(17, 24, 39, 0.5)", border: "1px solid rgba(30, 41, 59, 0.5)" }}>
                    <ul className="space-y-2">
                      {report.dueDiligenceChecklist.map((item, i) => (
                        <li key={i} className="text-[12px] text-slate-300 flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5" style={{
                            background: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid rgba(30, 41, 59, 0.6)",
                          }}>
                            <span className="text-[8px] text-slate-600">☐</span>
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <CumulativeAssessment analysis={analysis} />
                <AnomalyDetection analysis={analysis} />
                <Disclaimer />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
