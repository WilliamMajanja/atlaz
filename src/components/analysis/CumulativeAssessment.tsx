"use client";

import { useState, useCallback } from "react";
import { SiteAnalysisFull } from "@/types";

interface CumulativeAssessmentProps {
  analysis: SiteAnalysisFull;
}

interface AssessmentState {
  isGenerating: boolean;
  content: string;
  error: string | null;
}

export default function CumulativeAssessment({ analysis }: CumulativeAssessmentProps) {
  const [state, setState] = useState<AssessmentState>({
    isGenerating: false,
    content: "",
    error: null,
  });

  const generateAssessment = useCallback(async () => {
    setState({ isGenerating: true, content: "", error: null });
    try {
      const response = await fetch("/api/cumulative-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate assessment");
      setState({ isGenerating: false, content: data.assessment, error: null });
    } catch (err) {
      setState({
        isGenerating: false,
        content: "",
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }, [analysis]);

  return (
    <div className="card overflow-hidden">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(17, 24, 39, 0.4)",
          borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1))",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}>
            <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[12px] font-semibold text-white">Cumulative Impact Assessment</h3>
            <p className="text-[10px] text-slate-500">AI-generated environmental, social & economic impact analysis</p>
          </div>
        </div>
        <button
          onClick={generateAssessment}
          disabled={state.isGenerating}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 text-white disabled:opacity-50"
          style={{
            background: state.isGenerating ? "rgba(139, 92, 246, 0.3)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            boxShadow: state.isGenerating ? "none" : "0 0 16px -4px rgba(139, 92, 246, 0.4)",
          }}
        >
          {state.isGenerating ? (
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Generate CIA
            </span>
          )}
        </button>
      </div>

      <div className="p-4">
        {state.error && (
          <div className="rounded-lg p-3 mb-4" style={{
            background: "rgba(244, 63, 94, 0.08)",
            border: "1px solid rgba(244, 63, 94, 0.15)",
          }}>
            <p className="text-[11px] text-rose-300">{state.error}</p>
          </div>
        )}

        {state.isGenerating && !state.content && (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse" style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}>
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-300 font-medium mb-1">Preparing assessment context...</p>
            <p className="text-[10px] text-slate-500">This may take 30-60 seconds depending on your hardware</p>
          </div>
        )}

        {state.content && (
          <div className="whitespace-pre-wrap text-[12px] text-slate-300 leading-relaxed animate-fade-in">
            {state.content}
          </div>
        )}

        {!state.content && !state.error && !state.isGenerating && (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{
              background: "rgba(30, 41, 59, 0.3)",
              border: "1px solid rgba(30, 41, 59, 0.5)",
            }}>
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-300 font-medium mb-1">Generate a Cumulative Impact Assessment</p>
            <p className="text-[10px] text-slate-500">Uses local Ollama with llama3 model</p>
          </div>
        )}
      </div>
    </div>
  );
}
