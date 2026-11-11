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
      badge: '14',
      badgeClass: 'bg-surface-container-high text-on-surface'
    },
    {
      path: '/processing-state',
      label: 'Processing State',
      icon: 'hourglass_top',
      badge: '1 active',
      badgeClass: 'bg-surface-container-high text-on-surface'
    },
    {
      path: '/ownership-workbench',
      label: 'Ownership Workbench',
      icon: 'account_tree',
      badge: 'Primary',
      badgeClass: 'bg-secondary-container text-white'
    },
    {
      path: '/registry-reconciliation',
      label: 'Registry Reconciliation',
      icon: 'sync_alt',
      badge: '1 Discrepancy',
      badgeClass: 'bg-red-100 text-red-700 font-semibold'
    },
    {
      path: '/document-viewer',
      label: 'Document Viewer',
      icon: 'description',
      badge: 'Extracted',
      badgeClass: 'bg-surface-container-high text-on-surface'
    },
    {
      path: '/deficiency-punch-list',
      label: 'Deficiency Punch List',
      icon: 'rule',
      badge: '2 Blockers',
      badgeClass: 'bg-red-100 text-red-700 font-bold'
    },
    {
      path: '/audit-trail',
      label: 'Audit Trail',
      icon: 'history_edu',
      badge: 'Live',
      badgeClass: 'bg-surface-container-high text-on-surface'
    }
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-[#e2e8f0] flex flex-col justify-between z-40 select-none">
      <div className="flex flex-col pt-3">
        <div className="px-4 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operational Queue
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/intake-queue');
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${item.badgeClass}`}>
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
            FedRAMP East-1
          </span>
          <span className="font-mono text-[10px]">v4.2-pilot</span>
        </div>
        <div className="text-[11px] text-center font-medium text-slate-500 bg-white py-1 px-2 rounded border border-slate-200">
          Prototype with sample data.
        </div>
      </div>
    </aside>
  );
};
