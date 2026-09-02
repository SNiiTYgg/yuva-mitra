import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  School,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export function AdminProviderDetailsPage() {
  const { id } = useParams();
  const { providers, approveProvider, rejectProvider } = useData();
  const navigate = useNavigate();

  const provider = providers.find((p) => p.id === id) || providers[0];

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    approveProvider(provider.id);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      rejectProvider(provider.id, rejectionReason.trim());
      setIsRejectModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/admin/providers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Providers Directory
        </Link>
      </div>

      {/* Main Verification Card Header */}
      <Card padding="p-6 sm:p-8" className="shadow-lg border-rose-100 dark:border-rose-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              {provider.providerType === 'academia' ? (
                <School className="w-8 h-8 text-purple-600" />
              ) : (
                <Building2 className="w-8 h-8 text-indigo-600" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {provider.organizationName}
                </h1>
                <Badge
                  variant={
                    provider.status === 'approved'
                      ? 'success'
                      : provider.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                  size="md"
                >
                  {provider.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {provider.status === 'rejected' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {provider.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                  <span className="capitalize">{provider.status}</span>
                </Badge>
              </div>

              <p className="text-xs text-slate-500 capitalize">
                {provider.providerType} Organization • ID: {provider.orgId}
              </p>
              <p className="text-xs text-slate-400">
                Submitted on {formatDate(provider.joinedDate)}
              </p>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {provider.status !== 'approved' && (
              <Button
                variant="success"
                size="md"
                onClick={handleApprove}
                icon={CheckCircle2}
              >
                Approve Provider
              </Button>
            )}

            {provider.status !== 'rejected' && (
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsRejectModalOpen(true)}
                icon={AlertTriangle}
              >
                Reject Request
              </Button>
            )}
          </div>
        </div>

        {/* Rejection notice banner if rejected */}
        {provider.status === 'rejected' && provider.rejectionReason && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
            <strong className="block font-bold mb-0.5">Audit Rejection Notice:</strong>
            {provider.rejectionReason}
          </div>
        )}
      </Card>

      {/* Grid: Applicant Details & Organization Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nodal Representative Info */}
        <Card padding="p-6">
          <CardHeader
            title="Applicant & Nodal Contact"
            subtitle="Authorized institutional representative"
            className="pb-3 mb-4"
          />
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Representative Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{provider.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Designation / Role</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {provider.designation || 'Head of Strategic Alliances'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Official Email</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{provider.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Phone Number</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{provider.phone}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 font-medium">Headquarters Location</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{provider.location}</span>
            </div>
          </div>
        </Card>

        {/* Regulatory & Institutional Details */}
        <Card padding="p-6">
          <CardHeader
            title="Institutional Accreditation & Registry"
            subtitle="Government and regulatory compliance identifiers"
            className="pb-3 mb-4"
          />
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">CIN / AISHE ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{provider.orgId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Sector / Type</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {provider.industrySector || provider.institutionType}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Official Website</span>
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {provider.website}
              </a>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 font-medium">Registration Status</span>
              <Badge variant={provider.status === 'approved' ? 'success' : 'warning'} size="sm">
                {provider.status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Purpose & Supporting Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purpose */}
        <Card padding="p-6">
          <CardHeader
            title="Reason for Joining YuvaMitra"
            subtitle="Stated collaboration objectives and target cohorts"
            className="pb-3 mb-4"
          />
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            "{provider.reasonForJoining || 'Collaborating with premier colleges on funded apprenticeships and research capstones.'}"
          </p>
        </Card>

        {/* Supporting Docs */}
        <Card padding="p-6">
          <CardHeader
            title="Attached Compliance Documents"
            subtitle="Uploaded accreditation and authorization files"
            className="pb-3 mb-4"
          />
          <div className="space-y-2.5">
            {(provider.supportingDocs || ['Incorporation_Certificate.pdf', 'MoU_Authorization_Letter.pdf']).map(
              (doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{doc}</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">✓ Verified PDF</span>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Audit Rejection Notice"
        subtitle={`Organization: ${provider.organizationName}`}
      >
        <form onSubmit={handleReject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Specific Reason for Rejection *
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid organization ID documentation; unable to verify on national MCA/AISHE database..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirm Rejection Decision
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
