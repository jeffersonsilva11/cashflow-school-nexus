
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
const locationSchema = z.object({
  zipCode: z.string().min(8, { message: 'CEP inválido' }).max(9),
  address: z.string().min(3, { message: 'Endereço é obrigatório' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().min(2, { message: 'Estado é obrigatório' }),
  directorName: z.string().min(3, { message: 'Nome do diretor/responsável é obrigatório' }),
  directorPosition: z.string().min(2, { message: 'Cargo é obrigatório' }),
  directorEmail: z.string().email({ message: 'E-mail inválido' }),
  directorPhone: z.string().min(10, { message: 'Telefone inválido' }),
});

type LocationStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

// Lista de estados brasileiros
const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export const LocationStep = ({ formData, updateFormData }: LocationStepProps) => {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zipCode: formData.zipCode || '',
      address: formData.address || '',
      number: formData.number || '',
      complement: formData.complement || '',
      neighborhood: formData.neighborhood || '',
      city: formData.city || '',
      state: formData.state || '',
      directorName: formData.directorName || '',
      directorPosition: formData.directorPosition || '',
      directorEmail: formData.directorEmail || '',
      directorPhone: formData.directorPhone || '',
    },
  });

  // Atualiza o formData sempre que houver mudanças no formulário
  const handleChange = (field: keyof z.infer<typeof locationSchema>, value: string) => {
    updateFormData({ [field]: value });
    form.setValue(field, value);
  };

  // Simulação de função para buscar endereço pelo CEP
  const handleZipCodeChange = (zipCode: string) => {
    handleChange('zipCode', zipCode);
    
    // Simulação de busca de CEP (em produção, usaria uma API)
    if (zipCode.length === 8) {
      // Simular um delay para dar a sensação de busca
      setTimeout(() => {
        // Dados fictícios
        if (zipCode === '01001000') {
          updateFormData({
            address: 'Praça da Sé',
            neighborhood: 'Sé',
            city: 'São Paulo',
            state: 'SP',
          });
          
          form.setValue('address', 'Praça da Sé');
          form.setValue('neighborhood', 'Sé');
          form.setValue('city', 'São Paulo');
          form.setValue('state', 'SP');
        }
      }, 800);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="00000-000"
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Rua, Avenida, etc."
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="123"
                    onChange={(e) => handleChange('number', e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Apto, Sala, Bloco, etc."
                  onChange={(e) => handleChange('complement', e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Bairro"
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Cidade"
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <Select 
                  onValueChange={(value) => handleChange('state', value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brazilianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-border pt-6 mt-8">
          <h3 className="text-lg font-medium mb-4">Informações do Responsável</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="directorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do diretor/responsável *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nome completo"
                      onChange={(e) => handleChange('directorName', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="directorPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Diretor, Coordenador"
                      onChange={(e) => handleChange('directorPosition', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              control={form.control}
              name="directorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contato *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="email@exemplo.com"
                      type="email"
                      onChange={(e) => handleChange('directorEmail', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="directorPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone de contato *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="(XX) XXXXX-XXXX"
                      onChange={(e) => handleChange('directorPhone', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
