import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, FileText, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const STUDENT_NAV_ITEMS = [
  { label: 'Explore Opportunities', path: '/student/explore', icon: Compass },
  { label: 'My Applications', path: '/student/applications', icon: FileText },
  { label: 'My Profile', path: '/student/profile', icon: User },
];

export function StudentSidebar({ onClose }) {
  const { currentUser } = useAuth();

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full py-5 px-3 overflow-y-auto">
      <div className="space-y-4">
        {/* User Mini Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
            {currentUser?.name || 'Aarav Sharma'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {currentUser?.college || 'IIT Delhi'}
          </div>
          <div className="mt-2 text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
            Student • Active
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {STUDENT_NAV_ITEMS.map((item) => {
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
        YuvaMitra Student Portal
      </div>
    </aside>
  );
}
