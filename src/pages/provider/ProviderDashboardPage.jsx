import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getProviderOpportunities, getProviderApplications } from '../../firebase/firestore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';

export function ProviderDashboardPage() {
  const { currentUser, demoMode, isPendingProvider, isApprovedProvider, isRejectedProvider } = useAuth();
  const { opportunities: demoOpportunities, applications: demoApplications } = useData();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      // Filter to show only this provider's data
      const pid = currentUser?.uid || currentUser?.id;
      setOpportunities(demoOpportunities.filter((o) => o.providerId === pid));
      setApplications(demoApplications.filter((a) => a.providerId === pid));
      setLoading(false);
      return;
    }

    async function loadProviderData() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const [opps, apps] = await Promise.all([
          getProviderOpportunities(currentUser.uid),
          getProviderApplications(currentUser.uid),
        ]);
        setOpportunities(opps);
        setApplications(apps);
      } catch (error) {
        console.error('Failed to load provider metrics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProviderData();
  }, [currentUser?.uid, demoMode, demoOpportunities, demoApplications]);

  const activeCount = opportunities.filter((o) => o.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Provider Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser?.organizationName || 'Organization'} • {currentUser?.organizationType || 'Industry Partner'}
          </p>
        </div>

        {isApprovedProvider && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/provider/opportunities/create')}
            icon={PlusCircle}
          >
            Post Opportunity
          </Button>
        )}
      </div>

      {/* Pending Banner if pending */}
      {isPendingProvider && (
        <Card padding="p-5" className="bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Registration under review
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Your organization request has been submitted. You will be able to post opportunities once an administrator approves your account.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Rejected Banner if rejected */}
      {isRejectedProvider && (
        <Card padding="p-5" className="bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                Registration Rejected
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                Reason: {currentUser?.rejectionReason || 'Verification criteria not met.'}
              </p>
              <Link to="/provider/profile">
                <Button variant="outline" size="xs">
                  Update Organization Info & Resubmit
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Summary KPI Cards */}
      {loading ? (
        <div className="py-6">
          <LoadingState message="Loading organization summary from Firestore..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="p-5">
            <span className="text-xs font-medium text-slate-500">Total Opportunities</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {opportunities.length}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Created by your organization</span>
          </Card>

          <Card padding="p-5">
            <span className="text-xs font-medium text-slate-500">Active Opportunities</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {activeCount}
            </div>
            <span className="text-[11px] text-emerald-600/80 block mt-1">Currently open for applications</span>
          </Card>

          <Card padding="p-5">
            <span className="text-xs font-medium text-slate-500">Applications Received</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {applications.length}
            </div>
            <span className="text-[11px] text-indigo-600/80 block mt-1">Student submissions</span>
          </Card>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="p-5" className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Manage Opportunities
            </h4>
            <p className="text-xs text-slate-500">View and toggle published openings</p>
          </div>
          <Link to="/provider/opportunities">
            <Button variant="outline" size="sm">
              View Openings
            </Button>
          </Link>
        </Card>

        <Card padding="p-5" className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Applications
            </h4>
            <p className="text-xs text-slate-500">Review candidates and update status</p>
          </div>
          <Link to="/provider/applications">
            <Button variant="outline" size="sm">
              Review Candidates
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
