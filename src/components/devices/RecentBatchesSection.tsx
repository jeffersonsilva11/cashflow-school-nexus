
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DeviceBatchCard } from '@/components/devices/DeviceBatchCard';

interface DeviceBatch {
  id: string;
  name: string;
  type: string;
  quantity: number;
  available: number;
  allocated: number;
  date: string;
}

interface RecentBatchesSectionProps {
  batches: DeviceBatch[];
  onNewBatch: () => void;
}

export const RecentBatchesSection = ({ batches, onNewBatch }: RecentBatchesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Lotes Recentes</h3>
            <p className="text-sm text-muted-foreground">Últimos lotes de dispositivos cadastrados</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onNewBatch} className="gap-1">
              <Plus size={16} />
              Novo Lote
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {batches.map(batch => (
            <DeviceBatchCard key={batch.id} batch={batch} />
          ))}
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <Link to="/device-batches">Ver todos os lotes</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
