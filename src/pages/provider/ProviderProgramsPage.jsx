import React, { useState } from 'react';
import { GraduationCap, Users, Calendar, PlusCircle, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function ProviderProgramsPage() {
  const { currentUser, isPendingProvider } = useAuth();
  const { programs } = useData();
  const { addToast } = useToast();

  const [programsList, setProgramsList] = useState(programs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: '',
    type: 'Faculty Development Program (FDP)',
    duration: '4 Weeks',
    seats: 50,
    description: '',
  });

  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (!newProgram.title) return;

    const created = {
      id: `prog-${Date.now()}`,
      title: newProgram.title,
      providerName: currentUser?.organizationName || 'TCS Research',
      type: newProgram.type,
      duration: newProgram.duration,
      seats: Number(newProgram.seats),
      enrolledCount: 0,
      status: 'Active',
      description: newProgram.description || 'Intensive skill and research immersion program.',
    };

    setProgramsList((prev) => [created, ...prev]);
    addToast({
      title: 'Program Created',
      message: `"${created.title}" is now open for enrollments.`,
      type: 'success',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Programs & Incubation Cohorts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Faculty Development Programs (FDPs), industry bootcamps, and hackathons
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={isPendingProvider}
          onClick={() => setIsModalOpen(true)}
          icon={PlusCircle}
        >
          Create Program Cohort
        </Button>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programsList.map((prog) => (
          <Card key={prog.id} padding="p-6" className="flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">{prog.type}</Badge>
                <Badge variant="success" size="sm">{prog.status}</Badge>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {prog.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prog.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {prog.duration}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Users className="w-3.5 h-3.5 text-indigo-500" /> {prog.enrolledCount} / {prog.seats} enrolled
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="outline" size="xs">
                Manage Cohort
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Program Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Cohort Program"
        subtitle="Publish a guided workshop or faculty development immersion"
      >
        <form onSubmit={handleCreateProgram} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Program Title *
            </label>
            <input
              type="text"
              required
              value={newProgram.title}
              onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
              placeholder="e.g. Generative AI Pedagogical Workshop for Engineering Faculty"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Program Type
              </label>
              <select
                value={newProgram.type}
                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="Faculty Development Program (FDP)">Faculty FDP</option>
                <option value="Student Bootcamp">Student Bootcamp</option>
                <option value="Incubation Cohort">Incubation Cohort</option>
                <option value="Research Fellowship">Research Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Seat Capacity
              </label>
              <input
                type="number"
                value={newProgram.seats}
                onChange={(e) => setNewProgram({ ...newProgram, seats: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Program Description
            </label>
            <textarea
              rows={3}
              value={newProgram.description}
              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              placeholder="Explain prerequisites, syllabus outline, and certification rewards..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Program
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
