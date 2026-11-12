import React from 'react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const navItems = [
    {
      path: '/intake-queue',
      label: 'Intake Queue',
      icon: 'move_to_inbox',
      badge: '14 Active',
      badgeClass: 'bg-slate-200 text-slate-800'
    },
    {
      path: '/processing-state',
      label: 'Processing State',
      icon: 'hourglass_top',
      badge: '1 active',
      badgeClass: 'bg-blue-100 text-blue-800 font-semibold'
    },
    {
      path: '/ownership-workbench',
      label: 'Ownership Workbench',
      icon: 'account_tree',
      badge: 'Primary',
      badgeClass: 'bg-blue-600 text-white font-semibold'
    },
    {
      path: '/registry-reconciliation',
      label: 'Registry Reconciliation',
      icon: 'sync_alt',
      badge: '1 Discrepancy',
      badgeClass: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      path: '/document-viewer',
      label: 'Document Viewer',
      icon: 'description',
      badge: 'Extracted',
      badgeClass: 'bg-slate-200 text-slate-800'
    },
    {
      path: '/deficiency-punch-list',
      label: 'Deficiency Punch List',
      icon: 'rule',
      badge: '2 Blockers',
      badgeClass: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      path: '/audit-trail',
      label: 'Audit Trail',
      icon: 'history_edu',
      badge: 'Live WORM',
      badgeClass: 'bg-emerald-100 text-emerald-800 font-semibold'
    }
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-40 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col pt-3">
        <div className="px-4 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Operational Queue</span>
          <span className="text-[10px] text-slate-400 font-mono">FATF / 5AMLD</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/intake-queue');
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`material-symbols-outlined text-[18px] transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-800'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono flex-shrink-0 ${
                  isActive ? 'bg-slate-800 text-slate-200' : item.badgeClass
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-slate-200 flex flex-col gap-2 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FedRAMP High (asia-south1)
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-600">v4.2-pilot</span>
        </div>
        <div className="text-[11px] text-center font-medium text-slate-600 bg-white py-1 px-2 rounded border border-slate-200">
          Dual-Analyst Gate Active (4-Eye)
        </div>
      </div>
    </aside>
  );
};
