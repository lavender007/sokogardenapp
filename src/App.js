import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

import LandingPage from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import CustomerHome from './pages/CustomerHome';
import TherapistDashboard from './pages/TherapistDashboard';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import TherapistInfoPage from './pages/TherapistInfo';

import './index.css';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

function ProtectedRoute({ children, allowedRole }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'therapist' ? '/therapist' : '/home'} replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }) {
  const user = getStoredUser();
  if (user) return <Navigate to={user.role === 'therapist' ? '/therapist' : '/home'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Customer routes */}
      <Route path="/home" element={
        <ProtectedRoute allowedRole="customer"><CustomerHome /></ProtectedRoute>
      } />
      <Route path="/therapist-info" element={
        <ProtectedRoute allowedRole="customer"><TherapistInfoPage /></ProtectedRoute>
      } />

      {/* Therapist routes */}
      <Route path="/therapist" element={
        <ProtectedRoute allowedRole="therapist"><TherapistDashboard /></ProtectedRoute>
      } />

      {/* Shared */}
      <Route path="/chat" element={
        <ProtectedRoute><ChatPage /></ProtectedRoute>
      } />
      <Route path="/chat/:userId" element={
        <ProtectedRoute><ChatPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}