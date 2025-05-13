
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateDevice } from '@/services/deviceService';
import { useSchools } from '@/services/schoolService';
import { CreditCard, Tag } from 'lucide-react';

export default function RegisterDevice() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serial_number: '',
    device_type: 'card',
    status: 'active',
    school_id: '',
    device_model: '',
    batch_id: ''
  });

  const { mutate: createDevice, isPending } = useCreateDevice();
  const { data: schools = [], isLoading: isLoadingSchools } = useSchools();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createDevice(formData, {
      onSuccess: (data) => {
        navigate(`/devices/${data.id}`);
      }
    });
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Registrar Novo Dispositivo</h1>
      <p className="text-muted-foreground mb-6">Cadastre um novo cartão ou pulseira NFC no sistema.</p>

      <Card>
        <CardHeader className="bg-muted/40">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Informações do Dispositivo</CardTitle>
          </div>
          <CardDescription>
            Preencha os campos abaixo para registrar um novo dispositivo no sistema.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
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
                  placeholder="Ex: CARD-2023-001"
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_id">Escola</Label>
                <Select
                  value={formData.school_id}
                  onValueChange={(value) => handleSelectChange('school_id', value)}
                >
                  <SelectTrigger id="school_id">
                    <SelectValue placeholder="Selecione a escola (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma escola</SelectItem>
                    {isLoadingSchools ? (
                      <SelectItem value="" disabled>Carregando escolas...</SelectItem>
                    ) : (
                      schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device_model">Modelo do Dispositivo</Label>
                <Input
                  id="device_model"
                  name="device_model"
                  value={formData.device_model}
                  onChange={handleChange}
                  placeholder="Ex: Standard NFC Card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch_id">ID do Lote</Label>
                <div className="flex">
                  <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                    <Tag size={16} />
                  </div>
                  <Input
                    id="batch_id"
                    name="batch_id"
                    value={formData.batch_id}
                    onChange={handleChange}
                    placeholder="Ex: LOT-2023-001"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/30">
            <Button type="button" variant="outline" onClick={() => navigate('/devices')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Registrando...' : 'Registrar Dispositivo'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
