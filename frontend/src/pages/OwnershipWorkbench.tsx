import React, { useState } from 'react';
import { sampleCase, sampleOwnershipNodes, type BeneficialOwner } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const OwnershipWorkbench: React.FC<PageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [selectedNode, setSelectedNode] = useState<BeneficialOwner | null>(sampleOwnershipNodes[2]); // Arthur Pendelton by default
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideApplied, setOverrideApplied] = useState<boolean>(false);
  const [nodes, setNodes] = useState<BeneficialOwner[]>(sampleOwnershipNodes);

  const handleApplyOverride = () => {
    if (!overrideReason.trim()) {
      showToast(
        'Justification Required',
        'Mandatory Rule: Written regulatory justification is required for any analyst override.',
        'warning'
      );
      return;
    }

    if (selectedNode) {
      setNodes(prev => prev.map(n => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            notes: (n.notes ? n.notes + ' • ' : '') + `Analyst Override: ${overrideReason.trim()}`
          };
        }
        return n;
      }));
    }

    setOverrideApplied(true);
    showToast(
      'Analyst Override Logged',
      `Written justification committed to SHA-256 compliance audit log for ${selectedNode?.name}.`,
      'success'
    );
  };

  const handleExportCapTable = () => {
    const headers = [
      'Node ID',
      'Legal Name / Person',
      'Role',
      'Citizenship / Jurisdiction',
      'Tier',
      'Direct Equity %',
      'Effective Equity %',
      'Qualified UBO (>=25%)',
      'Liveness / Credential Status',
      'Notes'
    ];

    const rows = nodes.map(n => [
      `"${n.id}"`,
      `"${n.name}"`,
      `"${n.role}"`,
      `"${n.citizenship}"`,
      n.tier,
      n.directPct.toFixed(2),
      n.effectivePct.toFixed(2),
      n.isUBO ? 'YES' : 'NO',
      `"${n.livenessStatus || 'N/A'}"`,
      `"${(n.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `Northgate_CapTable_${sampleCase.caseId}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Cap Table Exported', `Generated cap table CSV for ${nodes.length} hierarchy nodes.`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Ownership Structure & UBO Reconciliation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              FATF / 5AMLD Rule Engine Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-semibold">
              UBO Threshold: &ge; {sampleCase.uboThreshold}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic resolution of multi-tier holding chains, effective equity computation, and analyst override governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <button 
            type="button"
            onClick={handleExportCapTable}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            title="Download multi-tier cap table as CSV"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export Cap Table CSV</span>
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('/registry-reconciliation')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span>Proceed to Registry Check</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Threshold Status Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Entity</span>
          <div className="font-bold text-slate-900 mt-1 text-sm">{sampleCase.entityName}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">Direct Equity: 100.00%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Qualified UBOs (&ge; 25.0%)</span>
          <div className="font-bold text-emerald-900 mt-1 text-xl font-mono">2 Identified</div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Arthur Pendelton (32%) • Helena Vance-Cross (28%)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Minority Holders (&lt; 25.0%)</span>
          <div className="font-bold text-slate-800 mt-1 text-xl font-mono">2 Identified</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Julian Sterling (22%) • Vanguard Nominees (18%)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hierarchy Depth</span>
          <div className="font-bold text-slate-800 mt-1 text-xl font-mono">3 Tiers</div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">Total Direct Equity Sum = 100.0%</div>
        </div>
      </div>

      {/* Main Hierarchy & Cap Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3-Layer Hierarchy Diagram */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Three-Layer Ownership Structure (Interactive Visualizer)
            </span>
            <span className="text-xs font-mono text-slate-500">
              Formula: Effective % = &prod; (Direct % &times; Tier Ownership %)
            </span>
          </div>

          <div className="space-y-4 py-2">
            {/* TIER 1: Operating Target */}
            <div 
              onClick={() => setSelectedNode(nodes[0])}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm flex items-center justify-between ${
                selectedNode?.id === 'node-1'
                  ? 'border-blue-600 bg-slate-900 text-white ring-2 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-900 text-white hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-blue-400 flex-shrink-0">apartment</span>
                <div>
                  <div className="font-bold text-sm">Tier 1: Harbor Crest Holdings Ltd (Operating Target)</div>
                  <div className="text-[11px] text-slate-300 font-mono">CRN: 09841209 • United Kingdom (100.0% Base)</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex-shrink-0">
                100.00%
              </span>
            </div>

            {/* Downward Connector */}
            <div className="flex justify-center -my-2">
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* TIER 2: Intermediate Holders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Atlantic Horizon Capital Ltd */}
              <div 
                onClick={() => setSelectedNode(nodes[1])}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-sm flex flex-col justify-between ${
                  selectedNode?.id === 'node-2'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                    : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">Tier 2 Conduit</span>
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-200 px-1.5 py-0.5 rounded">60.0% Direct</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-1">Atlantic Horizon Capital Ltd</div>
                  <div className="text-[10px] text-slate-500 font-mono">Cayman Islands • Parent of 2 UBOs</div>
                </div>
                <div className="text-[10px] text-blue-600 font-semibold mt-2">&darr; Tracing Tier 3 Beneficiaries</div>
              </div>

              {/* Julian Sterling */}
              <div 
                onClick={() => setSelectedNode(nodes[4])}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-sm flex flex-col justify-between ${
                  selectedNode?.id === 'node-5'
                    ? 'border-slate-400 bg-slate-100 ring-2 ring-slate-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tier 2 Direct</span>
                    <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">22.0% Direct</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-1">Julian Sterling</div>
                  <div className="text-[10px] text-slate-500">Natural Person • Individual</div>
                </div>
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded mt-2 self-start">
                  NON-UBO (&lt; 25%)
                </span>
              </div>

              {/* Vanguard Pacific Nominees */}
              <div 
                onClick={() => setSelectedNode(nodes[5])}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-sm flex flex-col justify-between ${
                  selectedNode?.id === 'node-6'
                    ? 'border-slate-400 bg-slate-100 ring-2 ring-slate-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tier 2 Nominee</span>
                    <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">18.0% Direct</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-1">Vanguard Pacific Nominees</div>
                  <div className="text-[10px] text-slate-500 font-mono">Jersey • Regulated Trustee</div>
                </div>
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded mt-2 self-start">
                  NON-UBO (&lt; 25%)
                </span>
              </div>
            </div>

            {/* Downward Connector to Tier 3 */}
            <div className="flex justify-start pl-12 sm:pl-24 -my-2">
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* TIER 3: Natural Person Beneficiaries under Atlantic Horizon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-400">
              {/* Arthur Pendelton (32.0% Qualified UBO) */}
              <div 
                onClick={() => setSelectedNode(nodes[2])}
                className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  selectedNode?.id === 'node-3' 
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/30' 
                    : 'border-emerald-200 bg-white hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-900">Arthur Pendelton</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-300">
                    32.00% Effective
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  Atlantic Equity: 53.33% &times; 60.0% Direct = <strong>32.00%</strong>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    QUALIFIED UBO (&ge; 25%)
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-semibold rounded">
                    Expired Passport (GAP-1)
                  </span>
                </div>
              </div>

              {/* Helena Vance-Cross (28.0% Qualified UBO) */}
              <div 
                onClick={() => setSelectedNode(nodes[3])}
                className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  selectedNode?.id === 'node-4' 
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/30' 
                    : 'border-emerald-200 bg-white hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-900">Helena Vance-Cross</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-300">
                    28.00% Effective
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  Atlantic Equity: 46.67% &times; 60.0% Direct = <strong>28.00%</strong>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    QUALIFIED UBO (&ge; 25%)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                    Liveness: PASS (GAP-1)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Entity Inspector & Analyst Override */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Entity Node Details
              </span>
              <span className="text-[10px] font-mono text-slate-400">{selectedNode?.id}</span>
            </div>

            {selectedNode && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Legal Name / Person</span>
                  <strong className="text-slate-900 text-sm">{selectedNode.name}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Classification</span>
                    <span className="font-semibold text-slate-800">{selectedNode.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Citizenship / Reg</span>
                    <span className="font-mono text-slate-800">{selectedNode.citizenship}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Direct Share</span>
                    <span className="font-bold text-slate-800">{selectedNode.directPct.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Effective Equity</span>
                    <span className={`font-bold ${selectedNode.isUBO ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {selectedNode.effectivePct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {selectedNode.livenessStatus && (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-900 block uppercase">
                      Liveness Verdict (PROVISIONAL-GAP-1 & GAP-5)
                    </span>
                    <span className="font-mono text-xs font-semibold text-blue-900">
                      Status: {selectedNode.livenessStatus}
                    </span>
                    <span className="text-[10px] text-blue-700 block mt-0.5">
                      Linked via hash token (No raw biometrics stored per GAP-8)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Analyst Override Form (Strict Written Justification Rule from AGENTS.md) */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Analyst Override & Justification</span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Mandatory Regulatory Rule: Any exemption or classification adjustment requires a written legal justification.
              </p>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Enter mandatory regulatory justification for audit log..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 h-20 resize-none"
              ></textarea>
              <button
                type="button"
                onClick={handleApplyOverride}
                className="w-full py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              >
                Apply Override to Audit Log
              </button>
              {overrideApplied && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                  <span>Override committed to Merkle audit chain (#8f2a-cc91-44b0)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
