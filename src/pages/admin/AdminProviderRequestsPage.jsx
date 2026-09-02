import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import {
  getProviders,
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
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function AdminProviderRequestsPage() {
  const { demoMode } = useAuth();
  const { providers: demoProviders } = useData();
  const { addToast } = useToast();

  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [rejectModalProvider, setRejectModalProvider] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadRequests = async () => {
    if (demoMode) {
      setPendingProviders(demoProviders.filter((p) => p.status === 'pending'));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getProviders('pending');
      setPendingProviders(data);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [demoMode, demoProviders]);

  const handleApprove = async (providerId) => {
    setProcessing(true);
    try {
      await approveProviderAccount(providerId);
      addToast({
        title: 'Provider Approved',
        message: 'Organization status updated to approved in Firestore.',
        type: 'success',
      });
      setSelectedProvider(null);
      loadRequests();
    } catch (error) {
      console.error('Failed to approve provider:', error);
      addToast({
        title: 'Approval Failed',
        message: 'Unable to approve provider in Firestore.',
        type: 'danger',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalProvider || !rejectionReason.trim()) return;

    setProcessing(true);
    try {
      await rejectProviderAccount(rejectModalProvider.id, rejectionReason.trim());
      addToast({
        title: 'Provider Rejected',
        message: 'Organization status updated to rejected in Firestore.',
        type: 'warning',
      });
      setRejectModalProvider(null);
      loadRequests();
    } catch (error) {
      console.error('Failed to reject provider:', error);
      addToast({
        title: 'Rejection Failed',
        message: 'Unable to update status.',
        type: 'danger',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Provider Registration Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review pending industry and academia organization applications in Firestore
        </p>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading pending provider requests from Firestore..." />
        </div>
      ) : (
        <Card padding="p-0" className="overflow-hidden shadow-xs">
          {pendingProviders.length > 0 ? (
            <Table headers={['Organization Name', 'Type', 'Nodal Contact', 'Submission Date', 'Actions']}>
              {pendingProviders.map((prov) => (
                <TableRow key={prov.id}>
                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {prov.organizationName}
                    </span>
                    <span className="text-xs text-slate-400">{prov.website || 'No website'}</span>
                  </TableCell>

                  <TableCell>
                    <Badge variant="primary" size="sm">
                      {prov.organizationType}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                      {prov.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{prov.email || prov.officialEmail}</span>
                    <span className="text-[11px] text-slate-400 block">{prov.phone}</span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {formatDate(prov.joinedDate || prov.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedProvider(prov)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="success"
                        size="xs"
                        disabled={processing}
                        onClick={() => handleApprove(prov.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="xs"
                        disabled={processing}
                        onClick={() => {
                          setRejectModalProvider(prov);
                          setRejectionReason('');
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Pending Provider Requests
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                All submitted registrations have been approved or rejected.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* View Provider Details Modal */}
      {selectedProvider && (
        <Modal
          isOpen={!!selectedProvider}
          onClose={() => setSelectedProvider(null)}
          title="Organization Details"
          subtitle={selectedProvider.organizationName}
        >
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block">Organization Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedProvider.organizationType}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Official Website:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedProvider.website || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Person:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedProvider.name} ({selectedProvider.email || selectedProvider.officialEmail}, {selectedProvider.phone})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Description:</span>
              <p className="p-2.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-1">
                {selectedProvider.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="success"
                size="sm"
                disabled={processing}
                onClick={() => handleApprove(selectedProvider.id)}
              >
                Approve Provider
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={processing}
                onClick={() => {
                  const prov = selectedProvider;
                  setSelectedProvider(null);
                  setRejectModalProvider(prov);
                  setRejectionReason('');
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectModalProvider && (
        <Modal
          isOpen={!!rejectModalProvider}
          onClose={() => setRejectModalProvider(null)}
          title="Reject Provider Request"
          subtitle={`Organization: ${rejectModalProvider.organizationName}`}
        >
          <form onSubmit={handleConfirmReject} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Rejection *
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete organization profile, unable to verify domain credentials..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRejectModalProvider(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                loading={processing}
              >
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
