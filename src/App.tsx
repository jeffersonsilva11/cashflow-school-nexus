import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import NewSchool from './pages/NewSchool';
import SchoolDetails from './pages/SchoolDetails';
import SchoolsMap from './pages/SchoolsMap';
import SchoolInvites from './pages/schools/SchoolInvites';
import StudentsImport from './pages/StudentsImport';
import Tablets from './pages/Tablets';
import NewTablet from './pages/NewTablet';
import TabletDetails from './pages/TabletDetails';
import DeviceAlerts from './pages/DeviceAlerts';
import Payments from './pages/Payments';
import Canteen from './pages/Canteen';
import FinancialReports from './pages/FinancialReports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Schools Routes */}
          <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
          <Route path="/schools/new" element={<ProtectedRoute><NewSchool /></ProtectedRoute>} />
          <Route path="/schools/map" element={<ProtectedRoute><SchoolsMap /></ProtectedRoute>} />
          <Route path="/schools/invites" element={<ProtectedRoute><SchoolInvites /></ProtectedRoute>} />
          <Route path="/schools/students-import" element={<ProtectedRoute><StudentsImport /></ProtectedRoute>} />
          <Route path="/schools/:schoolId" element={<ProtectedRoute><SchoolDetails /></ProtectedRoute>} />

          {/* Tablets Routes */}
          <Route path="/tablets" element={<ProtectedRoute><Tablets /></ProtectedRoute>} />
          <Route path="/tablets/new" element={<ProtectedRoute><NewTablet /></ProtectedRoute>} />
          <Route path="/tablets/:tabletId" element={<ProtectedRoute><TabletDetails /></ProtectedRoute>} />

          {/* Device Alerts Route */}
          <Route path="/device-alerts" element={<ProtectedRoute><DeviceAlerts /></ProtectedRoute>} />

          {/* Payments Route */}
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />

          {/* Canteen Route */}
          <Route path="/canteen" element={<ProtectedRoute><Canteen /></ProtectedRoute>} />

          {/* Financial Reports Route */}
          <Route path="/financial-reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />

          {/* Settings Route */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
