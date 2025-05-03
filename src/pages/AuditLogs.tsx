
import React, { useState, useEffect } from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Search, Filter, Calendar, MoreHorizontal, FileDown, Eye, History } from 'lucide-react';
import { fetchAuditLogs, fetchAuditableTables, AuditLog } from '@/services/auditService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ReactJson from 'react-json-view';

export default function AuditLogs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    table: 'all',
    action: 'all',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Carregar logs e tabelas auditáveis quando a página é carregada
  useEffect(() => {
    loadAuditLogs();
    loadTables();
  }, [currentPage, filters, searchTerm]);
  
  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const result = await fetchAuditLogs(currentPage, pageSize, {
        table: filters.table === 'all' ? undefined : filters.table,
        action: filters.action === 'all' ? undefined : filters.action,
        startDate: filters.startDate,
        endDate: filters.endDate,
        searchTerm: searchTerm || undefined,
      });
      
      setLogs(result.data);
      setTotalLogs(result.count);
    } catch (error) {
      toast({
        title: "Erro ao carregar logs",
        description: "Não foi possível carregar os logs de auditoria",
        variant: "destructive",
      });
      console.error("Erro ao carregar logs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadTables = async () => {
    try {
      const tablesData = await fetchAuditableTables();
      setTables(tablesData);
    } catch (error) {
      console.error("Erro ao carregar tabelas:", error);
    }
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Resetar para a primeira página quando filtros mudam
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Resetar para a primeira página quando busca é realizada
  };
  
  const clearFilters = () => {
    setFilters({
      table: 'all',
      action: 'all',
      startDate: '',
      endDate: '',
    });
    setSearchTerm('');
    setCurrentPage(0);
  };
  
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'INSERT':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Inserção</Badge>;
      case 'UPDATE':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Atualização</Badge>;
      case 'DELETE':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Exclusão</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };
  
  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
  };
  
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm:ss", { locale: pt });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage * pageSize < totalLogs) {
      setCurrentPage(newPage);
    }
  };

  // Verifica se o usuário é admin para permitir visualizar a página
  if (user?.role !== 'admin' && user?.role !== 'school_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <History className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-center text-muted-foreground">
          Você não tem permissão para acessar os logs de auditoria.
          <br />
          Esta funcionalidade é restrita a administradores.
        </p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
          <p className="text-muted-foreground">Registros de todas as alterações realizadas no sistema.</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
          <CardDescription>
            Encontre os registros de auditoria por data, tabela ou ação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar nos logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button type="submit">Buscar</Button>
              
              {(filters.table !== 'all' || 
                filters.action !== 'all' || 
                filters.startDate || 
                filters.endDate) && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tabela</label>
                  <Select
                    value={filters.table}
                    onValueChange={(value) => handleFilterChange('table', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por tabela" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as tabelas</SelectItem>
                      {tables.map(table => (
                        <SelectItem key={table} value={table}>{table}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ação</label>
                  <Select
                    value={filters.action}
                    onValueChange={(value) => handleFilterChange('action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as ações</SelectItem>
                      <SelectItem value="INSERT">Inserção</SelectItem>
                      <SelectItem value="UPDATE">Atualização</SelectItem>
                      <SelectItem value="DELETE">Exclusão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Inicial</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Final</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>ID do Registro</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Carregando logs de auditoria...</div>
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/40">
                    <TableCell className="whitespace-nowrap">{formatDate(log.changed_at)}</TableCell>
                    <TableCell className="font-medium">{log.table_name}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="font-mono text-xs">{log.record_id?.substring(0, 8) || '-'}</TableCell>
                    <TableCell>{log.user?.name || 'Sistema'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => viewLogDetails(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Log</DialogTitle>
                            <DialogDescription>
                              Registro de auditoria completo
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedLog && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Data e Hora</h4>
                                  <p className="text-sm">{formatDate(selectedLog.changed_at)}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Tabela</h4>
                                  <p className="text-sm">{selectedLog.table_name}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Ação</h4>
                                  <div>{getActionBadge(selectedLog.action)}</div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">ID do Registro</h4>
                                  <p className="text-sm font-mono">{selectedLog.record_id || '-'}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Usuário</h4>
                                  <p className="text-sm">{selectedLog.user?.name || 'Sistema'}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Email</h4>
                                  <p className="text-sm">{selectedLog.user?.email || '-'}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">IP</h4>
                                  <p className="text-sm font-mono">{selectedLog.ip_address || '-'}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {selectedLog.old_data && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Dados Anteriores</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                      <ReactJson 
                                        src={selectedLog.old_data} 
                                        theme="rjv-default" 
                                        name={false} 
                                        displayDataTypes={false}
                                        collapsed={2}
                                        enableClipboard={true}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {selectedLog.new_data && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Dados Novos</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                      <ReactJson 
                                        src={selectedLog.new_data} 
                                        theme="rjv-default" 
                                        name={false} 
                                        displayDataTypes={false}
                                        collapsed={2}
                                        enableClipboard={true}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum log de auditoria encontrado.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {logs.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, totalLogs)} de {totalLogs} registros
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={(currentPage + 1) * pageSize >= totalLogs}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
