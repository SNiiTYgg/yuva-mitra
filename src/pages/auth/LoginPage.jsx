import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, Building2, AlertTriangle, Wifi, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'student';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [organizationType, setOrganizationType] = useState('Industry / Company');
  const [googleLoading, setGoogleLoading] = useState(false);

  const { currentUser, loading, initiateGoogleLogin, firestoreError } = useAuth();
  const navigate = useNavigate();

  // ─── Navigate when auth resolves after redirect ────────────────────────────
  // Guard with !loading: only redirect AFTER Firebase Auth + Firestore have
  // both resolved. Without this, a cached user could bounce the user away
  // before they ever see the role-selection UI.
  useEffect(() => {
    if (loading) return;        // still initializing — stay on page
    if (!currentUser) return;   // no user — show role-selection

    if (!currentUser.isProfileComplete) {
      // New user — send to profile completion
      if (currentUser.role === 'student') {
        navigate('/complete-profile/student', { replace: true });
      } else {
        navigate('/complete-profile/provider', { replace: true });
      }
      return;
    }

    // Returning user with complete profile
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (currentUser.role === 'provider') {
      if (currentUser.status === 'pending') {
        navigate('/register/under-review', { replace: true });
      } else {
        navigate('/provider/dashboard', { replace: true });
      }
    } else {
      navigate('/student/explore', { replace: true });
    }
  }, [loading, currentUser, navigate]);

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    // This navigates the page away — no await. Loading state doesn't need reset.
    initiateGoogleLogin(selectedRole, organizationType);
  };

  // While Firebase is initializing show a minimal spinner so the role-selection
  // form never flashes and then disappears if a returning user is detected.
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              Y
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">YuvaMitra</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white pt-2">
            Welcome to YuvaMitra
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your account type and continue with Google
          </p>
        </div>

        {/* Firestore Offline / Error Banner */}
        {firestoreError === 'offline' && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200">
            <Wifi className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <strong className="block font-bold mb-0.5">Unable to reach YuvaMitra database</strong>
              <span>
                Google sign-in succeeded but the database is unreachable. This usually means:
              </span>
              <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300">
                <li>Cloud Firestore has not been created yet in Firebase Console</li>
                <li>A browser extension or firewall is blocking <code>firestore.googleapis.com</code></li>
                <li>The Firebase project ID in <code>.env.local</code> is incorrect</li>
              </ul>
              <span className="block mt-2 font-semibold text-indigo-700 dark:text-indigo-400">
                Fix: Firebase Console → Firestore Database → Create Database
              </span>
            </div>
          </div>
        )}

        {firestoreError === 'permission-denied' && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="block font-bold mb-0.5">Firestore Permission Denied</strong>
              <span>
                You're authenticated but Firestore security rules are rejecting the request.
              </span>
              <span className="block mt-2 font-semibold text-indigo-700 dark:text-indigo-400">
                Fix: Firebase Console → Firestore → Rules → publish the rules from <code>firestore.rules</code>
              </span>
            </div>
          </div>
        )}

        <Card padding="p-6 sm:p-7" className="shadow-xs border-slate-200 dark:border-slate-800">
          <div className="space-y-5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select your account type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[
                  { value: 'student', label: 'Student', icon: GraduationCap },
                  { value: 'provider', label: 'Provider', icon: Building2 },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedRole(value)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === value
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Type (Provider only) */}
            {selectedRole === 'provider' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  What type of organization are you?
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Industry / Company', 'Academic Institution'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrganizationType(type)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-all text-center ${
                        organizationType === type
                          ? 'border-indigo-600 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
              New to YuvaMitra? Choose an account type and continue with Google.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
