
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  School, 
  CreditCard, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Database, 
  HelpCircle, 
  Menu,
  X,
  ChevronDown,
  LogOut,
  BookOpen,
  UserRound,
  FileBarChart,
  ShieldCheck,
  Layers,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 font-normal", 
          active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  sidebarOpen: boolean;
};

const NavGroup = ({ title, children, sidebarOpen }: NavGroupProps) => {
  return (
    <div className="mb-4">
      {sidebarOpen && (
        <div className="px-3 mb-2">
          <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">{title}</h3>
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Dashboard
  const dashboardItems = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
  ];
  
  // Escolas
  const schoolItems = [
    { to: "/schools", icon: <School size={20} />, label: "Escolas" },
    { to: "/schools/map", icon: <Layers size={20} />, label: "Mapa de Escolas" },
    { to: "/schools/invites", icon: <ShieldCheck size={20} />, label: "Convites" },
  ];
  
  // Usuários
  const userItems = [
    { to: "/users", icon: <Users size={20} />, label: "Usuários" },
    { to: "/parents", icon: <UserRound size={20} />, label: "Pais/Responsáveis" },
    { to: "/students", icon: <GraduationCap size={20} />, label: "Alunos" },
  ];
  
  // Transações/Financeiro
  const financeItems = [
    { to: "/transactions", icon: <CreditCard size={20} />, label: "Transações" },
    { to: "/financial", icon: <DollarSign size={20} />, label: "Financeiro" },
  ];
  
  // Dispositivos
  const deviceItems = [
    { to: "/devices", icon: <Database size={20} />, label: "Dispositivos" },
    { to: "/device-batches", icon: <Layers size={20} />, label: "Lotes" },
  ];
  
  // Relatórios
  const reportItems = [
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { to: "/reports/financial", icon: <FileBarChart size={20} />, label: "Financeiros" },
    { to: "/reports/students", icon: <BookOpen size={20} />, label: "Alunos" },
  ];
  
  // Configurações e Suporte
  const settingsItems = [
    { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
    { to: "/support", icon: <HelpCircle size={20} />, label: "Suporte" },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar fixed inset-y-0 z-50 transition-all duration-300 flex flex-col border-r shadow-sm",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-cashless-700 flex items-center justify-center text-white font-bold text-lg">
                CS
              </div>
              <h1 className="font-bold text-lg">CashFlow</h1>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-sidebar-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        <div className="mt-2 px-3 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            <NavGroup title="Principal" sidebarOpen={sidebarOpen}>
              {dashboardItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Gestão Escolar" sidebarOpen={sidebarOpen}>
              {schoolItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Usuários" sidebarOpen={sidebarOpen}>
              {userItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Financeiro" sidebarOpen={sidebarOpen}>
              {financeItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Dispositivos" sidebarOpen={sidebarOpen}>
              {deviceItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Relatórios" sidebarOpen={sidebarOpen}>
              {reportItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
            
            <NavGroup title="Sistema" sidebarOpen={sidebarOpen}>
              {settingsItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname.startsWith(item.to)}
                />
              ))}
            </NavGroup>
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 font-normal"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback className="bg-cashless-700 text-white">AD</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm">Admin</span>
                    <ChevronDown size={16} />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Preferências
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <LogOut size={16} className="mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <header className="h-16 border-b bg-background sticky top-0 z-30 flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname.startsWith("/schools") && "Escolas"}
            {location.pathname === "/users" && "Usuários"}
            {location.pathname === "/parents" && "Pais/Responsáveis"}
            {location.pathname === "/students" && "Alunos"}
            {location.pathname === "/transactions" && "Transações"}
            {location.pathname === "/financial" && "Financeiro"}
            {location.pathname.startsWith("/devices") && "Dispositivos"}
            {location.pathname === "/device-batches" && "Lotes de Dispositivos"}
            {location.pathname === "/analytics" && "Analytics"}
            {location.pathname.startsWith("/reports") && "Relatórios"}
            {location.pathname === "/settings" && "Configurações"}
            {location.pathname === "/support" && "Suporte"}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Add notification icon, etc. here */}
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
