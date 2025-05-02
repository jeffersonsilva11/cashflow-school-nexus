
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save, UserRound, Phone, Mail } from 'lucide-react';
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
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="email@exemplo.com" 
                          {...field} 
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Será usado para contato e envio de SMS
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
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
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade, estado" {...field} />
                      </FormControl>
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
