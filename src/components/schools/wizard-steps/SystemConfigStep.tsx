import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SchoolFormData, EnabledModules } from '../SchoolWizard';

// Schema de validação
const systemConfigSchema = z.object({
  plan: z.string().min(1, { message: 'Selecione um plano' }),
  estimatedStudents: z.number().min(1, { message: 'Informe a quantidade estimada de alunos' }),
  contractDuration: z.string().min(1, { message: 'Selecione a vigência do contrato' }),
  
  // Módulos
  enabledModules: z.object({
    cashless: z.boolean().default(false),
    accessControl: z.boolean().default(false),
    attendance: z.boolean().default(false),
    parentComm: z.boolean().default(false),
    advancedReports: z.boolean().default(false),
  }),
  
  // Financeiro
  transactionFee: z.number().min(0).max(10),
  cashbackRate: z.number().min(0).max(10),
  monthlyClosingDay: z.number().min(1).max(31),
});

type SystemConfigFormValues = z.infer<typeof systemConfigSchema>;

type SystemConfigStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

const plans = [
  { value: 'Básico', label: 'Plano Básico' },
  { value: 'Standard', label: 'Plano Standard' },
  { value: 'Premium', label: 'Plano Premium' },
  { value: 'Enterprise', label: 'Plano Enterprise' },
];

const durations = [
  { value: '12 meses', label: '12 meses' },
  { value: '24 meses', label: '24 meses' },
  { value: '36 meses', label: '36 meses' },
  { value: 'Personalizado', label: 'Personalizado' },
];

export const SystemConfigStep = ({ formData, updateFormData }: SystemConfigStepProps) => {
  const form = useForm<SystemConfigFormValues>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      plan: formData.plan || 'Básico',
      estimatedStudents: formData.estimatedStudents || 0,
      contractDuration: formData.contractDuration || '12 meses',
      
      enabledModules: {
        cashless: formData.enabledModules?.cashless || false,
        accessControl: formData.enabledModules?.accessControl || false,
        attendance: formData.enabledModules?.attendance || false,
        parentComm: formData.enabledModules?.parentComm || false,
        advancedReports: formData.enabledModules?.advancedReports || false,
      },
      
      transactionFee: formData.transactionFee || 2.5,
      cashbackRate: formData.cashbackRate || 0,
      monthlyClosingDay: formData.monthlyClosingDay || 25,
    },
  });

  // Atualiza o formData sempre que houver mudanças no formulário
  const handleChange = (field: keyof SystemConfigFormValues, value: any) => {
    updateFormData({ [field]: value });
  };

  // Handler específico para os módulos
  const handleModuleChange = (module: keyof EnabledModules, checked: boolean) => {
    const updatedModules = { 
      ...formData.enabledModules,
      [module]: checked 
    };
    
    updateFormData({ enabledModules: updatedModules });
    
    // Using form.setValue with the correct path syntax
    form.setValue(`enabledModules.${module}`, checked);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Plano e Contrato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleChange('plan', value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans.map(plan => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contractDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vigência do contrato *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleChange('contractDuration', value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a vigência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map(duration => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormField
                control={form.control}
                name="estimatedStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade estimada de alunos *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(value);
                          handleChange('estimatedStudents', value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Módulos Habilitados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enabledModules.cashless"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          handleModuleChange('cashless', Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Pagamentos cashless</FormLabel>
                      <FormDescription>
                        Pagamentos sem dinheiro utilizando pulseiras NFC
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.accessControl"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          handleModuleChange('accessControl', Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Controle de acesso</FormLabel>
                      <FormDescription>
                        Monitoramento de entrada e saída de alunos
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.attendance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          handleModuleChange('attendance', Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Histórico de presença</FormLabel>
                      <FormDescription>
                        Registro e relatório de presença em aulas
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.parentComm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          handleModuleChange('parentComm', Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Comunicação com pais</FormLabel>
                      <FormDescription>
                        Notificações e comunicados para responsáveis
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.advancedReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          handleModuleChange('advancedReports', Boolean(checked));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Relatórios avançados</FormLabel>
                      <FormDescription>
                        Relatórios e analytics detalhados
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Configurações Financeiras</h3>
            
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="transactionFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Transação: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={10}
                        step={0.1}
                        onValueChange={([value]) => {
                          field.onChange(value);
                          handleChange('transactionFee', value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Taxa aplicada em cada transação financeira
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cashbackRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Cashback: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={10}
                        step={0.1}
                        onValueChange={([value]) => {
                          field.onChange(value);
                          handleChange('cashbackRate', value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual de retorno em cada transação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="monthlyClosingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de fechamento mensal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={31}
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 25;
                          field.onChange(value);
                          handleChange('monthlyClosingDay', value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Dia do mês para fechamento do ciclo financeiro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
