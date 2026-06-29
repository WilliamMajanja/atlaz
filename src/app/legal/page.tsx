"use client";

import LegalDocumentList from "@/components/legal/LegalDocumentList";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">⚖️</span>
          <div>
            <h1 className="text-lg font-semibold text-white">Legal Framework</h1>
            <p className="text-sm text-gray-500">
              Zanzibar land laws, investment regulations, and statutory instruments
            </p>
          </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mb-6 text-sm text-gray-400 leading-relaxed">
          <p className="mb-2">
            <strong className="text-gray-300">Disclaimer:</strong> These documents are provided for
            informational purposes only and may not reflect the most current legal developments.
            The PDF copies are sourced from public government archives. Users should verify the
            current status and applicability of any law with qualified legal counsel.
          </p>
          <p>
            <strong className="text-gray-300">Data sources:</strong> Zanzibar Legal Framework is
            compiled from the Zanzibar Gazette, the Attorney General's Chambers, and open government
            repositories. Statutes are referenced by their official Act number and year of enactment.
          </p>
        </div>

        <LegalDocumentList />
      </div>
    </div>
  );
}
