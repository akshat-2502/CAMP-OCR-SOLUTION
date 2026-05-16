/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { DemoPage } from '../pages/DemoPage';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, isInitialized } = useAuth();
  
  if (!isInitialized) return null; // or a loading spinner
  
  if (!user) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage isAdminLogin />} />
      <Route 
        path="/demo" 
        element={
          <ProtectedRoute>
            <DemoPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
