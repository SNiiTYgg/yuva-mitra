import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  getProviderApplications,
  updateApplicationStatusInFirestore,
} from '../../firebase/firestore';
import { Card } from '../../components/common/Card';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function ProviderApplicationsPage() {
  const { currentUser, demoMode } = useAuth();
  const { applications: demoApplications } = useData();
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    if (demoMode) {
      const pid = currentUser?.uid || currentUser?.id;
      setApplications(demoApplications.filter((a) => a.providerId === pid));
      setLoading(false);
      return;
    }
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const data = await getProviderApplications(currentUser.uid);
      setApplications(data);
    } catch (error) {
      console.error('Failed to load candidate applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentUser?.uid, demoMode, demoApplications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatusInFirestore(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      addToast({
        title: 'Status Updated',
        message: `Candidate status changed to "${newStatus}".`,
        type: 'info',
      });
    } catch (error) {
      console.error('Failed to update application status:', error);
      addToast({
        title: 'Update Failed',
        message: 'Unable to update candidate status. Please try again.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Candidate Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review student applications and update selection status in Firestore
        </p>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading candidate applications from Firestore..." />
        </div>
      ) : applications.length > 0 ? (
        <Card padding="p-0" className="overflow-hidden shadow-xs">
          <Table headers={['Student Name', 'Education', 'Skills', 'Target Opportunity', 'Applied Date', 'Status Action']}>
            {applications.map((app) => (
              <TableRow key={app.id}>
                {/* Student Name */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {app.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400">{app.studentEmail}</span>
                  </div>
                </TableCell>

                {/* Education */}
                <TableCell>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                    {app.studentCollege || 'Institution'}
                  </span>
                  <span className="text-[11px] text-slate-400">{app.studentCourse}</span>
                </TableCell>

                {/* Skills */}
                <TableCell>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {app.studentSkills || 'Not specified'}
                  </span>
                </TableCell>

                {/* Opportunity */}
                <TableCell>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block max-w-[200px] truncate">
                    {app.opportunityTitle}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-xs text-slate-500">
                  {formatDate(app.appliedDate || app.createdAt)}
                </TableCell>

                {/* Status Dropdown */}
                <TableCell>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      ) : (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No candidate applications yet
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Applications submitted by students for your opportunities will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
