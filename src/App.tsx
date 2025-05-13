
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
import AccessDenied from './pages/AccessDenied';
import Parents from './pages/Parents';
import ParentDetails from './pages/ParentDetails';
import StudentParentBinding from './pages/StudentParentBinding';
import StudentForm from './pages/StudentForm';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import SecurityCompliance from './pages/SecurityCompliance';
import CanteenTerminals from './pages/canteen/CanteenTerminals';
import CanteenRecharges from './pages/canteen/CanteenRecharges';
import StudentRecharge from './pages/canteen/StudentRecharge';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import NotificationSettings from './pages/settings/NotificationSettings';
import RegisterDevice from './pages/deviceManagement/RegisterDevice';
import BindToStudents from './pages/deviceManagement/BindToStudents';
import AllocateToSchool from './pages/deviceManagement/AllocateToSchool';
import ReplaceDevice from './pages/deviceManagement/ReplaceDevice';
import EditDevice from './pages/deviceManagement/EditDevice';

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
              <Route path="/canteen/terminals" element={<ProtectedRoute><CanteenTerminals /></ProtectedRoute>} />
              <Route path="/canteen/recharges" element={<ProtectedRoute><CanteenRecharges /></ProtectedRoute>} />
              <Route path="/canteen/recharges/:studentId" element={<ProtectedRoute><StudentRecharge /></ProtectedRoute>} />

              {/* Devices Routes */}
              <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/devices/:deviceId" element={<ProtectedRoute><DeviceDetails /></ProtectedRoute>} />
              
              {/* Device Management Routes */}
              <Route path="/deviceManagement/RegisterDevice" element={<ProtectedRoute><RegisterDevice /></ProtectedRoute>} />
              <Route path="/deviceManagement/BindToStudents" element={<ProtectedRoute><BindToStudents /></ProtectedRoute>} />
              <Route path="/deviceManagement/AllocateToSchool" element={<ProtectedRoute><AllocateToSchool /></ProtectedRoute>} />
              <Route path="/deviceManagement/ReplaceDevice" element={<ProtectedRoute><ReplaceDevice /></ProtectedRoute>} />
              <Route path="/deviceManagement/EditDevice" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
              
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

              {/* Notifications & Messages Routes */}
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/messages/:threadId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

              {/* System Routes */}
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
              <Route path="/security-compliance" element={<ProtectedRoute><SecurityCompliance /></ProtectedRoute>} />

              {/* Settings Routes */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
              <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
