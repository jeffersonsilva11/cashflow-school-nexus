
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  school: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RegisterTabletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterTabletDialog = ({
  open,
  onOpenChange
}: RegisterTabletDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      model: "",
      school: "",
    }
  });

  const onSubmit = (data: FormData) => {
    console.log("Tablet registration data:", data);
    
    // Simulando o registro do tablet
    toast({
      title: "Tablet cadastrado com sucesso",
      description: `O tablet ${data.name} foi registrado e está aguardando ativação.`
    });
    
    onOpenChange(false);
    form.reset();
  };

  // Mock data de escolas
  const schools = [
    { id: '1', name: 'Escola São Paulo' },
    { id: '2', name: 'Escola Rio de Janeiro' },
    { id: '3', name: 'Escola Belo Horizonte' },
    { id: '4', name: 'Escola Salvador' },
  ];
  
  // Mock data de modelos
  const tabletModels = [
    { id: 'model1', name: 'Samsung Galaxy Tab A' },
    { id: 'model2', name: 'Apple iPad' },
    { id: 'model3', name: 'Lenovo Tab M10' },
    { id: 'model4', name: 'Amazon Fire HD' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Tablet</DialogTitle>
          <DialogDescription>
            Preencha os dados do dispositivo para registrá-lo no sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tablet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tablet Recepção" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SN123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tabletModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
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
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escola (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a escola" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
