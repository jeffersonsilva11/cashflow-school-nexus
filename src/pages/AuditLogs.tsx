
import React, { useState, useEffect } from 'react';
import { fetchAuditLogs, fetchAuditableTables, AuditLog } from '@/services/auditService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, FilterX } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ptBR } from 'date-fns/locale';

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({
    table: 'all',
    action: 'all',
    searchTerm: '',
  });

  // Carregar logs
  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetchAuditLogs(page, pageSize, filters);
      setLogs(response.data);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar tabelas para o filtro
  const loadTables = async () => {
    try {
      const tablesList = await fetchAuditableTables();
      setTables(tablesList);
    } catch (error) {
      console.error('Erro ao carregar tabelas:', error);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, pageSize, filters]);

  useEffect(() => {
    loadTables();
  }, []);

  const handleTableChange = (value: string) => {
    setFilters(prev => ({ ...prev, table: value }));
    setPage(0);
  };

  const handleActionChange = (value: string) => {
    setFilters(prev => ({ ...prev, action: value }));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      table: 'all',
      action: 'all',
      searchTerm: '',
    });
    setPage(0);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'INSERT':
        return <Badge className="bg-green-600">Inserção</Badge>;
      case 'UPDATE':
        return <Badge className="bg-blue-600">Atualização</Badge>;
      case 'DELETE':
        return <Badge className="bg-red-600">Exclusão</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
          <p className="text-muted-foreground">
            Visualize todas as alterações realizadas no sistema.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Alterações</CardTitle>
          <CardDescription>
            Acompanhe todas as alterações feitas nos registros do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar..."
                className="pl-10"
                value={filters.searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={filters.table}
                onValueChange={handleTableChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tabela" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tabelas</SelectItem>
                  {tables.map(table => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.action}
                onValueChange={handleActionChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  <SelectItem value="INSERT">Inserção</SelectItem>
                  <SelectItem value="UPDATE">Atualização</SelectItem>
                  <SelectItem value="DELETE">Exclusão</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleClearFilters}
                title="Limpar filtros"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {formatDate(log.changed_at)}
                          </TableCell>
                          <TableCell>{log.table_name}</TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>{log.user?.name || log.changed_by}</TableCell>
                          <TableCell>{log.ip_address}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Nenhum registro de auditoria encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Exibindo {logs.length} de {totalCount} registros
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={page >= Math.ceil(totalCount / pageSize) - 1}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
