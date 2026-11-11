import React, { useState } from 'react';
import { sampleCase, sampleOwnershipNodes, type BeneficialOwner } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const OwnershipWorkbench: React.FC<PageProps> = ({ onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<BeneficialOwner | null>(sampleOwnershipNodes[2]); // Arthur Pendelton by default
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideApplied, setOverrideApplied] = useState<boolean>(false);

  const handleApplyOverride = () => {
    if (!overrideReason.trim()) {
      alert('Mandatory Rule: Written regulatory justification is required for any analyst override.');
      return;
    }
    setOverrideApplied(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ownership Structure & UBO Reconciliation</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              FATF / 5AMLD Rule Engine Active
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-semibold">
              UBO Threshold: &ge; {sampleCase.uboThreshold}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic resolution of multi-tier holding chains, effective equity computation, and analyst override governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">file_download</span>
            Export Cap Table CSV
          </button>
          <button 
            onClick={() => onNavigate('/registry-reconciliation')}
            className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Registry Reconciliation</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Threshold Status Summary Banner */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Target Entity</span>
          <div className="font-bold text-slate-900 mt-0.5 text-sm">{sampleCase.entityName}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">Direct Equity: 100.00%</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Qualified UBOs (&ge; 25.0%)</span>
          <div className="font-bold text-emerald-900 mt-0.5 text-lg font-mono">2 Identified</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Arthur Pendelton (32%) • Helena Vance-Cross (28%)</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Minority Holders (&lt; 25.0%)</span>
          <div className="font-bold text-slate-800 mt-0.5 text-lg font-mono">2 Identified</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Julian Sterling (22%) • Vanguard Nominees (18%)</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Hierarchy Depth</span>
          <div className="font-bold text-slate-800 mt-0.5 text-lg font-mono">3 Tiers</div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">Total Direct Equity Sum = 100.0%</div>
        </div>
      </div>

      {/* Main Hierarchy & Cap Table Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: 3-Layer Hierarchy Diagram */}
        <div className="col-span-2 bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Three-Layer Ownership Structure
            </span>
            <span className="text-xs font-mono text-slate-500">
              Formula: Effective % = &prod; (Direct % &times; Tier Ownership %)
            </span>
          </div>

          <div className="space-y-4 py-2">
            {/* TIER 1: Operating Target */}
            <div className="p-3.5 rounded border-2 border-slate-800 bg-slate-900 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-blue-400">apartment</span>
                <div>
                  <div className="font-bold text-sm">Tier 1: Harbor Crest Holdings Ltd (Operating Target)</div>
                  <div className="text-[11px] text-slate-300 font-mono">CRN: 09841209 • United Kingdom (100.0% Base)</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-mono font-bold">100.00%</span>
            </div>

            {/* Downward Connector */}
            <div className="flex justify-center -my-2">
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* TIER 2: Intermediate Holders */}
            <div className="grid grid-cols-3 gap-3">
              {/* Atlantic Horizon Capital Ltd (Conduit to 32% & 28%) */}
              <div 
                onClick={() => setSelectedNode(sampleOwnershipNodes[1])}
                className="p-3 rounded border border-blue-300 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all shadow-sm flex flex-col justify-between"
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

              {/* Julian Sterling (22.0% Non-UBO) */}
              <div 
                onClick={() => setSelectedNode(sampleOwnershipNodes[4])}
                className="p-3 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-sm flex flex-col justify-between"
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

              {/* Vanguard Pacific Nominees (18.0% Non-UBO) */}
              <div 
                onClick={() => setSelectedNode(sampleOwnershipNodes[5])}
                className="p-3 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-sm flex flex-col justify-between"
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
            <div className="flex justify-start pl-24 -my-2">
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* TIER 3: Natural Person Beneficiaries under Atlantic Horizon */}
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-400">
              {/* Arthur Pendelton (32.0% Qualified UBO) */}
              <div 
                onClick={() => setSelectedNode(sampleOwnershipNodes[2])}
                className={`p-3.5 rounded border cursor-pointer transition-all shadow-sm ${
                  selectedNode?.id === 'node-3' 
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20' 
                    : 'border-emerald-200 bg-white hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-900">Arthur Pendelton</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-300">
                    32.00% Effective
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  Atlantic Equity: 53.33% &times; 60.0% Direct = <strong>32.00%</strong>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-1.5 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    QUALIFIED UBO (&ge; 25%)
                  </span>
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded">
                    Expired Passport (PROVISIONAL-GAP-1)
                  </span>
                </div>
              </div>

              {/* Helena Vance-Cross (28.0% Qualified UBO) */}
              <div 
                onClick={() => setSelectedNode(sampleOwnershipNodes[3])}
                className={`p-3.5 rounded border cursor-pointer transition-all shadow-sm ${
                  selectedNode?.id === 'node-4' 
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20' 
                    : 'border-emerald-200 bg-white hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold text-slate-900">Helena Vance-Cross</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded border border-emerald-300">
                    28.00% Effective
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono">
                  Atlantic Equity: 46.67% &times; 60.0% Direct = <strong>28.00%</strong>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-1.5 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    QUALIFIED UBO (&ge; 25%)
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                    Liveness: PASS (PROVISIONAL-GAP-1)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Entity Inspector & Analyst Override */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Entity Node Details</span>
              <span className="text-[10px] font-mono text-slate-400">{selectedNode?.id}</span>
            </div>

            {selectedNode && (
              <div className="space-y-2.5 text-xs">
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

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded font-mono">
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
                  <div className="p-2.5 rounded bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-900 block uppercase">
                      Liveness Verdict (PROVISIONAL-GAP-1 & GAP-5)
                    </span>
                    <span className="font-mono text-xs font-semibold text-blue-900">
                      Status: {selectedNode.livenessStatus}
                    </span>
                    <span className="text-[10px] text-blue-700 block mt-0.5">
                      Cryptographically linked via session token (No raw biometric stored per GAP-8)
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
                className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary h-16 resize-none"
              ></textarea>
              <button
                onClick={handleApplyOverride}
                className="w-full py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold shadow-sm"
              >
                Apply Override to Audit Log
              </button>
              {overrideApplied && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200">
                  Override committed to Merkle audit chain (#8f2a-cc91-44b0)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
