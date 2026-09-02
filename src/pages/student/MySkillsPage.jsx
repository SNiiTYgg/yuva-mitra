import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle2, Sparkles, AlertTriangle, Trash2, Award, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function MySkillsPage() {
  const { currentUser, updateProfile } = useAuth();
  const { skillsDatabase } = useData();
  const { addToast } = useToast();

  const [skillsList, setSkillsList] = useState(
    currentUser?.strongSkills || [
      { name: 'Python', level: 'Expert', verified: true },
      { name: 'React.js', level: 'Advanced', verified: true },
      { name: 'Data Structures & Algorithms', level: 'Advanced', verified: true },
      { name: 'SQL & Database Design', level: 'Intermediate', verified: false },
      { name: 'Git & GitHub', level: 'Advanced', verified: true },
    ]
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      verified: false, // New self-added skills are unverified until assessment
    };

    const updated = [...skillsList, newSkill];
    setSkillsList(updated);
    updateProfile({ strongSkills: updated });

    addToast({
      title: 'Skill Added',
      message: `"${newSkill.name}" added to your profile as ${newSkill.level}.`,
      type: 'success',
    });

    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  const handleRemoveSkill = (skillName) => {
    const updated = skillsList.filter((s) => s.name !== skillName);
    setSkillsList(updated);
    updateProfile({ strongSkills: updated });
    addToast({
      title: 'Skill Removed',
      message: `"${skillName}" removed from your profile.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Skills & Competencies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage verified credentials, self-reported proficiencies, and targeted upskilling goals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/student/assessment">
            <Button variant="outline" size="sm" icon={Zap}>
              Verify via Assessment
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)} icon={Plus}>
            Add Skill
          </Button>
        </div>
      </div>

      {/* Grid of Verified Skills and Skill Gap Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Skills List */}
        <div className="lg:col-span-8 space-y-4">
          <Card padding="p-6">
            <CardHeader
              title={`Active Skills Inventory (${skillsList.length})`}
              subtitle="Skills indexed by our AI matching engine for internships and placements"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {skillsList.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {skill.name}
                      </span>
                      {skill.verified ? (
                        <span title="Verified by YuvaMitra Assessment" className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </span>
                      ) : (
                        <Badge variant="default" size="sm">Self-Reported</Badge>
                      )}
                    </div>
                    <Badge variant={skill.level === 'Expert' ? 'purple' : skill.level === 'Advanced' ? 'primary' : 'default'} size="sm">
                      {skill.level} Proficiency
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Gap Insights & Suggestions */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="p-5">
            <CardHeader
              title="Industry Demand Radar"
              subtitle="Highest required skills in current opportunities"
              className="pb-3 mb-3"
            />
            <div className="space-y-2.5">
              {skillsDatabase.slice(0, 5).map((sk) => (
                <div
                  key={sk.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{sk.name}</span>
                    <span className="text-[10px] text-slate-400 block">{sk.category}</span>
                  </div>
                  <Badge variant={sk.demand === 'Very High' ? 'danger' : 'warning'} size="sm">
                    {sk.demand} Demand
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="p-5" className="bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Skill Verification Tip</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Verified skills increase your opportunity match score by up to <strong>35%</strong> when viewed by top tier recruiters.
            </p>
            <Link to="/student/assessment">
              <Button variant="primary" size="sm" className="w-full" icon={Zap}>
                Start 10-Min Assessment
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Skill to Profile"
        subtitle="Specify your capability and proficiency level"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Next.js, PyTorch, Kubernetes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Proficiency Level
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Hands-on)</option>
              <option value="Advanced">Advanced (Production-ready)</option>
              <option value="Expert">Expert (Architecture & Leadership)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
