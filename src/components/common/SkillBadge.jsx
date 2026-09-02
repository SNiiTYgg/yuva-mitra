import React from 'react';
import { CheckCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

export function SkillBadge({
  name,
  level,
  verified = false,
  matched = null, // true | false | null
  onRemove,
  size = 'md',
  className = '',
}) {
  const isMatch = matched === true;
  const isGap = matched === false;

  let colorStyle =
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

  if (isMatch) {
    colorStyle =
      'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (isGap) {
    colorStyle =
      'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (verified) {
    colorStyle =
      'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
  }

  const sizeStyle = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-xs sm:text-sm px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-all ${colorStyle} ${sizeStyle} ${className}`}
    >
      {isMatch && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
      {isGap && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
      {!isMatch && !isGap && verified && (
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
      )}

      <span>{name}</span>

      {level && (
        <span className="text-[10px] font-semibold opacity-75 uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
          {level}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
}
