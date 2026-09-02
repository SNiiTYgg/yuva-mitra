import React, { useState } from 'react';
import { BookOpen, Award, Clock, Users, Play, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export function StudentLearningPage() {
  const { programs } = useData();
  const { addToast } = useToast();

  const [enrolledIds, setEnrolledIds] = useState(['prog-1']);

  const learningModules = [
    {
      id: 'mod-1',
      title: 'Cloud Native Microservices & Kubernetes on AWS',
      provider: 'Tata Consultancy Services',
      duration: '4 Weeks (Self-paced)',
      modulesCount: 12,
      progress: 60,
      enrolled: true,
      category: 'DevOps & Cloud',
      skillsCovered: ['Cloud Computing', 'Docker', 'Kubernetes', 'CI/CD'],
    },
    {
      id: 'mod-2',
      title: 'Deep Learning with PyTorch & HuggingFace Transformers',
      provider: 'IIT Madras AI Lab',
      duration: '6 Weeks',
      modulesCount: 18,
      progress: 0,
      enrolled: false,
      category: 'AI / Data Science',
      skillsCovered: ['Machine Learning', 'NLP & LLMs', 'PyTorch'],
    },
    {
      id: 'mod-3',
      title: 'Enterprise REST & GraphQL Security Standards (OWASP)',
      provider: 'C-DAC & YuvaMitra Academy',
      duration: '2 Weeks',
      modulesCount: 8,
      progress: 0,
      enrolled: false,
      category: 'Security',
      skillsCovered: ['Cybersecurity', 'API Security', 'OAuth2'],
    },
  ];

  const handleEnroll = (modTitle) => {
    addToast({
      title: 'Enrolled in Course',
      message: `You now have full access to "${modTitle}".`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Targeted Upskilling & Micro-Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Industry Learning & Training
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bridge your skill gaps with authorized corporate bootcamps and faculty masterclasses
          </p>
        </div>
      </div>

      {/* Grid of Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((item) => (
          <Card key={item.id} hoverEffect padding="p-6" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="primary" size="sm">{item.category}</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {item.duration}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                Offered by {item.provider}
              </p>

              {/* Skills Tags */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                  Skills Gained
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.skillsCovered.map((s, idx) => (
                    <Badge key={idx} variant="default" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>

              {item.enrolled && (
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">Course Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{item.progress}%</span>
                  </div>
                  <ProgressBar value={item.progress} size="sm" color="indigo" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {item.enrolled ? (
                <Button variant="primary" size="sm" className="w-full" icon={Play}>
                  Continue Learning
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEnroll(item.title)}
                  icon={BookOpen}
                >
                  Enroll for Free
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
