import React from 'react';
import { sampleCase, sampleOwnershipNodes, sampleDeficiencies } from '../../data/sampleData';

interface CaseInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  caseData?: typeof sampleCase;
}

export const CaseInspectionModal: React.FC<CaseInspectionModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  caseData = sampleCase,
}) => {
  if (!isOpen) return null;

  const qualifiedUBOs = sampleOwnershipNodes.filter((n) => n.isUBO);
  const criticalDeficiencies = sampleDeficiencies.filter((d) => d.severity === 'CRITICAL_BLOCKER');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-blue-300 font-semibold">{caseData.caseId}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                  {caseData.status}
                </span>
              </div>
              <h2 id="modal-title" className="text-base font-bold text-white tracking-tight">
                {caseData.entityName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">LEI Code</span>
              <span className="font-mono font-bold text-slate-800 break-all">{caseData.lei}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">CRN / Registration</span>
              <span className="font-mono font-bold text-slate-800">{caseData.crn}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Jurisdiction</span>
              <span className="font-semibold text-slate-800">{caseData.jurisdiction}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Cycle Time Elapsed</span>
              <span className="font-mono font-bold text-blue-700">{caseData.cycleTime}</span>
            </div>
          </div>

          {/* Key Evidentiary Findings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-blue-600">policy</span>
              Evidentiary & Algorithmic Triage Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UBOs card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Qualified UBOs</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-mono text-[10px]">
                    &ge; 25%
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {qualifiedUBOs.map((ubo) => (
                    <div key={ubo.id} className="text-xs text-emerald-800 flex justify-between">
                      <span className="font-medium truncate">{ubo.name}</span>
                      <span className="font-mono font-bold ml-2">{ubo.effectivePct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registry Discrepancies */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Registry Check</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-mono text-[10px]">
                    1 Alert
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-2 leading-relaxed">
                  Address mismatch detected between declared Articles (Cannon St) and UK Companies House (Finsbury Circus).
                </p>
              </div>

              {/* Blockers */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span>Deficiencies</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 font-mono text-[10px]">
                    {criticalDeficiencies.length} Blockers
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 mt-2 leading-relaxed">
                  Arthur Pendelton passport expired on 12 Jan 2024. Remediation dispatch required prior to sign-off.
                </p>
              </div>
            </div>
          </div>

          {/* Ingested Dossier Packets */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ingested Document Packets (5 Source PDFs)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="material-symbols-outlined text-sm text-slate-500">description</span>
                  Articles_of_Association.pdf
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">PARSED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="material-symbols-outlined text-sm text-slate-500">description</span>
                  Register_of_Members.pdf
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">PARSED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="material-symbols-outlined text-sm text-rose-500">badge</span>
                  Passport_Arthur_Pendelton.pdf
                </span>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">EXPIRED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="material-symbols-outlined text-sm text-slate-500">receipt_long</span>
                  Proof_of_Address_Utility.pdf
                </span>
                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">MISMATCH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Analyst: <strong className="text-slate-800">{caseData.assignedAnalyst}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('/document-viewer');
              }}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Document Vault
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('/registry-reconciliation');
              }}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">sync_alt</span>
              Registry Check
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('/ownership-workbench');
              }}
              className="px-3.5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Ownership Workbench</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
