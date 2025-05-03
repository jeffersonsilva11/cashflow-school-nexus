
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FileSpreadsheet, 
  Download,
  Check
} from 'lucide-react';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ExportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: string) => void;
}

export function ExportDataDialog({ 
  open, 
  onOpenChange,
  onExport
}: ExportDataDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedData, setSelectedData] = useState('financial');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    onExport(selectedFormat);
    
    // Simulando processamento
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <DialogDescription>
            Selecione o formato e o conjunto de dados que deseja exportar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Conjunto de Dados</h4>
            <RadioGroup 
              value={selectedData} 
              onValueChange={setSelectedData}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="financial" id="financial" />
                <Label htmlFor="financial" className="flex-1 cursor-pointer">
                  <div className="font-medium">Dados Financeiros</div>
                  <div className="text-xs text-muted-foreground">
                    Receitas, transações e métricas financeiras
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="schools" id="schools" />
                <Label htmlFor="schools" className="flex-1 cursor-pointer">
                  <div className="font-medium">Uso por Escola</div>
                  <div className="text-xs text-muted-foreground">
                    Dados de uso, alunos e dispositivos por escola
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="complete" id="complete" />
                <Label htmlFor="complete" className="flex-1 cursor-pointer">
                  <div className="font-medium">Relatório Completo</div>
                  <div className="text-xs text-muted-foreground">
                    Conjunto completo de dados e métricas
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Formato de Arquivo</h4>
            <RadioGroup 
              value={selectedFormat} 
              onValueChange={setSelectedFormat}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx" className="flex-1 cursor-pointer flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Excel (.xlsx)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex-1 cursor-pointer flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>CSV (.csv)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>PDF (.pdf)</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex-1 cursor-pointer flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>JSON (.json)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Check className="h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
