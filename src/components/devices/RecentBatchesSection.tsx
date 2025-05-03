
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeviceBatchData } from '@/services/deviceStatsService';

interface RecentBatchesSectionProps {
  batches: DeviceBatchData[];
  onNewBatch: () => void;
  isLoading?: boolean;
}

export const RecentBatchesSection = ({ 
  batches, 
  onNewBatch,
  isLoading = false
}: RecentBatchesSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lotes Recentes</CardTitle>
          <CardDescription>Lotes de cartões e pulseiras cadastrados recentemente</CardDescription>
        </div>
        <Button size="sm" onClick={onNewBatch} className="gap-1">
          <Plus className="h-4 w-4" />
          Novo Lote
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Lote</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Disponíveis</TableHead>
              <TableHead>Alocados</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                    <span className="text-muted-foreground">Carregando lotes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : batches.length > 0 ? (
              batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.name}</TableCell>
                  <TableCell>
                    {batch.type === 'card' ? 'Cartão' : 'Pulseira'}
                  </TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>{batch.available}</TableCell>
                  <TableCell>{batch.allocated}</TableCell>
                  <TableCell>{new Date(batch.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {batch.available > 0 ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Disponível
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        Esgotado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <span className="text-muted-foreground">Nenhum lote encontrado</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
