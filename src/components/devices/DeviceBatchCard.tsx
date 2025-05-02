
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DeviceBatch {
  id: string;
  name: string;
  type: string;
  quantity: number;
  available: number;
  allocated: number;
  date: string;
}

interface DeviceBatchCardProps {
  batch: DeviceBatch;
}

export const DeviceBatchCard: React.FC<DeviceBatchCardProps> = ({ batch }) => {
  const allocationPercentage = Math.round((batch.allocated / batch.quantity) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{batch.id}</p>
            <h3 className="font-bold mt-1 line-clamp-1" title={batch.name}>{batch.name}</h3>
          </div>
          <div className="bg-white p-2 rounded-full">
            <CreditCard size={16} className="text-indigo-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span>Alocação</span>
          <span className="font-medium">{allocationPercentage}%</span>
        </div>
        <Progress value={allocationPercentage} className="mb-3" />
        <div className="text-sm text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Disponíveis:</span>
            <span className="font-medium">{batch.available}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Alocados:</span>
            <span className="font-medium">{batch.allocated}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">{batch.quantity}</span>
          </div>
          <div className="mt-3 text-xs">Adicionado em: {new Date(batch.date).toLocaleDateString('pt-BR')}</div>
        </div>
      </CardContent>
    </Card>
  );
};
