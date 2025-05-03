
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wifi, WifiOff, RefreshCw, Search, Signal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateBR } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Terminal {
  id: string;
  name: string;
  location: string;
  schoolName: string;
  schoolId: string;
  status: 'online' | 'offline' | 'maintenance';
  lastConnection: string;
  ipAddress: string;
  version: string;
  batteryLevel?: number;
  signalStrength?: number;
}

export const TerminalsMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [terminals, setTerminals] = useState<Terminal[]>([
    {
      id: 'TERM001',
      name: 'Terminal Cantina',
      location: 'Cantina Principal',
      schoolName: 'Colégio São Paulo',
      schoolId: 'SCH001',
      status: 'online',
      lastConnection: '2023-05-04T08:45:23',
      ipAddress: '192.168.1.101',
      version: '2.3.0',
      signalStrength: 87
    },
    {
      id: 'TERM002',
      name: 'Terminal Entrada',
      location: 'Portaria Principal',
      schoolName: 'Colégio São Paulo',
      schoolId: 'SCH001',
      status: 'online',
      lastConnection: '2023-05-04T08:50:12',
      ipAddress: '192.168.1.102',
      version: '2.3.1',
      signalStrength: 92
    },
    {
      id: 'TERM003',
      name: 'Terminal Biblioteca',
      location: 'Biblioteca Central',
      schoolName: 'Colégio Dom Bosco',
      schoolId: 'SCH002',
      status: 'offline',
      lastConnection: '2023-05-03T14:22:45',
      ipAddress: '192.168.2.105',
      version: '2.2.8',
      signalStrength: 24
    },
    {
      id: 'TERM004',
      name: 'Terminal Secretaria',
      location: 'Secretaria Acadêmica',
      schoolName: 'Instituto Futuro',
      schoolId: 'SCH003',
      status: 'maintenance',
      lastConnection: '2023-05-02T09:15:30',
      ipAddress: '192.168.3.110',
      version: '2.2.5',
      signalStrength: 0
    },
    {
      id: 'TERM005',
      name: 'Terminal Pátio',
      location: 'Pátio Central',
      schoolName: 'Colégio Dom Bosco',
      schoolId: 'SCH002',
      status: 'online',
      lastConnection: '2023-05-04T08:42:15',
      ipAddress: '192.168.2.106',
      version: '2.3.0',
      signalStrength: 76
    }
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulação de atualização dos dados
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados de monitoramento foram atualizados com sucesso",
      });
    }, 1500);
  };
  
  const handleViewDetails = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
    setOpenDialog(true);
  };
  
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
            <span className="text-green-600 font-medium">Online</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span className="text-red-600 font-medium">Offline</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-amber-600 font-medium">Em manutenção</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
            <span className="text-gray-600 font-medium">Desconhecido</span>
          </div>
        );
    }
  };
  
  const filteredTerminals = terminals.filter(terminal => 
    terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terminal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terminal.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terminal.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSignalStrengthIndicator = (strength?: number) => {
    if (strength === undefined) return null;
    
    if (strength === 0) {
      return <WifiOff className="text-gray-400 h-5 w-5" />;
    }
    
    if (strength < 30) {
      return <Signal className="text-red-500 h-5 w-5" />;
    }
    
    if (strength < 70) {
      return <Signal className="text-amber-500 h-5 w-5" />;
    }
    
    return <Signal className="text-green-500 h-5 w-5" />;
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Monitoramento de Maquininhas</h3>
              <p className="text-sm text-muted-foreground">Acompanhe o status dos terminais em tempo real</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" className="flex gap-1 items-center">
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button className="gap-1">
                <Plus size={16} />
                Novo Terminal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, localização ou escola..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sinal</TableHead>
                  <TableHead>Última Conexão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerminals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum terminal encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTerminals.map((terminal) => (
                    <TableRow key={terminal.id}>
                      <TableCell className="font-medium">{terminal.name}</TableCell>
                      <TableCell>{terminal.location}</TableCell>
                      <TableCell>{terminal.schoolName}</TableCell>
                      <TableCell>{getStatusIndicator(terminal.status)}</TableCell>
                      <TableCell>{getSignalStrengthIndicator(terminal.signalStrength)}</TableCell>
                      <TableCell>{formatDateBR(new Date(terminal.lastConnection))}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(terminal)}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de detalhes do terminal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Terminal</DialogTitle>
            <DialogDescription>
              Informações técnicas e status de conexão do dispositivo
            </DialogDescription>
          </DialogHeader>
          
          {selectedTerminal && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ID do Terminal</span>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{selectedTerminal.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Endereço IP</span>
                <span className="font-mono text-sm">{selectedTerminal.ipAddress}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Versão de Software</span>
                <span className="text-sm">{selectedTerminal.version}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                {getStatusIndicator(selectedTerminal.status)}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Força do Sinal</span>
                <div className="flex items-center gap-2">
                  {getSignalStrengthIndicator(selectedTerminal.signalStrength)}
                  {selectedTerminal.signalStrength !== undefined && (
                    <span className="text-sm">{selectedTerminal.signalStrength}%</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Última Conexão</span>
                <span className="text-sm">{formatDateBR(new Date(selectedTerminal.lastConnection))}</span>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw size={14} />
                    Reiniciar
                  </Button>
                  <Button size="sm" variant="default" className="gap-1">
                    <Wifi size={14} />
                    Testar Conexão
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
