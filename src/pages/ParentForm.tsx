
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save, UserRound, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Definir o esquema de validação com Zod
const parentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  documentId: z.string().min(11, "CPF deve ter 11 dígitos").optional(),
  address: z.string().optional(),
});

type ParentFormValues = z.infer<typeof parentSchema>;

export default function ParentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      documentId: '',
      address: '',
    },
  });
  
  // Funções para aplicar máscaras de formatação
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o nono e o décimo dígitos
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen entre o quinto e o sexto dígitos
      .replace(/(-\d{4})\d+?$/, '$1'); // Limita a 11 dígitos
  };
  
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const formatted = formatCPF(e.target.value);
    onChange(formatted);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };
  
  const onSubmit = async (data: ParentFormValues) => {
    console.log("Dados do formulário:", data);
    
    // Aqui seria feita a chamada à API para cadastrar o responsável
    // Simulando um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulando um ID gerado pelo backend
    const newParentId = `PAR${Math.floor(10000 + Math.random() * 90000)}`;
    
    toast({
      title: "Responsável cadastrado com sucesso",
      description: `O responsável ${data.name} foi cadastrado com o ID ${newParentId}`,
    });
    
    // Redireciona para a página de detalhes do responsável recém-criado
    navigate(`/parents/${newParentId}`);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/parents')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Responsável</h1>
            <p className="text-muted-foreground">Cadastre um novo responsável de aluno no sistema.</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Informações do Responsável</CardTitle>
                </div>
                <CardDescription>
                  Dados pessoais do responsável
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="email@exemplo.com" 
                              className="pl-10"
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Será usado para login e notificações
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              placeholder="(00) 00000-0000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => handlePhoneChange(e, field.onChange)}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Será usado para contato e envio de SMS
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="documentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          {...field} 
                          onChange={(e) => handleCPFChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormDescription>
                        Documento de identificação para fins fiscais
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            placeholder="Rua, número, bairro, cidade, estado" 
                            className="pl-10"
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Opcional
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/parents')}
              >
                Cancelar
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Responsável
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
