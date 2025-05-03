
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Plus, 
  FileSpreadsheet, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useStudents, useDeleteStudent } from '@/services/studentService';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: students, isLoading, error } = useStudents();
  const deleteStudentMutation = useDeleteStudent();
  
  // Filtrar alunos com base no termo de busca
  const filteredStudents = students?.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Estatísticas
  const totalStudents = students?.length || 0;
  const monthlyRegistrations = Math.floor(totalStudents * 0.4); // Simulação para exemplo
  const activeStudents = students?.filter(student => student.active)?.length || 0;
  const activationRate = totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0;
  
  // Funções de ações
  const handleViewStudent = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };
  
  const handleEditStudent = (studentId: string) => {
    navigate(`/students/${studentId}/edit`);
  };
  
  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      deleteStudentMutation.mutate(studentId);
    }
  };
  
  const handleNewStudent = () => {
    navigate('/students/new');
  };
  
  const handleViewDevice = (studentId: string) => {
    navigate(`/students/${studentId}/device`);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Carregando dados dos alunos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-lg text-red-500 mb-4">Erro ao carregar dados dos alunos</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie os cadastros de alunos do sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-1" onClick={handleNewStudent}>
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Matrículas no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyRegistrations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Ativação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activationRate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm font-medium mb-2 block">
              Buscar aluno
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome, matrícula ou escola..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Button variant="outline" className="w-full gap-1">
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                          {student.photo_url ? (
                            <img 
                              src={student.photo_url} 
                              alt={student.name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                              {student.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                          )}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.grade || 'N/A'}</TableCell>
                    <TableCell>{student.school?.name || 'N/A'}</TableCell>
                    <TableCell>{student.document_id || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={student.active ? 'default' : 'secondary'}
                      >
                        {student.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewStudent(student.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditStudent(student.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
