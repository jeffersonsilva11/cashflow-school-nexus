
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewBatchDialog = ({ open, onOpenChange }: NewBatchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Lote de Dispositivos</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo lote de cartões ou pulseiras.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="batch-name" className="text-sm font-medium">Nome do Lote</label>
            <Input id="batch-name" placeholder="Ex: Lote Junho 2023 - Cartões" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="batch-type" className="text-sm font-medium">Tipo de Dispositivo</label>
              <select id="batch-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Selecione...</option>
                <option value="card">Cartão</option>
                <option value="wristband">Pulseira</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="batch-quantity" className="text-sm font-medium">Quantidade</label>
              <Input id="batch-quantity" type="number" min="1" placeholder="Ex: 500" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="batch-supplier" className="text-sm font-medium">Fornecedor</label>
            <Input id="batch-supplier" placeholder="Nome do fornecedor" />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="batch-notes" className="text-sm font-medium">Observações</label>
            <textarea 
              id="batch-notes" 
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Informações adicionais sobre este lote"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => {
            onOpenChange(false);
            // Redirecionaria para a página de detalhes do lote recém-criado
          }}>Cadastrar Lote</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
