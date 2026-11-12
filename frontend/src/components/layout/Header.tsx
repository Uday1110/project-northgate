import React, { useState } from 'react';
import { sampleCase } from '../../data/sampleData';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  currentPath: string;
  onOpenUpload: () => void;
  onOpenCaseInspection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onOpenCaseInspection,
}) => {
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Statutory Address Mismatch',
      desc: 'Companies House record differs from declared Articles for Harbor Crest Holdings Ltd.',
      time: '12m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Credential Expiry Flagged',
      desc: 'Passport for UBO Arthur Pendelton expired on 12 Jan 2024.',
      time: '18m ago',
      type: 'error',
    },
    {
      id: 3,
      title: 'MCP Gateway Latency Warning',
      desc: 'Public registry query retry 1 of 2 scheduled (bounded at 10s).',
      time: '34m ago',
      type: 'info',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white z-50 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border-b border-slate-200">
      <div className="h-14 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Case Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              N
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900">Project Northgate</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] uppercase tracking-wider flex items-center gap-1 font-semibold border border-blue-200">
                  <span className="material-symbols-outlined text-[11px]">verified_user</span>
                  FedRAMP High
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:block h-5 w-px bg-slate-200 flex-shrink-0"></div>

          {/* Interactive Case metadata pill */}
          <button
            onClick={onOpenCaseInspection}
            className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-slate-100 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer text-left truncate group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            title="Click to view Case Inspection Dossier"
          >
            <span className="font-mono text-[11px] font-bold text-slate-600 group-hover:text-blue-700 transition-colors">
              {sampleCase.caseId}
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="font-semibold text-slate-800 truncate hidden sm:inline max-w-[160px] lg:max-w-none">
              {sampleCase.entityName}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px] border border-emerald-200 flex-shrink-0">
              {sampleCase.status}
            </span>
            <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-slate-700 hidden sm:inline">
              expand_more
            </span>
          </button>
        </div>

        {/* Right: Actions, Notifications, Timer & Analyst */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Header Upload Action Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 rounded-lg border border-blue-200 text-xs font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none shadow-sm"
            title="Upload new corporate dossier formation bundle"
            aria-label="Upload bundle"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span className="hidden md:inline">Upload Bundle</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              title="View system alerts"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-left"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Operational Alerts ({notifications.length})
                  </span>
                  <button
                    onClick={() => {
                      showToast('Alerts Cleared', 'All active alerts marked as acknowledged.', 'info');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <span className={`material-symbols-outlined text-base mt-0.5 ${
                          n.type === 'error' ? 'text-rose-600' : n.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {n.type === 'error' ? 'error' : n.type === 'warning' ? 'warning' : 'info'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 flex justify-between">
                            <span className="truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal ml-2">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Operational cycle timer */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
            <span className="material-symbols-outlined text-sm text-amber-700">timer</span>
            <span>Cycle: <strong>{sampleCase.cycleTime}</strong></span>
          </div>

          {/* Analyst profile badge */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              MV
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Marcus Vance</span>
              <span className="text-[10px] text-slate-500 leading-tight">KYC Senior Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
