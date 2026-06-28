"use client";

import { config } from "@/lib/config";

export default function Disclaimer() {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(234, 179, 8, 0.03))",
        border: "1px solid rgba(245, 158, 11, 0.12)",
      }}
    >
      <div className="flex items-start gap-2.5">
        <svg className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-[11px] text-amber-200/60 leading-relaxed">
          <strong className="text-amber-200/80">Disclaimer:</strong>{" "}
          {config.disclaimer}
        </p>
      </div>
    </div>
  );
}
