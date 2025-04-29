
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
  LogOut
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

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navItems = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/schools", icon: <School size={20} />, label: "Escolas" },
    { to: "/users", icon: <Users size={20} />, label: "Usuários" },
    { to: "/transactions", icon: <CreditCard size={20} />, label: "Transações" },
    { to: "/financial", icon: <DollarSign size={20} />, label: "Financeiro" },
    { to: "/devices", icon: <Database size={20} />, label: "Dispositivos" },
    { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
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
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.to)}
              />
            ))}
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
            {navItems.find(item => location.pathname.startsWith(item.to))?.label || "Dashboard"}
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
