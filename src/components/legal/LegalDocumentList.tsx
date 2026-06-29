"use client";

import { useState, useMemo } from "react";
import { getDataSource, LegalDocumentRecord } from "@/lib/data-source";

const ds = getDataSource();
const allDocs = ds.getLegalDocuments();

const CATEGORIES = [
  { key: "all", label: "All Documents", icon: "📋" },
  { key: "land_tenure", label: "Land Tenure", icon: "🏛️" },
  { key: "investment", label: "Investment & Business", icon: "💼" },
  { key: "tourism", label: "Tourism", icon: "🏖️" },
  { key: "environmental", label: "Environmental", icon: "🌿" },
  { key: "planning", label: "Planning & Zoning", icon: "🗺️" },
  { key: "taxation", label: "Taxation", icon: "💰" },
  { key: "governance", label: "Governance", icon: "⚖️" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  land_tenure: "Land Tenure",
  investment: "Investment & Business",
  tourism: "Tourism",
  environmental: "Environmental",
  planning: "Planning & Zoning",
  taxation: "Taxation",
  governance: "Governance",
};

function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function openPdf(doc: LegalDocumentRecord) {
  window.open(doc.pdfUrl, "_blank", "noopener,noreferrer");
}

export default function LegalDocumentList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = allDocs;
    if (activeCategory !== "all") {
      result = result.filter((d) => d.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.description ?? "").toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          (d.referenceNumber ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search laws, acts, regulations..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setExpandedId(null); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        </div>
        <a
          href="/api/legal-documents"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors text-center"
        >
          📡 API
        </a>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white"
                : "bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-700/60"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {allDocs.length} documents
      </p>

      <div className="space-y-2">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden transition-colors hover:border-gray-600/50"
          >
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      {CATEGORY_LABELS[doc.category] ?? doc.category}
                    </span>
                    {doc.referenceNumber && (
                      <span className="text-xs text-gray-500">{doc.referenceNumber}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                    className="text-left mt-1"
                  >
                    <h3 className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">
                      {doc.title}
                    </h3>
                  </button>
                </div>
                <button
                  onClick={() => openPdf(doc)}
                  className="shrink-0 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>📄</span>
                  <span>Open PDF</span>
                </button>
              </div>

              {expandedId === doc.id && (
                <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2">
                  <p className="text-sm text-gray-400 leading-relaxed">{doc.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Jurisdiction</span>
                      <p className="text-gray-300 mt-0.5">{doc.jurisdiction}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Language</span>
                      <p className="text-gray-300 mt-0.5">{doc.language}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Enacted</span>
                      <p className="text-gray-300 mt-0.5">{formatDate(doc.enactedDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Amended</span>
                      <p className="text-gray-300 mt-0.5">{formatDate(doc.lastAmended)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pages</span>
                      <p className="text-gray-300 mt-0.5">{doc.pages ?? "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">File Size</span>
                      <p className="text-gray-300 mt-0.5">{formatFileSize(doc.fileSize)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-2xl mb-2">📜</p>
          <p className="text-sm">No legal documents found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
