import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const APPLICATION_STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Accepted', 'In Progress', 'Completed'];

export function StatusTimeline({ currentStatus = 'Applied', timeline = [], className = '' }) {
  const isRejected = currentStatus.toLowerCase() === 'rejected';

  const getCurrentIndex = () => {
    if (isRejected) return 1;
    const idx = APPLICATION_STAGES.findIndex(
      (s) => s.toLowerCase() === currentStatus.toLowerCase()
    );
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className={`w-full py-4 ${className}`}>
      {/* Desktop / Tablet Horizontal Pipeline */}
      <div className="hidden sm:grid grid-cols-6 gap-2 relative">
        {APPLICATION_STAGES.map((stage, idx) => {
          const isPassed = !isRejected && idx < currentIndex;
          const isCurrent = !isRejected && idx === currentIndex;
          const isPending = !isRejected && idx > currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center relative group">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-1 -z-0 transition-colors ${
                    isPassed || isCurrent
                      ? 'bg-indigo-600 dark:bg-indigo-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 ${
                  isPassed
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/80 shadow-md scale-110'
                    : isRejected && idx === 1
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100 dark:ring-rose-950/80'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isPassed ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-spin-slow" />
                ) : isRejected && idx === 1 ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>

              {/* Stage label */}
              <span
                className={`text-xs text-center mt-2 font-medium leading-tight ${
                  isCurrent
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : isPassed
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden flex flex-col space-y-3">
        {APPLICATION_STAGES.map((stage, idx) => {
          const isPassed = !isRejected && idx < currentIndex;
          const isCurrent = !isRejected && idx === currentIndex;

          return (
            <div key={stage} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isPassed
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 dark:ring-indigo-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : isPassed
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
              {isCurrent && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                  Current Status
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline Event Log if available */}
      {timeline && timeline.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Activity Log
          </h5>
          <div className="space-y-2">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.status}</span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  {item.note && <p className="mt-0.5 text-slate-500 dark:text-slate-400">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
