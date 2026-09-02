import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { getProviders } from '../../firebase/firestore';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadProviders = async (status) => {
    setLoading(true);
    try {
      const data = await getProviders(status);
      setProviders(data);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders(filter);
  }, [filter]);

  const filtered = providers.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchOrg = p.organizationName?.toLowerCase().includes(q);
    const matchName = p.name?.toLowerCase().includes(q);
    return matchOrg || matchName;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Providers Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor registered industry partners and academic institutions in Firestore
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
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

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by organization name or contact person..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading providers from Firestore..." />
        </div>
      ) : (
        <Card padding="p-0" className="overflow-hidden shadow-xs">
          {filtered.length > 0 ? (
            <Table headers={['Organization', 'Type', 'Contact Person', 'Registered Date', 'Status']}>
              {filtered.map((prov) => (
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
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {formatDate(prov.joinedDate || prov.createdAt)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        prov.status === 'approved'
                          ? 'success'
                          : prov.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {prov.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {prov.status === 'pending' && <Clock className="w-3 h-3" />}
                      {prov.status === 'rejected' && <AlertTriangle className="w-3 h-3" />}
                      <span className="capitalize">{prov.status}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No providers match your search
              </h4>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
