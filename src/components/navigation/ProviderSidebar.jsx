import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Building2, PlusCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export function ProviderSidebar({ onClose }) {
  const { currentUser, isPendingProvider, isApprovedProvider } = useAuth();

  const PROVIDER_NAV_ITEMS = [
    { label: 'Overview', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'My Opportunities', path: '/provider/opportunities', icon: Briefcase },
    { label: 'Applications', path: '/provider/applications', icon: Users },
    { label: 'Organization Profile', path: '/provider/profile', icon: Building2 },
  ];

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full py-5 px-3 overflow-y-auto">
      <div className="space-y-4">
        {/* Provider Mini Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
            {currentUser?.organizationName || 'TCS'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize truncate">
            {currentUser?.providerType || 'Industry'} Partner
          </div>
          <div className="mt-2">
            {isApprovedProvider ? (
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3" /> Approved
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                <Clock className="w-3 h-3" /> Pending Approval
              </Badge>
            )}
          </div>
        </div>

        {/* Post Opportunity Button */}
        {isApprovedProvider && (
          <NavLink
            to="/provider/opportunities/create"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Opportunity</span>
          </NavLink>
        )}

        {/* Nav Links */}
        <nav className="space-y-1">
          {PROVIDER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white dark:bg-indigo-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        YuvaMitra Provider Hub
      </div>
    </aside>
  );
}
