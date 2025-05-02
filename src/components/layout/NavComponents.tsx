
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

export const NavItem = ({ to, icon, label, active }: NavItemProps) => {
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

export const NavGroup = ({ title, children, sidebarOpen }: NavGroupProps) => {
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
