
import React from 'react';

type HeaderProps = {
  pathname: string;
};

const Header = ({ pathname }: HeaderProps) => {
  return (
    <header className="h-16 border-b bg-background sticky top-0 z-30 flex items-center justify-between px-6">
      <h2 className="text-lg font-medium">
        {pathname === "/dashboard" && "Dashboard"}
        {pathname.startsWith("/schools") && "Escolas"}
        {pathname === "/users" && "Usuários"}
        {pathname === "/parents" && "Pais/Responsáveis"}
        {pathname === "/students" && "Alunos"}
        {pathname === "/transactions" && "Transações"}
        {pathname === "/financial" && "Financeiro"}
        {pathname.startsWith("/devices") && "Dispositivos"}
        {pathname === "/device-batches" && "Lotes de Dispositivos"}
        {pathname === "/analytics" && "Analytics"}
        {pathname.startsWith("/reports") && "Relatórios"}
        {pathname === "/settings" && "Configurações"}
        {pathname === "/support" && "Suporte"}
      </h2>
      
      <div className="flex items-center gap-4">
        {/* Add notification icon, etc. here */}
      </div>
    </header>
  );
};

export default Header;
