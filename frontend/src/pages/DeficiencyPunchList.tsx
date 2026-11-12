import React, { useState } from 'react';
import { sampleDeficiencies, sampleCase, type DeficiencyItem } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const DeficiencyPunchList: React.FC<PageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<DeficiencyItem[]>(sampleDeficiencies);
  const [selectedItems, setSelectedItems] = useState<string[]>(['DEF-001', 'DEF-002']);
  const [approvalRequested, setApprovalRequested] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExportAuditPDF = () => {
    const reportText = `PROJECT NORTHGATE - DEFICIENCY PUNCH LIST AUDIT EXPORT\n=======================================================\nCase ID: ${sampleCase.caseId}\nEntity: ${sampleCase.entityName}\nGenerated: ${new Date().toISOString()}\nSLA Deadline: 18 Nov 2024 (T-48h)\n\nITEMS:\n` +
      items.map(i => `[${i.id}] ${i.severity}\nTitle: ${i.title}\nTarget: ${i.targetEntityOrPerson}\nRef: ${i.regulatoryReference}\nStatus: ${i.status}\nAction: ${i.actionRequired}\n`).join('\n----------------------------------------\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Deficiency_Punch_List_${sampleCase.caseId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Audit Report Exported', `Exported ${items.length} deficiency items for regulatory compliance file.`, 'success');
  };

  const handleConfirmDispatch = () => {
    setItems(prev => prev.map(item => {
      if (selectedItems.includes(item.id)) {
        return {
          ...item,
          status: 'PENDING_RM_SUBMISSION'
        };
      }
      return item;
    }));
    setApprovalRequested(true);
    setShowApprovalModal(false);
    showToast(
      'Remediation Outreach Dispatched',
      `4-Eye approval confirmed by Marcus Vance. Action notices sent to RM Sarah Lin for ${selectedItems.length} items.`,
      'success',
      5000
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Deficiency Punch List & Remediation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
              Stage 3 Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Actionable audit checklist of missing documentation and registry disparities for Relationship Manager resolution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <button 
            type="button"
            onClick={handleExportAuditPDF}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export Report</span>
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('/audit-trail')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span>View Audit Trail</span>
            <span className="material-symbols-outlined text-base">history_edu</span>
          </button>
        </div>
      </div>

      {/* Pipeline Gate Banner */}
      <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl">lock_clock</span>
          </div>
          <div>
            <div className="text-sm font-bold text-rose-950 uppercase tracking-wide">
              Current Pipeline Gate: BLOCKED PENDING REMEDIATION
            </div>
            <div className="text-xs text-rose-800 mt-0.5">
              Account activation prohibited until all Critical Blockers are cured. SLA Deadline: 18 Nov 2024 (T-48h).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <span className="px-3 py-1 bg-rose-200 text-rose-950 text-xs font-bold rounded-lg font-mono">
            2 CRITICAL BLOCKERS ACTIVE
          </span>
        </div>
      </div>

      {/* Deficiency Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Evidentiary Discrepancy Ledger ({items.length} Identified Items)
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            {selectedItems.length} of {items.length} selected for outreach
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[960px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === items.length}
                    onChange={() => {
                      if (selectedItems.length === items.length) setSelectedItems([]);
                      else setSelectedItems(items.map(d => d.id));
                    }}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Deficiency Item</th>
                <th className="px-5 py-3">Target Entity / Person</th>
                <th className="px-5 py-3">Regulatory Reference</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const isCritical = item.severity === 'CRITICAL_BLOCKER';
                return (
                  <tr 
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`cursor-pointer transition-colors ${
                      isCritical ? 'bg-rose-50/20 hover:bg-rose-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      {isCritical ? (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded border border-rose-300">
                          CRITICAL BLOCKER
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded border border-amber-300">
                          STANDARD WARNING
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {item.targetEntityOrPerson}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">
                      {item.regulatoryReference}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-500">
                      {item.ageDays} Days
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Human-in-the-Loop Approval Gate Dispatch Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Approval Gate Enforcement & Outreach Dispatch
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Rule 1 & PROVISIONAL-GAP-6: No outbound messages may leave the system without human analyst authorization.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedItems.length === 0) {
                showToast('Selection Required', 'Please select at least one deficiency item to dispatch outreach.', 'warning');
                return;
              }
              setShowApprovalModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none self-end sm:self-auto flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">outgoing_mail</span>
            <span>Dispatch Outreach ({selectedItems.length} items)</span>
          </button>
        </div>

        {approvalRequested && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-base">lock</span>
              <strong>Approval Gate Active:</strong> Dispatch request for {selectedItems.length} items submitted to Marcus Vance for 4-eye sign-off.
            </span>
            <span className="font-mono text-[11px] text-amber-700 font-bold">HELD AT GATE</span>
          </div>
        )}
      </div>

      {/* Dual Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dual-Analyst Outreach Authorization</h3>
                <p className="text-xs text-slate-500">4-Eye Gate &bull; Relationship Management Outreach</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are authorizing outreach for <strong>{selectedItems.length} deficiency items</strong> for <strong>{sampleCase.entityName}</strong>. This will notify Relationship Manager Sarah Lin with standardized remediation templates.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div><strong>Primary Reviewer:</strong> Marcus Vance (Senior Analyst)</div>
              <div><strong>Regulatory Basis:</strong> FCA MLR 2017 Art 13 & FATF Recommendation 10</div>
              <div><strong>SLA Window:</strong> 48 hours for customer reply</div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 cursor-pointer shadow-sm"
              >
                Authorize & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
