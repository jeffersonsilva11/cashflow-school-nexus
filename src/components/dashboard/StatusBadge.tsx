
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  language?: 'pt' | 'en';
}

export const StatusBadge = ({ status, language = 'pt' }: StatusBadgeProps) => {
  const getStatusLabel = () => {
    if (language === 'pt') {
      switch (status) {
        case 'active': return 'Ativo';
        case 'pending': return 'Pendente';
        case 'transit': return 'Em Trânsito';
        case 'inactive': return 'Inativo';
        default: return 'Desconhecido';
      }
    } else {
      switch (status) {
        case 'active': return 'Active';
        case 'pending': return 'Pending';
        case 'transit': return 'In Transit';
        case 'inactive': return 'Inactive';
        default: return 'Unknown';
      }
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'active': 
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'pending': 
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'transit': 
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'inactive':
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  return (
    <Badge className={getStatusClasses()}>
      {getStatusLabel()}
    </Badge>
  );
};
