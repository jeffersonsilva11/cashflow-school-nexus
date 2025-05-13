
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevice, useUpdateDevice } from '@/services/deviceService';
import { useSchools } from '@/services/schoolService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, School, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AllocateToSchool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  
  const [schoolId, setSchoolId] = useState<string>('');
  
  const { data: device, isLoading: isDeviceLoading, error: deviceError } = useDevice(deviceId || undefined);
  const { data: schools, isLoading: isSchoolsLoading } = useSchools();
  const { mutate: updateDevice, isPending: isUpdating } = useUpdateDevice();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId || !schoolId) {
      return;
    }
    
    updateDevice({ 
      id: deviceId, 
      updates: { school_id: schoolId } 
    }, {
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

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Alocar Dispositivo para Escola</h1>
      <p className="text-muted-foreground mb-6">Associe um dispositivo existente a uma escola cadastrada.</p>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              <CardTitle className="text-lg">Informações do Dispositivo</CardTitle>
            </div>
            <CardDescription>
              Dispositivo: {device.serial_number} - 
              {device.device_type === 'card' ? 'Cartão' : 
               device.device_type === 'wristband' ? 'Pulseira' : 
               device.device_type}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="school" className="block text-sm font-medium mb-1">
                  Escola <span className="text-red-500">*</span>
                </label>
                <Select value={schoolId} onValueChange={setSchoolId} required>
                  <SelectTrigger id="school" className="w-full">
                    <SelectValue placeholder="Selecione uma escola" />
                  </SelectTrigger>
                  <SelectContent>
                    {isSchoolsLoading ? (
                      <SelectItem value="" disabled>Carregando escolas...</SelectItem>
                    ) : schools && schools.length > 0 ? (
                      schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>
                          <div className="flex items-center gap-2">
                            <School size={14} />
                            {school.name}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        <span className="text-muted-foreground">
                          Nenhuma escola cadastrada
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!schools?.length && (
                  <p className="text-sm text-amber-600 mt-1">
                    Não há escolas cadastradas. 
                    <Button variant="link" asChild className="h-auto p-0 ml-2">
                      <a href="/schools/new">Cadastrar Escola</a>
                    </Button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-muted/20">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUpdating || !schoolId}
            >
              {isUpdating ? 'Alocando...' : 'Alocar para Escola'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
