"use client";

import { useState } from "react";
import { neighbourhoods } from "@/data/seed/zanzibar";
import { useMapStore } from "@/lib/store";

type Step = "welcome" | "purpose" | "budget" | "timeline" | "risk" | "results";

interface Answers {
  purpose: string | null;
  budget: string | null;
  timeline: string | null;
  risk: string | null;
}

const purposes = [
  { id: "investment", label: "Real Estate Investment", icon: "📈", desc: "Find high-ROI land and property opportunities" },
  { id: "development", label: "Resort Development", icon: "🏗️", desc: "Build hotels, villas, or eco-resorts" },
  { id: "living", label: "Relocation & Living", icon: "🏡", desc: "Find your dream home or retirement spot" },
  { id: "business", label: "Business Expansion", icon: "🏢", desc: "Open a restaurant, shop, or commercial venture" },
];

const budgets = [
  { id: "50k-200k", label: "$50K – $200K", desc: "Entry-level land or small property" },
  { id: "200k-500k", label: "$200K – $500K", desc: "Prime plots and small developments" },
  { id: "500k-2m", label: "$500K – $2M", desc: "Large parcels and resort projects" },
  { id: "2m-plus", label: "$2M+", desc: "Premium estates and institutional investment" },
];

const timelines = [
  { id: "short", label: "0–2 Years", desc: "Quick turnaround / immediate use" },
  { id: "medium", label: "2–5 Years", desc: "Medium-term development horizon" },
  { id: "long", label: "5–10 Years", desc: "Patient capital / land banking" },
];

const riskLevels = [
  { id: "conservative", label: "Conservative", desc: "I prefer safe, proven areas with stable returns", emoji: "🛡️" },
  { id: "balanced", label: "Balanced", desc: "I want a mix of safety and upside potential", emoji: "⚖️" },
  { id: "opportunistic", label: "Opportunistic", desc: "I'm willing to take calculated risks for higher returns", emoji: "🚀" },
];

function getRecommendations(answers: Answers) {
  let filtered = [...neighbourhoods];

  if (answers.purpose === "investment") {
    filtered.sort((a, b) => (b.developmentMomentum + b.tourismScore) - (a.developmentMomentum + a.tourismScore));
  } else if (answers.purpose === "development") {
    filtered.sort((a, b) => (b.tourismScore + b.infrastructureScore) - (a.tourismScore + a.infrastructureScore));
  } else if (answers.purpose === "living") {
    filtered.sort((a, b) => (b.infrastructureScore - b.floodSensitivity) - (a.infrastructureScore - a.floodSensitivity));
  }

  if (answers.risk === "conservative") {
    filtered = filtered.filter((n) => n.floodSensitivity < 60);
  } else if (answers.risk === "opportunistic") {
    filtered.sort((a, b) => (b.developmentMomentum) - (a.developmentMomentum));
  }

  if (answers.timeline === "short") {
    filtered = filtered.filter((n) => n.infrastructureScore >= 50);
  }

  return filtered.slice(0, 3);
}

function getStrategyNote(purpose: string | null): string {
  const notes: Record<string, string> = {
    investment: "Focus on zones with high development momentum and tourism demand. Target areas near planned infrastructure upgrades for maximum appreciation.",
    development: "Prioritize coastal zones with existing tourism infrastructure. Eco-resort and boutique hotel models show strongest returns in current market.",
    living: "Look for areas with established infrastructure, low flood risk, and access to amenities. Stone Town and Fumba offer the best urban living conditions.",
    business: "Target high-foot-traffic tourism corridors and areas with improving infrastructure. Paje and Nungwi have the strongest commercial ecosystems.",
  };
  return notes[purpose ?? ""] ?? "Explore our recommended zones below to find your ideal match.";
}

export default function OpportunityNavigator() {
  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<Answers>({ purpose: null, budget: null, timeline: null, risk: null });
  const { setSelectedPoint, setCenter, setZoom } = useMapStore();

  const handleAnswer = (key: keyof Answers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    const nextSteps: Record<keyof Answers, Step> = {
      purpose: "budget",
      budget: "timeline",
      timeline: "risk",
      risk: "results",
    };
    setStep(nextSteps[key]);
  };

  const handleReset = () => {
    setAnswers({ purpose: null, budget: null, timeline: null, risk: null });
    setStep("welcome");
  };

  const handleFocusZone = (lat: number, lng: number) => {
    setSelectedPoint({ latitude: lat, longitude: lng });
    setCenter({ latitude: lat, longitude: lng });
    setZoom(14);
  };

  const progress = {
    welcome: 0,
    purpose: 20,
    budget: 40,
    timeline: 60,
    risk: 80,
    results: 100,
  };

  const recommendations = step === "results" ? getRecommendations(answers) : [];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-500"
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}>
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.812 7.655L12 3l8.188 4.655m0 0L12 12.31M3.812 7.655L12 12.31M3.812 7.655v8.69L12 21m8.188-4.655V7.655m0 0L12 12.31m8.188 4.655L12 21" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white tracking-tight">Opportunity Navigator</h3>
            <p className="text-[10px] text-slate-500">Guided property matching</p>
          </div>
        </div>
        {step !== "welcome" && (
          <button
            onClick={handleReset}
            className="text-[10px] font-medium text-slate-500 hover:text-white transition-colors px-2.5 py-1 rounded-lg"
            style={{ border: "1px solid rgba(30, 41, 59, 0.5)" }}
          >
            Reset
          </button>
        )}
      </div>

      {step !== "welcome" && (
        <div className="px-5 pt-3 pb-1">
          <div className="h-1 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress[step]}%`,
                background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.3)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-slate-600">Start</span>
            <span className="text-[9px] text-slate-600">Match</span>
          </div>
        </div>
      )}

      <div className="p-5 animate-fade-in" key={step}>
        {step === "welcome" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(59, 130, 246, 0.08))",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}>
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-white mb-2">Find Your Perfect Property</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed mb-6 max-w-sm mx-auto">
              Answer 4 quick questions and we'll match you with the best land opportunities in Zanzibar.
            </p>
            <button
              onClick={() => setStep("purpose")}
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-white hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                boxShadow: "0 0 24px -4px rgba(6, 182, 212, 0.4)",
              }}
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {step === "purpose" && (
          <div>
            <h4 className="text-[14px] font-bold text-white mb-1">What brings you to Zanzibar?</h4>
            <p className="text-[11px] text-slate-500 mb-4">Select your primary goal</p>
            <div className="space-y-2">
              {purposes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAnswer("purpose", p.id)}
                  className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: answers.purpose === p.id
                      ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                      : "rgba(17, 24, 39, 0.5)",
                    border: answers.purpose === p.id
                      ? "1px solid rgba(6, 182, 212, 0.3)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                    boxShadow: answers.purpose === p.id ? "0 0 20px -4px rgba(6, 182, 212, 0.15)" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-white block">{p.label}</span>
                      <span className="text-[10px] text-slate-500">{p.desc}</span>
                    </div>
                    {answers.purpose === p.id && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{
                        background: "rgba(6, 182, 212, 0.2)",
                      }}>
                        <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "budget" && (
          <div>
            <h4 className="text-[14px] font-bold text-white mb-1">What's your budget?</h4>
            <p className="text-[11px] text-slate-500 mb-4">Select your investment range</p>
            <div className="grid grid-cols-2 gap-2">
              {budgets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleAnswer("budget", b.id)}
                  className="text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: answers.budget === b.id
                      ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                      : "rgba(17, 24, 39, 0.5)",
                    border: answers.budget === b.id
                      ? "1px solid rgba(6, 182, 212, 0.3)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                  }}
                >
                  <span className="text-[14px] font-bold text-white block">{b.label}</span>
                  <span className="text-[10px] text-slate-500">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "timeline" && (
          <div>
            <h4 className="text-[14px] font-bold text-white mb-1">What's your timeline?</h4>
            <p className="text-[11px] text-slate-500 mb-4">When do you plan to start?</p>
            <div className="space-y-2">
              {timelines.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleAnswer("timeline", t.id)}
                  className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: answers.timeline === t.id
                      ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                      : "rgba(17, 24, 39, 0.5)",
                    border: answers.timeline === t.id
                      ? "1px solid rgba(6, 182, 212, 0.3)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: answers.timeline === t.id ? "rgba(6, 182, 212, 0.15)" : "rgba(30, 41, 59, 0.3)",
                    }}>
                      <span className={`text-[11px] font-bold ${answers.timeline === t.id ? "text-cyan-400" : "text-slate-500"}`}>
                        {t.id === "short" ? "1" : t.id === "medium" ? "5" : "10"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-[13px] font-semibold text-white block">{t.label}</span>
                      <span className="text-[10px] text-slate-500">{t.desc}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "risk" && (
          <div>
            <h4 className="text-[14px] font-bold text-white mb-1">What's your risk comfort level?</h4>
            <p className="text-[11px] text-slate-500 mb-4">This helps us match you to the right zones</p>
            <div className="space-y-2">
              {riskLevels.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleAnswer("risk", r.id)}
                  className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: answers.risk === r.id
                      ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                      : "rgba(17, 24, 39, 0.5)",
                    border: answers.risk === r.id
                      ? "1px solid rgba(6, 182, 212, 0.3)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{r.emoji}</span>
                    <div className="flex-1">
                      <span className="text-[13px] font-semibold text-white block">{r.label}</span>
                      <span className="text-[10px] text-slate-500">{r.desc}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-4">
            <div className="rounded-xl p-3.5" style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))",
              border: "1px solid rgba(6, 182, 212, 0.12)",
            }}>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Your Profile</p>
              <div className="flex flex-wrap gap-1.5">
                {answers.purpose && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-cyan-300" style={{
                    background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)",
                  }}>
                    {purposes.find(p => p.id === answers.purpose)?.label}
                  </span>
                )}
                {answers.budget && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-blue-300" style={{
                    background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}>
                    {budgets.find(b => b.id === answers.budget)?.label}
                  </span>
                )}
                {answers.timeline && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-violet-300" style={{
                    background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)",
                  }}>
                    {timelines.find(t => t.id === answers.timeline)?.label}
                  </span>
                )}
                {answers.risk && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-amber-300" style={{
                    background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}>
                    {riskLevels.find(r => r.id === answers.risk)?.label}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {getStrategyNote(answers.purpose)}
            </p>

            <div className="space-y-2.5">
              {recommendations.length > 0 ? (
                recommendations.map((zone) => {
                  const matchScore = Math.round(
                    (zone.tourismScore + zone.developmentMomentum + zone.infrastructureScore) / 3
                  );
                  const matchColor = matchScore >= 75 ? "text-emerald-400" : matchScore >= 60 ? "text-amber-400" : "text-slate-400";
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleFocusZone(zone.latitude, zone.longitude)}
                      className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
                      style={{
                        background: "rgba(17, 24, 39, 0.5)",
                        border: "1px solid rgba(30, 41, 59, 0.5)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-white">{zone.name}</span>
                          <span className={`text-[11px] font-semibold ${matchColor}`}>{matchScore}% Match</span>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                          Focus on map →
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2">{zone.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                          background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.15)", color: "#34d399",
                        }}>
                          Tourism {zone.tourismScore}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                          background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.15)", color: "#60a5fa",
                        }}>
                          Infrastructure {zone.infrastructureScore}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                          background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.15)", color: "#fbbf24",
                        }}>
                          Momentum {zone.developmentMomentum}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                          background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.15)", color: "#a78bfa",
                        }}>
                          ${zone.pricePerSqmMin}–${zone.pricePerSqmMax}/sqm
                        </span>
                      </div>
                      <div className="mt-2 h-0.5 rounded-full" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{
                          width: `${matchScore}%`,
                          background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                          boxShadow: "0 0 6px rgba(6, 182, 212, 0.3)",
                        }} />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-[12px] text-slate-400">No exact matches found. Try adjusting your preferences.</p>
                  <button onClick={handleReset} className="mt-3 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    Start over
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
