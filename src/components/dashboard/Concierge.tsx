"use client";

import { useConciergeStore, useMapStore } from "@/lib/store";
import { useEffect, useState } from "react";

const goals = [
  { id: "invest", label: "Invest for Returns", desc: "Find high-growth land and property investments", emoji: "📈" },
  { id: "develop", label: "Build & Develop", desc: "Build hotels, villas, or eco-resorts", emoji: "🏗️" },
  { id: "live", label: "Live & Relocate", desc: "Find a home or retirement property", emoji: "🏡" },
  { id: "explore", label: "Just Exploring", desc: "Browse opportunities and learn about the market", emoji: "🔍" },
];

const budgets = [
  { id: "entry", label: "Under $200K", desc: "Entry-level land or small property" },
  { id: "mid", label: "$200K – $500K", desc: "Prime plots and small developments" },
  { id: "premium", label: "$500K – $2M", desc: "Large parcels and resort projects" },
  { id: "institutional", label: "$2M+", desc: "Premium estates and institutional investment" },
];

const timelines = [
  { id: "now", label: "Ready Now (0-2 yrs)", emoji: "⚡" },
  { id: "soon", label: "Medium Term (2-5 yrs)", emoji: "📅" },
  { id: "later", label: "Long Term (5-10 yrs)", emoji: "🎯" },
];

const experiences = [
  { id: "first", label: "First-Time Buyer", desc: "New to Zanzibar real estate — I need guidance" },
  { id: "some", label: "Some Experience", desc: "I've bought property before but need market insights" },
  { id: "expert", label: "Experienced Investor", desc: "I know the market — just need data & analysis" },
];

function getStepAdvice(step: string, answers: Record<string, string | null>) {
  const advice: Record<string, string> = {
    invest: "Zanzibar's tourism corridor from Paje to Nungwi offers the strongest rental yields at 8-12%. For capital appreciation, look at emerging zones like Fumba and Michamvi where infrastructure investments are driving growth.",
    develop: "The Zanzibar government is actively encouraging eco-resort and boutique hotel development. Coastal zones with existing tourism infrastructure (Paje, Nungwi, Kendwa) offer the fastest path to revenue.",
    live: "Stone Town and Fumba offer the best urban amenities with established infrastructure. For beach living, Paje and Jambiani provide the best balance of community and coastal access.",
    explore: "Start by exploring our interactive map. Click any zone to see its intelligence profile — risk scores, opportunity ratings, and strategic recommendations.",
  };
  return advice[answers.goal ?? ""] ?? "Let me guide you through the best opportunities Zanzibar has to offer.";
}

function getRecommendedZones(answers: Record<string, string | null>) {
  const zones: Record<string, { name: string; reason: string; score: number; lat: number; lng: number }[]> = {
    invest: [
      { name: "Paje", reason: "Highest tourism demand + strong momentum", score: 92, lat: -6.43, lng: 39.79 },
      { name: "Fumba", reason: "Emerging zone with major infrastructure investment", score: 85, lat: -6.31, lng: 39.29 },
      { name: "Nungwi", reason: "Established tourism hub, premium pricing", score: 88, lat: -5.73, lng: 39.30 },
    ],
    develop: [
      { name: "Kendwa", reason: "Premium coastal location, resort-ready", score: 90, lat: -5.75, lng: 39.28 },
      { name: "Michamvi", reason: "Undeveloped coastline with high upside", score: 82, lat: -6.16, lng: 39.50 },
      { name: "Paje", reason: "Existing tourism ecosystem, proven demand", score: 88, lat: -6.43, lng: 39.79 },
    ],
    live: [
      { name: "Stone Town", reason: "Best infrastructure, culture, and amenities", score: 85, lat: -6.16, lng: 39.19 },
      { name: "Fumba", reason: "Master-planned community, modern living", score: 80, lat: -6.31, lng: 39.29 },
      { name: "Jambiani", reason: "Relaxed beach lifestyle, growing community", score: 75, lat: -6.32, lng: 39.55 },
    ],
    explore: [
      { name: "Stone Town", reason: "Start here — most data-rich zone", score: 80, lat: -6.16, lng: 39.19 },
      { name: "Paje", reason: "Best example of tourism-driven growth", score: 88, lat: -6.43, lng: 39.79 },
      { name: "Nungwi", reason: "Premier beach destination", score: 85, lat: -5.73, lng: 39.30 },
    ],
  };
  return zones[answers.goal ?? "explore"] ?? zones.explore;
}

const stepIcons: Record<string, string> = {
  welcome: "👋",
  discover: "🎯",
  match: "🤝",
  review: "📊",
  act: "🚀",
};

const stepTitles: Record<string, string> = {
  welcome: "Welcome to Your Land Intelligence Journey",
  discover: "What brings you to Zanzibar?",
  match: "Let's find your perfect match",
  review: "Your Personalized Opportunities",
  act: "Ready to take the next step?",
};

const stepSubtitles: Record<string, string> = {
  welcome: "I'll guide you through finding the perfect land opportunity in Zanzibar. Just 3 quick questions.",
  discover: "Tell me what you're looking for, and I'll match you with the best opportunities.",
  match: "A few details help me narrow down the perfect zones for you.",
  review: "Based on what you've told me, here are your best matches in Zanzibar.",
  act: "Here's how to move forward with confidence.",
};

export default function Concierge() {
  const { isOpen, currentStep, answers, toggleConcierge, setStep, setAnswer, reset } = useConciergeStore();
  const { setCenter, setZoom, setSelectedPoint } = useMapStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAnswer = (key: string, value: string) => {
    setAnswer(key, value);
    if (key === "goal") setTimeout(() => setStep("match"), 400);
    else if (key === "budget") setTimeout(() => setStep("review"), 400);
    else if (key === "timeline") setTimeout(() => { setAnswer("experience", "some"); setStep("review"); }, 400);
  };

  const handleStart = () => setStep("discover");

  const handleFocusZone = (lat: number, lng: number) => {
    setSelectedPoint({ latitude: lat, longitude: lng });
    setCenter({ latitude: lat, longitude: lng });
    setZoom(14);
  };

  const handleDone = () => {
    reset();
    setStep("welcome");
  };

  if (!mounted) return null;

  const progress = { welcome: 0, discover: 20, match: 50, review: 80, act: 100 };

  return (
    <>
      <button
        onClick={toggleConcierge}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white font-semibold text-[13px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)",
          boxShadow: "0 8px 32px -8px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.2)",
        }}
      >
        <span className="text-lg animate-float">{isOpen ? "✕" : "✨"}</span>
        <span>{isOpen ? "Close" : "AI Concierge"}</span>
        {!isOpen && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-breathe" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[580px] rounded-2xl overflow-hidden shadow-2xl animate-slide-up" style={{
          background: "linear-gradient(180deg, rgba(10, 14, 26, 0.98), rgba(15, 21, 37, 0.98))",
          border: "1px solid rgba(6, 182, 212, 0.15)",
          boxShadow: "0 24px 64px -16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(6, 182, 212, 0.06)",
        }}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }} />

          <div className="relative px-5 py-4 flex items-center gap-3" style={{
            borderBottom: "1px solid rgba(26, 37, 64, 0.6)",
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(59, 130, 246, 0.02))",
          }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}>
              {stepIcons[currentStep]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold text-white">Atlaz Concierge</h3>
              <p className="text-[10px] text-slate-500">The Atlaz Method — Guided Discovery</p>
            </div>
            <button onClick={toggleConcierge} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all" style={{ border: "1px solid rgba(26, 37, 64, 0.5)" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentStep !== "welcome" && (
            <div className="px-5 pt-3 pb-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(26, 37, 64, 0.5)" }}>
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{
                    width: `${progress[currentStep]}%`,
                    background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 8px rgba(6, 182, 212, 0.3)",
                  }} />
                </div>
                <span className="text-[9px] text-slate-600 font-medium">{progress[currentStep]}%</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-slate-600">Start</span>
                <span className="text-[8px] text-slate-600">Ready</span>
              </div>
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            <div className="p-5 animate-fade-in" key={currentStep}>
              {currentStep === "welcome" && (
                <div className="text-center py-4">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl animate-float" style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06), rgba(139, 92, 246, 0.04))",
                    border: "1px solid rgba(6, 182, 212, 0.15)",
                  }}>
                    🏝️
                  </div>
                  <h2 className="text-[18px] font-bold text-white mb-2">Welcome to Atlaz</h2>
                  <p className="text-[12px] text-slate-400 leading-relaxed mb-6 max-w-sm mx-auto">
                    Your personal guide to finding the best land opportunities in Zanzibar. No jargon, no complexity — just smart, simple guidance.
                  </p>
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center gap-2.5 text-[13px] font-semibold px-7 py-3.5 rounded-xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                      boxShadow: "0 0 30px -6px rgba(6, 182, 212, 0.4)",
                    }}
                  >
                    <span>✨</span>
                    Start My Journey
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  <p className="text-[9px] text-slate-600 mt-4">Takes about 30 seconds • No account needed</p>
                </div>
              )}

              {currentStep === "discover" && (
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1">What brings you to Zanzibar?</h4>
                  <p className="text-[11px] text-slate-500 mb-4">Choose the option that best describes your goal</p>
                  <div className="space-y-2">
                    {goals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleAnswer("goal", g.id)}
                        className="w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
                        style={{
                          background: answers.goal === g.id
                            ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                            : "rgba(15, 21, 37, 0.5)",
                          border: answers.goal === g.id
                            ? "1px solid rgba(6, 182, 212, 0.3)"
                            : "1px solid rgba(26, 37, 64, 0.5)",
                          boxShadow: answers.goal === g.id ? "0 0 20px -4px rgba(6, 182, 212, 0.15)" : "none",
                        }}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl">{g.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[13px] font-semibold text-white block">{g.label}</span>
                            <span className="text-[10px] text-slate-500">{g.desc}</span>
                          </div>
                          {answers.goal === g.id && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(6, 182, 212, 0.2)" }}>
                              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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

              {currentStep === "match" && (
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1">Help me narrow it down</h4>
                  <p className="text-[11px] text-slate-500 mb-4">What's your investment range?</p>
                  <div className="space-y-2 mb-5">
                    {budgets.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleAnswer("budget", b.id)}
                        className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                        style={{
                          background: answers.budget === b.id
                            ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                            : "rgba(15, 21, 37, 0.5)",
                          border: answers.budget === b.id
                            ? "1px solid rgba(6, 182, 212, 0.3)"
                            : "1px solid rgba(26, 37, 64, 0.5)",
                        }}
                      >
                        <span className="text-[14px] font-bold text-white block">{b.label}</span>
                        <span className="text-[10px] text-slate-500">{b.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid rgba(26, 37, 64, 0.5)" }} className="pt-4">
                    <h4 className="text-[14px] font-bold text-white mb-3">Your timeline?</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {timelines.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleAnswer("timeline", t.id)}
                          className="text-center p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                          style={{
                            background: answers.timeline === t.id
                              ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.06))"
                              : "rgba(15, 21, 37, 0.5)",
                            border: answers.timeline === t.id
                              ? "1px solid rgba(6, 182, 212, 0.3)"
                              : "1px solid rgba(26, 37, 64, 0.5)",
                          }}
                        >
                          <span className="text-xl block mb-1">{t.emoji}</span>
                          <span className="text-[10px] font-medium text-white">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "review" && (
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.03))",
                    border: "1px solid rgba(6, 182, 212, 0.1)",
                  }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Your Profile</p>
                    <div className="flex flex-wrap gap-1.5">
                      {answers.goal && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium text-cyan-300" style={{
                          background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)",
                        }}>
                          {goals.find(g => g.id === answers.goal)?.label}
                        </span>
                      )}
                      {answers.budget && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium text-blue-300" style={{
                          background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)",
                        }}>
                          {budgets.find(b => b.id === answers.budget)?.label}
                        </span>
                      )}
                      {answers.timeline && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium text-violet-300" style={{
                          background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)",
                        }}>
                          {timelines.find(t => t.id === answers.timeline)?.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed rounded-lg p-3.5" style={{
                    background: "rgba(6, 182, 212, 0.03)",
                    border: "1px solid rgba(6, 182, 212, 0.08)",
                  }}>
                    <span className="text-cyan-400 font-medium">💡 Insight: </span>
                    {getStepAdvice(currentStep, answers)}
                  </p>

                  <div className="space-y-2.5">
                    <p className="text-[12px] font-semibold text-white">Top Matches for You</p>
                    {getRecommendedZones(answers).map((zone, i) => (
                      <button
                        key={zone.name}
                        onClick={() => handleFocusZone(zone.lat, zone.lng)}
                        className="w-full text-left p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group card-premium"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{
                              background: zone.score >= 85 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: zone.score >= 85 ? "#34d399" : "#fbbf24",
                              border: `1px solid ${zone.score >= 85 ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
                            }}>
                              {zone.score}
                            </div>
                            <span className="text-[14px] font-bold text-white">{zone.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                            Show on map →
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{zone.reason}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep("act")}
                    className="w-full inline-flex items-center justify-center gap-2 text-[12px] font-semibold px-5 py-3 rounded-xl text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-2"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                      boxShadow: "0 0 24px -4px rgba(6, 182, 212, 0.3)",
                    }}
                  >
                    Great — What's Next?
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}

              {currentStep === "act" && (
                <div className="space-y-4">
                  <div className="rounded-xl p-4 text-center" style={{
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))",
                    border: "1px solid rgba(6, 182, 212, 0.1)",
                  }}>
                    <span className="text-3xl block mb-2">🚀</span>
                    <h4 className="text-[15px] font-bold text-white">You're Ready!</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Here are your next steps:</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { step: "1", title: "Explore the Map", desc: "Click the zones I recommended to see detailed intelligence", icon: "🗺️", action: "Open Map", onClick: () => handleFocusZone(-6.1659, 39.2026) },
                      { step: "2", title: "Run a Plot Analysis", desc: "Click anywhere on the map and run a full intelligence analysis", icon: "📊", action: "Analyze", onClick: () => { setStep("welcome"); toggleConcierge(); } },
                      { step: "3", title: "Get a Due Diligence Report", desc: "Generate a comprehensive report for any shortlisted property", icon: "📋", action: "View Reports", onClick: () => { setStep("welcome"); toggleConcierge(); window.location.href = "/reports"; } },
                      { step: "4", title: "Talk to Our Team", desc: "Connect with our Zanzibar-based advisors for personalized help", icon: "💬", action: "Contact", onClick: () => { setStep("welcome"); toggleConcierge(); } },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:bg-white/[0.02] group card-premium">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{
                          background: "rgba(6, 182, 212, 0.08)",
                          border: "1px solid rgba(6, 182, 212, 0.12)",
                        }}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-semibold text-white block">{item.title}</span>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                        <button
                          onClick={item.onClick}
                          className="text-[10px] font-medium px-3 py-1.5 rounded-lg text-cyan-400 transition-all hover:bg-cyan-500/10 shrink-0"
                          style={{ border: "1px solid rgba(6, 182, 212, 0.2)" }}
                        >
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleDone}
                      className="flex-1 text-[11px] font-medium px-4 py-2.5 rounded-xl text-white transition-all hover:scale-[1.01]"
                      style={{
                        background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                      }}
                    >
                      Done — Start Exploring
                    </button>
                    <button
                      onClick={() => setStep("welcome")}
                      className="text-[11px] font-medium px-4 py-2.5 rounded-xl text-slate-400 hover:text-white transition-all"
                      style={{ border: "1px solid rgba(26, 37, 64, 0.6)" }}
                    >
                      Restart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentStep !== "welcome" && currentStep !== "act" && (
            <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(26, 37, 64, 0.5)" }}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    const backMap: Record<string, string> = { discover: "welcome", match: "discover", review: "match" };
                    setStep(backMap[currentStep] as typeof currentStep);
                  }}
                  className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <p className="text-[9px] text-slate-600">Atlaz Concierge</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
