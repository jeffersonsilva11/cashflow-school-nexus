
import React from 'react';
import { SchoolWizard } from '@/components/schools/SchoolWizard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Building, Home } from 'lucide-react';

export default function NewSchool() {
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
            <BreadcrumbPage>Nova Escola</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nova Escola</h1>
        <p className="text-muted-foreground">Complete o formulário abaixo para cadastrar uma nova escola.</p>
      </div>

      <SchoolWizard />
    </div>
  );
}
