
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import AccessDenied from "@/pages/AccessDenied";
import SchoolsPage from "@/pages/Schools";
import VendorsPage from "@/pages/Vendors";
import DevicesPage from "@/pages/Devices";
import DeviceDetails from "@/pages/DeviceDetails";
import Students from "@/pages/Students";
import StudentDetails from "@/pages/StudentDetails";
import StudentEdit from "@/pages/StudentEdit";
import Transactions from "@/pages/Transactions";
import Financial from "@/pages/financial/Financial";
import Invoices from "@/pages/financial/Invoices";
import InvoiceDetails from "@/pages/financial/InvoiceDetails";
import CreateInvoice from "@/pages/financial/CreateInvoice";
import Billing from "@/pages/financial/Billing";
import BillingDetails from "@/pages/financial/BillingDetails";
import FinancialReports from "@/pages/reports/FinancialReports";
import { Toaster } from "@/components/ui/toaster";
import DataMigration from "@/pages/admin/DataMigration"; 
import StudentsImport from "@/pages/school/StudentsImport";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          
          {/* Protected routes inside main layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Schools */}
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/schools/students-import" element={<StudentsImport />} />
            
            {/* Students */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/:studentId" element={<StudentDetails />} />
            <Route path="/students/:studentId/edit" element={<StudentEdit />} />
            
            {/* Vendors */}
            <Route path="/vendors" element={<VendorsPage />} />
            
            {/* Devices */}
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/:deviceId" element={<DeviceDetails />} />
            
            {/* Transactions */}
            <Route path="/transactions" element={<Transactions />} />
            
            {/* Financial */}
            <Route path="/financial" element={<Financial />} />
            <Route path="/financial/invoices" element={<Invoices />} />
            <Route path="/financial/invoices/:invoiceId" element={<InvoiceDetails />} />
            <Route path="/financial/invoices/create" element={<CreateInvoice />} />
            <Route path="/financial/billing" element={<Billing />} />
            <Route path="/financial/billing/:billingId" element={<BillingDetails />} />
            
            {/* Reports */}
            <Route path="/reports/financial" element={<FinancialReports />} />
            
            {/* Admin */}
            <Route path="/admin/data-migration" element={<DataMigration />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
