import React from 'react';
import {
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Award,
  BookOpen,
  FolderGit2,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SkillBadge } from '../../components/common/SkillBadge';

export function DigitalPortfolioPage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const handleDownload = () => {
    addToast({
      title: 'Digital Portfolio Exported',
      message: 'Generating verified NEP-compliant PDF resume bundle...',
      type: 'success',
    });
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: 'Public Link Copied',
      message: 'Verified digital portfolio URL copied to clipboard.',
      type: 'info',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Digital Skill Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Verified academic accomplishments, industrial projects, and skill credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleShare} icon={Share2}>
            Share Profile
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload} icon={Download}>
            Download Portfolio
          </Button>
        </div>
      </div>

      {/* Portfolio Printable Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.name || 'Aarav Sharma'}
                </h2>
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3" /> Verified Student
                </Badge>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {currentUser?.course || 'B.Tech in Computer Science & Engineering'}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser?.college || 'Indian Institute of Technology, Delhi'} • Class of {currentUser?.graduationYear || '2027'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser?.email || 'aarav.sharma@iitd.ac.in'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser?.location || 'New Delhi, India'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center shrink-0">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block uppercase tracking-wider">
              Skill Score
            </span>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {currentUser?.overallSkillMatchScore || 86}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
              Top 5% Cohort
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Professional Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentUser?.bio ||
              'Passionate computer science undergraduate focusing on full-stack web architectures, distributed systems, and applied machine learning with proven competitive hackathon leadership.'}
          </p>
        </div>

        {/* Verified Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Skill Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {(currentUser?.strongSkills || [
              { name: 'Python', level: 'Expert', verified: true },
              { name: 'React.js', level: 'Advanced', verified: true },
              { name: 'Data Structures & Algorithms', level: 'Advanced', verified: true },
              { name: 'SQL & Database Design', level: 'Intermediate', verified: true },
              { name: 'Git & GitHub', level: 'Advanced', verified: true },
            ]).map((skill, idx) => (
              <SkillBadge
                key={idx}
                name={typeof skill === 'string' ? skill : skill.name}
                level={typeof skill === 'object' ? skill.level : undefined}
                verified={true}
                size="md"
              />
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Education
          </h3>
          <div className="space-y-3">
            {(currentUser?.education || [
              {
                degree: 'B.Tech in Computer Science & Engineering',
                institution: 'Indian Institute of Technology Delhi',
                period: '2023 - Present (Expected 2027)',
                score: 'CGPA: 8.85 / 10.0',
              },
              {
                degree: 'Senior Secondary (Class XII) - CBSE',
                institution: 'Delhi Public School, R.K. Puram',
                period: '2021 - 2023',
                score: '96.4%',
              },
            ]).map((edu, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{edu.institution}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                    {edu.score}
                  </span>
                  <span className="text-[11px] text-slate-400">{edu.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Featured Capstone Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentUser?.projects || [
              {
                id: 'p-1',
                title: 'KisanSetu - Smart Agri Intelligence',
                description: 'End-to-end portal helping smallholder farmers identify mandi price forecasts using regression models and bilingual SMS triggers.',
                technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
              },
              {
                id: 'p-2',
                title: 'IndiCode Collaborative Code Sandbox',
                description: 'Real-time collaborative code editor with WebSockets, sandbox docker execution, and integrated AST syntax parser.',
                technologies: ['React.js', 'Node.js', 'Socket.io', 'Tailwind CSS'],
              },
            ]).map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {proj.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.map((t, i) => (
                    <Badge key={i} variant="default" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Credentials */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Certifications & Accreditations
          </h3>
          <div className="space-y-3">
            {(currentUser?.certifications || [
              {
                title: 'Full Stack Web Architecture Specialist',
                issuer: 'NPTEL / IIT Madras',
                date: 'May 2025',
                credentialId: 'NPTEL25CS88912',
              },
              {
                title: 'Python for Data Science & ML Bootcamp',
                issuer: 'Coursera & IIT Roorkee',
                date: 'Jan 2025',
                credentialId: 'COURSERA-IITR-9923',
              },
            ]).map((cert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {cert.issuer} • ID: {cert.credentialId}
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Verified</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key Achievements & Recognitions
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {(currentUser?.achievements || [
              'Smart India Hackathon (SIH) 2025 - Grand Finalist (Top 5 National)',
              'Dean’s Academic Excellence Award 2024-2025 (IIT Delhi)',
              'Winner, Inter-College Tech Symposium Hackathon (IIIT Delhi)',
            ]).map((ach, i) => (
              <li key={i} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
