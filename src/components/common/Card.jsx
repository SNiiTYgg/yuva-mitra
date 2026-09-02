import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  padding = 'p-5 sm:p-6',
  ...props
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel border-white/40 dark:border-slate-800/80 shadow-lg'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-sm'
      } ${
        hoverEffect
          ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
          : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      <div>
        {title && <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
