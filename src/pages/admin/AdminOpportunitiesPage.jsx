import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllOpportunities, getAllApplications } from '../../firebase/firestore';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';

export function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [opps, apps] = await Promise.all([
          getAllOpportunities(),
          getAllApplications(),
        ]);
        setOpportunities(opps);
        setApplications(apps);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = opportunities.filter((opp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      opp.title?.toLowerCase().includes(q) ||
      opp.organization?.toLowerCase().includes(q) ||
      opp.organizationName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          All Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Platform-wide monitoring of published student openings in Firestore
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by opportunity title or organization..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading opportunities from Firestore..." />
        </div>
      ) : (
        <Card padding="p-0" className="overflow-hidden shadow-xs">
          {filtered.length > 0 ? (
            <Table headers={['Opportunity Title', 'Organization', 'Mode & Location', 'Stipend', 'Applicants', 'Status']}>
              {filtered.map((opp) => {
                const count = applications.filter((a) => a.opportunityId === opp.id).length;
                return (
                  <TableRow key={opp.id}>
                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-white block max-w-[220px] truncate">
                        {opp.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{opp.role}</span>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                        {opp.organization || opp.organizationName}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant="primary" size="sm">{opp.workMode || 'Remote'}</Badge>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{opp.location}</span>
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {opp.stipend || 'Unpaid / Flexible'}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {count} applied
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={opp.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {opp.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No opportunities found in Firestore
              </h4>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
