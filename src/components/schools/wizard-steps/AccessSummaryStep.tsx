
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
import { SchoolFormData } from '../SchoolWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Schema de validação
const accessSummarySchema = z.object({
  adminName: z.string().min(3, { message: 'Nome do administrador é obrigatório' }),
  adminEmail: z.string().email({ message: 'E-mail inválido' }),
  sendConfirmation: z.boolean().default(true),
  scheduleTraining: z.boolean().default(false),
});

type AccessSummaryStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

export const AccessSummaryStep = ({ formData, updateFormData }: AccessSummaryStepProps) => {
  const form = useForm<z.infer<typeof accessSummarySchema>>({
    resolver: zodResolver(accessSummarySchema),
    defaultValues: {
      adminName: formData.adminName || '',
      adminEmail: formData.adminEmail || '',
      sendConfirmation: formData.sendConfirmation !== undefined ? formData.sendConfirmation : true,
      scheduleTraining: formData.scheduleTraining || false,
    },
  });

  // Atualiza o formData sempre que houver mudanças no formulário
  const handleChange = (field: keyof z.infer<typeof accessSummarySchema>, value: any) => {
    updateFormData({ [field]: value });
    form.setValue(field, value);
  };

  // Preparar os módulos habilitados para exibição
  const enabledModulesList = [];
  if (formData.enabledModules?.cashless) enabledModulesList.push('Pagamentos cashless');
  if (formData.enabledModules?.accessControl) enabledModulesList.push('Controle de acesso');
  if (formData.enabledModules?.attendance) enabledModulesList.push('Histórico de presença');
  if (formData.enabledModules?.parentComm) enabledModulesList.push('Comunicação com pais');
  if (formData.enabledModules?.advancedReports) enabledModulesList.push('Relatórios avançados');

  return (
    <div className="space-y-8">
      <Form {...form}>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Criação de Conta Administrativa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do administrador *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Nome completo"
                        onChange={(e) => handleChange('adminName', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="admin@escola.com"
                        type="email"
                        onChange={(e) => handleChange('adminEmail', e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Uma senha temporária será enviada para este email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="sendConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleChange('sendConfirmation', checked)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Enviar confirmação por email</FormLabel>
                      <FormDescription>
                        Um email de confirmação será enviado com os detalhes da escola
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduleTraining"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => 
                          handleChange('scheduleTraining', checked)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none pt-0.5">
                      <FormLabel>Agendar treinamento inicial</FormLabel>
                      <FormDescription>
                        Nossa equipe entrará em contato para agendar um treinamento
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </Form>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Resumo do Cadastro</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Dados Básicos</h4>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">{formData.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  CNPJ: {formData.cnpj} • {formData.type}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.email} • {formData.phone}
                </p>
                {formData.website && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Website: {formData.website}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Localização</h4>
              <div className="bg-muted p-4 rounded-md">
                <p>
                  {formData.address}, {formData.number}
                  {formData.complement && ` - ${formData.complement}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.neighborhood} • {formData.city}/{formData.state} • CEP: {formData.zipCode}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Plano Escolhido</h4>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formData.plan}</p>
                  <Badge variant="secondary" className="ml-2">
                    {formData.contractDuration}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.estimatedStudents} alunos estimados
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Módulos Habilitados</h4>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {enabledModulesList.length > 0 ? (
                    enabledModulesList.map((module, index) => (
                      <Badge key={index} className="bg-primary">{module}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum módulo adicional selecionado</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Configurações Financeiras</h4>
              <div className="bg-muted p-4 rounded-md grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Transação</p>
                  <p className="font-medium">{formData.transactionFee}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Cashback</p>
                  <p className="font-medium">{formData.cashbackRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dia de Fechamento</p>
                  <p className="font-medium">{formData.monthlyClosingDay}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
