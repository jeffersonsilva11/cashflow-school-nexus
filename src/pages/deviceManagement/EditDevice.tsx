
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevice, useUpdateDevice } from '@/services/deviceService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { AlertCircle, CreditCard, PencilLine } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function EditDevice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  
  const [formData, setFormData] = useState({
    serial_number: '',
    device_type: '',
    status: '',
    device_model: '',
    batch_id: '',
  });
  
  const { data: device, isLoading, error } = useDevice(deviceId || undefined);
  const { mutate: updateDevice, isPending } = useUpdateDevice();
  
  useEffect(() => {
    if (device) {
      setFormData({
        serial_number: device.serial_number,
        device_type: device.device_type,
        status: device.status,
        device_model: device.device_model || '',
        batch_id: device.batch_id || '',
      });
    }
  }, [device]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceId) return;
    
    updateDevice({
      id: deviceId,
      updates: formData
    }, {
      onSuccess: () => {
        toast({
          title: "Dispositivo atualizado",
          description: "As informações do dispositivo foram atualizadas com sucesso."
        });
        navigate(`/devices/${deviceId}`);
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
      <h1 className="text-3xl font-bold mb-2">Editar Dispositivo</h1>
      <p className="text-muted-foreground mb-6">
        Atualize as informações do dispositivo {device.serial_number}.
      </p>
      
      <Card>
        <CardHeader className="bg-muted/40">
          <CardTitle className="flex items-center gap-2">
            <PencilLine size={20} />
            <span>Informações do Dispositivo</span>
          </CardTitle>
          <CardDescription>
            Edite as informações do dispositivo conforme necessário.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serial_number">
                  Número de Série <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device_type">
                  Tipo de Dispositivo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.device_type}
                  onValueChange={(value) => handleSelectChange('device_type', value)}
                  required
                >
                  <SelectTrigger id="device_type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Cartão NFC</SelectItem>
                    <SelectItem value="wristband">Pulseira NFC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    {device.student_id && (
                      <SelectItem value="assigned">Alocado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device_model">Modelo do Dispositivo</Label>
                <Input
                  id="device_model"
                  name="device_model"
                  value={formData.device_model}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="batch_id">ID do Lote</Label>
              <Input
                id="batch_id"
                name="batch_id"
                value={formData.batch_id}
                onChange={handleChange}
              />
            </div>
            
            {device.student_id && (
              <div className="border rounded-md p-4 bg-amber-50 border-amber-200">
                <p className="text-amber-800 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>Este dispositivo está vinculado a um estudante. Algumas alterações podem afetar a vinculação.</span>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/30">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
