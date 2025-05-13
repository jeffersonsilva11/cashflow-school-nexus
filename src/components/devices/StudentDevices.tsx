
import React from 'react';
import { Link } from 'react-router-dom';
import { useDevicesByStudent } from '@/services/deviceService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Ban } from 'lucide-react';

interface StudentDevicesProps {
  studentId: string;
}

export const StudentDevices = ({ studentId }: StudentDevicesProps) => {
  const { data: devices, isLoading, error } = useDevicesByStudent(studentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard size={18} />
            <span>Dispositivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
            <span className="text-muted-foreground">Carregando dispositivos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard size={18} />
            <span>Dispositivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive flex items-center gap-2 py-4">
            <Ban size={18} />
            <span>Erro ao carregar dispositivos.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard size={18} />
          <span>Dispositivos</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/deviceManagement/RegisterDevice?studentId=${studentId}`} className="flex items-center gap-1">
            <Plus size={14} />
            <span>Adicionar</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {devices && devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map(device => (
              <div key={device.id} className="border rounded-md p-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {device.device_type === 'card' ? (
                      <CreditCard size={16} />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-primary"></span>
                    )}
                    {device.device_type === 'card' ? 'Cartão' : 'Pulseira'}: {device.serial_number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Badge variant={device.status === 'active' ? 'outline' : 'secondary'} className={
                      device.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200'
                    }>
                      {device.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {device.batch_id && (
                      <span className="text-xs">Lote: {device.batch_id}</span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/devices/${device.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Este estudante não possui nenhum dispositivo vinculado.</p>
            <Button asChild variant="outline">
              <Link to={`/deviceManagement/RegisterDevice?studentId=${studentId}`} className="flex items-center gap-1">
                <Plus size={14} />
                <span>Adicionar Dispositivo</span>
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
