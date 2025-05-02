
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { EnabledModules } from '../types/school-wizard-types';
import { 
  SystemConfigFormValues, 
  systemConfigSchema, 
  SystemConfigStepProps 
} from './system-config/types';
import { PlanContractSection } from './system-config/PlanContractSection';
import { ModulesSection } from './system-config/ModulesSection';
import { FinancialSection } from './system-config/FinancialSection';
import { plans } from '@/services/financialMockData';

export const SystemConfigStep = ({ formData, updateFormData }: SystemConfigStepProps) => {
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null);

  const form = useForm<SystemConfigFormValues>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      plan: formData.plan || '',
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

  // Calcula o preço estimado com base no plano e número de alunos
  useEffect(() => {
    const calculateEstimatedPrice = () => {
      const currentPlan = form.getValues('plan');
      const students = form.getValues('estimatedStudents');
      
      if (!currentPlan || students <= 0) {
        setPriceEstimate(null);
        return;
      }
      
      const selectedPlan = plans.find(p => p.name === currentPlan);
      
      if (selectedPlan) {
        let price = selectedPlan.pricePerStudent * students;
        
        // Aplicar desconto se aplicável
        if (selectedPlan.discount && students >= selectedPlan.discount.threshold) {
          price = price * (1 - selectedPlan.discount.percentage / 100);
        }
        
        setPriceEstimate(price);
      }
    };
    
    calculateEstimatedPrice();
  }, [form.watch('plan'), form.watch('estimatedStudents')]);

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
        
        {priceEstimate !== null && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Valor estimado mensal:</h4>
            <p className="text-xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceEstimate)}
              <span className="text-sm font-normal text-muted-foreground"> /mês</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em {form.getValues('estimatedStudents')} alunos ativos
            </p>
          </div>
        )}
        
        <ModulesSection form={form} handleModuleChange={handleModuleChange} />
        <FinancialSection form={form} handleChange={handleChange} />
      </form>
    </Form>
  );
};
