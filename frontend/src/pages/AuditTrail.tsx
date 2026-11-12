import React, { useState } from 'react';
import { sampleCase, sampleAuditEvents, type AuditEvent } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const AuditTrail: React.FC<PageProps> = () => {
  const { showToast } = useToast();
  const [hashesVerified, setHashesVerified] = useState<boolean>(false);
  const [events] = useState<AuditEvent[]>(sampleAuditEvents);

  const handleVerifyHashes = () => {
    setHashesVerified(true);
    showToast(
      'Cryptographic Hashes Verified',
      'All 28 WORM ledger records cryptographically validated against SHA-256 Merkle root. Zero altered records.',
      'success',
      5000
    );
  };

  const handleExportJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      caseId: sampleCase.caseId,
      entityName: sampleCase.entityName,
      merkleRoot: 'SHA-256 #8f2a-cc91-44b0',
      complianceStandard: 'SEC 17a-4 / FINRA WORM Storage',
      auditLedger: events,
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Northgate_Audit_${sampleCase.caseId}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Audit Log Exported', `Generated immutable JSON ledger with ${events.length} signed events.`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Compliance Audit Trail & Lineage Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              WORM Storage Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-semibold">
              SEC 17a-4 / FINRA Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically verifiable, immutable chronological log of extractions, registry validations, and analyst overrides.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <button 
            type="button"
            onClick={handleVerifyHashes}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Verify Hashes</span>
          </button>
          <button 
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export Audit Log (JSON)</span>
          </button>
        </div>
      </div>

      {/* Verification State Banner */}
      {hashesVerified && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-xl flex-shrink-0">check_circle</span>
            <div>
              <strong>Cryptographic Verification Passed:</strong> SHA-256 Merkle chain #8f2a-cc91-44b0 verified from Session Genesis. Zero altered or orphaned records.
            </div>
          </div>
          <span className="font-mono text-emerald-800 font-bold text-[11px] px-2.5 py-1 bg-emerald-200 rounded-lg flex-shrink-0">
            100% INTEGRITY VERIFIED
          </span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Package Root</span>
          <div className="font-mono text-xs font-bold text-slate-800 mt-1 truncate">SHA-256 #8f2a-cc91-44b0</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Merkle root signed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Logged Events</span>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1">28 entries</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% hash chained</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Overrides</span>
          <div className="font-mono text-xl font-bold text-amber-700 mt-1">03 recorded</div>
          <div className="text-[11px] text-slate-500 mt-0.5">1 Pending VP Sign</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registry Sync Latency</span>
          <div className="font-mono text-xl font-bold text-slate-900 mt-1">418ms avg</div>
          <div className="text-[11px] text-slate-500 mt-0.5">UK CH & OpenCorporates</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sequential Audit Ledger ({sampleCase.caseId})
          </span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Append-Only WORM Storage
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[960px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3 font-mono">Seq</th>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Actor / Engine</th>
                <th className="px-5 py-3">Description & Justification</th>
                <th className="px-5 py-3">Source / Ref</th>
                <th className="px-5 py-3 text-right font-mono">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {events.map((evt) => (
                <tr key={evt.seq} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-400">#{evt.seq}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">{evt.timestamp}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                      {evt.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{evt.actor}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-slate-900">{evt.description}</div>
                    {evt.justification && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-1 border border-amber-200">
                        <strong>Mandatory Justification:</strong> {evt.justification}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{evt.sourceRef}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-blue-700">{evt.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
