
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, FileArchive, FileText, Globe, Key, Lock, Settings, Shield, Users } from 'lucide-react';

export const SettingsNav = () => {
  const navItems = [
    { name: 'Geral', path: '/settings', icon: Settings },
    { name: 'Usuários', path: '/settings/users', icon: Users },
    { name: 'Notificações', path: '/settings/notifications', icon: Bell },
    { name: 'API', path: '/settings/api', icon: Key },
    { name: 'Integrações', path: '/settings/integrations', icon: Globe },
    { name: 'Segurança', path: '/settings/security', icon: Shield },
    { name: 'Backup', path: '/settings/backup', icon: FileArchive },
    { name: 'Logs', path: '/settings/logs', icon: FileText },
  ];
  
  return (
    <div className="w-60 min-w-60 border-r pr-4 py-4">
      <h2 className="font-semibold mb-4 px-3">Configurações</h2>
      <nav className="space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/settings'}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-md text-sm
              ${isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:bg-slate-50'}
            `}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
