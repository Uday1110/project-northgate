import React from 'react';
import { sampleCase } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const ProcessingState: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center animate-spin">
            <span className="material-symbols-outlined text-2xl">sync</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Ingesting Onboarding Dossier</h1>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                Tier-1 Institutional Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {sampleCase.entityName} • {sampleCase.caseId} • Submitted 42s ago by Sarah Lin (Relationship Mgr) • ENGINE: LON-PROD-04
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Fallback Kill Switch Trigger */}
          <button className="px-3 py-1.5 rounded border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Abort Intake / Kill Switch
          </button>
          <button 
            onClick={() => onNavigate('/ownership-workbench')}
            className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>View Partial Results in Workbench</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
      </div>

      {/* Amber Retry Banner (from Stitch design specification) */}
      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded flex items-center justify-between text-amber-900 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-amber-700 text-lg">schedule</span>
          <span>
            <strong>Public Registry Lookup Warning:</strong> Companies House API gateway latency spike. 
            <span className="ml-1 underline font-medium">Retry 1 of 2 scheduled</span> (Timeout bounded at 10.0s).
          </span>
        </div>
        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono text-[11px] font-bold">
          PROVISIONAL-GAP-4 RETRY ACTIVE
        </span>
      </div>

      {/* DAG Execution Graph v2.4 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: DAG Graph */}
        <div className="col-span-2 bg-white p-5 rounded border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">DAG Execution Graph v2.4 Orchestrator</h2>
              <p className="text-xs text-slate-500">Parallel Intake & Extraction Workers (Target &lt; 90s)</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2.5 py-1 rounded">
              <span className="text-slate-500">Elapsed:</span>
              <strong className="text-slate-800">1m 07s of 90s</strong>
            </div>
          </div>

          {/* Stepper / Worker Nodes */}
          <div className="space-y-4">
            {/* Worker 1: Entity Parser */}
            <div className="p-4 rounded border border-emerald-200 bg-emerald-50/40 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl mt-0.5">check_circle</span>
                <div>
                  <div className="flex items-center gap-2">
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
              <span className="text-xs font-mono text-slate-500">22s elapsed</span>
            </div>

            {/* Worker 2: Registry Lookup (MCP Tool) */}
            <div className="p-4 rounded border border-emerald-200 bg-emerald-50/40 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl mt-0.5">check_circle</span>
                <div>
                  <div className="flex items-center gap-2">
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
              <span className="text-xs font-mono text-slate-500">31s elapsed</span>
            </div>

            {/* Worker 3: Ownership Reconciliation (KYC Agent via AI Gateway) */}
            <div className="p-4 rounded border border-blue-200 bg-blue-50/40 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 text-xl mt-0.5 animate-spin">refresh</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Worker 03: Ownership Reconciliation (KYC Agent)</span>
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">RUNNING</span>
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] font-mono rounded">PROVISIONAL-GAP-2 AI GATEWAY</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Resolving multi-tier cap table paths, calculating effective UBO % (&ge; 25%), and verifying liveness.
                  </p>
                  <div className="text-[11px] text-blue-700 mt-1 font-mono">
                    Model calls mediated via AI Gateway with strict JSON schema validation.
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">14s elapsed</span>
            </div>

            {/* Worker 4: Document Scanner & Deficiency Engine */}
            <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start justify-between opacity-80">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5">hourglass_empty</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-700">Worker 04: Document Scanner & Deficiency Engine</span>
                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">QUEUED</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Validates document expiration, checks completeness, and compiles the Deficiency Punch List.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Waiting...</span>
            </div>
          </div>
        </div>

        {/* Right Col: Task Dispatch & Metrics */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
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

          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
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
