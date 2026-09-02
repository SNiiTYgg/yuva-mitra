import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const OPPORTUNITY_TYPES = [
  'All Types',
  'Internship',
  'Research Project',
  'Live Project',
  'Training',
  'Apprenticeship',
  'Workshop',
  'Mentorship',
];

export const WORK_MODES = ['All Modes', 'Remote', 'Hybrid', 'Onsite'];

export function OpportunityFilter({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedWorkMode,
  setSelectedWorkMode,
  selectedSkill,
  setSelectedSkill,
  availableSkills = [],
  onClear,
}) {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'All Types' ||
    selectedWorkMode !== 'All Modes' ||
    selectedSkill !== '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, organization, or domain..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selects & Pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Type Select */}
        <div className="shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs sm:text-sm font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {OPPORTUNITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode Select */}
        <div className="shrink-0">
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="text-xs sm:text-sm font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {WORK_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter Dropdown if available */}
        {availableSkills.length > 0 && (
          <div className="shrink-0">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="text-xs sm:text-sm font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Skills</option>
              {availableSkills.map((s) => (
                <option key={s} value={s}>
                  Skill: {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
          >
            <X className="w-3 h-3" /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
