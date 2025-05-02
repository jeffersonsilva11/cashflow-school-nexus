
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
  CreditCard
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

// Dados simulados de alunos
const studentsMockData = [
  {
    id: 'STD00498',
    name: 'Maria Silva',
    grade: '9º Ano B',
    school: 'Colégio São Paulo',
    parent: 'José Silva',
    parentId: 'PAR001',
    status: 'active',
    deviceId: 'CARD-2023-8742',
    photo: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'STD00512',
    name: 'João Oliveira',
    grade: '7º Ano A',
    school: 'Colégio São Paulo',
    parent: 'Maria Oliveira',
    parentId: 'PAR002',
    status: 'active',
    deviceId: 'CARD-2023-8743',
    photo: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'STD00523',
    name: 'Pedro Santos',
    grade: '5º Ano C',
    school: 'Escola Maria Eduarda',
    parent: 'Carlos Santos',
    parentId: 'PAR003',
    status: 'inactive',
    deviceId: 'CARD-2023-8744',
    photo: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 'STD00531',
    name: 'Ana Costa',
    grade: '3º Ano D',
    school: 'Escola Maria Eduarda',
    parent: 'Ana Pereira',
    parentId: 'PAR004',
    status: 'active',
    deviceId: null,
    photo: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'STD00547',
    name: 'Lucas Santos',
    grade: '8º Ano B',
    school: 'Colégio São Pedro',
    parent: 'Roberto Costa',
    parentId: 'PAR005',
    status: 'pending',
    deviceId: 'CARD-2023-8745',
    photo: 'https://i.pravatar.cc/150?img=6'
  }
];

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filtrar alunos com base no termo de busca
  const filteredStudents = studentsMockData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Estatísticas
  const totalStudents = studentsMockData.length;
  const monthlyRegistrations = Math.floor(totalStudents * 0.4); // Simulação para exemplo
  const activationRate = Math.round((studentsMockData.filter(student => 
    student.status === 'active').length / totalStudents) * 100);
  
  // Funções de ações
  const handleViewStudent = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };
  
  const handleEditStudent = (studentId: string) => {
    navigate(`/students/${studentId}/edit`);
  };
  
  const handleDeleteStudent = (studentId: string) => {
    toast({
      title: "Confirmação necessária",
      description: "Esta funcionalidade será implementada em breve.",
    });
  };
  
  const handleNewStudent = () => {
    navigate('/students/new');
  };
  
  const handleViewDevice = (deviceId: string | null) => {
    if (deviceId) {
      navigate(`/devices/${deviceId}`);
    } else {
      toast({
        title: "Dispositivo não encontrado",
        description: "Este aluno não possui dispositivo vinculado.",
        variant: "destructive"
      });
    }
  };

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
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={student.photo} 
                            alt={student.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-normal"
                        onClick={() => navigate(`/parents/${student.parentId}`)}
                      >
                        {student.parent}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={student.status === 'active' ? 'default' : 
                                student.status === 'pending' ? 'outline' : 'secondary'}
                      >
                        {student.status === 'active' ? 'Ativo' : 
                         student.status === 'pending' ? 'Pendente' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.deviceId ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={() => handleViewDevice(student.deviceId)}
                        >
                          <CreditCard className="h-3 w-3" />
                          {student.deviceId?.substring(0, 8)}...
                        </Button>
                      ) : (
                        <Badge variant="outline">Não vinculado</Badge>
                      )}
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
                  <TableCell colSpan={8} className="h-24 text-center">
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
