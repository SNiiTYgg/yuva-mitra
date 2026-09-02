import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/common/LoadingState';
import { Wifi, AlertTriangle } from 'lucide-react';

export function ProtectedRoute({ allowedRole }) {
  const { currentUser, loading, firestoreError, isApprovedProvider } = useAuth();
  const location = useLocation();

  // Still resolving auth / Firestore
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <LoadingState message="Signing you in…" />
      </div>
    );
  }

  // Firestore offline — show a clear error instead of a confusing redirect
  if (firestoreError === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto">
            <Wifi className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Cannot reach YuvaMitra database
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your internet connection is working, but Cloud Firestore is unreachable.
            This usually means Firestore has not been created in the Firebase Console yet.
          </p>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 text-left space-y-1">
            <strong className="block">Fix in Firebase Console:</strong>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Open <strong>Firebase Console → yuvamitra project</strong></li>
              <li>Go to <strong>Build → Firestore Database</strong></li>
              <li>Click <strong>Create Database</strong></li>
              <li>Choose <strong>asia-south1</strong> (Mumbai) or nearest region</li>
              <li>Start in <strong>Production mode</strong></li>
              <li>Paste your <code>firestore.rules</code> in the Rules tab</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (firestoreError === 'permission-denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Firestore Permission Denied
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You're signed in but Firestore security rules are blocking access.
            Publish the <code>firestore.rules</code> file in Firebase Console.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated → login
  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Profile incomplete → onboarding
  if (!currentUser.isProfileComplete) {
    return currentUser.role === 'student'
      ? <Navigate to="/complete-profile/student" replace />
      : <Navigate to="/complete-profile/provider" replace />;
  }

  // Wrong role → correct dashboard
  if (allowedRole && currentUser.role !== allowedRole) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
    return <Navigate to="/student/explore" replace />;
  }

  return <Outlet />;
}
