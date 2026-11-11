import React from 'react';
import { sampleCase } from '../../data/sampleData';

interface HeaderProps {
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0]">
      <div className="h-14 w-full px-4 flex items-center justify-between gap-4">
        {/* Left: Brand & Case Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-on-surface">Project Northgate</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span>
                  FedRAMP High
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-outline-variant opacity-40"></div>

          {/* Case metadata pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-medium text-slate-500">Case ID:</span>
            <span className="font-mono font-bold text-slate-800 bg-surface-container px-1.5 py-0.5 rounded">{sampleCase.caseId}</span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-800">{sampleCase.entityName}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
              {sampleCase.status}
            </span>
          </div>
        </div>

        {/* Right: Operational cycle timer & analyst profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
            <span className="material-symbols-outlined text-sm text-amber-700">timer</span>
            <span>Cycle Time: <strong>{sampleCase.cycleTime}</strong></span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
              MV
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">Marcus Vance</span>
              <span className="text-[10px] text-slate-500 leading-tight">KYC Senior Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
