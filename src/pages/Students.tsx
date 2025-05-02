
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Plus, FileSpreadsheet, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Students() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie os cadastros de alunos do sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14,583</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Matrículas no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">752</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Ativação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm font-medium mb-2 block">
              Buscar aluno
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome, matrícula ou escola..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Button variant="outline" className="w-full">
              Filtros Avançados
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Aguardando implementação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <GraduationCap className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Funcionalidade em desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md">
            O cadastro de alunos está em desenvolvimento. Em breve você poderá gerenciar todos os alunos do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
