
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import Users from "./pages/Users";
import Parents from "./pages/Parents";
import ParentDetails from "./pages/ParentDetails";
import ParentForm from "./pages/ParentForm";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import StudentForm from "./pages/StudentForm";
import StudentEdit from "./pages/StudentEdit";
import Transactions from "./pages/Transactions";
import Devices from "./pages/Devices";
import DeviceDetails from "./pages/DeviceDetails";
import DeviceBatches from "./pages/DeviceBatches";
import RegisterDevice from "./pages/deviceManagement/RegisterDevice";
import AllocateToSchool from "./pages/deviceManagement/AllocateToSchool";
import BindToStudents from "./pages/deviceManagement/BindToStudents";
import EditDevice from "./pages/deviceManagement/EditDevice";
import ReplaceDevice from "./pages/deviceManagement/ReplaceDevice";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import NewSchool from "./pages/NewSchool";
import StudentsImport from "./pages/school/StudentsImport";
import Financial from "./pages/financial/Financial";
import Invoices from "./pages/financial/Invoices";
import InvoiceDetails from "./pages/financial/InvoiceDetails";
import CreateInvoice from "./pages/financial/CreateInvoice";
import Subscriptions from "./pages/financial/Subscriptions";
import SubscriptionDetails from "./pages/financial/SubscriptionDetails";
import Billing from "./pages/financial/Billing";
import BillingDetails from "./pages/financial/BillingDetails";
import PaymentManager from "./pages/payment/PaymentManager";
import NewPayment from "./pages/payment/NewPayment";
import PaymentDetail from "./pages/payment/PaymentDetail";
import FinancialReports from "./pages/reports/FinancialReports";
import DeviceUsageReport from "./pages/reports/DeviceUsageReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Rotas protegidas com AppLayout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Escolas - restrito a admin e school_admin */}
              <Route path="schools" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <Schools />
                </ProtectedRoute>
              } />
              <Route path="schools/new" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <NewSchool />
                </ProtectedRoute>
              } />
              <Route path="schools/students/import" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <StudentsImport />
                </ProtectedRoute>
              } />
              <Route path="schools/invites" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <ComingSoonPage title="Convites" description="Módulo de envio de convites para responsáveis e colaboradores" />
                </ProtectedRoute>
              } />
              <Route path="schools/map" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ComingSoonPage title="Mapa de Escolas" description="Visualização geográfica das escolas cadastradas" />
                </ProtectedRoute>
              } />
              
              {/* Usuários - diferentes níveis de acesso */}
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="parents" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <Parents />
                </ProtectedRoute>
              } />
              <Route path="parents/:parentId" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <ParentDetails />
                </ProtectedRoute>
              } />
              <Route path="parents/new" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <ParentForm />
                </ProtectedRoute>
              } />
              <Route path="parents/:parentId/edit" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <ComingSoonPage title="Editar Responsável" description="Edição de dados do responsável" />
                </ProtectedRoute>
              } />
              
              <Route path="students" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <Students />
                </ProtectedRoute>
              } />
              <Route path="students/:studentId" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff', 'parent']}>
                  <StudentDetails />
                </ProtectedRoute>
              } />
              <Route path="students/new" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <StudentForm />
                </ProtectedRoute>
              } />
              <Route path="students/:studentId/edit" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <StudentEdit />
                </ProtectedRoute>
              } />
              
              {/* Financeiro - principalmente para admin */}
              <Route path="transactions" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="financial" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <Financial />
                </ProtectedRoute>
              } />
              <Route path="financial/invoices" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <Invoices />
                </ProtectedRoute>
              } />
              <Route path="financial/invoices/:invoiceId" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <InvoiceDetails />
                </ProtectedRoute>
              } />
              <Route path="financial/invoices/create" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateInvoice />
                </ProtectedRoute>
              } />
              <Route path="financial/subscriptions" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Subscriptions />
                </ProtectedRoute>
              } />
              <Route path="financial/subscriptions/:subscriptionId" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubscriptionDetails />
                </ProtectedRoute>
              } />
              <Route path="financial/billing" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="financial/billing/:billingId" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BillingDetails />
                </ProtectedRoute>
              } />
              
              {/* Sistema de Pagamentos */}
              <Route path="payment" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'parent']}>
                  <PaymentManager />
                </ProtectedRoute>
              } />
              <Route path="payment/new" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <NewPayment />
                </ProtectedRoute>
              } />
              <Route path="payment/:paymentId" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'parent']}>
                  <PaymentDetail />
                </ProtectedRoute>
              } />
              
              {/* Dispositivos */}
              <Route path="devices" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <Devices />
                </ProtectedRoute>
              } />
              <Route path="devices/:deviceId" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <DeviceDetails />
                </ProtectedRoute>
              } />
              <Route path="device-batches" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DeviceBatches />
                </ProtectedRoute>
              } />
              
              {/* Gestão de Dispositivos */}
              <Route path="devices/register" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RegisterDevice />
                </ProtectedRoute>
              } />
              <Route path="devices/allocate" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllocateToSchool />
                </ProtectedRoute>
              } />
              <Route path="devices/bind" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <BindToStudents />
                </ProtectedRoute>
              } />
              <Route path="devices/:deviceId/edit" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <EditDevice />
                </ProtectedRoute>
              } />
              <Route path="devices/:deviceId/replace" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <ReplaceDevice />
                </ProtectedRoute>
              } />
              
              {/* Relatórios */}
              <Route path="analytics" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <ComingSoonPage title="Analytics" description="Visão geral de analytics do sistema" />
                </ProtectedRoute>
              } />
              <Route path="reports/financial" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <FinancialReports />
                </ProtectedRoute>
              } />
              <Route path="reports/devices" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin']}>
                  <DeviceUsageReport />
                </ProtectedRoute>
              } />
              <Route path="reports/students" element={
                <ProtectedRoute allowedRoles={['admin', 'school_admin', 'staff']}>
                  <ComingSoonPage title="Relatórios de Alunos" description="Relatórios de atividade e comportamento dos alunos" />
                </ProtectedRoute>
              } />
              
              {/* Configurações e Suporte */}
              <Route path="settings" element={
                <ProtectedRoute>
                  <ComingSoonPage title="Configurações" description="Configurações gerais do sistema" />
                </ProtectedRoute>
              } />
              <Route path="support" element={
                <ProtectedRoute>
                  <ComingSoonPage title="Suporte" description="Central de suporte e ajuda" />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Simple component for pages that are coming soon
function ComingSoonPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">
        {description || "Esta funcionalidade estará disponível em breve!"}
      </p>
      <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Estamos trabalhando para trazer esta funcionalidade para o sistema Cashflow School Nexus.
        Fique atento às próximas atualizações!
      </p>
    </div>
  );
}

export default App;
