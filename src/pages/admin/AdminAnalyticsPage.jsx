import React from 'react';
import { BarChart3, TrendingUp, Users, Building2, MapPin, Sparkles, Award } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          National Platform Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Macro metrics on talent mobility, industry engagement, and NEP alignment
        </p>
      </div>

      {/* Analytics Visual Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="p-6">
          <CardHeader title="Regional Placement Hubs" subtitle="Top engagement zones" className="pb-3 mb-3" />
          <div className="space-y-3">
            {[
              { region: 'Bengaluru / Karnataka Hub', share: '32%', count: '4,740 Internships' },
              { region: 'Delhi NCR / Northern Zone', share: '28%', count: '4,150 Internships' },
              { region: 'Hyderabad / Telangana Hub', share: '22%', count: '3,260 Internships' },
              { region: 'Pune / Maharashtra Zone', share: '18%', count: '2,670 Internships' },
            ].map((reg, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{reg.region}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{reg.share}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="p-6">
          <CardHeader title="Skill Mapping Efficiency" subtitle="Candidate matching performance" className="pb-3 mb-3" />
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">89.4%</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">
                Average Match Accuracy
              </span>
              <span className="text-[11px] text-slate-500">Based on verified code assessments</span>
            </div>

            <div className="flex justify-around text-xs text-slate-500">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">4.8 Days</span>
                <span>Avg Selection Speed</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">96.2%</span>
                <span>Completion Rate</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="p-6">
          <CardHeader title="Institutional Adoption" subtitle="Participating academies" className="pb-3 mb-3" />
          <div className="space-y-3">
            {[
              { tier: 'Institutes of National Importance (IITs/NITs)', count: '54 Campuses' },
              { tier: 'State Technical Universities', count: '142 Campuses' },
              { tier: 'Autonomous Engineering Colleges', count: '320 Campuses' },
              { tier: 'Enterprise Corporate Partners', count: '210 Organizations' },
            ].map((t, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t.tier}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
