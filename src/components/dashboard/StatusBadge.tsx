
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  language?: 'pt' | 'en';
}

export const StatusBadge = ({ status, language = 'pt' }: StatusBadgeProps) => {
  const getStatusLabel = () => {
    if (language === 'pt') {
      if (status === 'active') return 'Ativo';
      if (status === 'pending') return 'Pendente';
      if (status === 'transit') return 'Em Trânsito';
      return 'Inativo';
    } else {
      if (status === 'active') return 'Active';
      if (status === 'pending') return 'Pending';
      if (status === 'transit') return 'In Transit';
      return 'Inactive';
    }
  };

  if (status === 'active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{getStatusLabel()}</Badge>;
  } else if (status === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{getStatusLabel()}</Badge>;
  } else if (status === 'transit') {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{getStatusLabel()}</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{getStatusLabel()}</Badge>;
  }
};
