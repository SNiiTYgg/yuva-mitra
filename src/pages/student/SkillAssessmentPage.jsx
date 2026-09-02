import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  Award,
  Layers,
} from 'lucide-react';
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CATEGORIES,
  calculateAssessmentResults,
} from '../../data/assessmentQuestions';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SkillBadge } from '../../components/common/SkillBadge';
import { Badge } from '../../components/common/Badge';

export function SkillAssessmentPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentIdx];
  const currentCategory = ASSESSMENT_CATEGORIES.find((c) => c.id === currentQuestion?.category);

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Complete Assessment
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const finishAssessment = () => {
    const computedResults = calculateAssessmentResults(answers);
    setResults(computedResults);
    setIsCompleted(true);

    // Update student's profile with verified assessment results
    updateProfile({
      overallSkillMatchScore: computedResults.score,
      strongSkills: computedResults.strongSkills,
      skillsToImprove: computedResults.skillsToImprove,
      interests: computedResults.careerInterests,
    });

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    addToast({
      title: 'Skill Assessment Complete!',
      message: `Skill match score updated to ${computedResults.score}%.`,
      type: 'success',
    });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Skill Benchmarking Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Comprehensive Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            5 Domains • Real-world Scenario Evaluation • Dynamic Gap Detection
          </p>
        </div>

        {isCompleted && (
          <Button variant="outline" size="sm" onClick={handleRetake} icon={RotateCcw}>
            Retake Assessment
          </Button>
        )}
      </div>

      {/* QUESTIONNAIRE IN PROGRESS VIEW */}
      {!isCompleted ? (
        <Card padding="p-6 sm:p-8" className="space-y-6 shadow-lg border-indigo-100 dark:border-indigo-950">
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <Badge variant="primary" size="sm">
                Category: {currentCategory?.name}
              </Badge>
            </div>
            <ProgressBar
              value={currentIdx + 1}
              max={totalQuestions}
              size="md"
              color="indigo"
            />
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select the option that best reflects your current practical experience.
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 group ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 dark:border-slate-600 text-slate-400 group-hover:border-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium leading-relaxed ${
                      isSelected
                        ? 'text-indigo-950 dark:text-indigo-100 font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              icon={ArrowLeft}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={answers[currentQuestion.id] === undefined}
              onClick={handleNext}
              icon={ArrowRight}
              iconPosition="right"
            >
              {currentIdx === totalQuestions - 1 ? 'Finish Assessment' : 'Next Question'}
            </Button>
          </div>
        </Card>
      ) : (
        /* RESULTS PROFILE VIEW */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Results Summary Hero */}
          <Card padding="p-6 sm:p-8" className="bg-gradient-to-tr from-indigo-50 via-white to-emerald-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/40 border-indigo-200 dark:border-indigo-900/60 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2">
                <Badge variant="success" size="lg">
                  Assessment Completed
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Your Verified Skill Profile Generated!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Based on your responses across Technical, Soft Skills, Problem Solving, and Domain questions, your profile has been calibrated against active industry benchmarks.
                </p>
              </div>

              {/* Match Score Display */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md shrink-0 w-44">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {results.score}%
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  Overall Match Score
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Industry Ready
                </span>
              </div>
            </div>
          </Card>

          {/* Detailed Skill Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Skills */}
            <Card padding="p-6">
              <CardHeader
                title="Strong Verified Skills"
                subtitle="High proficiency demonstrated"
                className="pb-3 mb-4"
              />
              <div className="space-y-2.5">
                {results.strongSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
                        {skill.name}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills to Improve */}
            <Card padding="p-6">
              <CardHeader
                title="Targeted Skill Gaps"
                subtitle="Recommended for top internship cohorts"
                className="pb-3 mb-4"
              />
              <div className="space-y-2.5">
                {results.skillsToImprove.map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100">
                        {gap.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 pl-6">
                      {gap.reason}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommended Career Domains & Next Steps */}
          <Card padding="p-6">
            <CardHeader
              title="Recommended Career Domains & Opportunities"
              subtitle="Where your skill profile shows the highest percentile alignment"
              className="pb-3 mb-4"
            />
            <div className="flex flex-wrap gap-2 mb-6">
              {results.careerInterests.map((interest, i) => (
                <Badge key={i} variant="primary" size="md">
                  <Compass className="w-3.5 h-3.5" /> {interest}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                onClick={() => navigate('/student/opportunities')}
                icon={Compass}
              >
                Browse Matched Opportunities
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/student/portfolio')}
                icon={Award}
              >
                View Digital Portfolio
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
