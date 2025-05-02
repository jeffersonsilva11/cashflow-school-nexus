
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { SystemConfigFormValues } from './types';
import { EnabledModules } from '../../SchoolWizard';

type ModulesSectionProps = {
  form: UseFormReturn<SystemConfigFormValues>;
  handleModuleChange: (module: keyof EnabledModules, checked: boolean) => void;
};

export const ModulesSection: React.FC<ModulesSectionProps> = ({ form, handleModuleChange }) => {
  return (
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
  );
};
