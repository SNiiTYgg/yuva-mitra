import React from 'react';
import { FolderGit2, Building2, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { formatDate } from '../../utils/formatters';

export function AdminCollaborationsPage() {
  const { collaborations } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Live Collaborations & Placement Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active industry projects, student fellows, and milestone execution rates
          </p>
        </div>
      </div>

      {/* Table */}
      <Card padding="p-0" className="overflow-hidden shadow-md">
        <Table headers={['Project & Student Fellow', 'Industry / Academia Partner', 'Designated Mentor', 'Milestone Progress', 'Duration', 'Status']}>
          {collaborations.map((collab) => (
            <TableRow key={collab.id}>
              <TableCell>
                <span className="font-bold text-slate-900 dark:text-white block max-w-[220px] truncate">
                  {collab.projectTitle}
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium block">
                  Fellow: {collab.studentName} ({collab.studentCollege})
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {collab.providerName}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                {collab.mentor}
              </TableCell>

              <TableCell className="w-48">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{collab.progressPercentage}%</span>
                    <span className="text-slate-400">
                      {collab.milestones.filter((m) => m.completed).length}/{collab.milestones.length}
                    </span>
                  </div>
                  <ProgressBar value={collab.progressPercentage} size="sm" color="indigo" />
                </div>
              </TableCell>

              <TableCell className="text-xs text-slate-500">
                {formatDate(collab.startDate)} – {formatDate(collab.expectedCompletion)}
              </TableCell>

              <TableCell>
                <Badge variant={collab.progressPercentage === 100 ? 'success' : 'warning'} size="sm">
                  {collab.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
