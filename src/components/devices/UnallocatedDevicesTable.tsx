
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { CreditCard, UserRound, School } from 'lucide-react';

interface DeviceData {
  id: string;
  serial_number: string;
  device_type: string;
  status: string;
  batch_id?: string;
  created_at?: string;
  school?: { name: string } | null;
  student?: { name: string } | null;
}

interface UnallocatedDevicesTableProps {
  devices: DeviceData[];
  isLoading?: boolean;
}

export const UnallocatedDevicesTable = ({ 
  devices, 
  isLoading = false 
}: UnallocatedDevicesTableProps) => {
  const unallocatedDevices = devices.filter(d => !d.student_id);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Dispositivos não alocados</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/deviceManagement/RegisterDevice">Registrar Dispositivo</Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID / Número de Série</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Escola</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span className="text-muted-foreground">Carregando dispositivos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : unallocatedDevices.length > 0 ? (
            unallocatedDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-muted-foreground" />
                    {device.serial_number}
                  </div>
                </TableCell>
                <TableCell>
                  {device.device_type === 'card' ? 'Cartão' : 
                   device.device_type === 'wristband' ? 'Pulseira' : 
                   device.device_type}
                </TableCell>
                <TableCell>{device.batch_id || '-'}</TableCell>
                <TableCell>
                  {device.created_at 
                    ? new Date(device.created_at).toLocaleDateString('pt-BR')
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Badge variant={device.status === 'active' ? 'outline' : 'secondary'} className={
                    device.status === 'active' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
                      : device.status === 'inactive'
                      ? 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200'
                      : ''
                  }>
                    {device.status === 'active' ? 'Ativo' : 
                     device.status === 'inactive' ? 'Inativo' : 
                     device.status === 'assigned' ? 'Alocado' : 
                     device.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {device.school ? (
                    <div className="flex items-center gap-1">
                      <School size={14} />
                      {device.school.name}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/devices/${device.id}`}>
                        Detalhes
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/deviceManagement/BindToStudents?deviceId=${device.id}`}>
                        <UserRound size={14} className="mr-1" />
                        Vincular
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <p className="text-muted-foreground">Nenhum dispositivo não alocado encontrado</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link to="/deviceManagement/RegisterDevice">Registrar Novo Dispositivo</Link>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
