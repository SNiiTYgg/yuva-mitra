import React, { useState } from 'react';
import { Users, FileCheck, Building2, Sparkles, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';

export function AdminApplicationsPage() {
  const { applications } = useData();
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All'
    ? applications
    : applications.filter((a) => a.status?.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            National Applications Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit candidate applications, screening turnaround times, and selection yields
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['All', 'Applied', 'Under Review', 'Shortlisted', 'Accepted'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="p-0" className="overflow-hidden shadow-md">
        <Table headers={['Applicant Student', 'Target Opportunity & Provider', 'Skill Match', 'Status', 'Submission Date']}>
          {filtered.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                <span className="font-bold text-slate-900 dark:text-white block">{app.studentName}</span>
                <span className="text-xs text-slate-500">{app.studentCollege}</span>
              </TableCell>

              <TableCell>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block max-w-[220px] truncate">
                  {app.opportunityTitle}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {app.organization}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs w-fit">
                  <Sparkles className="w-3 h-3" /> {app.matchScore}%
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    app.status === 'Accepted'
                      ? 'success'
                      : app.status === 'Shortlisted'
                      ? 'primary'
                      : 'warning'
                  }
                  size="sm"
                >
                  {app.status}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-slate-500">
                {formatDate(app.appliedDate)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
