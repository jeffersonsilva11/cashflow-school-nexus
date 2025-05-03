
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSchools } from "@/services/schoolService";
import { 
  ArrowUpDown, Search, MoreHorizontal, Filter, Plus, 
  Map, Download, Upload, Mail
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SchoolsTable } from "@/components/dashboard/SchoolsTable";

export default function Schools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data: schools = [], isLoading } = useSchools();

  // Filter schools based on status and search query
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? (school.active ? 'active' : 'inactive') === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground">
            Gerencie as escolas cadastradas no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/schools/students-import">
              <Upload className="mr-2 h-4 w-4" />
              Importar Alunos
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/schools/map">
              <Map className="mr-2 h-4 w-4" />
              Ver Mapa
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/schools/invites">
              <Mail className="mr-2 h-4 w-4" />
              Convites
            </Link>
          </Button>
          <Button asChild>
            <Link to="/schools/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar escolas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Ativos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inativos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <DateRangePicker />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <SchoolsTable schools={filteredSchools} title="Escolas" description="Lista de todas as escolas cadastradas" />
      )}

      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>
    </div>
  );
}
