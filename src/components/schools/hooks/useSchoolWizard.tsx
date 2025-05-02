
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SchoolFormData, WizardStep } from '../types/school-wizard-types';

export const useSchoolWizard = () => {
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

  // Function to finalize the registration
  const handleFinish = () => {
    // Generate a random ID for the school if not present
    if (!formData.id) {
      const newId = `schl_${Math.random().toString(36).substring(2, 15)}`;
      updateFormData({ id: newId });
    }
    
    // Here would be implemented the logic to save the data in the backend
    console.log('School data for submission:', formData);
    
    toast({
      title: "Escola cadastrada com sucesso!",
      description: `${formData.name} foi adicionada ao sistema.`
    });
    
    setCurrentStep('confirmation');
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

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    getProgressPercentage
  };
};
