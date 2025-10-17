import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressSteps = ({ currentStep = 3 }) => {
  const steps = [
    {
      id: 1,
      label: 'Búsqueda',
      icon: 'Search',
      completed: currentStep > 1,
      active: currentStep === 1
    },
    {
      id: 2,
      label: 'Selección',
      icon: 'Plane',
      completed: currentStep > 2,
      active: currentStep === 2
    },
    {
      id: 3,
      label: 'Pasajeros',
      icon: 'User',
      completed: currentStep > 3,
      active: currentStep === 3
    },
    {
      id: 4,
      label: 'Pago',
      icon: 'CreditCard',
      completed: currentStep > 4,
      active: currentStep === 4
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-card p-4 mb-6">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            {/* Step Item */}
            <div className="flex items-center">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth ${
                  step?.completed
                    ? 'bg-success border-success text-success-foreground'
                    : step?.active
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-surface border-border text-text-secondary'
                }`}
              >
                {step?.completed ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>

              {/* Step Label - Hidden on mobile */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium transition-smooth ${
                    step?.active
                      ? 'text-primary'
                      : step?.completed
                      ? 'text-success' :'text-text-secondary'
                  }`}
                >
                  {step?.label}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps?.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 transition-smooth ${
                    step?.completed
                      ? 'bg-success' :'bg-border'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Mobile Step Labels */}
      <div className="sm:hidden mt-3 text-center">
        <p className="text-sm font-medium text-primary">
          Paso {currentStep} de {steps?.length}: {steps?.find(s => s?.id === currentStep)?.label}
        </p>
      </div>
    </div>
  );
};

export default ProgressSteps;