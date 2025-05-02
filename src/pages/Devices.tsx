
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CreditCard, Wifi, Plus, Server, Package, School, Users } from 'lucide-react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { DeviceStatusChart } from '@/components/devices/DeviceStatusChart';
import { DeviceAllocationChart } from '@/components/devices/DeviceAllocationChart';
import { DeviceBatchCard } from '@/components/devices/DeviceBatchCard';

export default function Devices() {
  const [activeTab, setActiveTab] = useState("cards");
  const [openLotDialog, setOpenLotDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dados mockados para cartões/pulseiras
  const cardStats = {
    total: 12458,
    active: 10874,
    inactive: 620,
    pending: 458,
    transit: 506
  };
  
  // Dados mockados para maquininhas
  const terminalStats = {
    total: 245,
    online: 235,
    offline: 10
  };
  
  // Dados mockados para lotes recentes
  const recentBatches = [
    { id: 'LOT-2023-05A', name: 'Lote Maio 2023 - Cartões', type: 'card', quantity: 1500, available: 342, allocated: 1158, date: '2023-05-10' },
    { id: 'LOT-2023-06B', name: 'Lote Junho 2023 - Pulseiras', type: 'wristband', quantity: 2000, available: 230, allocated: 1770, date: '2023-06-15' },
    { id: 'LOT-2023-08C', name: 'Lote Agosto 2023 - Cartões Premium', type: 'card', quantity: 1200, available: 120, allocated: 1080, date: '2023-08-22' }
  ];
  
  // Dados mockados para dispositivos não alocados
  const unallocatedDevices = [
    { serial: 'CARD-2023-8742', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
    { serial: 'WBAND-2023-3641', type: 'Pulseira', status: 'pending', batch: 'LOT-2023-06B' },
    { serial: 'CARD-2023-9134', type: 'Cartão Premium', status: 'active', batch: 'LOT-2023-08C' },
    { serial: 'WBAND-2023-5192', type: 'Pulseira', status: 'inactive', batch: 'LOT-2023-06B' },
    { serial: 'CARD-2023-6723', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  ];
  
  // Função para filtrar dispositivos com base na busca
  const filteredDevices = unallocatedDevices.filter(device => 
    device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
          <p className="text-muted-foreground">Gerencie cartões, pulseiras e maquininhas do sistema.</p>
        </div>
      </div>
      
      <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Cartões/Pulseiras</span>
          </TabsTrigger>
          <TabsTrigger value="terminals" className="flex items-center gap-2">
            <Server size={16} />
            <span>Maquininhas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total de Dispositivos</CardTitle>
                <CardDescription>Cartões e pulseiras emitidos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{cardStats.total.toLocaleString()}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {((cardStats.active / cardStats.total) * 100).toFixed(1)}% ativos
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Ativos</CardTitle>
                <CardDescription>Vinculados a estudantes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{cardStats.active.toLocaleString()}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {cardStats.inactive} inativos, {cardStats.pending} pendentes
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Em Trânsito</CardTitle>
                <CardDescription>Em processo de entrega</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{cardStats.transit}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  5 escolas aguardando entrega
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Status dos Dispositivos</CardTitle>
                    <CardDescription>Distribuição por status atual</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <DeviceStatusChart data={{
                  active: cardStats.active,
                  inactive: cardStats.inactive,
                  pending: cardStats.pending,
                  transit: cardStats.transit
                }} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Alocação por Escola</CardTitle>
                    <CardDescription>Top 5 escolas com mais dispositivos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <DeviceAllocationChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Lotes Recentes</CardTitle>
                    <CardDescription>Últimos lotes de dispositivos cadastrados</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setOpenLotDialog(true)} className="gap-1">
                      <Plus size={16} />
                      Novo Lote
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {recentBatches.map(batch => (
                    <DeviceBatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/device-batches">Ver todos os lotes</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Dispositivos Disponíveis</CardTitle>
                    <CardDescription>Dispositivos não alocados a estudantes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-1">
                      <Package size={16} />
                      Cadastrar Individual
                    </Button>
                    <Button variant="outline" className="gap-1">
                      <School size={16} />
                      Alocar para Escola
                    </Button>
                    <Button variant="outline" className="gap-1">
                      <Users size={16} />
                      Vincular a Alunos
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Buscar por número de série, tipo ou lote..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número de Série</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.length > 0 ? (
                        filteredDevices.map(device => (
                          <TableRow key={device.serial}>
                            <TableCell className="font-medium">{device.serial}</TableCell>
                            <TableCell>{device.type}</TableCell>
                            <TableCell><StatusBadge status={device.status} /></TableCell>
                            <TableCell>{device.batch}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/devices/${device.serial}`}>Detalhes</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            Nenhum dispositivo encontrado com os critérios de busca
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="terminals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total de Maquininhas</CardTitle>
                <CardDescription>Dispositivos instalados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{terminalStats.total}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Em 23 escolas
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Online</CardTitle>
                <CardDescription>Conectados ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{terminalStats.online}</p>
                  <span className="rounded-full bg-green-500 h-3 w-3 animate-pulse"></span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {((terminalStats.online / terminalStats.total) * 100).toFixed(1)}% de disponibilidade
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Offline</CardTitle>
                <CardDescription>Desconectados do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{terminalStats.offline}</p>
                  <span className="rounded-full bg-red-500 h-3 w-3"></span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {((terminalStats.offline / terminalStats.total) * 100).toFixed(1)}% requerendo atenção
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Monitoramento de Maquininhas</CardTitle>
                  <CardDescription>Acompanhe o status dos terminais em tempo real</CardDescription>
                </div>
                <Button className="gap-1">
                  <Plus size={16} />
                  Novo Terminal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                <Wifi className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-muted-foreground max-w-md">
                  O módulo completo de monitoramento de terminais está sendo implementado. 
                  Em breve você poderá acompanhar o status de todas as maquininhas do sistema por aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Novo Lote */}
      <Dialog open={openLotDialog} onOpenChange={setOpenLotDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Lote de Dispositivos</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo lote de cartões ou pulseiras.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="batch-name" className="text-sm font-medium">Nome do Lote</label>
              <Input id="batch-name" placeholder="Ex: Lote Junho 2023 - Cartões" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="batch-type" className="text-sm font-medium">Tipo de Dispositivo</label>
                <select id="batch-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Selecione...</option>
                  <option value="card">Cartão</option>
                  <option value="wristband">Pulseira</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="batch-quantity" className="text-sm font-medium">Quantidade</label>
                <Input id="batch-quantity" type="number" min="1" placeholder="Ex: 500" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="batch-supplier" className="text-sm font-medium">Fornecedor</label>
              <Input id="batch-supplier" placeholder="Nome do fornecedor" />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="batch-notes" className="text-sm font-medium">Observações</label>
              <textarea 
                id="batch-notes" 
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Informações adicionais sobre este lote"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLotDialog(false)}>Cancelar</Button>
            <Button onClick={() => {
              setOpenLotDialog(false);
              // Redirecionaria para a página de detalhes do lote recém-criado
            }}>Cadastrar Lote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
