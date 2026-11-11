import React, { useState } from 'react';
import { sampleDeficiencies } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const DeficiencyPunchList: React.FC<PageProps> = ({ onNavigate }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(['DEF-001', 'DEF-002']);
  const [approvalRequested, setApprovalRequested] = useState<boolean>(false);

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDispatchOutreach = () => {
    setApprovalRequested(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Deficiency Punch List & Remediation</h1>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold border border-red-300">
              Stage 3 Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Actionable audit checklist of missing documentation and registry disparities for Relationship Manager resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            Export Audit PDF
          </button>
          <button 
            onClick={() => onNavigate('/audit-trail')}
            className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>View Audit Trail</span>
            <span className="material-symbols-outlined text-sm">history_edu</span>
          </button>
        </div>
      </div>

      {/* Pipeline Gate Banner */}
      <div className="bg-red-50 border-2 border-red-400 rounded p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-red-600 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">lock_clock</span>
          </div>
          <div>
            <div className="text-sm font-bold text-red-950 uppercase tracking-wide">
              Current Pipeline Gate: BLOCKED PENDING REMEDIATION
            </div>
            <div className="text-xs text-red-800 mt-0.5">
              Account activation prohibited until all Critical Blockers are cured. SLA Deadline: 18 Nov 2024 (T-48h).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-200 text-red-950 text-xs font-bold rounded font-mono">
            2 CRITICAL BLOCKERS ACTIVE
          </span>
        </div>
      </div>

      {/* Deficiency Items Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Evidentiary Discrepancy Ledger (4 Identified Items)
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {selectedItems.length} of {sampleDeficiencies.length} selected for outreach
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-2.5 w-10">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === sampleDeficiencies.length}
                  onChange={() => {
                    if (selectedItems.length === sampleDeficiencies.length) setSelectedItems([]);
                    else setSelectedItems(sampleDeficiencies.map(d => d.id));
                  }}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-2.5">Severity</th>
              <th className="px-4 py-2.5">Deficiency Item</th>
              <th className="px-4 py-2.5">Target Entity / Person</th>
              <th className="px-4 py-2.5">Regulatory Reference</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sampleDeficiencies.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isCritical = item.severity === 'CRITICAL_BLOCKER';
              return (
                <tr 
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`cursor-pointer transition-colors ${
                    isCritical ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {isCritical ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[11px] font-bold rounded border border-red-300">
                        CRITICAL BLOCKER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded border border-amber-300">
                        STANDARD WARNING
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {item.targetEntityOrPerson}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                    {item.regulatoryReference}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">
                    {item.ageDays} Days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Human-in-the-Loop Approval Gate Dispatch Section */}
      <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Approval Gate Enforcement & Outreach Dispatch
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Rule 1 & PROVISIONAL-GAP-6: No outbound messages may leave the system without human analyst authorization.
            </p>
          </div>

          <button
            onClick={handleDispatchOutreach}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">outgoing_mail</span>
            Request Analyst Approval to Dispatch ({selectedItems.length} items)
          </button>
        </div>

        {approvalRequested && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-base">lock</span>
              <strong>Approval Gate Active:</strong> Dispatch request for {selectedItems.length} items submitted to Marcus Vance for 4-eye sign-off.
            </span>
            <span className="font-mono text-[11px] text-amber-700">HELD AT GATE</span>
          </div>
        )}
      </div>
    </div>
  );
};
