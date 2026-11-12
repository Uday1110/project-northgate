import React, { useState } from 'react';
import { sampleCase } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const ProcessingState: React.FC<PageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [killSwitchEngaged, setKillSwitchEngaged] = useState<boolean>(false);
  const [retryActive, setRetryActive] = useState<boolean>(true);
  const [showKillConfirm, setShowKillConfirm] = useState<boolean>(false);

  const handleKillSwitch = () => {
    setKillSwitchEngaged(true);
    setShowKillConfirm(false);
    showToast(
      'Fallback Kill Switch Engaged',
      'Automated extraction suspended for this dossier. System reverted to manual human analyst triage. Audit record emitted.',
      'error',
      6000
    );
  };

  const handleManualRetry = () => {
    showToast('Retrying Public Registry Lookup', 'Dispatching MCP tool request to Companies House API gateway...', 'info');
    setTimeout(() => {
      setRetryActive(false);
      showToast(
        'Registry Gateway Connected',
        'Companies House API response received (200 OK). Statutory address discrepancy flagged for review.',
        'success'
      );
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
            killSwitchEngaged 
              ? 'bg-rose-100 text-rose-700' 
              : 'bg-blue-100 text-blue-700 animate-spin'
          }`}>
            <span className="material-symbols-outlined text-2xl">
              {killSwitchEngaged ? 'warning' : 'sync'}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {killSwitchEngaged ? 'Intake Suspended (Manual Triage Active)' : 'Ingesting Onboarding Dossier'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                killSwitchEngaged 
                  ? 'bg-rose-100 text-rose-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {killSwitchEngaged ? 'FALLBACK KILL SWITCH' : 'Tier-1 Institutional Pipeline'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {sampleCase.entityName} • {sampleCase.caseId} • Submitted 42s ago by Sarah Lin (RM) • CLUSTER: LON-PROD-04
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          {!killSwitchEngaged ? (
            <button 
              type="button"
              onClick={() => setShowKillConfirm(true)}
              className="px-3.5 py-2 rounded-lg border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:outline-none"
              title="Abort automated extraction and route dossier to manual review"
            >
              <span className="material-symbols-outlined text-base">cancel</span>
              <span>Abort Intake / Kill Switch</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => {
                setKillSwitchEngaged(false);
                showToast('Pipeline Resumed', 'Automated extraction DAG resumed.', 'info');
              }}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span>Resume Automation</span>
            </button>
          )}

          <button 
            type="button"
            onClick={() => onNavigate('/ownership-workbench')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span>View Workbench</span>
            <span className="material-symbols-outlined text-base">open_in_new</span>
          </button>
        </div>
      </div>

      {/* Kill Switch Confirmation Modal */}
      {showKillConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-base font-bold text-slate-900">Engage Fallback Kill Switch?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This triggers the statutory fallback kill switch per Specification Guardrails. All automated AI model queries and MCP registry lookups will cease immediately, and the dossier will be locked for manual forensic analyst ingestion.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowKillConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleKillSwitch}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-sm"
              >
                Confirm Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amber Retry Banner */}
      {retryActive && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-700 text-xl flex-shrink-0">schedule</span>
            <div>
              <strong>Public Registry Lookup Warning:</strong> Companies House API gateway latency spike. 
              <span className="ml-1 font-medium">Retry 1 of 2 scheduled (Timeout bounded at 10.0s).</span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleManualRetry}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
            >
              Retry Now
            </button>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono text-[10px] font-bold">
              PROVISIONAL-GAP-4
            </span>
          </div>
        </div>
      )}

      {/* DAG Execution Graph v2.4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: DAG Graph */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">DAG Execution Graph v2.4 Orchestrator</h2>
              <p className="text-xs text-slate-500">Parallel Intake & Extraction Workers (Target &lt; 90s SLA)</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
              <span className="text-slate-500">Elapsed:</span>
              <strong className="text-slate-800">1m 07s of 90s</strong>
            </div>
          </div>

          {/* Stepper / Worker Nodes */}
          <div className="space-y-4">
            {/* Worker 1: Entity Parser */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl mt-0.5 flex-shrink-0">check_circle</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Worker 01: Entity Parser (OCR & Legal Text)</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">COMPLETE</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Identifies legal entities, officers, and shareholders from Articles of Association.
                  </p>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    3 legal entities identified • 4 directors extracted • 3 shareholders detected
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 flex-shrink-0">22s elapsed</span>
            </div>

            {/* Worker 2: Registry Lookup (MCP Tool) */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl mt-0.5 flex-shrink-0">check_circle</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Worker 02: Public Registry Lookup (MCP Tool)</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">COMPLETE</span>
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-mono rounded">PROVISIONAL-GAP-4</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Queries Companies House API v3 and GLEIF index via MCP Server tool.
                  </p>
                  <div className="text-[11px] text-amber-700 mt-1 font-semibold">
                    1 Critical Discrepancy detected (Statutory Address Mismatch: Cannon St vs Finsbury Circus)
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 flex-shrink-0">31s elapsed</span>
            </div>

            {/* Worker 3: Ownership Reconciliation (KYC Agent via AI Gateway) */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 text-xl mt-0.5 animate-spin flex-shrink-0">refresh</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Worker 03: Ownership Reconciliation (KYC Agent)</span>
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">RUNNING</span>
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] font-mono rounded">AI GATEWAY</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Resolving multi-tier cap table paths, calculating effective UBO % (&ge; 25%), and verifying liveness.
                  </p>
                  <div className="text-[11px] text-blue-700 mt-1 font-mono">
                    Model calls mediated via AI Gateway with strict JSON schema validation.
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 flex-shrink-0">14s elapsed</span>
            </div>

            {/* Worker 4: Document Scanner & Deficiency Engine */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 opacity-80">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5 flex-shrink-0">hourglass_empty</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-slate-700">Worker 04: Document Scanner & Deficiency Engine</span>
                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">QUEUED</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Validates document expiration, checks completeness, and compiles the Deficiency Punch List.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 flex-shrink-0">Waiting...</span>
            </div>
          </div>
        </div>

        {/* Right Col: Task Dispatch & Metrics */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Worker Progress Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total Pipeline Execution</span>
                <span className="font-mono font-bold">50% (2 of 4)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Node Cluster:</span>
                <span className="font-mono font-medium text-slate-800">LON-PROD-04</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MCP Protocol State:</span>
                <span className="text-emerald-700 font-semibold">CONNECTED (4 Tools)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Gateway State:</span>
                <span className="text-emerald-700 font-semibold">ONLINE (Approved Model)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Governance Note (Phase 2):</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every worker event, state transition, and retry attempt emits an immutable SHA-256 audit record to the compliance ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
