
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Building, Home, Users } from 'lucide-react';

export default function StudentsImport() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <Home className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/schools">
              <Building className="h-3.5 w-3.5 mr-1" />
              Escolas
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Users className="h-3.5 w-3.5 mr-1" />
              Importação de Alunos
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Importação de Alunos</h1>
        <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
      </div>

      {/* Placeholder para desenvolvimento futuro */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-center">Módulo em Desenvolvimento</h3>
        <p className="text-muted-foreground max-w-md mx-auto text-center">
          O módulo de importação e cadastro de alunos está em desenvolvimento.
          Esta funcionalidade estará disponível em breve!
        </p>
      </div>
    </div>
  );
}
