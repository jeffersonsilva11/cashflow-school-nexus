
import React from 'react';

type WizardProgressBarProps = {
  percentage: number;
};

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({ percentage }) => {
  return (
    <div className="relative h-2 bg-muted">
      <div 
        className="absolute h-2 bg-primary transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
