
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Schools from "./pages/Schools";
import NewSchool from "./pages/NewSchool";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import StudentForm from "./pages/StudentForm";
import StudentEdit from "./pages/StudentEdit";
import StudentParentBinding from "./pages/StudentParentBinding";
import Parents from "./pages/Parents";
import ParentDetails from "./pages/ParentDetails";
import ParentForm from "./pages/ParentForm";
import ParentEdit from "./pages/ParentEdit";
import StudentsImport from "./pages/school/StudentsImport";
import SchoolsMap from "./pages/schools/SchoolsMap";
import SchoolInvites from "./pages/schools/SchoolInvites";
import Devices from "./pages/Devices";
import DeviceBatches from "./pages/DeviceBatches";
import DeviceDetails from "./pages/DeviceDetails";
import AllocateToSchool from "./pages/deviceManagement/AllocateToSchool";
import BindToStudents from "./pages/deviceManagement/BindToStudents";
import EditDevice from "./pages/deviceManagement/EditDevice";
import RegisterDevice from "./pages/deviceManagement/RegisterDevice";
import ReplaceDevice from "./pages/deviceManagement/ReplaceDevice";
import Financial from "./pages/financial/Financial";
import Billing from "./pages/financial/Billing";
import BillingDetails from "./pages/financial/BillingDetails";
import CreateInvoice from "./pages/financial/CreateInvoice";
import InvoiceDetails from "./pages/financial/InvoiceDetails";
import Invoices from "./pages/financial/Invoices";
import SubscriptionDetails from "./pages/financial/SubscriptionDetails";
import Subscriptions from "./pages/financial/Subscriptions";
import PaymentManager from "./pages/payment/PaymentManager";
import PaymentDetail from "./pages/payment/PaymentDetail";
import NewPayment from "./pages/payment/NewPayment";
import AnalyticsReport from "./pages/reports/AnalyticsReport";
import DeviceUsageReport from "./pages/reports/DeviceUsageReport";
import FinancialReports from "./pages/reports/FinancialReports";
import StudentsReport from "./pages/reports/StudentsReport";
import SecurityCompliance from "./pages/SecurityCompliance";
import Settings from "./pages/Settings";
import ThirdPartyDashboard from "./pages/ThirdPartyDashboard";
import Transactions from "./pages/Transactions";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import VendorForm from "./pages/VendorForm";
import AuditLogs from "./pages/AuditLogs";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Schools />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <NewSchool />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/map"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <SchoolsMap />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/invites"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <SchoolInvites />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Users />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <Students />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin", "parent"]}>
                <AppLayout>
                  <StudentDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <StudentForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <StudentEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/bind-parent"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <StudentParentBinding />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/import"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <StudentsImport />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <Parents />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <ParentDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <ParentForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <ParentEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <Devices />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/batches"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <DeviceBatches />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <DeviceDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/:id/allocate"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <AllocateToSchool />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/:id/bind"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <BindToStudents />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <EditDevice />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/register"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <RegisterDevice />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices/:id/replace"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <ReplaceDevice />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Financial />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/billing"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Billing />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/billing/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <BillingDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/invoices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Invoices />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/invoices/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <CreateInvoice />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <InvoiceDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/subscriptions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Subscriptions />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial/subscriptions/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <SubscriptionDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-manager"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PaymentManager />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PaymentDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NewPayment />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <AnalyticsReport />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/devices"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <DeviceUsageReport />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/financial"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <FinancialReports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <StudentsReport />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/security-compliance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <SecurityCompliance />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/third-party"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <ThirdPartyDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Transactions />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <Vendors />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin", "staff"]}>
                <AppLayout>
                  <VendorDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <VendorForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={["admin", "school_admin"]}>
                <AppLayout>
                  <AuditLogs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
