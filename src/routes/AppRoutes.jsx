import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { ProviderLayout } from '../layouts/ProviderLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public & Google Auth Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { CompleteStudentProfilePage } from '../pages/auth/CompleteStudentProfilePage';
import { CompleteProviderProfilePage } from '../pages/auth/CompleteProviderProfilePage';
import { RegistrationUnderReviewPage } from '../pages/auth/RegistrationUnderReviewPage';

// Student Portal Pages
import { StudentExplorePage } from '../pages/student/StudentExplorePage';
import { OpportunityDetailsPage } from '../pages/student/OpportunityDetailsPage';
import { StudentApplicationsPage } from '../pages/student/StudentApplicationsPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Provider Portal Pages
import { ProviderDashboardPage } from '../pages/provider/ProviderDashboardPage';
import { ProviderOpportunitiesPage } from '../pages/provider/ProviderOpportunitiesPage';
import { CreateOpportunityPage } from '../pages/provider/CreateOpportunityPage';
import { ProviderApplicationsPage } from '../pages/provider/ProviderApplicationsPage';
import { ProviderProfilePage } from '../pages/provider/ProviderProfilePage';

// Admin Portal Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProviderRequestsPage } from '../pages/admin/AdminProviderRequestsPage';
import { AdminProvidersPage } from '../pages/admin/AdminProvidersPage';
import { AdminOpportunitiesPage } from '../pages/admin/AdminOpportunitiesPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/complete-profile/student" element={<CompleteStudentProfilePage />} />
        <Route path="/complete-profile/provider" element={<CompleteProviderProfilePage />} />
        <Route path="/register/under-review" element={<RegistrationUnderReviewPage />} />
      </Route>

      {/* Student Portal (Protected for Student role) */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/explore" replace />} />
          <Route path="explore" element={<StudentExplorePage />} />
          <Route path="opportunities/:id" element={<OpportunityDetailsPage />} />
          <Route path="applications" element={<StudentApplicationsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>
      </Route>

      {/* Provider Portal (Protected for Provider role) */}
      <Route element={<ProtectedRoute allowedRole="provider" />}>
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="opportunities" element={<ProviderOpportunitiesPage />} />
          <Route path="opportunities/create" element={<CreateOpportunityPage />} />
          <Route path="applications" element={<ProviderApplicationsPage />} />
          <Route path="profile" element={<ProviderProfilePage />} />
        </Route>
      </Route>

      {/* Admin Portal (Protected for Admin role) */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="provider-requests" element={<AdminProviderRequestsPage />} />
          <Route path="providers" element={<AdminProvidersPage />} />
          <Route path="opportunities" element={<AdminOpportunitiesPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
