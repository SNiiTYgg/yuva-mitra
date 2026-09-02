import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Building2, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
            <span>Hunar Ki Pehchaan • Academia–Industry Collaboration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Connect. Discover. <span className="text-indigo-600 dark:text-indigo-400">Grow.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            YuvaMitra connects students with opportunities from industries, companies and academic institutions — making it easier to discover, apply and build meaningful career experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/login')}
              icon={Compass}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section (Students & Providers) */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Student Flow */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                How it works — For Students
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card padding="p-5">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Step 1
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Create your profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add your education, college details, and basic skill information.
                </p>
              </Card>

              <Card padding="p-5">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Step 2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Explore opportunities
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Browse internships and projects posted by approved providers.
                </p>
              </Card>

              <Card padding="p-5">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Step 3
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Apply & track
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Apply to openings and monitor application status in real-time.
                </p>
              </Card>
            </div>
          </div>

          {/* Provider Flow */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                How it works — For Providers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card padding="p-5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  Step 1
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Register your organization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submit basic company or academic institution details.
                </p>
              </Card>

              <Card padding="p-5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  Step 2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Get approved
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  YuvaMitra administrators review your organization details.
                </p>
              </Card>

              <Card padding="p-5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  Step 3
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Post opportunities
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Publish openings, define criteria, and manage student applicants.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => navigate('/register?role=student')}
            >
              I'm a Student
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => navigate('/register?role=provider')}
            >
              I'm a Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            YuvaMitra • Hunar Ki Pehchaan
          </span>
          <span>© {new Date().getFullYear()} YuvaMitra Platform</span>
        </div>
      </footer>
    </div>
  );
}
