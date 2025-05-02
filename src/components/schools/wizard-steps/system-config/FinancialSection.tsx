
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { SystemConfigFormValues } from './types';

type FinancialSectionProps = {
  form: UseFormReturn<SystemConfigFormValues>;
  handleChange: (field: keyof SystemConfigFormValues, value: any) => void;
};

export const FinancialSection: React.FC<FinancialSectionProps> = ({ form, handleChange }) => {
  return (
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
  );
};
