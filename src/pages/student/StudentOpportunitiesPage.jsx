import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { OpportunityCard } from '../../components/opportunity/OpportunityCard';
import { OpportunityFilter } from '../../components/opportunity/OpportunityFilter';
import { EmptyState } from '../../components/common/EmptyState';
import { Compass, Sparkles } from 'lucide-react';

export function StudentOpportunitiesPage() {
  const { opportunities, skillsDatabase } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All Modes');
  const [selectedSkill, setSelectedSkill] = useState('');

  const availableSkillNames = useMemo(
    () => skillsDatabase.map((s) => s.name),
    [skillsDatabase]
  );

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title?.toLowerCase().includes(q);
        const matchesOrg = opp.organization?.toLowerCase().includes(q);
        const matchesDesc = opp.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc) return false;
      }

      // Type filter
      if (selectedType !== 'All Types') {
        if (opp.type?.toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // Work Mode filter
      if (selectedWorkMode !== 'All Modes') {
        if (opp.workMode?.toLowerCase() !== selectedWorkMode.toLowerCase()) return false;
      }

      // Skill filter
      if (selectedSkill) {
        if (!opp.requiredSkills?.includes(selectedSkill)) return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedType, selectedWorkMode, selectedSkill]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedWorkMode('All Modes');
    setSelectedSkill('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Powered Opportunity Mapping</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Internships, Research Grants, Live Industry Projects, and Faculty Fellowships
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <OpportunityFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedWorkMode={selectedWorkMode}
        setSelectedWorkMode={setSelectedWorkMode}
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        availableSkills={availableSkillNames}
        onClear={handleClearFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong>{filteredOpportunities.length}</strong> opportunities
        </span>
        <span>Sorted by Match Score</span>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} userRole="student" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No matching opportunities found"
          description="Try broadening your filters or clearing search keywords to view all active openings."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
}
