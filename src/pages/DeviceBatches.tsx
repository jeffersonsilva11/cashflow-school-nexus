
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Package, FileDown, FileUp, Filter, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DeviceBatches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewBatchDialog, setOpenNewBatchDialog] = useState(false);
  
  // Dados mockados para lotes de dispositivos
  const batches = [
    { 
      id: 'LOT-2023-05A', 
      name: 'Lote Maio 2023 - Cartões', 
      type: 'Cartão', 
      quantity: 1500, 
      available: 342, 
      allocated: 1158, 
      status: 'active',
      created: '2023-05-10',
      supplier: 'TechCards Inc.'
    },
    { 
      id: 'LOT-2023-06B', 
      name: 'Lote Junho 2023 - Pulseiras', 
      type: 'Pulseira', 
      quantity: 2000, 
      available: 230, 
      allocated: 1770, 
      status: 'active',
      created: '2023-06-15',
      supplier: 'WristTech Solutions'
    },
    { 
      id: 'LOT-2023-08C', 
      name: 'Lote Agosto 2023 - Cartões Premium', 
      type: 'Cartão Premium', 
      quantity: 1200, 
      available: 120, 
      allocated: 1080, 
      status: 'active',
      created: '2023-08-22',
      supplier: 'TechCards Inc.'
    },
    { 
      id: 'LOT-2023-10D', 
      name: 'Lote Outubro 2023 - Pulseiras', 
      type: 'Pulseira', 
      quantity: 1800, 
      available: 580, 
      allocated: 1220, 
      status: 'active',
      created: '2023-10-05',
      supplier: 'WristTech Solutions'
    },
    { 
      id: 'LOT-2023-11E', 
      name: 'Lote Novembro 2023 - Cartões', 
      type: 'Cartão', 
      quantity: 2500, 
      available: 1200, 
      allocated: 1300, 
      status: 'active',
      created: '2023-11-18',
      supplier: 'TechCards Inc.'
    },
    { 
      id: 'LOT-2024-01F', 
      name: 'Lote Janeiro 2024 - Cartões', 
      type: 'Cartão', 
      quantity: 3000, 
      available: 2450, 
      allocated: 550, 
      status: 'active',
      created: '2024-01-22',
      supplier: 'TechCards Inc.'
    },
    { 
      id: 'LOT-2024-03G', 
      name: 'Lote Março 2024 - Pulseiras Premium', 
      type: 'Pulseira Premium', 
      quantity: 1000, 
      available: 1000, 
      allocated: 0, 
      status: 'pending',
      created: '2024-03-15',
      supplier: 'WristTech Solutions'
    }
  ];
  
  // Filtro baseado na busca
  const filteredBatches = batches.filter(batch => 
    batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">Lotes de Dispositivos</h1>
          </div>
          <p className="text-muted-foreground">Gerencie os lotes de cartões e pulseiras cadastrados no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <FileDown size={16} />
            Exportar
          </Button>
          <Button variant="outline" className="gap-1">
            <FileUp size={16} />
            Importar CSV
          </Button>
          <Button className="gap-1" onClick={() => setOpenNewBatchDialog(true)}>
            <Plus size={16} />
            Novo Lote
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Lotes</CardTitle>
          <CardDescription>Visualize e gerencie todos os lotes de dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative">
                <Input 
                  className="pl-9 w-72" 
                  placeholder="Buscar lotes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Filter size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: <strong>{batches.length}</strong> lotes
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome do Lote</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Disponíveis</TableHead>
                  <TableHead>Alocados</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map(batch => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.id}</TableCell>
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{batch.type}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{batch.available}</TableCell>
                    <TableCell>{batch.allocated}</TableCell>
                    <TableCell><StatusBadge status={batch.status} /></TableCell>
                    <TableCell>{new Date(batch.created).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{batch.supplier}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredBatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                      Nenhum lote encontrado com os critérios de busca
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredBatches.length} de {batches.length} lotes
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Novo Lote */}
      <Dialog open={openNewBatchDialog} onOpenChange={setOpenNewBatchDialog}>
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
                  <option value="premium-card">Cartão Premium</option>
                  <option value="wristband">Pulseira</option>
                  <option value="premium-wristband">Pulseira Premium</option>
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
              <label htmlFor="batch-date" className="text-sm font-medium">Data de Recebimento</label>
              <Input id="batch-date" type="date" />
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
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Método de Cadastro dos Dispositivos</label>
              <div className="flex items-center space-x-2">
                <input type="radio" id="register-later" name="register-method" className="h-4 w-4" />
                <label htmlFor="register-later" className="text-sm">Cadastrar dispositivos depois</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="register-now" name="register-method" className="h-4 w-4" />
                <label htmlFor="register-now" className="text-sm">Iniciar cadastro de dispositivos após salvar</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="register-import" name="register-method" className="h-4 w-4" />
                <label htmlFor="register-import" className="text-sm">Importar dispositivos de CSV</label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewBatchDialog(false)}>Cancelar</Button>
            <Button>Cadastrar Lote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
