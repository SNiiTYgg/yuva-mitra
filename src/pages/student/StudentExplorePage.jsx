import React, { useState, useEffect } from 'react';
import { getActiveOpportunities } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OpportunityCard } from '../../components/opportunity/OpportunityCard';
import { LoadingState } from '../../components/common/LoadingState';
import { Search, Compass } from 'lucide-react';

export function StudentExplorePage() {
  const { demoMode } = useAuth();
  const { opportunities: demoOpportunities } = useData();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');

  useEffect(() => {
    if (demoMode) {
      setOpportunities(demoOpportunities);
      setLoading(false);
      return;
    }

    async function loadOpportunities() {
      setLoading(true);
      try {
        const data = await getActiveOpportunities();
        setOpportunities(data);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, [demoMode, demoOpportunities]);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (modeFilter !== 'All' && opp.workMode?.toLowerCase() !== modeFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = opp.title?.toLowerCase().includes(q);
      const matchOrg = opp.organization?.toLowerCase().includes(q);
      const matchSkills = opp.requiredSkills?.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Explore Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Browse internships, capstone projects, and research opportunities posted by verified providers.
        </p>
      </div>

      {/* Search & Simple Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, organization, or skill..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                modeFilter === mode
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="py-12">
          <LoadingState message="Loading opportunities..." />
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} userRole="student" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No opportunities available right now
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Check back soon as approved providers publish new openings.
          </p>
        </div>
      )}
    </div>
  );
}
