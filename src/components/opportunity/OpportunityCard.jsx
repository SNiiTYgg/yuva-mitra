import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Clock, Calendar, IndianRupee, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export function OpportunityCard({ opportunity, userRole = 'student' }) {
  const {
    id,
    title,
    role,
    organization,
    workMode,
    location,
    duration,
    stipend,
    deadline,
    requiredSkills = [],
  } = opportunity;

  const linkTarget = userRole === 'provider'
    ? `/provider/opportunities`
    : `/student/opportunities/${id}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between">
      <div>
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="primary" size="sm">
            {workMode}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location.split(',')[0]}
          </span>
        </div>

        {/* Title & Organization */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          {title}
        </h3>
        {role && (
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
            {role}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-1.5 mb-3 text-xs text-slate-600 dark:text-slate-400">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{organization}</span>
        </div>

        {/* Quick details */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-slate-400 block text-[11px]">Stipend</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{stipend}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Duration</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{duration}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 block mb-1 font-medium">Skills</span>
          <div className="flex flex-wrap gap-1">
            {requiredSkills.map((s, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Deadline: {formatDate(deadline)}
        </span>

        <Link
          to={linkTarget}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
