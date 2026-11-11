import React, { useState } from 'react';
import { sampleCase, sampleAuditEvents } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const AuditTrail: React.FC<PageProps> = () => {
  const [hashesVerified, setHashesVerified] = useState<boolean>(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Compliance Audit Trail & Lineage Log</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
              WORM Storage Active
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-semibold">
              SEC 17a-4 / FINRA Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically verifiable, immutable chronological log of extractions, registry validations, and analyst overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setHashesVerified(true)}
            className="px-3 py-1.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            Verify Hashes
          </button>
          <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">file_download</span>
            Export Audit Log (JSON)
          </button>
        </div>
      </div>

      {/* Verification State Banner */}
      {hashesVerified && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-lg">check_circle</span>
            <span>
              <strong>Cryptographic Verification Passed:</strong> SHA-256 Merkle chain #8f2a-cc91-44b0 verified from Session Genesis. Zero altered or orphaned records.
            </span>
          </div>
          <span className="font-mono text-emerald-800 font-bold text-[11px]">100% INTEGRITY</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Audit Package Root</span>
          <div className="font-mono text-xs font-bold text-slate-800 mt-1 truncate">SHA-256 #8f2a-cc91-44b0</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Merkle root signed</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Logged Events</span>
          <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">28 entries</div>
          <div className="text-[10px] text-emerald-600 font-semibold">100% hash chained</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Critical Overrides</span>
          <div className="font-mono text-lg font-bold text-amber-700 mt-0.5">03 recorded</div>
          <div className="text-[10px] text-slate-500">1 Pending VP Sign</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Registry Sync Latency</span>
          <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">418ms avg</div>
          <div className="text-[10px] text-slate-500">UK CH & OpenCorporates</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sequential Audit Ledger ({sampleCase.caseId})
          </span>
          <span className="text-xs font-mono text-slate-500">Append-Only WORM Storage</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-2.5 font-mono">Seq</th>
              <th className="px-4 py-2.5">Timestamp (UTC)</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Actor / Engine</th>
              <th className="px-4 py-2.5">Description & Justification</th>
              <th className="px-4 py-2.5">Source / Ref</th>
              <th className="px-4 py-2.5 text-right font-mono">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sampleAuditEvents.map((evt) => (
              <tr key={evt.seq} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-400">#{evt.seq}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{evt.timestamp}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                    {evt.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">{evt.actor}</td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{evt.description}</div>
                  {evt.justification && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                      <strong>Mandatory Justification:</strong> {evt.justification}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{evt.sourceRef}</td>
                <td className="px-4 py-3 text-right font-mono text-blue-700">{evt.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
