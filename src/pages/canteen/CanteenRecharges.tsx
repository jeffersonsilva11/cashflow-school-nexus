
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Search, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '@/services/studentService';
import { fetchStudentBalance } from '@/services/studentBalanceService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function CanteenRecharges() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchStudents(),
  });
  
  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/canteen')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Recargas</h1>
          <p className="text-muted-foreground">Gerenciamento de saldo de estudantes</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recargas de Estudantes</CardTitle>
            <CardDescription>Visualize e adicione saldo para os estudantes</CardDescription>
          </div>
          <Button onClick={() => navigate('/canteen/recharges/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Recarga
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do estudante ou escola..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loadingStudents ? (
            <div className="h-64 w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Carregando estudantes...</p>
            </div>
          ) : !filteredStudents?.length ? (
            <div className="h-64 w-full border rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-muted-foreground mb-4">Nenhum estudante encontrado</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead>Série/Turma</TableHead>
                    <TableHead className="text-right">Saldo Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <StudentBalanceRow key={student.id} studentId={student.id} student={student} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StudentBalanceRowProps {
  studentId: string;
  student: any;
}

function StudentBalanceRow({ studentId, student }: StudentBalanceRowProps) {
  const navigate = useNavigate();
  
  // Fetch balance for student
  const { data: balance, isLoading } = useQuery({
    queryKey: ['student-balance', studentId],
    queryFn: () => fetchStudentBalance(studentId),
  });

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };
  
  const getBalanceStatus = (balance?: number) => {
    if (balance === undefined) return null;
    
    if (balance <= 0) {
      return <Badge variant="destructive">Sem saldo</Badge>;
    } else if (balance < 10) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Saldo baixo</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Saldo ok</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>{student.school?.name || '-'}</TableCell>
      <TableCell>{student.grade || '-'}</TableCell>
      <TableCell className="text-right">
        {isLoading ? (
          <div className="h-4 w-20 bg-muted/30 animate-pulse rounded float-right"></div>
        ) : (
          formatCurrency(balance?.balance)
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <div className="h-5 w-16 bg-muted/30 animate-pulse rounded"></div>
        ) : (
          getBalanceStatus(balance?.balance)
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/canteen/recharges/${studentId}`)}
        >
          <UserCog className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
