
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileSpreadsheet, 
  Filter,
  User,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { useToast } from '@/hooks/use-toast';

// Dados simulados para relatório de alunos
const studentsMockData = [
  {
    id: 'STD00498',
    name: 'Maria Silva',
    grade: '9º Ano B',
    school: 'Colégio São Paulo',
    registrationDate: '15/03/2023',
    accessCount: 189,
    deviceStatus: 'active',
    averageSpending: 230.45,
  },
  {
    id: 'STD00512',
    name: 'João Oliveira',
    grade: '7º Ano A',
    school: 'Colégio São Paulo',
    registrationDate: '02/02/2023',
    accessCount: 145,
    deviceStatus: 'active',
    averageSpending: 180.20,
  },
  {
    id: 'STD00523',
    name: 'Pedro Santos',
    grade: '5º Ano C',
    school: 'Escola Maria Eduarda',
    registrationDate: '10/04/2023',
    accessCount: 67,
    deviceStatus: 'inactive',
    averageSpending: 90.75,
  },
  {
    id: 'STD00531',
    name: 'Ana Costa',
    grade: '3º Ano D',
    school: 'Escola Maria Eduarda',
    registrationDate: '05/03/2023',
    accessCount: 58,
    deviceStatus: 'pending',
    averageSpending: 65.30,
  },
  {
    id: 'STD00547',
    name: 'Lucas Santos',
    grade: '8º Ano B',
    school: 'Colégio São Pedro',
    registrationDate: '22/02/2023',
    accessCount: 201,
    deviceStatus: 'active',
    averageSpending: 245.80,
  }
];

export default function StudentsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Filtrar estudantes com base nos critérios
  const filteredStudents = studentsMockData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = selectedSchool === 'all' || student.school.includes(selectedSchool);
    const matchesGrade = selectedGrade === 'all' || student.grade.includes(selectedGrade);
    return matchesSearch && matchesSchool && matchesGrade;
  });

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados dos alunos estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Alunos</h1>
          <p className="text-muted-foreground">Análise detalhada do desempenho e comportamento dos alunos</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{studentsMockData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de Alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground mt-1">Taxa de Ativação</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">R$ 162,50</div>
            <p className="text-xs text-muted-foreground mt-1">Gasto Médio Mensal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Análise</CardTitle>
          <CardDescription>Selecione os parâmetros para analisar os dados dos alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="listing">
            <TabsList className="mb-4">
              <TabsTrigger value="listing" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Listagem
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Frequência
              </TabsTrigger>
              <TabsTrigger value="spending" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Desempenho
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="listing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="search" className="mb-2 block">Buscar aluno</Label>
                  <Input 
                    id="search" 
                    placeholder="Nome ou ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="school" className="mb-2 block">Escola</Label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger id="school">
                      <SelectValue placeholder="Selecionar escola" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as escolas</SelectItem>
                      <SelectItem value="Colégio São Paulo">Colégio São Paulo</SelectItem>
                      <SelectItem value="Escola Maria Eduarda">Escola Maria Eduarda</SelectItem>
                      <SelectItem value="Colégio São Pedro">Colégio São Pedro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grade" className="mb-2 block">Série</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Selecionar série" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as séries</SelectItem>
                      <SelectItem value="3º Ano">3º Ano</SelectItem>
                      <SelectItem value="5º Ano">5º Ano</SelectItem>
                      <SelectItem value="7º Ano">7º Ano</SelectItem>
                      <SelectItem value="8º Ano">8º Ano</SelectItem>
                      <SelectItem value="9º Ano">9º Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Acessos</TableHead>
                    <TableHead>Status Disp.</TableHead>
                    <TableHead className="text-right">Gasto Médio (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.school}</TableCell>
                        <TableCell>{student.registrationDate}</TableCell>
                        <TableCell>{student.accessCount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={student.deviceStatus === 'active' ? 'default' : 
                                    student.deviceStatus === 'pending' ? 'outline' : 'secondary'}
                          >
                            {student.deviceStatus === 'active' ? 'Ativo' : 
                             student.deviceStatus === 'pending' ? 'Pendente' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {student.averageSpending.toFixed(2).replace('.', ',')}
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
            </TabsContent>
            
            <TabsContent value="attendance">
              <div className="py-8 flex justify-center items-center">
                <p className="text-muted-foreground">
                  Os dados de frequência serão implementados em breve.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="spending">
              <div className="py-8 flex justify-center items-center">
                <p className="text-muted-foreground">
                  Os dados de desempenho serão implementados em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExportData}
      />
    </div>
  );
}
