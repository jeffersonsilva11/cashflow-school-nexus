import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './main';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import NewSchool from './pages/NewSchool';
import SchoolDetails from './pages/SchoolDetails';
import SchoolsMap from './pages/schools/SchoolsMap';
import SchoolInvites from './pages/schools/SchoolInvites';
import StudentsImport from './pages/school/StudentsImport';
import Tablets from './pages/Tablets';
import NewTablet from './pages/NewTablet';
import TabletDetails from './pages/TabletDetails';
import DeviceAlerts from './pages/DeviceAlerts';
import Payments from './pages/Payments';
import Canteen from './pages/Canteen';
import FinancialReports from './pages/reports/FinancialReports';
import Settings from './pages/Settings';
import SecuritySettings from './pages/settings/SecuritySettings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Devices from './pages/Devices';
import DeviceDetails from './pages/DeviceDetails';
import { GlobalComponents } from './components/layout/GlobalComponents';
import Index from './pages/Index';
import MainLayout from './components/layout/MainLayout';
import ThirdPartyDashboard from './pages/ThirdPartyDashboard';
import Students from './pages/Students';
import Vendors from './pages/Vendors';
import Financial from './pages/financial/Financial';
import Billing from './pages/financial/Billing';
import Invoices from './pages/financial/Invoices';
import Transactions from './pages/Transactions';
import Reports from './pages/reports/Reports';
import DataMigration from './pages/admin/DataMigration';
import AccessDenied from './pages/AccessDenied';
import MigrationStatus from '@/pages/admin/MigrationStatus';
import Parents from './pages/Parents';
import ParentDetails from './pages/ParentDetails';
import StudentParentBinding from './pages/StudentParentBinding';
import StudentForm from './pages/StudentForm';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalComponents />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Protected Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/third-party-dashboard" element={<ProtectedRoute><ThirdPartyDashboard /></ProtectedRoute>} />

              {/* Schools Routes */}
              <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
              <Route path="/schools/new" element={<ProtectedRoute><NewSchool /></ProtectedRoute>} />
              <Route path="/schools/map" element={<ProtectedRoute><SchoolsMap /></ProtectedRoute>} />
              <Route path="/schools/invites" element={<ProtectedRoute><SchoolInvites /></ProtectedRoute>} />
              <Route path="/schools/students-import" element={<ProtectedRoute><StudentsImport /></ProtectedRoute>} />
              <Route path="/schools/:schoolId" element={<ProtectedRoute><SchoolDetails /></ProtectedRoute>} />

              {/* Students Routes */}
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/students/new" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
              <Route path="/students/:studentId/parents" element={<ProtectedRoute><StudentParentBinding /></ProtectedRoute>} />

              {/* Parents Routes */}
              <Route path="/parents" element={<ProtectedRoute><Parents /></ProtectedRoute>} />
              <Route path="/parents/:parentId" element={<ProtectedRoute><ParentDetails /></ProtectedRoute>} />

              {/* Vendors/Canteen Routes */}
              <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
              <Route path="/canteen" element={<ProtectedRoute><Canteen /></ProtectedRoute>} />

              {/* Devices Routes */}
              <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/devices/:deviceId" element={<ProtectedRoute><DeviceDetails /></ProtectedRoute>} />
              
              {/* Tablets Routes */}
              <Route path="/tablets" element={<ProtectedRoute><Tablets /></ProtectedRoute>} />
              <Route path="/tablets/new" element={<ProtectedRoute><NewTablet /></ProtectedRoute>} />
              <Route path="/tablets/:tabletId" element={<ProtectedRoute><TabletDetails /></ProtectedRoute>} />

              {/* Device Alerts Route */}
              <Route path="/device-alerts" element={<ProtectedRoute><DeviceAlerts /></ProtectedRoute>} />

              {/* Financial Routes */}
              <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
              <Route path="/financial/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/financial/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

              {/* Payments Route */}
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />

              {/* Reports Routes */}
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/reports/financial" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/data-migration" element={<ProtectedRoute><DataMigration /></ProtectedRoute>} />
              <Route path="/admin/migration-status" element={<MigrationStatus />} />

              {/* System Routes */}
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
              <Route path="/security-compliance" element={<ProtectedRoute><AccessDenied /></ProtectedRoute>} />

              {/* Settings Routes */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
