
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateDeviceBatch } from '@/services/deviceBatchService';
import { useToast } from '@/hooks/use-toast';

interface NewBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewBatchDialog = ({ open, onOpenChange }: NewBatchDialogProps) => {
  const { toast } = useToast();
  const { mutateAsync: createDeviceBatch, isPending } = useCreateDeviceBatch();
  
  const [batchName, setBatchName] = useState('');
  const [batchType, setBatchType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchName || !batchType || !quantity) {
      toast({
        title: "Dados incompletos",
        description: "Preencha os campos obrigatórios: Nome, Tipo e Quantidade",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Gerar um ID de lote baseado na data e tipo
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
      const batchId = `LOT-${year}-${month}${randomChars}`;
      
      await createDeviceBatch({
        name: batchName,
        batch_id: batchId,
        device_type: batchType,
        quantity: parseInt(quantity),
        available: parseInt(quantity), // Inicialmente todos disponíveis
        allocated: 0,
        supplier,
        status: 'active'
      });
      
      // Limpar o formulário
      setBatchName('');
      setBatchType('');
      setQuantity('');
      setSupplier('');
      setNotes('');
      
      // Fechar o diálogo
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating batch:", error);
      toast({
        title: "Erro ao criar lote",
        description: "Não foi possível cadastrar o novo lote. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Lote de Dispositivos</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo lote de cartões ou pulseiras.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="batch-name" className="text-sm font-medium">Nome do Lote</label>
              <Input 
                id="batch-name" 
                placeholder="Ex: Lote Junho 2023 - Cartões" 
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="batch-type" className="text-sm font-medium">Tipo de Dispositivo</label>
                <select 
                  id="batch-type" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="card">Cartão</option>
                  <option value="wristband">Pulseira</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="batch-quantity" className="text-sm font-medium">Quantidade</label>
                <Input 
                  id="batch-quantity" 
                  type="number" 
                  min="1" 
                  placeholder="Ex: 500" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="batch-supplier" className="text-sm font-medium">Fornecedor</label>
              <Input 
                id="batch-supplier" 
                placeholder="Nome do fornecedor" 
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="batch-notes" className="text-sm font-medium">Observações</label>
              <textarea 
                id="batch-notes" 
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Informações adicionais sobre este lote"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Cadastrando...' : 'Cadastrar Lote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
