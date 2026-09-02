import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Building2, Briefcase, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  getProviders,
  getAllOpportunities,
  getAllApplications,
  approveProviderAccount,
  rejectProviderAccount,
} from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function AdminDashboardPage() {
  const { demoMode } = useAuth();
  const { providers: demoProviders, opportunities: demoOpportunities, applications: demoApplications } = useData();
  const { addToast } = useToast();

  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    if (demoMode) {
      setPendingProviders(demoProviders.filter((p) => p.status === 'pending'));
      setApprovedProviders(demoProviders.filter((p) => p.status === 'approved'));
      setOpportunities(demoOpportunities);
      setApplications(demoApplications);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [allProv, opps, apps] = await Promise.all([
        getProviders('all'),
        getAllOpportunities(),
        getAllApplications(),
      ]);
      setPendingProviders(allProv.filter((p) => p.status === 'pending'));
      setApprovedProviders(allProv.filter((p) => p.status === 'approved'));
      setOpportunities(opps);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load admin metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [demoMode, demoProviders, demoOpportunities, demoApplications]);

  const handleApprove = async (providerId) => {
    try {
      await approveProviderAccount(providerId);
      addToast({
        title: 'Provider Approved',
        message: 'Organization status updated to approved in Firestore.',
        type: 'success',
      });
      loadAdminData();
    } catch (error) {
      console.error('Failed to approve provider:', error);
      addToast({
        title: 'Action Failed',
        message: 'Unable to approve provider.',
        type: 'danger',
      });
    }
  };

  const handleReject = async (providerId) => {
    try {
      await rejectProviderAccount(providerId, 'Audit criteria not fulfilled.');
      addToast({
        title: 'Provider Rejected',
        message: 'Organization status marked as rejected.',
        type: 'warning',
      });
      loadAdminData();
    } catch (error) {
      console.error('Failed to reject provider:', error);
      addToast({
        title: 'Action Failed',
        message: 'Unable to reject provider.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Oversight console for provider approvals and platform activity
        </p>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingState message="Connecting to Firestore Admin database..." />
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card padding="p-5" className="border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
              <div className="flex justify-between items-center text-xs font-semibold text-amber-900 dark:text-amber-300">
                <span>Pending Requests</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {pendingProviders.length}
              </div>
              <Link to="/admin/provider-requests" className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold hover:underline block mt-1">
                Review Queue →
              </Link>
            </Card>

            <Card padding="p-5">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                <span>Approved Providers</span>
                <Building2 className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {approvedProviders.length}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Industry & Academia</span>
            </Card>

            <Card padding="p-5">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                <span>Active Opportunities</span>
                <Briefcase className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {opportunities.length}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Posted in Firestore</span>
            </Card>

            <Card padding="p-5">
              <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                <span>Total Applications</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {applications.length}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Student submissions</span>
            </Card>
          </div>

          {/* Pending Provider Requests Section */}
          <Card padding="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Pending Provider Requests
                </h2>
                <p className="text-xs text-slate-500">
                  Review and approve organization registrations
                </p>
              </div>

              <Link
                to="/admin/provider-requests"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({pendingProviders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingProviders.length > 0 ? (
              <Table headers={['Organization', 'Type', 'Contact Person', 'Submission Date', 'Actions']}>
                {pendingProviders.slice(0, 4).map((prov) => (
                  <TableRow key={prov.id}>
                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {prov.organizationName}
                      </span>
                      <span className="text-xs text-slate-400">{prov.website || 'No website'}</span>
                    </TableCell>

                    <TableCell>
                      <Badge variant="primary" size="sm">{prov.organizationType}</Badge>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                        {prov.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{prov.email || prov.officialEmail}</span>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      {formatDate(prov.joinedDate || prov.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="success"
                          size="xs"
                          onClick={() => handleApprove(prov.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleReject(prov.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            ) : (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  No Pending Requests
                </h4>
                <p className="text-[11px] text-slate-400">
                  All organization registrations have been audited.
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
