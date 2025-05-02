
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SystemConfigFormValues, durations } from './types';
import { plans } from '@/services/financialMockData';

type PlanContractSectionProps = {
  form: UseFormReturn<SystemConfigFormValues>;
  handleChange: (field: keyof SystemConfigFormValues, value: any) => void;
};

export const PlanContractSection: React.FC<PlanContractSectionProps> = ({ form, handleChange }) => {
  return (
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
                      <SelectItem key={plan.id} value={plan.name}>
                        {plan.name} - {plan.studentRange}
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
                <FormDescription>
                  Este valor será utilizado para calcular o custo mensal estimado da assinatura
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
