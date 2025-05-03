
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
import { Search, MoreHorizontal, FileDown, Calendar } from 'lucide-react';
import { recentTransactions } from '@/services/mockData';
import { formatCurrency } from '@/lib/format';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVendorType, setSelectedVendorType] = useState('all');

  // Generate more transactions for display purposes
  const expandedTransactions = [
    ...recentTransactions,
    ...recentTransactions.map(t => ({...t, id: `T${parseInt(t.id.substring(1)) + 100}`})),
    ...recentTransactions.map(t => ({...t, id: `T${parseInt(t.id.substring(1)) + 200}`})),
  ];
  
  // Adicionar informações de terceirização a algumas transações para exemplo
  const transactionsWithVendorInfo = expandedTransactions.map((t, index) => {
    // Alterna entre própria e terceirizada
    const isThirdParty = index % 4 === 0 || index % 5 === 0;
    return {
      ...t,
      vendorType: isThirdParty ? 'third_party' : 'own',
      vendorName: isThirdParty 
        ? ['Cantina do João', 'Lanchonete Maria', 'Delícias Gourmet'][index % 3] 
        : 'Cantina Escolar',
    };
  });
  
  const filteredTransactions = transactionsWithVendorInfo.filter(transaction => {
    const matchesSearch = transaction.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      transaction.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (transaction.vendorName && transaction.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    const matchesVendorType = selectedVendorType === 'all' || transaction.vendorType === selectedVendorType;
    
    return matchesSearch && matchesType && matchesVendorType;
  });
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Compra</Badge>;
      case 'reload':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Recarga</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getVendorBadge = (vendorType: string) => {
    switch (vendorType) {
      case 'third_party':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Terceirizado</Badge>;
      case 'own':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Próprio</Badge>;
      default:
        return null;
    }
  };
  
  // Format date to display as readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">Visualize e gerencie todas as transações do sistema.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar size={16} />
          Hoje
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stats-card">
          <p className="stats-label">Total de Transações (Hoje)</p>
          <p className="stats-value">1,458</p>
          <p className="stats-change stats-change-positive">
            <span>↑ 12.5% desde ontem</span>
          </p>
        </div>
        
        <div className="stats-card">
          <p className="stats-label">Volume Financeiro (Hoje)</p>
          <p className="stats-value">{formatCurrency(18452.75)}</p>
          <p className="stats-change stats-change-positive">
            <span>↑ 8.3% desde ontem</span>
          </p>
        </div>
        
        <div className="stats-card">
          <p className="stats-label">Ticket Médio</p>
          <p className="stats-value">{formatCurrency(12.65)}</p>
          <p className="stats-change stats-change-negative">
            <span>↓ 2.1% desde ontem</span>
          </p>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar transações..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="purchase">Compra</SelectItem>
                <SelectItem value="reload">Recarga</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={selectedVendorType}
              onValueChange={setSelectedVendorType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Cantina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cantinas</SelectItem>
                <SelectItem value="own">Cantinas próprias</SelectItem>
                <SelectItem value="third_party">Cantinas terceirizadas</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <FileDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Estabelecimento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.student}</TableCell>
                  <TableCell>{transaction.school}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.vendorName}
                      {getVendorBadge(transaction.vendorType)}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
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
                        <DropdownMenuItem>Imprimir comprovante</DropdownMenuItem>
                        {transaction.type === 'purchase' && (
                          <DropdownMenuItem className="text-red-500">
                            Estornar
                          </DropdownMenuItem>
                        )}
                        {transaction.vendorType === 'third_party' && (
                          <DropdownMenuItem>
                            Detalhes do estabelecimento
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredTransactions.length} de {transactionsWithVendorInfo.length} transações
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
    </div>
  );
};
