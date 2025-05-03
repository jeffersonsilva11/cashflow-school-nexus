
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Device } from '@/services/deviceService';

interface UnallocatedDevice {
  id?: string;
  serial?: string;
  type?: string;
  status?: string;
  batch?: string;
  serial_number?: string;
  device_type?: string;
  batch_id?: string;
}

interface UnallocatedDevicesTableProps {
  devices: UnallocatedDevice[];
  isLoading?: boolean;
}

export const UnallocatedDevicesTable = ({ 
  devices,
  isLoading = false
}: UnallocatedDevicesTableProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Dispositivos Não Alocados</h3>
        <Button variant="outline" size="sm">Ver Todos</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span className="text-muted-foreground">Carregando dispositivos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : devices.length > 0 ? (
            devices.map((device, index) => (
              <TableRow key={device.id || device.serial || index}>
                <TableCell>{device.serial_number || device.serial || '-'}</TableCell>
                <TableCell>{device.device_type || device.type || '-'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      device.status === 'active' ? 'default' : 
                      device.status === 'inactive' ? 'secondary' : 
                      device.status === 'pending' ? 'outline' : 'destructive'
                    }
                  >
                    {device.status === 'active' ? 'Ativo' : 
                     device.status === 'inactive' ? 'Inativo' : 
                     device.status === 'pending' ? 'Pendente' : 'Erro'}
                  </Badge>
                </TableCell>
                <TableCell>{device.batch_id || device.batch || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Alocar</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <span className="text-muted-foreground">Nenhum dispositivo não alocado encontrado</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
