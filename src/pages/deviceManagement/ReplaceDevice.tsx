
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevice, useUpdateDevice, useCreateDevice } from '@/services/deviceService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, SwapHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function ReplaceDevice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  
  const [replacementSerialNumber, setReplacementSerialNumber] = useState('');
  
  const { data: device, isLoading, error } = useDevice(deviceId || undefined);
  const { mutate: updateDevice } = useUpdateDevice();
  const { mutate: createDevice } = useCreateDevice();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId || !replacementSerialNumber) {
      toast({
        title: "Dados incompletos",
        description: "O número de série do dispositivo substituto é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    if (!device) return;
    
    // Create the replacement device
    const newDeviceData = {
      serial_number: replacementSerialNumber,
      device_type: device.device_type,
      status: 'active',
      school_id: device.school_id,
      student_id: device.student_id,
      batch_id: device.batch_id,
      device_model: device.device_model
    };
    
    createDevice(newDeviceData, {
      onSuccess: (newDevice) => {
        // Update the old device to mark it as replaced
        updateDevice({
          id: deviceId,
          updates: {
            status: 'replaced',
            replacement_device_id: newDevice.id,
            replacement_reason: 'Substituição manual'
          }
        }, {
          onSuccess: () => {
            toast({
              title: "Dispositivo substituído com sucesso",
              description: `O dispositivo ${device.serial_number} foi substituído por ${newDevice.serial_number}.`
            });
            navigate(`/devices/${newDevice.id}`);
          }
        });
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Carregando informações do dispositivo...</span>
      </div>
    );
  }
  
  if (error || !device) {
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
      <h1 className="text-3xl font-bold mb-2">Substituir Dispositivo</h1>
      <p className="text-muted-foreground mb-6">
        Substitua um dispositivo existente mantendo as mesmas vinculações.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <SwapHorizontal size={20} />
              <span>Informações da Substituição</span>
            </CardTitle>
            <CardDescription>
              O dispositivo atual será marcado como substituído e um novo dispositivo será criado com as mesmas vinculações.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CreditCard size={16} />
                <span>Dispositivo atual</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
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
                {device.student_id && (
                  <div>
                    <Label>Estudante</Label>
                    <p>{device.student?.name || 'Não disponível'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="replacementSerialNumber" className="font-medium">
                  Número de Série do Dispositivo Substituto
                </Label>
                <Input
                  id="replacementSerialNumber"
                  value={replacementSerialNumber}
                  onChange={(e) => setReplacementSerialNumber(e.target.value)}
                  placeholder="Ex: CARD-2023-9999"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Informe o número de série do novo dispositivo que substituirá o atual.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/30">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Confirmar Substituição
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
