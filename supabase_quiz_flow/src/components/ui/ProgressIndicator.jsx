import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 6, 
  completedSteps = [], 
  stepLabels = [
    'Registro',
    'Pregunta 1',
    'Pregunta 2', 
    'Pregunta 3',
    'Validación',
    'Valoración',
    'Completado'
  ],
  className = '' 
}) => {
  const getStepStatus = (stepIndex) => {
    if (completedSteps?.includes(stepIndex + 1)) return 'completed';
    if (stepIndex + 1 === currentStep) return 'current';
    return 'pending';
  };

  const getConnectorStatus = (stepIndex) => {
    return completedSteps?.includes(stepIndex + 1) ? 'completed' : 'pending';
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-6 ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-text-primary">
            {stepLabels?.[currentStep - 1]}
          </span>
        </div>
      </div>
      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(index);
          const isLast = index === totalSteps - 1;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={`progress-step ${status}`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : status === 'current' ? (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  ) : (
                    <span className="text-sm">{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-20">
                  <span className={`text-xs font-medium ${
                    status === 'current' ?'text-accent-foreground' 
                      : status === 'completed' ?'text-primary' :'text-text-secondary'
                  }`}>
                    {stepLabels?.[index]}
                  </span>
                </div>
              </div>
              {!isLast && (
                <div className={`progress-connector ${getConnectorStatus(index)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Progress Summary */}
      <div className="mt-4 text-center">
        <p className="text-sm text-text-secondary">
          {completedSteps?.length > 0 && (
            <span className="text-success font-medium">
              {completedSteps?.length} completado{completedSteps?.length !== 1 ? 's' : ''}
            </span>
          )}
          {completedSteps?.length > 0 && currentStep <= totalSteps && ' • '}
          {currentStep <= totalSteps && (
            <span className="text-text-primary">
              {totalSteps - currentStep + 1} restante{totalSteps - currentStep + 1 !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;