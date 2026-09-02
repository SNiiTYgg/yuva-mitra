import React, { useState } from 'react';
import { Settings, Shield, Sliders, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export function AdminSettingsPage() {
  const { resetToDefaults } = useData();
  const { addToast } = useToast();

  const [autoApproveStudents, setAutoApproveStudents] = useState(true);
  const [requireCINVerification, setRequireCINVerification] = useState(true);
  const [enableSkillAssessments, setEnableSkillAssessments] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Settings Saved',
      message: 'Platform governance configurations updated.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          System Governance Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure institutional compliance criteria and automated verification rules
        </p>
      </div>

      <Card padding="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registration Policies
            </h3>

            {/* Rule 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Immediate Student Activation
                </h4>
                <p className="text-xs text-slate-500">
                  Allow students to immediately take assessments and apply without manual admin gatekeeping
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveStudents}
                onChange={(e) => setAutoApproveStudents(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            {/* Rule 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Mandatory Provider Audit Queue
                </h4>
                <p className="text-xs text-slate-500">
                  Require all Industry & Academia providers to receive admin sign-off before publishing
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireCINVerification}
                onChange={(e) => setRequireCINVerification(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            {/* Rule 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Skill Benchmarking Engine
                </h4>
                <p className="text-xs text-slate-500">
                  Enable dynamic skill gap detection and match percentile ranking
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableSkillAssessments}
                onChange={(e) => setEnableSkillAssessments(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Reset Demo Data Sandbox */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Simulation Sandbox Controls
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Reset Mock Platform Database
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Restore all initial student, provider, opportunity, and collaboration records.
                </p>
              </div>
              <Button variant="secondary" size="xs" onClick={resetToDefaults} icon={RotateCcw}>
                Reset Data
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button type="submit" variant="primary" size="md" icon={Save}>
              Save Governance Configuration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
