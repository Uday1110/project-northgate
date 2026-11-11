import React from 'react';
import { sampleCase } from '../data/sampleData';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const IntakeQueue: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Intake & Triage Queue</h1>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">14 Active Units</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated corporate dossier ingestion, OCR extraction, and multi-tier reconciliation queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">file_download</span>
            Export Ledger
          </button>
          <button className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            Upload Bundle
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Queue</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">14 Cases</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span> +3 from last shift
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Intake Cycle Time</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">03m 42s</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Target &lt; 05:00 (SLA Compliant)</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discrepancy Rate</div>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">18.4%</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">2.1% flagged UBOs</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">24-Hour SLA Compliance</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">99.1%</div>
          <div className="text-[11px] text-slate-500 mt-1">342 of 345 completed</div>
        </div>
      </div>

      {/* Upload Dropzone Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </div>
          <div>
            <div className="text-sm font-bold text-blue-950">Automated Entity Extraction & Cross-Check &lt; 90s</div>
            <div className="text-xs text-blue-700 mt-0.5">
              Drag & drop formation packets (Articles of Association, Register of Members, Director rosters, Passports)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('/ownership-workbench')}
            className="px-3 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            Inspect Sample Case ({sampleCase.entityName})
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Intake Ledger</span>
          <span className="text-xs text-slate-500 font-mono">Showing primary test cases</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-2.5">Case ID</th>
              <th className="px-4 py-2.5">Client Legal Name</th>
              <th className="px-4 py-2.5">Jurisdiction & Type</th>
              <th className="px-4 py-2.5">Documents</th>
              <th className="px-4 py-2.5">Processing Status</th>
              <th className="px-4 py-2.5">Received</th>
              <th className="px-4 py-2.5">Analyst Assigned</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            <tr className="hover:bg-blue-50/50 bg-blue-50/20 transition-colors">
              <td className="px-4 py-3 font-mono font-bold text-blue-700">{sampleCase.caseId}</td>
              <td className="px-4 py-3">
                <div className="font-bold text-slate-900">{sampleCase.entityName}</div>
                <div className="text-[10px] text-slate-400 font-mono">LEI: {sampleCase.lei} • CRN: {sampleCase.crn}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{sampleCase.jurisdiction}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">5 Files</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  Ready for Review
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 font-mono">14m ago</td>
              <td className="px-4 py-3 text-slate-700 font-medium">Marcus Vance</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onNavigate('/ownership-workbench')}
                  className="px-2.5 py-1 rounded bg-primary text-white hover:bg-slate-800 font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
                >
                  Workbench <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </td>
            </tr>

            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-mono font-semibold text-slate-600">CASE-2024-8840</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-800">Vanguard Maritime Logistics Corp</div>
                <div className="text-[10px] text-slate-400 font-mono">LEI: 549300VNG8821901234 • SG</div>
              </td>
              <td className="px-4 py-3 text-slate-600">Singapore / Pte Ltd</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">8 Files</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200">
                  In Processing
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 font-mono">42m ago</td>
              <td className="px-4 py-3 text-slate-700 font-medium">Sarah Lin (RM)</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onNavigate('/processing-state')}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs inline-flex items-center gap-1"
                >
                  View DAG
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
