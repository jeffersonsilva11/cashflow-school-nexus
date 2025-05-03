
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Building, FileSpreadsheet, Home, Upload, Users } from 'lucide-react';
import { StudentsImportForm } from '@/components/students/StudentsImportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        <p className="text-muted-foreground">Importe vários alunos de uma única vez usando arquivos CSV ou Excel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StudentsImportForm />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Como Importar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Selecione a escola destino</li>
                <li>Escolha o formato do arquivo (CSV ou Excel)</li>
                <li>Baixe o modelo de importação (opcional)</li>
                <li>Preencha o arquivo com os dados dos alunos</li>
                <li>Faça upload do arquivo</li>
                <li>Clique em "Importar"</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Formato do Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Os arquivos devem conter pelo menos estas colunas:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Coluna</th>
                      <th className="text-left pb-2">Obrigatório</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">nome</td>
                      <td className="py-2 text-green-600">Sim</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">documento</td>
                      <td className="py-2 text-amber-600">Não</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">série</td>
                      <td className="py-2 text-amber-600">Não</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTitle>Dica</AlertTitle>
            <AlertDescription>
              Para importar mais de 1000 alunos, recomendamos dividir em múltiplos arquivos para melhor desempenho.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
