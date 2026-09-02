import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  IndianRupee,
  ArrowLeft,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  getOpportunityById,
  checkHasStudentApplied,
  applyToOpportunityInFirestore,
} from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate } from '../../utils/formatters';

export function OpportunityDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [opportunity, setOpportunity] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        const oppData = await getOpportunityById(id);
        setOpportunity(oppData);

        if (currentUser?.uid && oppData) {
          const applied = await checkHasStudentApplied(id, currentUser.uid);
          setHasApplied(applied);
        }
      } catch (error) {
        console.error('Failed to load opportunity details:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id, currentUser?.uid]);

  const handleApply = async () => {
    if (!currentUser) {
      addToast({
        title: 'Authentication Required',
        message: 'Please sign in to apply.',
        type: 'warning',
      });
      return;
    }

    setApplying(true);
    try {
      await applyToOpportunityInFirestore(opportunity, currentUser);
      setHasApplied(true);
      addToast({
        title: 'Application Submitted',
        message: `Your application for "${opportunity.title}" was submitted successfully.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
      addToast({
        title: 'Application Failed',
        message: error.message || 'Unable to submit application. Please try again.',
        type: 'danger',
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState message="Loading opportunity details from Firestore..." />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 text-center py-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-slate-500">
          This opportunity may have been removed or closed by the provider.
        </p>
        <Link to="/student/explore">
          <Button variant="primary" size="sm">
            Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/student/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
      </div>

      {/* Main Opportunity Card */}
      <Card padding="p-6 sm:p-8" className="shadow-xs border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">{opportunity.workMode || 'Remote'}</Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {opportunity.location}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {opportunity.title}
            </h1>

            {opportunity.role && (
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Role: {opportunity.role}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{opportunity.organization || opportunity.organizationName}</span>
            </div>
          </div>

          <div className="shrink-0">
            {hasApplied ? (
              <Button variant="success" size="md" disabled icon={CheckCircle2}>
                Applied
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={applying}
                onClick={handleApply}
                icon={Send}
              >
                Apply
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Stipend</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {opportunity.stipend || 'Unpaid / Certificate'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Duration</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {opportunity.duration || 'Flexible'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Application Deadline</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {formatDate(opportunity.deadline || opportunity.applicationDeadline)}
            </span>
          </div>
        </div>

        {/* Full Details Content */}
        <div className="pt-6 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {/* Required Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Job Description
            </h3>
            <p className="leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Eligibility */}
          {opportunity.eligibility && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Eligibility
              </h3>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 leading-relaxed">
                {opportunity.eligibility}
              </p>
            </div>
          )}

          {/* Selection / Exam Criteria */}
          {opportunity.selectionCriteria && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Selection / Exam Criteria & Instructions
              </h3>
              <p className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-800 dark:text-slate-200 leading-relaxed">
                {opportunity.selectionCriteria}
              </p>
            </div>
          )}

          {/* Additional Instructions */}
          {opportunity.additionalInstructions && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Additional Instructions
              </h3>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                {opportunity.additionalInstructions}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
