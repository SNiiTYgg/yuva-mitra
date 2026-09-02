import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  getProviderOpportunities,
  toggleOpportunityStatusInFirestore,
} from '../../firebase/firestore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function ProviderOpportunitiesPage() {
  const { currentUser, demoMode, isApprovedProvider } = useAuth();
  const { opportunities: demoOpportunities } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOpportunities = async () => {
    if (demoMode) {
      const pid = currentUser?.uid || currentUser?.id;
      setOpportunities(demoOpportunities.filter((o) => o.providerId === pid));
      setLoading(false);
      return;
    }
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const data = await getProviderOpportunities(currentUser.uid);
      setOpportunities(data);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [currentUser?.uid, demoMode, demoOpportunities]);

  const handleToggleStatus = async (oppId, currentStatus) => {
    try {
      const newStatus = await toggleOpportunityStatusInFirestore(oppId, currentStatus);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, status: newStatus } : o))
      );
      addToast({
        title: 'Status Updated',
        message: `Opportunity is now ${newStatus}.`,
        type: 'info',
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      addToast({
        title: 'Update Failed',
        message: 'Unable to update opportunity status.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            My Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your organization's published roles in Firestore
          </p>
        </div>

        {isApprovedProvider && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/provider/opportunities/create')}
            icon={PlusCircle}
          >
            Create Opportunity
          </Button>
        )}
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading your opportunities from Firestore..." />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <Card key={opp.id} padding="p-5" className="shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {opp.title}
                    </h3>
                    <Badge
                      variant={opp.status === 'active' ? 'success' : 'default'}
                      size="sm"
                    >
                      {opp.status === 'active' ? 'Active' : 'Closed'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{opp.workMode || 'Remote'} • {opp.location}</span>
                    <span>•</span>
                    <span>Stipend: {opp.stipend}</span>
                    <span>•</span>
                    <span>Deadline: {formatDate(opp.deadline || opp.applicationDeadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleToggleStatus(opp.id, opp.status)}
                  >
                    {opp.status === 'active' ? 'Close / Deactivate' : 'Reactivate'}
                  </Button>
                  <Link to="/provider/applications">
                    <Button variant="ghost" size="xs">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No opportunities created yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Create your first opening for student applications.
          </p>
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
      )}
    </div>
  );
}
