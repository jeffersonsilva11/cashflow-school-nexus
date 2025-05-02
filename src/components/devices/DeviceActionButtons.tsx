
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, Lock, RefreshCw, XCircle } from 'lucide-react';

interface DeviceActionButtonsProps {
  deviceId: string;
}

export const DeviceActionButtons = ({ deviceId }: DeviceActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="gap-1" asChild>
        <Link to={`/devices/${deviceId}/edit`}>
          <Edit size={16} />
          Editar
        </Link>
      </Button>
      <Button variant="outline" className="gap-1">
        <Lock size={16} />
        Bloquear
      </Button>
      <Button variant="outline" className="gap-1" asChild>
        <Link to={`/devices/${deviceId}/replace`}>
          <RefreshCw size={16} />
          Substituir
        </Link>
      </Button>
      <Button variant="destructive" className="gap-1">
        <XCircle size={16} />
        Desativar
      </Button>
    </div>
  );
};
