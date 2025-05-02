
import React from 'react';
import { Button } from '@/components/ui/button';
import { WizardStep } from '../types/school-wizard-types';

type WizardNavigationProps = {
  currentStep: WizardStep;
  onNext: () => void;
  onPrev: () => void;
};

export const WizardNavigation: React.FC<WizardNavigationProps> = ({ 
  currentStep, 
  onNext, 
  onPrev 
}) => {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={currentStep === 'basicInfo' ? undefined : onPrev}
        disabled={currentStep === 'basicInfo'}
      >
        Voltar
      </Button>
      
      <Button onClick={onNext}>
        {currentStep === 'accessSummary' ? 'Finalizar Cadastro' : 'Próximo'}
      </Button>
    </div>
  );
};
