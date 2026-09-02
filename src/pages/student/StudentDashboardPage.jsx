import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Compass,
  FolderGit2,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { OpportunityCard } from '../../components/opportunity/OpportunityCard';
import { SkillBadge } from '../../components/common/SkillBadge';

export function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const { opportunities, applications, collaborations } = useData();
  const navigate = useNavigate();

  // Metrics
  const matchScore = currentUser?.overallSkillMatchScore || 86;
  const profileCompletion = currentUser?.profileCompletion || 88;
  const myApplications = (applications || []).filter((a) => a.studentId === currentUser?.id || a.studentName === currentUser?.name);
  const myCollaborations = (collaborations || []).filter((c) => c.studentId === currentUser?.id || c.studentName === currentUser?.name);
  const recommendedOpps = opportunities.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hunar Ki Pehchaan • Ready for Industry Collabs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {currentUser?.name?.split(' ')[0] || 'Aarav'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Your skill profile is mapped with top enterprise research programs and live academic internships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/student/assessment')}
              className="bg-white text-indigo-950 hover:bg-slate-100 font-bold dark:bg-white dark:text-indigo-950 shadow-md"
              icon={Zap}
            >
              Take Skill Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/opportunities')}
              className="border-white/30 text-white hover:bg-white/10"
              icon={Compass}
            >
              Explore Matches
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Compact Key KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Skill Match Score */}
        <Card hoverEffect padding="p-5" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Skill Match Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{matchScore}%</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+4% this week</span>
            </div>
            <ProgressBar value={matchScore} size="sm" color="emerald" className="mt-2" />
          </div>
        </Card>

        {/* Metric 2: Profile Completion */}
        <Card hoverEffect padding="p-5" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile Strength</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{profileCompletion}%</span>
              <span className="text-xs text-slate-400">Verified</span>
            </div>
            <ProgressBar value={profileCompletion} size="sm" color="indigo" className="mt-2" />
          </div>
        </Card>

        {/* Metric 3: Applications */}
        <Card hoverEffect padding="p-5" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{myApplications.length}</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">1 Under Review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">1 Offer Accepted</p>
          </div>
        </Card>

        {/* Metric 4: Collaborations */}
        <Card hoverEffect padding="p-5" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Collabs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{myCollaborations.length}</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">75% Progress</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">TCS Research Microservices</p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recommended Opportunities & Skill Gaps Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Top Recommended Opportunities */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Top Opportunity Matches
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked by alignment with your verified skill profile
              </p>
            </div>
            <Link
              to="/student/opportunities"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({opportunities.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} userRole="student" />
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Skill Gaps & Learning Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skill Gaps Card */}
          <Card padding="p-5">
            <CardHeader
              title="Skill Gap Insights"
              subtitle="Skills to upskill for 95%+ match rates"
              className="pb-3 mb-3"
            />
            <div className="space-y-3">
              {(currentUser?.skillsToImprove || [
                { name: 'Machine Learning', reason: 'High demand in applied tracks' },
                { name: 'Cloud Computing (AWS/GCP)', reason: 'Needed for microservice roles' },
                { name: 'Docker & Kubernetes', reason: 'Recommended for backend roles' },
              ]).map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-amber-950 dark:text-amber-200">{gap.name}</h5>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-tight">
                      {gap.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/student/learning">
                <Button variant="outline" size="sm" className="w-full text-xs" icon={BookOpen}>
                  Browse Targeted Modules
                </Button>
              </Link>
            </div>
          </Card>

          {/* Strong Verified Skills Card */}
          <Card padding="p-5">
            <CardHeader
              title="Verified Strengths"
              subtitle="Endorsed via assessments & certifications"
              className="pb-3 mb-3"
            />
            <div className="flex flex-wrap gap-1.5">
              {(currentUser?.strongSkills || [
                { name: 'Python', level: 'Expert', verified: true },
                { name: 'React.js', level: 'Advanced', verified: true },
                { name: 'Data Structures', level: 'Advanced', verified: true },
                { name: 'SQL Design', level: 'Intermediate', verified: true },
              ]).map((s, i) => (
                <SkillBadge key={i} name={typeof s === 'string' ? s : s.name} verified={true} size="sm" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
