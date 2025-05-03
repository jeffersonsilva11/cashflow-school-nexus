
import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, FileDown, Building, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSchools } from '@/services/schoolService';

export default function Schools() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Fetch schools from the database using the useSchools hook
  const { data: schools, isLoading, error } = useSchools();
  
  const filteredSchools = schools?.filter(school => {
    const matchesSearch = school.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          school.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || school.subscription_status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground">Gerencie todas as escolas cadastradas no sistema.</p>
        </div>
        <Button className="gap-1" asChild>
          <Link to="/schools/new">
            <Plus size={18} />
            Nova Escola
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar escolas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <FileDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando escolas...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 flex-col">
              <div className="text-red-500 mb-2">Erro ao carregar escolas</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Escola</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Plano</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.city || 'N/A'}, {school.state || 'N/A'}</TableCell>
                    <TableCell className="text-right">{getStatusBadge(school.subscription_status || 'inactive')}</TableCell>
                    <TableCell className="text-right">{school.subscription_plan || 'Sem plano'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Gerenciar usuários</DropdownMenuItem>
                          <DropdownMenuItem>Ver transações</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!isLoading && !error && filteredSchools.length === 0 && (
            <div className="py-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma escola encontrada</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Não foram encontradas escolas com os critérios de busca atuais.
                Tente ajustar os filtros ou cadastre uma nova escola.
              </p>
              <Button className="gap-1" asChild>
                <Link to="/schools/new">
                  <Plus size={16} />
                  Nova Escola
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredSchools.length} de {schools?.length || 0} escolas
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-auto p-4 justify-start flex flex-col items-start w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Importar Dados</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Importe escolas através de planilha Excel ou CSV
                </p>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Importar Escolas</SheetTitle>
                <SheetDescription>
                  Esta funcionalidade será implementada em breve.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <p>Módulo de importação em desenvolvimento.</p>
              </div>
            </SheetContent>
          </Sheet>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4 justify-start flex flex-col items-start w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Busca Avançada</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Busque escolas com filtros avançados
                </p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Busca Avançada</DialogTitle>
                <DialogDescription>
                  Esta funcionalidade será implementada em breve.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          <Link to="/schools/students/import">
            <Button variant="outline" className="h-auto p-4 justify-start flex flex-col items-start w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <FileDown className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Exportar Relatório</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Gere relatórios detalhados das escolas
              </p>
            </Button>
          </Link>
          
          <Link to="/schools/map">
            <Button variant="outline" className="h-auto p-4 justify-start flex flex-col items-start w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Ver no Mapa</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Visualize a distribuição geográfica das escolas
              </p>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
