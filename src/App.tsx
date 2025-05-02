
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import Users from "./pages/Users";
import Parents from "./pages/Parents";
import ParentDetails from "./pages/ParentDetails";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with AppLayout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Escolas */}
            <Route path="schools" element={<Schools />} />
            <Route path="schools/new" element={<NewSchool />} />
            <Route path="schools/students/import" element={<StudentsImport />} />
            <Route path="schools/invites" element={<ComingSoonPage title="Convites" description="Módulo de envio de convites para responsáveis e colaboradores" />} />
            <Route path="schools/map" element={<ComingSoonPage title="Mapa de Escolas" description="Visualização geográfica das escolas cadastradas" />} />
            
            {/* Usuários */}
            <Route path="users" element={<Users />} />
            <Route path="parents" element={<Parents />} />
            <Route path="parents/:parentId" element={<ParentDetails />} />
            <Route path="parents/new" element={<ComingSoonPage title="Novo Responsável" description="Cadastro de novo responsável" />} />
            <Route path="parents/:parentId/edit" element={<ComingSoonPage title="Editar Responsável" description="Edição de dados do responsável" />} />
            
            <Route path="students" element={<Students />} />
            <Route path="students/:studentId" element={<StudentDetails />} />
            <Route path="students/new" element={<ComingSoonPage title="Novo Aluno" description="Cadastro de novo aluno" />} />
            <Route path="students/:studentId/edit" element={<ComingSoonPage title="Editar Aluno" description="Edição de dados do aluno" />} />
            
            {/* Financeiro */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="financial" element={<Financial />} />
            <Route path="financial/invoices" element={<Invoices />} />
            <Route path="financial/invoices/:invoiceId" element={<InvoiceDetails />} />
            <Route path="financial/invoices/create" element={<CreateInvoice />} />
            <Route path="financial/subscriptions" element={<Subscriptions />} />
            <Route path="financial/subscriptions/:subscriptionId" element={<SubscriptionDetails />} />
            <Route path="financial/billing" element={<Billing />} />
            <Route path="financial/billing/:billingId" element={<BillingDetails />} />
            
            {/* Dispositivos */}
            <Route path="devices" element={<Devices />} />
            <Route path="devices/:deviceId" element={<DeviceDetails />} />
            <Route path="device-batches" element={<DeviceBatches />} />
            
            {/* Gestão de Dispositivos */}
            <Route path="devices/register" element={<RegisterDevice />} />
            <Route path="devices/allocate" element={<AllocateToSchool />} />
            <Route path="devices/bind" element={<BindToStudents />} />
            <Route path="devices/:deviceId/edit" element={<EditDevice />} />
            <Route path="devices/:deviceId/replace" element={<ReplaceDevice />} />
            
            {/* Relatórios */}
            <Route path="analytics" element={<ComingSoonPage title="Analytics" description="Visão geral de analytics do sistema" />} />
            <Route path="reports/financial" element={<ComingSoonPage title="Relatórios Financeiros" description="Relatórios detalhados de transações e dados financeiros" />} />
            <Route path="reports/students" element={<ComingSoonPage title="Relatórios de Alunos" description="Relatórios de atividade e comportamento dos alunos" />} />
            
            {/* Configurações e Suporte */}
            <Route path="settings" element={<ComingSoonPage title="Configurações" description="Configurações gerais do sistema" />} />
            <Route path="support" element={<ComingSoonPage title="Suporte" description="Central de suporte e ajuda" />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
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
