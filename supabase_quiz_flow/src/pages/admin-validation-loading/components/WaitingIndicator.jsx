import React from 'react';
import Icon from '../../../components/AppIcon';

const WaitingIndicator = ({ 
  currentStep = 1,
  totalSteps = 3,
  className = '' 
}) => {
  return (
    <div className={`bg-white/50 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Pregunta {currentStep} de {totalSteps}
        </span>
        <span className="text-xs text-gray-500">
          En revisión
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Status message */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="Eye" size={16} className="text-blue-500" />
        <span>Administrador revisando respuesta...</span>
      </div>
    </div>
  );
};

export default WaitingIndicator;