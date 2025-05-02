
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SchoolFormData } from '../SchoolWizard';
import { CheckCircle, Send, Users, CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

type ConfirmationStepProps = {
  formData: SchoolFormData;
};

export const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Cadastro Finalizado com Sucesso!</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          A escola {formData.name} foi cadastrada com sucesso no sistema. 
          Um email de confirmação foi enviado para {formData.adminEmail}.
        </p>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Próximos Passos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-full bg-primary/10 p-2 h-fit">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Importar Alunos</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Importe a lista de alunos ou cadastre manualmente
                </p>
                <Button asChild variant="link" className="p-0 mt-2 h-auto">
                  <Link to="/schools/students/import">Começar importação</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-full bg-primary/10 p-2 h-fit">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Configurar Dispositivos</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Vincule cartões e pulseiras aos alunos
                </p>
                <Button asChild variant="link" className="p-0 mt-2 h-auto">
                  <Link to="/devices">Gerenciar dispositivos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-full bg-primary/10 p-2 h-fit">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Personalizar Interface</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure a interface de acordo com as necessidades da escola
                </p>
                <Button asChild variant="link" className="p-0 mt-2 h-auto">
                  <Link to={`/schools/${formData.id}/settings`}>Configurar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
            <CardContent className="p-6 flex gap-4">
              <div className="rounded-full bg-primary/10 p-2 h-fit">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Enviar Convites</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Convide responsáveis e professores para acessar o sistema
                </p>
                <Button asChild variant="link" className="p-0 mt-2 h-auto">
                  <Link to="/schools/invites">Enviar convites</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md text-sm">
        <p className="font-medium">Informações de acesso</p>
        <p className="text-muted-foreground mt-1">
          Um email com as instruções de acesso foi enviado para {formData.adminEmail}. 
          A senha temporária expira em 24 horas.
        </p>
      </div>
    </div>
  );
};
