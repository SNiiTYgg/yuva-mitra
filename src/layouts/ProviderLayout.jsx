import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ProviderSidebar } from '../components/navigation/ProviderSidebar';
import { DemoRoleBar } from '../components/feedback/DemoRoleBar';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Sparkles, Menu, X, LogOut, Clock, AlertTriangle, Building2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/common/UserAvatar';

export function ProviderLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser, isPendingProvider, isRejectedProvider, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <DemoRoleBar />

      {/* Top Provider Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white hidden sm:inline">
                Yuva<span className="text-indigo-600 dark:text-indigo-400">Mitra</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-800">
                {currentUser?.providerType === 'academia' ? 'Academia' : 'Industry'} Provider
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link to="/provider/profile" className="flex items-center gap-2 group">
                <UserAvatar name={currentUser?.name || 'Provider'} size="sm" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:inline group-hover:text-indigo-600">
                  {currentUser?.name || 'Provider'}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pending / Rejected Notice Banner */}
      {isPendingProvider && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-300 dark:border-amber-800/80 px-4 sm:px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>Account Pending Review:</strong> Your provider registration has been submitted and is currently being audited by our verification directorate. Opportunity publishing will unlock once approved.
              </span>
            </div>
            <Link
              to="/register/under-review"
              className="underline font-bold text-amber-900 dark:text-amber-200 shrink-0 hover:text-amber-950"
            >
              View Status
            </Link>
          </div>
        </div>
      )}

      {isRejectedProvider && (
        <div className="bg-rose-500/10 dark:bg-rose-950/40 border-b border-rose-300 dark:border-rose-800/80 px-4 sm:px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs sm:text-sm text-rose-800 dark:text-rose-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Registration Verification Failed:</strong> {currentUser?.rejectionReason || 'Institutional credentials could not be validated.'} Please update your profile or reach out to support.
            </span>
          </div>
        </div>
      )}

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <ProviderSidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full z-50 animate-in slide-in-from-left duration-200">
              <ProviderSidebar onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
