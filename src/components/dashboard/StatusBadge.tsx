
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === 'active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>;
  } else if (status === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inativo</Badge>;
  }
};
