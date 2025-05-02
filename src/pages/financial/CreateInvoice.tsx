
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, School, CalendarIcon, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { schoolFinancials } from '@/services/financialMockData';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

type InvoiceItem = {
  description: string;
  amount: string;
};

type FormData = {
  schoolId: string;
  dueDate: Date | undefined;
  items: InvoiceItem[];
  useActiveStudents: boolean;
};

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStudentsCount, setActiveStudentsCount] = useState(0);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      items: [{ description: 'Mensalidade', amount: '' }],
      useActiveStudents: true
    }
  });
  
  const items = watch('items');
  const selectedSchoolId = watch('schoolId');
  const dueDate = watch('dueDate');
  const useActiveStudents = watch('useActiveStudents');
  
  const selectedSchool = selectedSchoolId 
    ? schoolFinancials.find(school => school.id === selectedSchoolId) 
    : null;

  // Calcular valor automaticamente com base nos alunos ativos quando a escola ou a opção mudar
  useEffect(() => {
    if (selectedSchool && useActiveStudents) {
      // Obter o número de alunos ativos
      const activeStudents = selectedSchool.activeStudents;
      setActiveStudentsCount(activeStudents);
      
      // Calcular valor por aluno com base no plano
      let pricePerStudent = 0;
      switch (selectedSchool.plan) {
        case 'Premium':
          pricePerStudent = 15.00; // R$15 por aluno no plano Premium
          break;
        case 'Standard':
          pricePerStudent = 12.00; // R$12 por aluno no plano Standard
          break;
        case 'Basic':
          pricePerStudent = 10.00; // R$10 por aluno no plano Basic
          break;
        default:
          pricePerStudent = 10.00;
      }
      
      // Atualizar valor do primeiro item (mensalidade)
      const totalAmount = (activeStudents * pricePerStudent).toFixed(2);
      setValue('items', [
        { 
          description: `Mensalidade ${selectedSchool.plan} - ${activeStudents} alunos ativos`, 
          amount: totalAmount 
        }
      ]);
    }
  }, [selectedSchoolId, selectedSchool, useActiveStudents, setValue]);
  
  const addItem = () => {
    const currentItems = watch('items') || [];
    setValue('items', [...currentItems, { description: '', amount: '' }]);
  };
  
  const removeItem = (index: number) => {
    const currentItems = watch('items');
    setValue('items', currentItems.filter((_, i) => i !== index));
  };
  
  const onSubmit = (data: FormData) => {
    toast({
      title: "Fatura criada",
      description: `Fatura para ${selectedSchool?.name} foi criada com sucesso.`,
    });
    navigate('/financial/invoices');
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/financial/invoices')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nova Fatura</h1>
            <p className="text-muted-foreground">
              Criar uma nova fatura para uma escola
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Detalhes da Escola</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolId">Escola</Label>
                  <Select onValueChange={(value) => setValue('schoolId', value)}>
                    <SelectTrigger id="schoolId" className="w-full">
                      <SelectValue placeholder="Selecione uma escola" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolFinancials.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.schoolId && <p className="text-sm text-red-500">Selecione uma escola</p>}
                </div>
                
                {selectedSchool && (
                  <div className="p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <School className="h-4 w-4" />
                      <h3 className="font-medium">{selectedSchool.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Plano:</div>
                        <div>{selectedSchool.plan}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Mensalidade Base:</div>
                        <div>{formatCurrency(selectedSchool.monthlyFee)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div className="text-muted-foreground">Alunos Ativos:</div>
                        <div className="font-medium">{selectedSchool.activeStudents}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Dispositivos Ativos:</div>
                        <div>{selectedSchool.activeDevices}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="useActiveStudents"
                    checked={useActiveStudents}
                    onCheckedChange={(checked) => setValue('useActiveStudents', checked)}
                  />
                  <Label htmlFor="useActiveStudents">Calcular valor com base em alunos ativos</Label>
                </div>
                
                {useActiveStudents && selectedSchool && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <h3 className="font-medium text-green-800">Cálculo por Alunos Ativos</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      A cobrança será calculada com base no número de alunos ativos ({activeStudentsCount}) 
                      e no plano da escola ({selectedSchool.plan}).
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data de Vencimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => setValue('dueDate', date)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                {errors.dueDate && <p className="text-sm text-red-500">Selecione uma data de vencimento</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Itens da Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-7">
                    <Label htmlFor={`items[${index}].description`}>Descrição</Label>
                    <Input
                      id={`items[${index}].description`}
                      {...register(`items.${index}.description`)}
                      readOnly={useActiveStudents && index === 0}
                    />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor={`items[${index}].amount`}>Valor</Label>
                    <Input
                      id={`items[${index}].amount`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.amount`)}
                      readOnly={useActiveStudents && index === 0}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={(items.length === 1) || (useActiveStudents && index === 0)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={addItem}
                disabled={useActiveStudents && items.length === 1}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div className="font-medium text-lg">Total</div>
                <div className="font-bold text-xl">{formatCurrency(calculateTotal())}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" onClick={() => navigate('/financial/invoices')}>
            Cancelar
          </Button>
          <Button type="submit">
            Criar Fatura
          </Button>
        </div>
      </form>
    </div>
  );
}
