import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PROVIDERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
} from '../data/initialMockData';
import {
  DEMO_OPPORTUNITIES,
  DEMO_STUDENT_APPLICATIONS,
  DEMO_PROVIDER_APPLICATIONS,
  DEMO_PROVIDERS,
} from '../data/demoData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { currentUser, updateProfile, demoMode } = useAuth();
  const { addToast } = useToast();

  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem('yuvamitra_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('yuvamitra_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('yuvamitra_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('yuvamitra_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('yuvamitra_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('yuvamitra_applications', JSON.stringify(applications));
  }, [applications]);

  // ─── Demo-aware data ──────────────────────────────────────────────────────
  // When demoMode is active, overlay demo data instead of real/stored data.
  const activeProviders = useMemo(() => {
    return demoMode ? DEMO_PROVIDERS : providers;
  }, [demoMode, providers]);

  const activeOpportunities = useMemo(() => {
    return demoMode ? DEMO_OPPORTUNITIES : opportunities;
  }, [demoMode, opportunities]);

  const activeApplications = useMemo(() => {
    if (!demoMode) return applications;
    // In demo mode, serve the right applications based on current persona
    if (currentUser?.role === 'student') return DEMO_STUDENT_APPLICATIONS;
    if (currentUser?.role === 'provider') return DEMO_PROVIDER_APPLICATIONS;
    // Admin sees everything
    return [...DEMO_STUDENT_APPLICATIONS, ...DEMO_PROVIDER_APPLICATIONS];
  }, [demoMode, applications, currentUser?.role]);

  // Admin Actions
  const approveProvider = (providerId) => {
    if (demoMode) {
      addToast({ title: 'Provider Approved (Demo)', message: 'Demo action — no real data changed.', type: 'success' });
      return;
    }
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, status: 'approved' } : p))
    );
    if (currentUser?.id === providerId) {
      updateProfile({ status: 'approved' });
    }
    addToast({
      title: 'Provider Approved',
      message: 'The organization can now create and post opportunities.',
      type: 'success',
    });
  };

  const rejectProvider = (providerId, reason = 'Registration criteria not met') => {
    if (demoMode) {
      addToast({ title: 'Provider Rejected (Demo)', message: 'Demo action — no real data changed.', type: 'warning' });
      return;
    }
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, status: 'rejected', rejectionReason: reason } : p
      )
    );
    if (currentUser?.id === providerId) {
      updateProfile({ status: 'rejected', rejectionReason: reason });
    }
    addToast({
      title: 'Provider Rejected',
      message: 'The organization request has been marked as rejected.',
      type: 'warning',
    });
  };

  // Provider Opportunity Actions
  const addOpportunity = (oppData) => {
    const newOpp = {
      ...oppData,
      id: `opp-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      providerId: currentUser?.id || currentUser?.uid || 'prov-1',
      organization: currentUser?.organizationName || 'Partner Organization',
      status: 'active',
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    addToast({
      title: 'Opportunity Posted',
      message: `"${newOpp.title}" is now available for students.`,
      type: 'success',
    });
    return newOpp;
  };

  const toggleOpportunityStatus = (oppId) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === oppId
          ? { ...o, status: o.status === 'active' ? 'closed' : 'active' }
          : o
      )
    );
    addToast({
      title: 'Status Updated',
      message: 'Opportunity status updated.',
      type: 'info',
    });
  };

  // Student Application Actions
  const applyToOpportunity = (opportunityId) => {
    const opp = activeOpportunities.find((o) => o.id === opportunityId);
    if (!opp) return false;

    const existing = activeApplications.find(
      (a) => a.opportunityId === opportunityId && a.studentId === (currentUser?.id || currentUser?.uid)
    );
    if (existing) {
      addToast({
        title: 'Already Applied',
        message: 'You have already submitted an application for this opportunity.',
        type: 'info',
      });
      return false;
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organization: opp.organization,
      providerId: opp.providerId,
      studentId: currentUser?.id || currentUser?.uid || 'stu-101',
      studentName: currentUser?.name || 'Student',
      studentEmail: currentUser?.email || '',
      studentCollege: currentUser?.college || '',
      studentCourse: currentUser?.course || '',
      studentSkills: currentUser?.skills || '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
    };

    setApplications((prev) => [newApplication, ...prev]);
    addToast({
      title: 'Application Submitted',
      message: `You applied for "${opp.title}".`,
      type: 'success',
    });
    return true;
  };

  // Provider Application Management
  const updateApplicationStatus = (applicationId, newStatus) => {
    if (demoMode) {
      addToast({ title: 'Status Updated (Demo)', message: `Demo: candidate status → ${newStatus}.`, type: 'info' });
      return;
    }
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    addToast({
      title: 'Application Updated',
      message: `Candidate status changed to ${newStatus}.`,
      type: 'info',
    });
  };

  const resetToDefaults = () => {
    setProviders(INITIAL_PROVIDERS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    localStorage.removeItem('yuvamitra_providers');
    localStorage.removeItem('yuvamitra_opportunities');
    localStorage.removeItem('yuvamitra_applications');
    addToast({
      title: 'Data Reset',
      message: 'Restored default demo records.',
      type: 'info',
    });
  };

  return (
    <DataContext.Provider
      value={{
        providers: activeProviders,
        opportunities: activeOpportunities,
        applications: activeApplications,
        collaborations: [],
        approveProvider,
        rejectProvider,
        addOpportunity,
        toggleOpportunityStatus,
        applyToOpportunity,
        updateApplicationStatus,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
