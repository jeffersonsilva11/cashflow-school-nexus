
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import SchoolsMap from './pages/schools/SchoolsMap';
import SchoolInvites from './pages/schools/SchoolInvites';
import NewSchool from './pages/NewSchool';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import StudentForm from './pages/StudentForm';
import StudentEdit from './pages/StudentEdit';
import StudentsImport from './pages/school/StudentsImport';
import StudentParentBinding from './pages/StudentParentBinding';
import Parents from './pages/Parents';
import ParentDetails from './pages/ParentDetails';
import ParentForm from './pages/ParentForm';
import ParentEdit from './pages/ParentEdit';
import Devices from './pages/Devices';
import DeviceDetails from './pages/DeviceDetails';
import DeviceBatches from './pages/DeviceBatches';
import RegisterDevice from './pages/deviceManagement/RegisterDevice';
import EditDevice from './pages/deviceManagement/EditDevice';
import ReplaceDevice from './pages/deviceManagement/ReplaceDevice';
import BindToStudents from './pages/deviceManagement/BindToStudents';
import AllocateToSchool from './pages/deviceManagement/AllocateToSchool';
import Transactions from './pages/Transactions';
import Financial from './pages/financial/Financial';
import Invoices from './pages/financial/Invoices';
import CreateInvoice from './pages/financial/CreateInvoice';
import InvoiceDetails from './pages/financial/InvoiceDetails';
import Subscriptions from './pages/financial/Subscriptions';
import SubscriptionDetails from './pages/financial/SubscriptionDetails';
import Billing from './pages/financial/Billing';
import BillingDetails from './pages/financial/BillingDetails';
import PaymentManager from './pages/payment/PaymentManager';
import NewPayment from './pages/payment/NewPayment';
import PaymentDetail from './pages/payment/PaymentDetail';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import VendorForm from './pages/VendorForm';
import Users from './pages/Users';
import Settings from './pages/Settings';
import ThirdPartyDashboard from './pages/ThirdPartyDashboard';
import FinancialReports from './pages/reports/FinancialReports';
import DeviceUsageReport from './pages/reports/DeviceUsageReport';
import StudentsReport from './pages/reports/StudentsReport';
import AnalyticsReport from './pages/reports/AnalyticsReport';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import SecurityCompliance from "./pages/SecurityCompliance";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/schools/map" element={<SchoolsMap />} />
              <Route path="/schools/invites" element={<SchoolInvites />} />
              <Route path="/new-school" element={<NewSchool />} />
              
              <Route path="/students" element={<Students />} />
              <Route path="/students/:studentId" element={<StudentDetails />} />
              <Route path="/students/add" element={<StudentForm />} />
              <Route path="/students/edit/:studentId" element={<StudentEdit />} />
              <Route path="/students/import" element={<StudentsImport />} />
              <Route path="/students/bind/:studentId" element={<StudentParentBinding />} />

              <Route path="/parents" element={<Parents />} />
              <Route path="/parents/:parentId" element={<ParentDetails />} />
              <Route path="/parents/add" element={<ParentForm />} />
              <Route path="/parents/edit/:parentId" element={<ParentEdit />} />
              
              <Route path="/devices" element={<Devices />} />
              <Route path="/devices/:deviceId" element={<DeviceDetails />} />
              <Route path="/device-batches" element={<DeviceBatches />} />
              <Route path="/device/register" element={<RegisterDevice />} />
              <Route path="/device/edit/:deviceId" element={<EditDevice />} />
              <Route path="/device/replace/:deviceId" element={<ReplaceDevice />} />
              <Route path="/device/bind-students/:deviceId" element={<BindToStudents />} />
              <Route path="/device/allocate-school/:deviceId" element={<AllocateToSchool />} />
              
              <Route path="/transactions" element={<Transactions />} />
              
              <Route path="/financial" element={<Financial />} />
              <Route path="/financial/invoices" element={<Invoices />} />
              <Route path="/financial/invoices/create" element={<CreateInvoice />} />
              <Route path="/financial/invoices/:invoiceId" element={<InvoiceDetails />} />
              <Route path="/financial/subscriptions" element={<Subscriptions />} />
              <Route path="/financial/subscriptions/:subscriptionId" element={<SubscriptionDetails />} />
              <Route path="/financial/billing" element={<Billing />} />
              <Route path="/financial/billing/:billingId" element={<BillingDetails />} />
              
              <Route path="/payment" element={<PaymentManager />} />
              <Route path="/payment/new" element={<NewPayment />} />
              <Route path="/payment/:paymentId" element={<PaymentDetail />} />
              
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendors/:vendorId" element={<VendorDetails />} />
              <Route path="/vendors/add" element={<VendorForm />} />
              
              <Route path="/users" element={<Users />} />
              
              <Route path="/settings" element={<Settings />} />
              
              <Route path="/third-party-dashboard" element={<ThirdPartyDashboard />} />
              
              <Route path="/reports/financial" element={<FinancialReports />} />
              <Route path="/reports/device-usage" element={<DeviceUsageReport />} />
              <Route path="/reports/students" element={<StudentsReport />} />
              <Route path="/analytics" element={<AnalyticsReport />} />
              
              {/* Nova rota para Segurança e Compliance */}
              <Route path="/security-compliance" element={<SecurityCompliance />} />
              
              {/* Fallback routes */}
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
