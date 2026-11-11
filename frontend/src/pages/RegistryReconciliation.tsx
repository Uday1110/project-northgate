import React from 'react';
import { sampleRegistryReconciliation } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const RegistryReconciliation: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Public Company Registry Reconciliation</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
              MCP Gated Tool: public_registries (PROVISIONAL-GAP-4)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated cross-verification between customer onboarding packet and official public company registers (UK Companies House, OpenCorporates, GLEIF).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Force Refresh API
          </button>
          <button 
            onClick={() => onNavigate('/deficiency-punch-list')}
            className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Review Deficiency Punch List</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Discrepancy Alert Bar */}
      <div className="bg-red-50 border border-red-300 rounded p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-red-600 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">error</span>
          </div>
          <div>
            <div className="text-sm font-bold text-red-950">1 Critical Statutory Discrepancy Detected</div>
            <div className="text-xs text-red-800 mt-0.5">
              Registered Office Address in Articles / IN01 does not match Companies House active statutory record.
            </div>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-red-200 text-red-950 font-bold text-xs rounded font-mono">
          BLOCKER: FCA MLR 2017 Art 13
        </span>
      </div>

      {/* Verification Matrix Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Data Field Verification Matrix (5 Ingested Fields)
          </span>
          <span className="text-xs text-slate-500 font-mono">Gateway: LON-PROD-GW04 • Status: 200 OK</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-2.5">Data Field</th>
              <th className="px-4 py-2.5">Declared Value (Onboarding)</th>
              <th className="px-4 py-2.5">Official Registry Value</th>
              <th className="px-4 py-2.5">Source & ID</th>
              <th className="px-4 py-2.5">Discrepancy Status</th>
              <th className="px-4 py-2.5 text-right">Action / Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sampleRegistryReconciliation.map((field) => (
              <tr 
                key={field.fieldCode}
                className={field.status === 'CRITICAL_MISMATCH' ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50'}
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{field.fieldName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{field.fieldCode}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className={field.status === 'CRITICAL_MISMATCH' ? 'font-bold text-red-900' : ''}>
                    {field.declaredValue}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className={field.status === 'CRITICAL_MISMATCH' ? 'font-bold text-red-900 bg-red-100 px-1 py-0.5 rounded' : ''}>
                    {field.registryValue}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                  {field.source}
                </td>
                <td className="px-4 py-3">
                  {field.status === 'CRITICAL_MISMATCH' ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[11px] font-bold rounded border border-red-300">
                      Critical Mismatch
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200">
                      Verified Match
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {field.remediationAction ? (
                    <span className="text-[11px] text-blue-700 font-semibold">{field.remediationAction}</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Auto-cleared</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
