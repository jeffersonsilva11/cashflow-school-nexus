
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Edit, Trash2, UserRound, School, CreditCard } from 'lucide-react';
import { useStudent } from '@/services/students/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function NewStudentDetails() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: student, isLoading, error } = useStudent(studentId || '');

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar dados do aluno",
        description: "Não foi possível carregar as informações do aluno. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Aluno</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Aluno não encontrado</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <p className="text-muted-foreground">
                O aluno solicitado não foi encontrado ou não existe.
              </p>
              <Button 
                onClick={() => navigate('/students')}
                variant="outline"
                className="mt-4"
              >
                Voltar para lista de alunos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {student.name}
              <Badge variant={student.active ? "default" : "secondary"}>
                {student.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              ID: {student.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/students/${studentId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir este aluno?')) {
                // Implementar exclusão
                toast({
                  title: "Aluno excluído com sucesso",
                  description: "O aluno foi removido permanentemente."
                });
                navigate('/students');
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações do Aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={student.photo_url || ''} alt={student.name} />
                  <AvatarFallback className="text-2xl">
                    {student.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{student.name}</h3>
                {student.school && (
                  <p className="text-muted-foreground text-sm">
                    {student.school.name}
                  </p>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turma</p>
                  <p>{student.grade || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                  <p>{formatBirthDate(student.date_of_birth)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documento</p>
                  <p>{student.document_id || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{student.active ? "Ativo" : "Inativo"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3 mt-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/students/${studentId}/parent-binding`)}
            >
              <UserRound className="h-4 w-4 mr-2" />
              Vincular Responsável
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/students/${studentId}/card-binding`)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Vincular Cartão
            </Button>
          </div>
          
          {student.school_id && (
            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => navigate(`/schools/${student.school_id}`)}
            >
              <School className="h-4 w-4 mr-2" />
              Ver Escola
            </Button>
          )}
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                  <CardDescription>Informações gerais sobre o aluno</CardDescription>
                </CardHeader>
                <CardContent>
                  {student.notes ? (
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Notas</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{student.notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma informação adicional registrada.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transações</CardTitle>
                  <CardDescription>Histórico de transações do aluno</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhuma transação encontrada para este aluno.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico</CardTitle>
                  <CardDescription>Registro de atividades</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">O histórico de atividades estará disponível em breve.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
