
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, UserRound, CreditCard, Link, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function StudentParentBinding() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados do aluno
  const student = {
    id: studentId || 'STD00498',
    name: 'Maria Silva',
    grade: '9º Ano B',
    school: 'Colégio São Paulo',
    schoolId: 'SCH001',
    deviceId: 'CARD-2023-8742',
    parentId: 'PAR001',
    parentName: 'José Silva',
    status: 'active',
  };

  // Responsáveis disponíveis no sistema (mock)
  const availableParents = [
    { id: 'PAR001', name: 'José Silva', email: 'jose.silva@exemplo.com', students: 2, status: 'active' },
    { id: 'PAR002', name: 'Maria Oliveira', email: 'maria.oliveira@exemplo.com', students: 1, status: 'active' },
    { id: 'PAR003', name: 'Carlos Santos', email: 'carlos.santos@exemplo.com', students: 3, status: 'active' },
    { id: 'PAR004', name: 'Ana Pereira', email: 'ana.pereira@exemplo.com', students: 1, status: 'inactive' },
    { id: 'PAR005', name: 'Roberto Costa', email: 'roberto.costa@exemplo.com', students: 2, status: 'pending' },
  ];

  // Dispositivos disponíveis para vínculo (mock)
  const availableDevices = [
    { id: 'CARD-2023-8742', type: 'card', status: 'active', assignedTo: student.name },
    { id: 'CARD-2023-8743', type: 'card', status: 'unassigned', assignedTo: null },
    { id: 'CARD-2023-8745', type: 'card', status: 'unassigned', assignedTo: null },
    { id: 'CARD-2023-8746', type: 'card', status: 'unassigned', assignedTo: null },
  ];

  // Filtrar responsáveis com base no termo de busca
  const filteredParents = availableParents.filter(parent => 
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para vincular um responsável ao aluno
  const handleBindParent = async (parentId: string) => {
    console.log(`Vinculando responsável ${parentId} ao aluno ${studentId}`);
    
    // Aqui seria a chamada à API para vincular o responsável
    // Simulando um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Responsável vinculado com sucesso",
      description: `O responsável foi vinculado ao aluno ${student.name}`,
    });
    
    // Em um sistema real, atualizaria o estado local ou redirecionaria
    navigate(`/students/${studentId}`);
  };

  // Função para vincular um dispositivo ao aluno
  const handleBindDevice = async (deviceId: string) => {
    console.log(`Vinculando dispositivo ${deviceId} ao aluno ${studentId}`);
    
    // Aqui seria a chamada à API para vincular o dispositivo
    // Simulando um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Dispositivo vinculado com sucesso",
      description: `O dispositivo ${deviceId} foi vinculado ao aluno ${student.name}`,
    });
    
    // Em um sistema real, atualizaria o estado local ou redirecionaria
    navigate(`/students/${studentId}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/students/${studentId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Vínculos</h1>
            <p className="text-muted-foreground">
              Vincule responsáveis e dispositivos ao aluno {student.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do aluno */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Informações do Aluno</CardTitle>
            </div>
            <CardDescription>
              Dados do aluno que está sendo gerenciado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-base">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="text-base">{student.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Turma</p>
                <p className="text-base">{student.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Escola</p>
                <p className="text-base">{student.school}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Vínculos Atuais</p>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Responsável:</span>
                  </div>
                  <div>
                    {student.parentId ? (
                      <Badge variant="outline" className="gap-1">
                        <Link className="h-3 w-3" />
                        {student.parentName}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não vinculado</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Dispositivo:</span>
                  </div>
                  <div>
                    {student.deviceId ? (
                      <Badge variant="outline" className="gap-1">
                        <Link className="h-3 w-3" />
                        {student.deviceId}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não vinculado</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vincular responsável */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Vincular Responsável</CardTitle>
            </div>
            <CardDescription>
              Selecione um responsável para vincular ao aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Buscar por nome, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.length > 0 ? (
                    filteredParents.map(parent => (
                      <TableRow key={parent.id}>
                        <TableCell>{parent.name}</TableCell>
                        <TableCell>{parent.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={parent.status === 'active' ? 'default' : 
                                   parent.status === 'pending' ? 'outline' : 'secondary'}
                          >
                            {parent.status === 'active' ? 'Ativo' : 
                             parent.status === 'pending' ? 'Pendente' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {parent.id === student.parentId ? (
                            <Button variant="ghost" size="sm" disabled className="gap-1">
                              <Check className="h-3 w-3" />
                              Vinculado
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-1"
                              onClick={() => handleBindParent(parent.id)}
                            >
                              <Link className="h-3 w-3" />
                              Vincular
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum resultado encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate('/parents/new')}
              >
                Cadastrar novo responsável
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vincular dispositivo */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Vincular Dispositivo</CardTitle>
            </div>
            <CardDescription>
              Selecione um dispositivo disponível para vincular ao aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Dispositivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atribuído a</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableDevices.map(device => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.id}</TableCell>
                      <TableCell className="capitalize">{device.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={device.status === 'active' ? 'default' : 
                                 device.status === 'unassigned' ? 'outline' : 'secondary'}
                        >
                          {device.status === 'active' ? 'Ativo' : 
                           device.status === 'unassigned' ? 'Não atribuído' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{device.assignedTo || '-'}</TableCell>
                      <TableCell className="text-right">
                        {device.id === student.deviceId ? (
                          <Button variant="ghost" size="sm" disabled className="gap-1">
                            <Check className="h-3 w-3" />
                            Vinculado
                          </Button>
                        ) : device.status === 'unassigned' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleBindDevice(device.id)}
                          >
                            <Link className="h-3 w-3" />
                            Vincular
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled
                          >
                            Indisponível
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate('/devices/register')}
              >
                Registrar novo dispositivo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
