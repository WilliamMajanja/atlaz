"use client";

interface ScoreCardProps {
  label: string;
  value: number;
  maxValue?: number;
  band?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "cyan" | "emerald";
}

const colorStyles: Record<string, { ring: string; glow: string; text: string; bg: string; bandBg: string; bandText: string }> = {
  cyan: {
    ring: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.15)",
    text: "text-cyan-400",
    bg: "rgba(6, 182, 212, 0.1)",
    bandBg: "rgba(6, 182, 212, 0.12)",
    bandText: "text-cyan-300",
  },
  blue: {
    ring: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.15)",
    text: "text-blue-400",
    bg: "rgba(59, 130, 246, 0.1)",
    bandBg: "rgba(59, 130, 246, 0.12)",
    bandText: "text-blue-300",
  },
  green: {
    ring: "#10b981",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400",
    bg: "rgba(16, 185, 129, 0.1)",
    bandBg: "rgba(16, 185, 129, 0.12)",
    bandText: "text-emerald-300",
  },
  red: {
    ring: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.15)",
    text: "text-rose-400",
    bg: "rgba(244, 63, 94, 0.1)",
    bandBg: "rgba(244, 63, 94, 0.12)",
    bandText: "text-rose-300",
  },
  yellow: {
    ring: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.15)",
    text: "text-amber-400",
    bg: "rgba(245, 158, 11, 0.1)",
    bandBg: "rgba(245, 158, 11, 0.12)",
    bandText: "text-amber-300",
  },
  purple: {
    ring: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.15)",
    text: "text-violet-400",
    bg: "rgba(139, 92, 246, 0.1)",
    bandBg: "rgba(139, 92, 246, 0.12)",
    bandText: "text-violet-300",
  },
  emerald: {
    ring: "#10b981",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400",
    bg: "rgba(16, 185, 129, 0.1)",
    bandBg: "rgba(16, 185, 129, 0.12)",
    bandText: "text-emerald-300",
  },
};

export default function ScoreCard({ label, value, maxValue = 100, band, color = "cyan" }: ScoreCardProps) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const style = colorStyles[color] || colorStyles.cyan;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card p-4 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        {band && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: style.bandBg, color: style.bandText }}
          >
            {band}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[76px] h-[76px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(30, 41, 59, 0.5)"
              strokeWidth="5"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke={style.ring}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: `drop-shadow(0 0 6px ${style.glow})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${style.text}`}>{value}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${style.ring}, ${style.ring}dd)`,
                boxShadow: `0 0 8px ${style.glow}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-slate-500">0</span>
            <span className="text-[10px] text-slate-500">{maxValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
