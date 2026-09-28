/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../frontend/src/context/AuthContext.jsx';
import Navbar from '../frontend/src/components/Navbar.jsx';
import Sidebar from '../frontend/src/components/Sidebar.jsx';
import Loading from '../frontend/src/components/Loading.jsx';

import Login from '../frontend/src/pages/Login.jsx';
import Dashboard from '../frontend/src/pages/Dashboard.jsx';
import CreateTestReport from '../frontend/src/pages/CreateTestReport.jsx';
import ReportRepository from '../frontend/src/pages/ReportRepository.jsx';
import ReportPreview from '../frontend/src/pages/ReportPreview.jsx';
import RegulatoryReferences from '../frontend/src/pages/RegulatoryReferences.jsx';
import UserManagement from '../frontend/src/pages/UserManagement.jsx';
import Settings from '../frontend/src/pages/Settings.jsx';

import '../frontend/src/styles/global.css';

function ProtectedLayout({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading message="Validating laboratory session & credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading message="Checking laboratory portal session..." />
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/create-test-report"
            element={
              <ProtectedLayout>
                <CreateTestReport />
              </ProtectedLayout>
            }
          />

          <Route
            path="/report-repository"
            element={
              <ProtectedLayout>
                <ReportRepository />
              </ProtectedLayout>
            }
          />

          <Route
            path="/report/:id"
            element={
              <ProtectedLayout>
                <ReportPreview />
              </ProtectedLayout>
            }
          />

          <Route
            path="/report-preview"
            element={
              <ProtectedLayout>
                <ReportPreview />
              </ProtectedLayout>
            }
          />

          <Route
            path="/regulatory-references"
            element={
              <ProtectedLayout>
                <RegulatoryReferences />
              </ProtectedLayout>
            }
          />

          <Route
            path="/user-management"
            element={
              <ProtectedLayout adminOnly={true}>
                <UserManagement />
              </ProtectedLayout>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
