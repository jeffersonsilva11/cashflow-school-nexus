
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import Devices from "./pages/Devices";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with AppLayout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schools" element={<Schools />} />
            <Route path="users" element={<Users />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="devices" element={<Devices />} />
            
            {/* Placeholder routes that will show "Coming Soon" */}
            <Route path="financial" element={<ComingSoonPage title="Financeiro" />} />
            <Route path="analytics" element={<ComingSoonPage title="Analytics" />} />
            <Route path="settings" element={<ComingSoonPage title="Configurações" />} />
            <Route path="support" element={<ComingSoonPage title="Suporte" />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Simple component for pages that are coming soon
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">Esta funcionalidade estará disponível em breve!</p>
      <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Estamos trabalhando para trazer esta funcionalidade para o sistema Cashflow School Nexus.
        Fique atento às próximas atualizações!
      </p>
    </div>
  );
}

export default App;
