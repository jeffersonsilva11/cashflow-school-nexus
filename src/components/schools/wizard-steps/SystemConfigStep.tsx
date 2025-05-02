
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SchoolFormData } from '../SchoolWizard';
import { Card, CardContent } from '@/components/ui/card';

// Schema de validação
const systemConfigSchema = z.object({
  plan: z.string().min(1, { message: 'Tipo de plano é obrigatório' }),
  estimatedStudents: z.coerce.number().min(1, { message: 'Quantidade de alunos deve ser maior que zero' }),
  contractDuration: z.string().min(1, { message: 'Vigência do contrato é obrigatória' }),
  enabledModules: z.object({
    cashless: z.boolean().default(true),
    accessControl: z.boolean().default(false),
    attendance: z.boolean().default(false),
    parentComm: z.boolean().default(false),
    advancedReports: z.boolean().default(false),
  }),
  transactionFee: z.coerce.number().min(0).max(100, { message: 'Taxa deve estar entre 0 e 100%' }),
  cashbackRate: z.coerce.number().min(0).max(100, { message: 'Taxa deve estar entre 0 e 100%' }),
  monthlyClosingDay: z.coerce.number().min(1).max(31, { message: 'Dia deve estar entre 1 e 31' }),
});

type SystemConfigStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

export const SystemConfigStep = ({ formData, updateFormData }: SystemConfigStepProps) => {
  const form = useForm<z.infer<typeof systemConfigSchema>>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      plan: formData.plan || 'Básico',
      estimatedStudents: formData.estimatedStudents || 100,
      contractDuration: formData.contractDuration || '12 meses',
      enabledModules: formData.enabledModules || {
        cashless: true,
        accessControl: false,
        attendance: false,
        parentComm: false,
        advancedReports: false,
      },
      transactionFee: formData.transactionFee || 2.5,
      cashbackRate: formData.cashbackRate || 0,
      monthlyClosingDay: formData.monthlyClosingDay || 25,
    },
  });

  // Atualiza o formData sempre que houver mudanças no formulário
  const handleChange = (field: keyof z.infer<typeof systemConfigSchema>, value: any) => {
    updateFormData({ [field]: value });
    form.setValue(field, value);
  };

  // Atualiza módulos habilitados - making sure we always pass all required properties
  const handleModuleChange = (module: keyof typeof formData.enabledModules, checked: boolean) => {
    const currentModules = formData.enabledModules || {
      cashless: true,
      accessControl: false,
      attendance: false,
      parentComm: false,
      advancedReports: false,
    };
    
    const updatedModules = {
      ...currentModules,
      [module]: checked,
    };
    
    updateFormData({ enabledModules: updatedModules });
    form.setValue(`enabledModules.${module}` as any, checked);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Plano</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de plano *</FormLabel>
                    <Select 
                      onValueChange={(value) => handleChange('plan', value)} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Profissional">Profissional</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd. alunos estimada *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1}
                        {...field} 
                        onChange={(e) => handleChange('estimatedStudents', e.target.value)}
                      />
                    </FormControl>
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
                      onValueChange={(value) => handleChange('contractDuration', value)} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a vigência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3 meses">3 meses</SelectItem>
                        <SelectItem value="6 meses">6 meses</SelectItem>
                        <SelectItem value="12 meses">12 meses</SelectItem>
                        <SelectItem value="24 meses">24 meses</SelectItem>
                        <SelectItem value="36 meses">36 meses</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Funcionalidades</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enabledModules.cashless"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleModuleChange('cashless', checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pagamentos cashless</FormLabel>
                      <FormDescription>
                        Permite pagamentos sem dinheiro dentro da escola
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.accessControl"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleModuleChange('accessControl', checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Controle de acesso</FormLabel>
                      <FormDescription>
                        Monitoramento de entrada e saída dos alunos
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.attendance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleModuleChange('attendance', checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Histórico de presença</FormLabel>
                      <FormDescription>
                        Registro automático de presença em sala de aula
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.parentComm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleModuleChange('parentComm', checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Comunicação com pais</FormLabel>
                      <FormDescription>
                        Envio de comunicados e alertas para responsáveis
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabledModules.advancedReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleModuleChange('advancedReports', checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Relatórios avançados</FormLabel>
                      <FormDescription>
                        Dashboards e análises detalhadas de uso e financeiro
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
            <h3 className="text-lg font-medium mb-4">Financeiro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="transactionFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de transação (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        {...field} 
                        onChange={(e) => handleChange('transactionFee', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cashbackRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de cashback (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        {...field} 
                        onChange={(e) => handleChange('cashbackRate', e.target.value)}
                      />
                    </FormControl>
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
                        onChange={(e) => handleChange('monthlyClosingDay', e.target.value)}
                      />
                    </FormControl>
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
