"use client";

import { BadgeType } from "@/types";

const badgeStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  "Golden Visa Potential": {
    bg: "rgba(245, 158, 11, 0.1)",
    text: "text-amber-300",
    border: "rgba(245, 158, 11, 0.25)",
    icon: "✦",
  },
  "Eco-Resort Potential": {
    bg: "rgba(16, 185, 129, 0.1)",
    text: "text-emerald-300",
    border: "rgba(16, 185, 129, 0.25)",
    icon: "◈",
  },
  "High Flood Caution": {
    bg: "rgba(244, 63, 94, 0.1)",
    text: "text-rose-300",
    border: "rgba(244, 63, 94, 0.25)",
    icon: "▲",
  },
  "Land Bank Candidate": {
    bg: "rgba(139, 92, 246, 0.1)",
    text: "text-violet-300",
    border: "rgba(139, 92, 246, 0.25)",
    icon: "◆",
  },
  "Infrastructure Watch": {
    bg: "rgba(249, 115, 22, 0.1)",
    text: "text-orange-300",
    border: "rgba(249, 115, 22, 0.25)",
    icon: "⚙",
  },
  "Prime Tourism Corridor": {
    bg: "rgba(6, 182, 212, 0.1)",
    text: "text-cyan-300",
    border: "rgba(6, 182, 212, 0.25)",
    icon: "★",
  },
  "Needs Legal Verification": {
    bg: "rgba(100, 116, 139, 0.1)",
    text: "text-slate-400",
    border: "rgba(100, 116, 139, 0.25)",
    icon: "⚑",
  },
};

interface BadgeProps {
  type: BadgeType;
}

export default function Badge({ type }: BadgeProps) {
  const style = badgeStyles[type] ?? {
    bg: "rgba(100, 116, 139, 0.1)",
    text: "text-slate-400",
    border: "rgba(100, 116, 139, 0.25)",
    icon: "●",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] ${style.text}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      <span className="text-[9px] opacity-70">{style.icon}</span>
      {type}
    </span>
  );
}

interface BadgeListProps {
  badges: BadgeType[];
}

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <Badge key={badge} type={badge} />
      ))}
    </div>
  );
}
