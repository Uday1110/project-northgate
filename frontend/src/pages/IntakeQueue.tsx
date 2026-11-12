import React from 'react';
import { sampleCase } from '../data/sampleData';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
  onOpenUpload: () => void;
  onOpenCaseInspection: () => void;
  customCases?: any[];
}

export interface IntakeCaseItem {
  caseId: string;
  entityName: string;
  lei: string;
  crn: string;
  jurisdiction: string;
  documents: number;
  status: 'Ready for Review' | 'In Processing' | 'Deficiency Action Required' | 'Approved';
  statusColor: string;
  received: string;
  analyst: string;
  actionRoute: string;
  actionLabel: string;
}

export const IntakeQueue: React.FC<PageProps> = ({
  onNavigate,
  onOpenUpload,
  onOpenCaseInspection,
  customCases = [],
}) => {
  const { showToast } = useToast();

  // Initial ledger entries
  const defaultCases: IntakeCaseItem[] = [
    {
      caseId: sampleCase.caseId,
      entityName: sampleCase.entityName,
      lei: sampleCase.lei,
      crn: sampleCase.crn,
      jurisdiction: sampleCase.jurisdiction,
      documents: sampleCase.documentsReceived,
      status: 'Ready for Review',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      received: '14m ago',
      analyst: 'Marcus Vance',
      actionRoute: '/ownership-workbench',
      actionLabel: 'Workbench',
    },
    {
      caseId: 'CASE-2024-8840',
      entityName: 'Vanguard Maritime Logistics Corp',
      lei: '549300VNG8821901234',
      crn: 'SG-20188921-A',
      jurisdiction: 'Singapore / Pte Ltd',
      documents: 8,
      status: 'In Processing',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      received: '42m ago',
      analyst: 'Sarah Lin (RM)',
      actionRoute: '/processing-state',
      actionLabel: 'View DAG',
    },
    {
      caseId: 'CASE-2024-8839',
      entityName: 'Apex Capital Infrastructure Partners',
      lei: '213800APX7712398765',
      crn: '09124578',
      jurisdiction: 'United Kingdom / LLP',
      documents: 6,
      status: 'Deficiency Action Required',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-200',
      received: '1h 15m ago',
      analyst: 'David Ross',
      actionRoute: '/deficiency-punch-list',
      actionLabel: 'Deficiencies',
    },
    {
      caseId: 'CASE-2024-8838',
      entityName: 'Solaria Renewable Holdings B.V.',
      lei: '724500SOL3311224455',
      crn: 'NL-88491023',
      jurisdiction: 'Netherlands / B.V.',
      documents: 4,
      status: 'Ready for Review',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      received: '2h 05m ago',
      analyst: 'Marcus Vance',
      actionRoute: '/registry-reconciliation',
      actionLabel: 'Reconcile',
    },
  ];

  // Combine default with any newly uploaded cases
  const allCases: IntakeCaseItem[] = [
    ...customCases.map((c) => ({
      caseId: c.caseId,
      entityName: c.entityName,
      lei: c.lei,
      crn: c.crn,
      jurisdiction: c.jurisdiction,
      documents: c.documentsReceived || 4,
      status: 'Ready for Review' as const,
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      received: 'Just now',
      analyst: 'Marcus Vance',
      actionRoute: '/ownership-workbench',
      actionLabel: 'Workbench',
    })),
    ...defaultCases,
  ];

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = [
      'Case ID',
      'Client Legal Name',
      'LEI',
      'CRN',
      'Jurisdiction',
      'Documents',
      'Processing Status',
      'Received',
      'Analyst Assigned',
    ];

    const rows = allCases.map((c) => [
      `"${c.caseId}"`,
      `"${c.entityName}"`,
      `"${c.lei}"`,
      `"${c.crn}"`,
      `"${c.jurisdiction}"`,
      c.documents,
      `"${c.status}"`,
      `"${c.received}"`,
      `"${c.analyst}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `Northgate_Intake_Ledger_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      'Intake Ledger Exported',
      `Exported ${allCases.length} corporate dossier records to CSV.`,
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Intake & Triage Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              {allCases.length} Active Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated corporate dossier ingestion, OCR extraction, and multi-tier reconciliation queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            title="Download full intake ledger as CSV"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export Ledger</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            title="Upload new corporate dossier formation bundle"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>Upload Bundle</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (4 KPI Cards with Responsive Grid Breakpoints) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Queue</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{allCases.length} Cases</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span> +3 from last shift
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Intake Cycle Time</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">03m 42s</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Target &lt; 05:00 (SLA Compliant)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discrepancy Rate</div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">18.4%</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">2.1% flagged UBOs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">24-Hour SLA Compliance</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">99.1%</div>
          <div className="text-[11px] text-slate-500 mt-1">342 of 345 completed</div>
        </div>
      </div>

      {/* Interactive Upload Dropzone Banner */}
      <div 
        onClick={onOpenUpload}
        className="bg-blue-50/80 hover:bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-sm cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-sm flex-shrink-0 transition-colors">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <span>Automated Entity Extraction & Cross-Check &lt; 90s</span>
              <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.5 rounded uppercase">
                Drag & Drop
              </span>
            </div>
            <div className="text-xs text-blue-700 mt-0.5">
              Click to browse or drop formation packets (Articles of Association, Register of Members, Director rosters, Passports)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            onClick={onOpenCaseInspection}
            className="px-3.5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            title="Inspect sample benchmark case details"
          >
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Inspect Sample Case ({sampleCase.entityName})</span>
          </button>
        </div>
      </div>

      {/* Active Intake Ledger Table (with Scoped Horizontal Scroll Wrapper) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Intake Ledger
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ({allCases.length} cases tracked)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Click any row to inspect evidentiary details
          </span>
        </div>

        {/* Scoped overflow-x-auto ensures the table never clips columns or pushes the parent container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[960px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Case ID</th>
                <th className="px-5 py-3">Client Legal Name</th>
                <th className="px-5 py-3">Jurisdiction & Type</th>
                <th className="px-5 py-3">Documents</th>
                <th className="px-5 py-3">Processing Status</th>
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3">Analyst Assigned</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {allCases.map((c) => (
                <tr
                  key={c.caseId}
                  onClick={onOpenCaseInspection}
                  className="hover:bg-blue-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-700 group-hover:underline">
                    {c.caseId}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{c.entityName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      LEI: {c.lei} • CRN: {c.crn}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{c.jurisdiction}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700 font-semibold">
                      {c.documents} Files
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded font-semibold text-[11px] border inline-block ${c.statusColor}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono">{c.received}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{c.analyst}</td>
                  <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onNavigate(c.actionRoute)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 font-semibold text-xs inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                    >
                      <span>{c.actionLabel}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
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
