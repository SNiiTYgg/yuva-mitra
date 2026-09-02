import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AdminSidebar({ onClose }) {
  const { providers } = useData();
  const pendingCount = providers.filter((p) => p.status === 'pending').length;

  const ADMIN_NAV_ITEMS = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    {
      label: 'Provider Requests',
      path: '/admin/provider-requests',
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: 'Providers Directory', path: '/admin/providers', icon: Building2 },
    { label: 'All Opportunities', path: '/admin/opportunities', icon: Briefcase },
  ];

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full py-5 px-3 overflow-y-auto">
      <div className="space-y-4">
        {/* Admin Header */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Admin Console</div>
            <div className="text-[10px] text-slate-500">Provider & Opportunity Oversight</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white dark:bg-slate-700 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        YuvaMitra Admin Oversight
      </div>
    </aside>
  );
}
