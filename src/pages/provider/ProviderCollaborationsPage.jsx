import React, { useState } from 'react';
import {
  FolderGit2,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  Star,
  Plus,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export function ProviderCollaborationsPage() {
  const { collaborations, toggleMilestone, addCollaborationFeedback } = useData();
  const { currentUser } = useAuth();

  const [selectedCollab, setSelectedCollab] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const myCollaborations = collaborations.filter(
    (c) =>
      c.providerId === currentUser?.id ||
      c.providerName?.toLowerCase().includes(currentUser?.organizationName?.toLowerCase() || '')
  );

  const activeCollab = selectedCollab || myCollaborations[0] || collaborations[0];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    addCollaborationFeedback(activeCollab.id, {
      from: `${currentUser?.name || 'Vikramaditya Sengupta'} (Industry Lead)`,
      rating: Number(rating),
      comment: feedbackText.trim(),
    });

    setFeedbackText('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Industry Collaboration Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor active student project milestones, deliverables, and review logs
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={MessageSquare}
        >
          Add Mentor Evaluation
        </Button>
      </div>

      {activeCollab && (
        <div className="space-y-6">
          {/* Main Card */}
          <Card padding="p-6 sm:p-8" className="shadow-lg border-indigo-100 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="md">
                    Live Industry Capstone
                  </Badge>
                  <Badge variant={activeCollab.progressPercentage === 100 ? 'success' : 'warning'} size="sm">
                    {activeCollab.status}
                  </Badge>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeCollab.projectTitle}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <strong>Fellow:</strong> {activeCollab.studentName} ({activeCollab.studentCollege})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <strong>Mentor:</strong> {activeCollab.mentor}
                  </span>
                </div>
              </div>

              {/* Progress Box */}
              <div className="flex flex-col items-center lg:items-end p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 shrink-0 w-full sm:w-64">
                <div className="w-full flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Completion Status</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-black">
                    {activeCollab.progressPercentage}%
                  </span>
                </div>
                <ProgressBar
                  value={activeCollab.progressPercentage}
                  size="md"
                  color="indigo"
                />
                <span className="text-[11px] text-slate-400 mt-2">
                  Sprint Duration: {formatDate(activeCollab.startDate)} to {formatDate(activeCollab.expectedCompletion)}
                </span>
              </div>
            </div>
          </Card>

          {/* 2-Column Grid: Milestones + Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Interactive Milestones */}
            <div className="lg:col-span-7 space-y-4">
              <Card padding="p-6">
                <CardHeader
                  title="Deliverables & Milestone Timeline"
                  subtitle="Validate deliverables and track completion status"
                  className="pb-3 mb-4"
                />

                <div className="space-y-3">
                  {activeCollab.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(activeCollab.id, m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                        m.completed
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80'
                          : m.current
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {m.completed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-indigo-500">
                            {m.current && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              m.completed
                                ? 'text-emerald-950 dark:text-emerald-100 line-through opacity-80'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {m.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 shrink-0">{m.date}</span>
                        </div>
                        {m.completed ? (
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            ✓ Verified by Mentor
                          </span>
                        ) : m.current ? (
                          <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
                            ● Active Review Sprint
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right 5 cols: Feedback Log & Deliverables */}
            <div className="lg:col-span-5 space-y-6">
              <Card padding="p-6">
                <CardHeader
                  title="Recorded Mentor Evaluations"
                  subtitle="Weekly supervisory notes"
                  className="pb-3 mb-4"
                />

                <div className="space-y-3">
                  {activeCollab.recentFeedback.map((fb, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs"
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-900 dark:text-white">{fb.from}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: fb.rating || 5 }).map((_, r) => (
                            <Star key={r} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                        "{fb.comment}"
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-1">{fb.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Mentor Performance Evaluation"
        subtitle="Record formal review feedback for student milestone progress"
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Performance Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="5">★★★★★ - Exceeds Expectations</option>
              <option value="4">★★★★☆ - Meets Sprints Goals</option>
              <option value="3">★★★☆☆ - Needs Architectural Guidance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback Comments & Instructions *
            </label>
            <textarea
              required
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Provide constructive review comments on code quality, testing rigor, and next sprint milestones..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Evaluation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
