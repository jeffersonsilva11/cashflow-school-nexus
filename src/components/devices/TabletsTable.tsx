
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

interface TabletData {
  id: string;
  name: string;
  serialNumber: string;
  school: string;
  status: 'online' | 'offline' | 'pending';
  lastActive: string;
  batteryLevel: number;
}

export const TabletsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dados mockados de tablets
  const tablets: TabletData[] = [
    { id: 'TB001', name: 'Tablet Recepção', serialNumber: 'SN78945612', school: 'Escola São Paulo', status: 'online', lastActive: '2023-06-01T15:30:00Z', batteryLevel: 78 },
    { id: 'TB002', name: 'Tablet Cantina', serialNumber: 'SN78945613', school: 'Escola São Paulo', status: 'online', lastActive: '2023-06-01T15:20:00Z', batteryLevel: 32 },
    { id: 'TB003', name: 'Tablet Secretaria', serialNumber: 'SN78945614', school: 'Escola Rio de Janeiro', status: 'online', lastActive: '2023-06-01T15:10:00Z', batteryLevel: 91 },
    { id: 'TB004', name: 'Tablet Biblioteca', serialNumber: 'SN78945615', school: 'Escola Belo Horizonte', status: 'offline', lastActive: '2023-06-01T10:30:00Z', batteryLevel: 0 },
    { id: 'TB005', name: 'Tablet Pátio', serialNumber: 'SN78945616', school: 'Escola Salvador', status: 'offline', lastActive: '2023-06-01T12:45:00Z', batteryLevel: 5 },
    { id: 'TB006', name: 'Tablet Entrada', serialNumber: 'SN78945617', school: 'Escola Salvador', status: 'pending', lastActive: '', batteryLevel: 0 },
  ];
  
  const filteredTablets = tablets.filter(
    tablet => 
      tablet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tablet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tablet.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tablet.school.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Função para obter cor de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Offline</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Aguardando Ativação</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca ativado';
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Função para renderizar indicador de bateria
  const renderBatteryLevel = (level: number, status: string) => {
    if (status === 'pending') return '-';
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
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Nº de Série</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Bateria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTablets.length > 0 ? (
                filteredTablets.map((tablet) => (
                  <TableRow key={tablet.id}>
                    <TableCell className="font-medium">{tablet.id}</TableCell>
                    <TableCell>{tablet.name}</TableCell>
                    <TableCell>{tablet.serialNumber}</TableCell>
                    <TableCell>{tablet.school}</TableCell>
                    <TableCell>{getStatusBadge(tablet.status)}</TableCell>
                    <TableCell>{formatDate(tablet.lastActive)}</TableCell>
                    <TableCell>{renderBatteryLevel(tablet.batteryLevel, tablet.status)}</TableCell>
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
                    Nenhum tablet encontrado.
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
