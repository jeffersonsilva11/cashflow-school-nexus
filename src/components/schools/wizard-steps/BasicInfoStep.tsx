
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
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SchoolFormData } from '../SchoolWizard';

// Schema de validação
const basicInfoSchema = z.object({
  name: z.string().min(3, { message: 'Nome da escola é obrigatório e deve ter pelo menos 3 caracteres' }),
  cnpj: z.string().min(14, { message: 'CNPJ inválido' }).max(18),
  type: z.string().min(1, { message: 'Tipo de instituição é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  website: z.string().optional(),
});

type BasicInfoStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

export const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name,
      cnpj: formData.cnpj,
      type: formData.type,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || '',
    },
  });

  // Atualiza o formData sempre que houver mudanças no formulário
  const handleChange = (field: keyof z.infer<typeof basicInfoSchema>, value: string) => {
    updateFormData({ [field]: value });
    form.setValue(field, value);
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da escola *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nome completo da instituição"
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de instituição *</FormLabel>
              <Select 
                onValueChange={(value) => handleChange('type', value)} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de instituição" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Privada">Escola Privada</SelectItem>
                  <SelectItem value="Pública">Escola Pública</SelectItem>
                  <SelectItem value="Técnica">Escola Técnica</SelectItem>
                  <SelectItem value="Faculdade">Faculdade/Universidade</SelectItem>
                  <SelectItem value="Curso">Curso Livre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email institucional *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="contato@escola.com"
                    type="email"
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="(XX) XXXXX-XXXX"
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="www.escola.com"
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
