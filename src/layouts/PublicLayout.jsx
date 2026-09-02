import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { DemoRoleBar } from '../components/feedback/DemoRoleBar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <DemoRoleBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
