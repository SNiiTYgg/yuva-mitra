import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  DEMO_STUDENT,
  DEMO_INDUSTRY_PROVIDER,
  DEMO_ACADEMIA_PROVIDER,
  DEMO_ADMIN,
} from '../../data/demoData';
import { GraduationCap, Building2, Shield, BookOpen, ChevronDown, RotateCcw, LogOut } from 'lucide-react';

export function DemoRoleBar() {
  const { currentUser, demoMode, switchRole, exitDemoMode } = useAuth();
  const { resetToDefaults } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSwitch = (demoUser, targetRoute) => {
    switchRole(demoUser);
    navigate(targetRoute);
    setOpen(false);
  };

  const handleExit = () => {
    exitDemoMode();
    navigate('/login');
    setOpen(false);
  };

  const getRoleLabel = () => {
    if (!currentUser) return 'Guest';
    if (currentUser.role === 'admin') return 'Admin View';
    if (currentUser.role === 'provider') {
      if (currentUser.status === 'pending') return 'Provider (Pending)';
      return currentUser.providerType === 'academia' ? 'Academia Provider' : 'Industry Provider';
    }
    return 'Student View';
  };

  const getModeLabel = () => {
    if (demoMode) return 'Demo';
    if (currentUser) return 'Live';
    return 'Guest';
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-1 px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Persona:</span>
          <span className="font-semibold text-slate-100 bg-slate-800 px-2 py-0.5 rounded">
            {getRoleLabel()}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
            demoMode
              ? 'bg-amber-900/60 text-amber-300 border border-amber-800/60'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {getModeLabel()}
          </span>
          <span className="text-slate-400 hidden sm:inline">
            ({currentUser?.name || 'Not signed in'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs transition-colors font-medium border border-slate-700"
            >
              <span>Switch Demo</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Switch Demo Persona
                </div>

                <button
                  onClick={() => handleSwitch(DEMO_STUDENT, '/student/explore')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-800 text-slate-200 text-xs transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-semibold block">Student</span>
                    <span className="text-[10px] text-slate-400">Aarav Sharma — VJTI Mumbai</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSwitch(DEMO_INDUSTRY_PROVIDER, '/provider/dashboard')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-800 text-slate-200 text-xs transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-semibold block">Industry Provider</span>
                    <span className="text-[10px] text-slate-400">TechNova Solutions Pvt. Ltd.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSwitch(DEMO_ACADEMIA_PROVIDER, '/provider/dashboard')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-800 text-slate-200 text-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-semibold block">Academia Provider</span>
                    <span className="text-[10px] text-slate-400">VJTI Mumbai</span>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => handleSwitch(DEMO_ADMIN, '/admin/dashboard')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-800 text-slate-200 text-xs transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-semibold block">Admin Console</span>
                    <span className="text-[10px] text-slate-400">YuvaMitra Administrator</span>
                  </div>
                </button>

                {demoMode && (
                  <>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      onClick={handleExit}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-800 text-amber-300 text-xs transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-semibold">Exit Demo Mode</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={resetToDefaults}
            title="Reset Data"
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
