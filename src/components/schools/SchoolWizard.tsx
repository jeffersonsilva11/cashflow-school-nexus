
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { SystemConfigStep } from './wizard-steps/SystemConfigStep';
import { AccessSummaryStep } from './wizard-steps/AccessSummaryStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';

// Tipos de etapas no wizard
type WizardStep = 'basicInfo' | 'location' | 'systemConfig' | 'accessSummary' | 'confirmation';

// Interface para dados da escola
export interface SchoolFormData {
  // Dados básicos
  name: string;
  cnpj: string;
  type: string;
  email: string;
  phone: string;
  website?: string;
  
  // Localização e contato
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  directorName?: string;
  directorPosition?: string;
  directorEmail?: string;
  directorPhone?: string;
  
  // Configurações do sistema
  plan?: string;
  estimatedStudents?: number;
  contractDuration?: string;
  enabledModules?: {
    cashless: boolean;
    accessControl: boolean;
    attendance: boolean;
    parentComm: boolean;
    advancedReports: boolean;
  };
  transactionFee?: number;
  cashbackRate?: number;
  monthlyClosingDay?: number;
  
  // Acesso e resumo
  adminName?: string;
  adminEmail?: string;
  sendConfirmation?: boolean;
  scheduleTraining?: boolean;
}

// Componente principal do wizard
export const SchoolWizard = () => {
  // Estado para controlar a etapa atual do wizard
  const [currentStep, setCurrentStep] = useState<WizardStep>('basicInfo');
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    cnpj: '',
    type: 'Privada',
    email: '',
    phone: '',
    enabledModules: {
      cashless: true,
      accessControl: false,
      attendance: false,
      parentComm: false,
      advancedReports: false
    }
  });
  
  // Função para atualizar os dados do formulário
  const updateFormData = (data: Partial<SchoolFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  // Configuração das etapas do wizard
  const steps: { id: WizardStep; title: string; description: string }[] = [
    { 
      id: 'basicInfo', 
      title: 'Dados Básicos', 
      description: 'Informações essenciais sobre a escola' 
    },
    { 
      id: 'location', 
      title: 'Localização e Contato', 
      description: 'Endereço e contatos da instituição' 
    },
    { 
      id: 'systemConfig', 
      title: 'Configurações do Sistema', 
      description: 'Plano, módulos e configurações financeiras' 
    },
    { 
      id: 'accessSummary', 
      title: 'Acesso e Resumo', 
      description: 'Criação de acesso administrativo e resumo' 
    },
    { 
      id: 'confirmation', 
      title: 'Confirmação', 
      description: 'Cadastro finalizado' 
    }
  ];
  
  // Index da etapa atual
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  // Navegação entre etapas
  const goToNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };
  
  // Função para finalizar o cadastro
  const handleFinish = () => {
    // Aqui seria implementada a lógica para salvar os dados no backend
    console.log('Dados da escola para envio:', formData);
    setCurrentStep('confirmation');
  };
  
  // Renderização condicional da etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basicInfo':
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 'location':
        return <LocationStep formData={formData} updateFormData={updateFormData} />;
      case 'systemConfig':
        return <SystemConfigStep formData={formData} updateFormData={updateFormData} />;
      case 'accessSummary':
        return <AccessSummaryStep formData={formData} updateFormData={updateFormData} />;
      case 'confirmation':
        return <ConfirmationStep formData={formData} />;
      default:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto border shadow-sm">
      <CardHeader>
        <CardTitle>{steps[currentIndex].title}</CardTitle>
        <CardDescription>{steps[currentIndex].description}</CardDescription>
      </CardHeader>
      
      {/* Barra de progresso */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={`text-xs mt-1 ${
                  index <= currentIndex 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      <CardContent className="py-6">
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-6">
        <div>
          {currentStep !== 'basicInfo' && currentStep !== 'confirmation' && (
            <Button 
              variant="outline" 
              onClick={goToPreviousStep}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar
            </Button>
          )}
          
          {currentStep === 'basicInfo' && (
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
          )}
        </div>
        
        <div>
          {currentStep !== 'confirmation' ? (
            currentStep === 'accessSummary' ? (
              <Button onClick={handleFinish} className="gap-1">
                Finalizar Cadastro <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={goToNextStep} className="gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Button onClick={() => window.history.back()} className="gap-1">
              Voltar para Lista de Escolas
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
