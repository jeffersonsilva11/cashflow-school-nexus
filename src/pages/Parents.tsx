
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserRound, 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Dados simulados de pais/responsáveis
const parentsMockData = [
  {
    id: 'PAR001',
    name: 'José Silva',
    email: 'jose.silva@exemplo.com',
    phone: '(11) 98765-4321',
    students: 2,
    status: 'active',
    lastAccess: '2025-04-30T14:35:00'
  },
  {
    id: 'PAR002',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    phone: '(11) 97654-3210',
    students: 1,
    status: 'active',
    lastAccess: '2025-05-01T08:22:00'
  },
  {
    id: 'PAR003',
    name: 'Carlos Santos',
    email: 'carlos.santos@exemplo.com',
    phone: '(11) 96543-2109',
    students: 3,
    status: 'active',
    lastAccess: '2025-04-29T16:40:00'
  },
  {
    id: 'PAR004',
    name: 'Ana Pereira',
    email: 'ana.pereira@exemplo.com',
    phone: '(11) 95432-1098',
    students: 1,
    status: 'inactive',
    lastAccess: '2025-04-15T09:12:00'
  },
  {
    id: 'PAR005',
    name: 'Roberto Costa',
    email: 'roberto.costa@exemplo.com',
    phone: '(11) 94321-0987',
    students: 2,
    status: 'pending',
    lastAccess: '2025-05-01T10:05:00'
  }
];

export default function Parents() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filtrar pais com base no termo de busca
  const filteredParents = parentsMockData.filter(parent => 
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Estatísticas
  const totalParents = parentsMockData.length;
  const monthlyRegistrations = parentsMockData.filter(
    parent => new Date(parent.lastAccess) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const activeParents = parentsMockData.filter(parent => parent.status === 'active').length;
  
  // Funções de ações
  const handleViewParent = (parentId: string) => {
    navigate(`/parents/${parentId}`);
  };
  
  const handleEditParent = (parentId: string) => {
    navigate(`/parents/${parentId}/edit`);
  };
  
  const handleDeleteParent = (parentId: string) => {
    toast({
      title: "Confirmação necessária",
      description: "Esta funcionalidade será implementada em breve.",
    });
  };
  
  const handleNewParent = () => {
    navigate('/parents/new');
  };

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
          <Button className="gap-1" onClick={handleNewParent}>
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
            <div className="text-3xl font-bold">{totalParents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cadastros no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyRegistrations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Responsáveis Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeParents}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm font-medium mb-2 block">
              Buscar responsável
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome, email ou ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Button variant="outline" className="w-full gap-1">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Responsáveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Dependentes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell className="font-medium">{parent.id}</TableCell>
                    <TableCell>{parent.name}</TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>{parent.phone}</TableCell>
                    <TableCell>{parent.students}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={parent.status === 'active' ? 'default' : 
                                parent.status === 'pending' ? 'outline' : 'secondary'}
                      >
                        {parent.status === 'active' ? 'Ativo' : 
                         parent.status === 'pending' ? 'Pendente' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(parent.lastAccess).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewParent(parent.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditParent(parent.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteParent(parent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
