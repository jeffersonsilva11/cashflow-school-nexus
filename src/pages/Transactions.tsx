
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/services/transactionService";
import { CalendarIcon, FilterIcon, SearchIcon, XCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

export default function Transactions() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [vendorType, setVendorType] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  // Apply filters
  const { data: transactionsData, isLoading, isError } = useTransactions(
    currentPage,
    pageSize,
    {
      searchTerm,
      type: transactionType !== 'all' ? transactionType : undefined,
      vendorType: vendorType !== 'all' ? vendorType : undefined,
      startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    }
  );

  const transactions = transactionsData?.data || [];
  const totalCount = transactionsData?.count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  // Format transaction type for display
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'Compra';
      case 'topup':
        return 'Recarga';
      case 'refund':
        return 'Estorno';
      default:
        return type;
    }
  };

  // Format vendor type for display
  const formatVendorType = (type: string) => {
    switch (type) {
      case 'own':
        return 'Próprio';
      case 'third_party':
        return 'Terceirizado';
      default:
        return type;
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'refunded':
        return <Badge variant="warning">Estornado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setTransactionType('all');
    setVendorType('all');
    setDateRange({ from: undefined, to: undefined });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Logic for showing ellipsis in pagination
    if (pageCount <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 0; i < pageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={0}>
          <PaginationLink
            isActive={currentPage === 0}
            onClick={() => handlePageChange(0)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(pageCount - 2, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < pageCount - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (pageCount > 1) {
        items.push(
          <PaginationItem key={pageCount - 1}>
            <PaginationLink
              isActive={currentPage === pageCount - 1}
              onClick={() => handlePageChange(pageCount - 1)}
            >
              {pageCount}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as transações do sistema
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Transações de compras, recargas e estornos realizadas na plataforma.
          </CardDescription>
          
          <div className="flex flex-col md:flex-row items-end gap-4 mt-4">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Buscar</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por aluno, transação..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo de Transação</label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="purchase">Compra</SelectItem>
                    <SelectItem value="topup">Recarga</SelectItem>
                    <SelectItem value="refund">Estorno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo de Estabelecimento</label>
                <Select value={vendorType} onValueChange={setVendorType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estabelecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="own">Próprio</SelectItem>
                    <SelectItem value="third_party">Terceirizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[230px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'P', { locale: ptBR })} -{' '}
                            {format(dateRange.to, 'P', { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, 'P', { locale: ptBR })
                        )
                      ) : (
                        <span>Selecionar período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              <p>Erro ao carregar as transações. Tente novamente mais tarde.</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Estabelecimento</TableHead>
                      <TableHead>Escola</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDateTime(transaction.transaction_date)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {transaction.transaction_id}
                        </TableCell>
                        <TableCell>{transaction.student?.name || '—'}</TableCell>
                        <TableCell>
                          {transaction.vendor?.name || '—'}
                          {transaction.vendor?.type && (
                            <span className="text-xs text-muted-foreground block">
                              {formatVendorType(transaction.vendor.type)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{transaction.student?.school?.name || '—'}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatTransactionType(transaction.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < pageCount - 1 && handlePageChange(currentPage + 1)}
                        className={currentPage >= pageCount - 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Exibindo {transactions.length} de {totalCount} transações
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
