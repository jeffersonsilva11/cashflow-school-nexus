
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabletIcon, Search, CheckCircle, XCircle, Settings } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTablets } from '@/services/tabletService';

export const TabletsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tablets = [], isLoading } = useTablets();
  
  const filteredTablets = tablets.filter(
    tablet => 
      tablet.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tablet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tablet.model && tablet.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tablet.school && tablet.school.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Função para obter cor de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Inativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Aguardando Ativação</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getConnectionBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Offline</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  // Função para formatar data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Nunca ativado';
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Função para renderizar indicador de bateria
  const renderBatteryLevel = (level: number | undefined, status: string) => {
    if (status === 'pending' || level === undefined) return '-';
    if (status === 'offline' && level <= 5) return '0%';
    
    let color = 'text-green-600';
    if (level < 20) color = 'text-red-600';
    else if (level < 50) color = 'text-amber-600';
    
    return <span className={color}>{level}%</span>;
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TabletIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Lista de Tablets</h3>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tablets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Conexão</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Bateria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                      <span className="text-muted-foreground">Carregando tablets...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTablets.length > 0 ? (
                filteredTablets.map((tablet) => (
                  <TableRow key={tablet.id}>
                    <TableCell className="font-medium">{tablet.serial_number}</TableCell>
                    <TableCell>{tablet.model || 'N/A'}</TableCell>
                    <TableCell>{tablet.school?.name || 'Não alocado'}</TableCell>
                    <TableCell>{getStatusBadge(tablet.status)}</TableCell>
                    <TableCell>{getConnectionBadge(tablet.connection_status)}</TableCell>
                    <TableCell>{formatDate(tablet.last_sync_at)}</TableCell>
                    <TableCell>{renderBatteryLevel(tablet.battery_level, tablet.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                              Detalhes
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                              Editar
                            </Button>
                          </DropdownMenuItem>
                          {tablet.status === 'pending' ? (
                            <DropdownMenuItem>
                              <Button variant="ghost" size="sm" className="w-full justify-start p-0 text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Ativar
                              </Button>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Button variant="ghost" size="sm" className="w-full justify-start p-0 text-amber-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Desativar
                              </Button>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {searchQuery ? (
                      <span className="text-muted-foreground">Nenhum tablet encontrado com a busca "{searchQuery}".</span>
                    ) : (
                      <span className="text-muted-foreground">Nenhum tablet cadastrado.</span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
