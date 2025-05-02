
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { SystemConfigStep } from './wizard-steps/SystemConfigStep';
import { AccessSummaryStep } from './wizard-steps/AccessSummaryStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';
import { WizardProgressBar } from './wizard-components/WizardProgressBar';
import { WizardNavigation } from './wizard-components/WizardNavigation';
import { useSchoolWizard } from './hooks/useSchoolWizard';
import { WizardStep } from './types/school-wizard-types';

// Export types from the types file for external use
export { 
  type EnabledModules, 
  type SchoolFormData,
  type WizardStep
} from './types/school-wizard-types';

export function SchoolWizard() {
  const { 
    currentStep, 
    formData, 
    updateFormData, 
    nextStep, 
    prevStep, 
    getProgressPercentage 
  } = useSchoolWizard();
  
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
  
  return (
    <Card className="border shadow-sm">
      {currentStep !== 'confirmation' && (
        <WizardProgressBar percentage={getProgressPercentage()} />
      )}
      
      <CardContent className="p-6">
        {renderStep()}
        
        {currentStep !== 'confirmation' && (
          <WizardNavigation 
            currentStep={currentStep} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )}
      </CardContent>
    </Card>
  );
}

export default SchoolWizard;
