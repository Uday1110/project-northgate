import React, { useState } from 'react';
import { sampleRegistryReconciliation, type RegistryField } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const RegistryReconciliation: React.FC<PageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [fields, setFields] = useState<RegistryField[]>(sampleRegistryReconciliation);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAPI = () => {
    setIsRefreshing(true);
    showToast('Refreshing Public Registries', 'Calling Companies House API v3 and GLEIF index via MCP gateway...', 'info');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        'Registry Data Refreshed',
        'UK Companies House & OpenCorporates records synchronized. 1 statutory address mismatch active.',
        'success'
      );
    }, 1200);
  };

  const handleResolveField = (fieldCode: string) => {
    setFields(prev => prev.map(f => {
      if (f.fieldCode === fieldCode) {
        return {
          ...f,
          status: 'PERFECT_MATCH',
          remediationAction: 'Resolved via Analyst Review'
        };
      }
      return f;
    }));
    showToast(
      'Discrepancy Remediation Recorded',
      `Field ${fieldCode} marked resolved. Certified registry copy requested.`,
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Public Company Registry Reconciliation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              MCP Gated Tool: public_registries (PROVISIONAL-GAP-4)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated cross-verification between customer onboarding packet and official public company registers (UK Companies House, OpenCorporates, GLEIF).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <button 
            type="button"
            onClick={handleRefreshAPI}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span className={`material-symbols-outlined text-base ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'Querying MCP...' : 'Force Refresh API'}</span>
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('/deficiency-punch-list')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span>Review Punch List</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Discrepancy Alert Bar */}
      <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl">error</span>
          </div>
          <div>
            <div className="text-sm font-bold text-rose-950">1 Critical Statutory Discrepancy Detected</div>
            <div className="text-xs text-rose-800 mt-0.5">
              Registered Office Address in Articles / IN01 does not match Companies House active statutory record.
            </div>
          </div>
        </div>

        <span className="px-3 py-1 bg-rose-200 text-rose-950 font-bold text-xs rounded-lg font-mono self-end sm:self-auto flex-shrink-0">
          BLOCKER: FCA MLR 2017 Art 13
        </span>
      </div>

      {/* Verification Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Data Field Verification Matrix ({fields.length} Ingested Fields)
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Gateway: LON-PROD-GW04 • Status: 200 OK
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[960px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Data Field</th>
                <th className="px-5 py-3">Declared Value (Onboarding)</th>
                <th className="px-5 py-3">Official Registry Value</th>
                <th className="px-5 py-3">Source & ID</th>
                <th className="px-5 py-3">Discrepancy Status</th>
                <th className="px-5 py-3 text-right">Action / Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {fields.map((field) => (
                <tr 
                  key={field.fieldCode}
                  className={field.status === 'CRITICAL_MISMATCH' ? 'bg-rose-50/40 hover:bg-rose-50/60' : 'hover:bg-slate-50'}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{field.fieldName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{field.fieldCode}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <span className={field.status === 'CRITICAL_MISMATCH' ? 'font-bold text-rose-900' : ''}>
                      {field.declaredValue}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <span className={field.status === 'CRITICAL_MISMATCH' ? 'font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded' : ''}>
                      {field.registryValue}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {field.source}
                  </td>
                  <td className="px-5 py-3.5">
                    {field.status === 'CRITICAL_MISMATCH' ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded border border-rose-300">
                        Critical Mismatch
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200">
                        Verified Match
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {field.status === 'CRITICAL_MISMATCH' ? (
                      <button
                        type="button"
                        onClick={() => handleResolveField(field.fieldCode)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Action Remediation
                      </button>
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
    </div>
  );
};
