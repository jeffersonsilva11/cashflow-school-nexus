
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, ChevronDown, LogOut } from 'lucide-react';
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
import { NavItem, NavGroup } from './NavComponents';
import { 
  dashboardItems, 
  schoolItems, 
  userItems, 
  financeItems,
  deviceItems, 
  reportItems,
  settingsItems 
} from './NavigationItems';

type SidebarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  location: { pathname: string };
};

const Sidebar = ({ sidebarOpen, toggleSidebar, location }: SidebarProps) => {
  return (
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
  );
};

export default Sidebar;
