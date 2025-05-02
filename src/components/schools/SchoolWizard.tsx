
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { SystemConfigStep } from './wizard-steps/SystemConfigStep';
import { AccessSummaryStep } from './wizard-steps/AccessSummaryStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';
import { useToast } from '@/hooks/use-toast';

// Define the enabled modules type
export type EnabledModules = {
  cashless: boolean;
  accessControl: boolean;
  attendance: boolean;
  parentComm: boolean;
  advancedReports: boolean;
};

// Export the SchoolFormData type for use in step components
export type SchoolFormData = {
  id?: string;
  name: string;
  cnpj: string;
  type: string;
  email: string;
  phone: string;
  website?: string;
  
  // Location
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Director/responsible
  directorName: string;
  directorPosition: string;
  directorEmail: string;
  directorPhone: string;
  
  // System configuration
  plan: string;
  estimatedStudents: number;
  contractDuration: string;
  
  // Modules
  enabledModules: EnabledModules;
  
  // Financial
  transactionFee: number;
  cashbackRate: number;
  monthlyClosingDay: number;
  
  // Access
  adminName: string;
  adminEmail: string;
  sendConfirmation?: boolean;
  scheduleTraining?: boolean;
};

// Define the available steps
type WizardStep = 'basicInfo' | 'location' | 'systemConfig' | 'accessSummary' | 'confirmation';

// Main SchoolWizard component
export function SchoolWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('basicInfo');
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    cnpj: '',
    type: '',
    email: '',
    phone: '',
    
    zipCode: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    
    directorName: '',
    directorPosition: '',
    directorEmail: '',
    directorPhone: '',
    
    plan: 'Básico',
    estimatedStudents: 0,
    contractDuration: '12 meses',
    
    enabledModules: {
      cashless: false,
      accessControl: false,
      attendance: false,
      parentComm: false,
      advancedReports: false
    },
    
    transactionFee: 2.5,
    cashbackRate: 0,
    monthlyClosingDay: 25,
    
    adminName: '',
    adminEmail: ''
  });
  
  // Update form data
  const updateFormData = (data: Partial<SchoolFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  // Go to the next step
  const nextStep = () => {
    switch(currentStep) {
      case 'basicInfo':
        setCurrentStep('location');
        break;
      case 'location':
        setCurrentStep('systemConfig');
        break;
      case 'systemConfig':
        setCurrentStep('accessSummary');
        break;
      case 'accessSummary':
        handleFinish();
        break;
      default:
        break;
    }
  };
  
  // Go to the previous step
  const prevStep = () => {
    switch(currentStep) {
      case 'location':
        setCurrentStep('basicInfo');
        break;
      case 'systemConfig':
        setCurrentStep('location');
        break;
      case 'accessSummary':
        setCurrentStep('systemConfig');
        break;
      default:
        break;
    }
  };

  // Função para finalizar o cadastro
  const handleFinish = () => {
    // Generate a random ID for the school if not present
    if (!formData.id) {
      const newId = `schl_${Math.random().toString(36).substring(2, 15)}`;
      updateFormData({ id: newId });
    }
    
    // Aqui seria implementada a lógica para salvar os dados no backend
    console.log('Dados da escola para envio:', formData);
    
    toast({
      title: "Escola cadastrada com sucesso!",
      description: `${formData.name} foi adicionada ao sistema.`
    });
    
    setCurrentStep('confirmation');
  };
  
  // Render the current step component
  const renderStep = () => {
    switch(currentStep) {
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
        return null;
    }
  };
  
  // Calculate the step percentage for progress bar
  const getProgressPercentage = () => {
    switch(currentStep) {
      case 'basicInfo': return 25;
      case 'location': return 50;
      case 'systemConfig': return 75;
      case 'accessSummary': return 100;
      case 'confirmation': return 100;
      default: return 0;
    }
  };
  
  return (
    <Card className="border shadow-sm">
      {currentStep !== 'confirmation' && (
        <div className="relative h-2 bg-muted">
          <div 
            className="absolute h-2 bg-primary transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}
      
      <CardContent className="p-6">
        {renderStep()}
        
        {currentStep !== 'confirmation' && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 'basicInfo' ? undefined : prevStep}
              disabled={currentStep === 'basicInfo'}
            >
              Voltar
            </Button>
            
            <Button onClick={nextStep}>
              {currentStep === 'accessSummary' ? 'Finalizar Cadastro' : 'Próximo'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
