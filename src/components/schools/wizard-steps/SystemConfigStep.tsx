
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SchoolFormData, EnabledModules } from '../SchoolWizard';
import { 
  SystemConfigFormValues, 
  systemConfigSchema, 
  SystemConfigStepProps 
} from './system-config/types';
import { PlanContractSection } from './system-config/PlanContractSection';
import { ModulesSection } from './system-config/ModulesSection';
import { FinancialSection } from './system-config/FinancialSection';

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
        <PlanContractSection form={form} handleChange={handleChange} />
        <ModulesSection form={form} handleModuleChange={handleModuleChange} />
        <FinancialSection form={form} handleChange={handleChange} />
      </form>
    </Form>
  );
};
