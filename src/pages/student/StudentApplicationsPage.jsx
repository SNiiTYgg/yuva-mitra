import React, { useState, useEffect } from 'react';
import { Building2, Calendar, FileText } from 'lucide-react';
import { getStudentApplications } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function StudentApplicationsPage() {
  const { currentUser, demoMode } = useAuth();
  const { applications: demoApplications } = useData();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (demoMode) {
      setApplications(demoApplications);
      setLoading(false);
      return;
    }

    async function loadApplications() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const data = await getStudentApplications(currentUser.uid);
        setApplications(data);
      } catch (error) {
        console.error('Failed to load student applications:', error);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, [currentUser?.uid, demoMode, demoApplications]);

  const filtered = filter === 'All'
    ? applications
    : applications.filter((a) => a.status?.toLowerCase() === filter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <Badge variant="success" size="sm">Accepted</Badge>;
      case 'shortlisted':
        return <Badge variant="primary" size="sm">Shortlisted</Badge>;
      case 'under review':
      case 'under_review':
        return <Badge variant="warning" size="sm">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      case 'applied':
      default:
        return <Badge variant="default" size="sm">Applied</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your applied opportunities and provider review status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['All', 'Applied', 'Under Review', 'Shortlisted', 'Accepted'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === st
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading your applications..." />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} padding="p-5" className="shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.opportunityTitle}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.organization}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied on {formatDate(app.appliedDate || app.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No applications found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Browse opportunities in the Explore tab to submit your first application.
          </p>
        </div>
      )}
    </div>
  );
}
