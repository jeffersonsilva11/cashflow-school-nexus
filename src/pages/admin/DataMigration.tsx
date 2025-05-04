
import React from 'react';
import DataMigrationTool from '@/components/admin/DataMigrationTool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function DataMigration() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Migração de Dados</h1>
        <p className="text-muted-foreground">
          Ferramenta para migrar dados mockados para o banco de dados Supabase
        </p>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Migração de Dados</AlertTitle>
        <AlertDescription>
          Esta página permite migrar todos os dados mockados para o banco de dados real.
          A migração incluirá escolas, planos, assinaturas, faturas e relatórios financeiros.
          <br /><br />
          <strong>Nota:</strong> A ferramenta verificará se já existem dados no banco para evitar duplicações.
        </AlertDescription>
      </Alert>
      
      <div className="py-6">
        <DataMigrationTool />
      </div>
    </div>
  );
}
