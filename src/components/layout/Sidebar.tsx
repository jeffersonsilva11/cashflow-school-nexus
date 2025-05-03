
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavItem, NavGroup } from './NavComponents';
import { 
  mainNavItems,
  financialNavItems,
  reportsAndAdminItems
} from './NavigationItems';
import { useAuth } from '@/contexts/AuthContext';

type SidebarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  location: { pathname: string };
};

const Sidebar = ({ sidebarOpen, toggleSidebar, location }: SidebarProps) => {
  const { user, logout } = useAuth();

  // Function to check if user has permission to see a menu item
  const hasPermission = (requiredPermissions: string[]) => {
    // If no user or no role, deny access
    if (!user || !user.role) {
      console.log('[Sidebar] No user or role defined, denying access');
      return false;
    }
    
    // Admin always has access to everything - always use lowercase comparison
    if (user.role.toLowerCase() === 'admin') {
      console.log(`[Sidebar] User ${user.name} has admin role, granting access to all items`);
      return true;
    }
    
    // For non-admins, check specific permissions (case-insensitive)
    const userRoleLower = user.role.toLowerCase();
    const hasAccess = requiredPermissions.some(role => role.toLowerCase() === userRoleLower);
    console.log(`[Sidebar] User ${user.name} with role ${user.role} access to ${requiredPermissions.join(', ')}: ${hasAccess}`);
    return hasAccess;
  };

  // Debug logging for menu filtering
  console.log(`[Sidebar] Current user:`, user);
  console.log(`[Sidebar] User role:`, user?.role);
  console.log(`[Sidebar] Admin check (case-insensitive):`, user?.role?.toLowerCase() === 'admin' ? 'Is admin' : 'Not admin');
  
  // Filter menu items based on user role
  let filteredMainNavItems = mainNavItems;
  let filteredFinancialNavItems = financialNavItems;
  let filteredReportsAndAdminItems = reportsAndAdminItems;
  
  // Apply filtering only for non-admin users - always use lowercase comparison
  if (!user || !user.role || user.role.toLowerCase() !== 'admin') {
    console.log('[Sidebar] Not an admin user, filtering menu items');
    filteredMainNavItems = mainNavItems.filter(item => hasPermission(item.permission));
    filteredFinancialNavItems = financialNavItems.filter(item => hasPermission(item.permission));
    filteredReportsAndAdminItems = reportsAndAdminItems.filter(item => hasPermission(item.permission));
  } else {
    console.log('[Sidebar] Admin user detected, showing all menu items');
  }

  console.log(`[Sidebar] Filtered items counts: Main: ${filteredMainNavItems.length}, Financial: ${filteredFinancialNavItems.length}, Reports/Admin: ${filteredReportsAndAdminItems.length}`);
  console.log('[Sidebar] Filtered items:', {
    main: filteredMainNavItems.map(i => i.title),
    financial: filteredFinancialNavItems.map(i => i.title),
    reports: filteredReportsAndAdminItems.map(i => i.title),
  });

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
          {filteredMainNavItems.length > 0 && (
            <NavGroup title="Principal" sidebarOpen={sidebarOpen}>
              {filteredMainNavItems.map((item) => (
                <NavItem 
                  key={item.href}
                  to={item.href}
                  icon={<item.icon size={20} />}
                  label={item.title}
                  active={location.pathname === item.href}
                />
              ))}
            </NavGroup>
          )}
          
          {filteredFinancialNavItems.length > 0 && (
            <NavGroup title="Financeiro" sidebarOpen={sidebarOpen}>
              {filteredFinancialNavItems.map((item) => (
                <NavItem 
                  key={item.href}
                  to={item.href}
                  icon={<item.icon size={20} />}
                  label={item.title}
                  active={location.pathname.startsWith(item.href)}
                />
              ))}
            </NavGroup>
          )}
          
          {filteredReportsAndAdminItems.length > 0 && (
            <NavGroup title="Relatórios & Admin" sidebarOpen={sidebarOpen}>
              {filteredReportsAndAdminItems.map((item) => (
                <NavItem 
                  key={item.href}
                  to={item.href}
                  icon={<item.icon size={20} />}
                  label={item.title}
                  active={location.pathname.startsWith(item.href)}
                />
              ))}
            </NavGroup>
          )}
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
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "Usuário"} />
                <AvatarFallback className="bg-cashless-700 text-white">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "UN"}
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm">{user?.name || "Usuário"}</span>
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
            <DropdownMenuItem className="text-red-500" onClick={() => logout()}>
              <LogOut size={16} className="mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
