import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const SimulationProgressIndicator = ({ currentStep = 0, className = '' }) => {
  const location = useLocation();

  // Define booking flow steps
  const steps = [
    {
      id: 1,
      label: 'Search',
      path: '/flight-search-homepage',
      icon: 'Search'
    },
    {
      id: 2,
      label: 'Select',
      path: '/flight-results-selection',
      icon: 'Plane'
    },
    {
      id: 3,
      label: 'Details',
      path: '/passenger-information',
      icon: 'User'
    },
    {
      id: 4,
      label: 'Payment',
      path: '/billing-and-payment',
      icon: 'CreditCard'
    }
  ];

  // Determine current step based on route
  const getCurrentStepFromRoute = () => {
    const stepMap = {
      '/flight-search-homepage': 1,
      '/flight-results-selection': 2,
      '/passenger-information': 3,
      '/billing-and-payment': 4
    };
    return stepMap?.[location?.pathname] || currentStep;
  };

  const activeStep = getCurrentStepFromRoute();

  // Only show on simulation pages
  const shouldShow = [
    '/flight-search-homepage',
    '/flight-results-selection', 
    '/passenger-information',
    '/billing-and-payment'
  ]?.includes(location?.pathname);

  if (!shouldShow) return null;

  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const isActive = step?.id === activeStep;
            const isCompleted = step?.id < activeStep;
            const isUpcoming = step?.id > activeStep;

            return (
              <React.Fragment key={step?.id}>
                {/* Step Item */}
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth ${
                      isCompleted
                        ? 'bg-success border-success text-success-foreground'
                        : isActive
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-surface border-border text-text-secondary'
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step?.icon} size={20} />
                    )}
                  </div>

                  {/* Step Label - Hidden on mobile */}
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium transition-smooth ${
                        isActive
                          ? 'text-primary'
                          : isCompleted
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
                        step?.id < activeStep
                          ? 'bg-success' :'bg-border'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Step Labels */}
        <div className="sm:hidden mt-3 text-center">
          <p className="text-sm font-medium text-primary">
            Step {activeStep} of {steps?.length}: {steps?.find(s => s?.id === activeStep)?.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationProgressIndicator;