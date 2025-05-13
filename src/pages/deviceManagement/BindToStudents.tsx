
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStudents } from '@/services/students';
import { useDevice, useAssignDeviceToStudent } from '@/services/deviceService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, School, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function BindToStudents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  
  const [schoolId, setSchoolId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: device, isLoading: isDeviceLoading, error: deviceError } = useDevice(deviceId || undefined);
  const { data: students, isLoading: isStudentsLoading } = useStudents();
  const { mutate: assignDevice, isPending: isAssigning } = useAssignDeviceToStudent();
  
  // Filter students by the selected school and search term
  const filteredStudents = students?.filter(student => 
    (!schoolId || student.school_id === schoolId) && 
    (!searchTerm || student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Get the list of unique schools from the students
  const schools = students ? Array.from(
    new Set(
      students
        .filter(s => s.school_id)
        .map(s => JSON.stringify({ id: s.school_id, name: s.school?.name }))
    )
  ).map(s => JSON.parse(s)) : [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId || !studentId) {
      toast({
        title: "Dados faltando",
        description: "Selecione um estudante para vincular ao dispositivo",
        variant: "destructive"
      });
      return;
    }
    
    assignDevice({ deviceId, studentId }, {
      onSuccess: () => {
        navigate(`/devices/${deviceId}`);
      }
    });
  };
  
  if (isDeviceLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Carregando informações do dispositivo...</span>
      </div>
    );
  }
  
  if (deviceError || !device) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as informações do dispositivo. Por favor, tente novamente mais tarde.
        </AlertDescription>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          Voltar
        </Button>
      </Alert>
    );
  }
  
  // Check if the device is already assigned to a student
  if (device.student_id) {
    return (
      <Alert variant="warning" className="max-w-2xl mx-auto my-8 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Dispositivo já vinculado</AlertTitle>
        <AlertDescription className="text-amber-700">
          Este dispositivo já está vinculado a um estudante. Para vinculá-lo a outro estudante, primeiro desvincule-o do estudante atual.
        </AlertDescription>
        <div className="flex gap-3 mt-4">
          <Button onClick={() => navigate(`/devices/${deviceId}`)} variant="outline">
            Ver Detalhes
          </Button>
          <Button onClick={() => navigate(-1)} variant="ghost">
            Voltar
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Vincular Dispositivo a Estudante</h1>
      <p className="text-muted-foreground mb-6">Associe um dispositivo existente a um estudante cadastrado.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard size={18} />
              Dispositivo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div>
                <Label>Número de Série</Label>
                <p className="font-medium">{device.serial_number}</p>
              </div>
              <div>
                <Label>Tipo</Label>
                <p>{device.device_type === 'card' ? 'Cartão' : 
                    device.device_type === 'wristband' ? 'Pulseira' : 
                    device.device_type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p>{device.status === 'active' ? 'Ativo' : 
                    device.status === 'inactive' ? 'Inativo' : 
                    device.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={18} />
              Selecionar Estudante
            </CardTitle>
            <CardDescription>
              Escolha o estudante que será vinculado ao dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="school">Filtrar por Escola</Label>
                <Select value={schoolId} onValueChange={setSchoolId}>
                  <SelectTrigger id="school" className="w-full">
                    <SelectValue placeholder="Selecione uma escola" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as Escolas</SelectItem>
                    {schools.map((school: any) => (
                      <SelectItem key={school.id} value={school.id}>
                        <div className="flex items-center gap-2">
                          <School size={14} />
                          {school.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="search">Buscar aluno</Label>
                <Input
                  id="search"
                  placeholder="Digite o nome do estudante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="student">Estudante</Label>
                <Select value={studentId} onValueChange={setStudentId} required>
                  <SelectTrigger id="student" className="w-full">
                    <SelectValue placeholder="Selecione um estudante" />
                  </SelectTrigger>
                  <SelectContent>
                    {isStudentsLoading ? (
                      <div className="p-2 text-center">Carregando estudantes...</div>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            {student.name} {student.grade ? `- ${student.grade}` : ''}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">
                        Nenhum estudante encontrado
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {filteredStudents.length === 0 && searchTerm && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Nenhum estudante encontrado com esse filtro
                  </p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-muted/20">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isAssigning || !studentId}
            >
              {isAssigning ? 'Vinculando...' : 'Vincular Dispositivo'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
