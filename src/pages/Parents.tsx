
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, Plus, FileSpreadsheet } from 'lucide-react';

export default function Parents() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pais/Responsáveis</h1>
          <p className="text-muted-foreground">Gerencie os cadastros de pais e responsáveis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Novo Responsável
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Responsáveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,358</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cadastros no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">237</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Responsáveis Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,879</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Aguardando implementação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <UserRound className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Funcionalidade em desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md">
            O cadastro de responsáveis está em desenvolvimento. Em breve você poderá gerenciar todos os responsáveis do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
