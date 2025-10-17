import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RetryButton = ({ 
  onRetry,
  attemptCount = 1,
  maxAttempts = 3,
  isLoading = false,
  disabled = false,
  questionNumber = 1
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const canRetry = attemptCount < maxAttempts && !disabled;
  const remainingAttempts = maxAttempts - attemptCount;

  const getButtonText = () => {
    if (isLoading) return "Procesando...";
    if (!canRetry) return "Sin Intentos Restantes";
    if (attemptCount === 1) return "Intentar de Nuevo";
    return `Intentar de Nuevo (${remainingAttempts} restantes)`;
  };

  const getButtonVariant = () => {
    if (!canRetry) return "secondary";
    if (attemptCount >= 2) return "warning";
    return "default";
  };

  const handleRetry = () => {
    if (canRetry && !isLoading) {
      onRetry();
    }
  };

  return (
    <div className="space-y-3">
      {/* Retry Button */}
      <Button
        variant={getButtonVariant()}
        onClick={handleRetry}
        disabled={!canRetry || isLoading}
        loading={isLoading}
        iconName={isLoading ? "Loader2" : "RotateCcw"}
        iconPosition="left"
        fullWidth
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getButtonText()}
      </Button>

      {/* Attempt Status */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: maxAttempts }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index < attemptCount
                    ? 'bg-red-500'
                    : index === attemptCount && canRetry
                    ? 'bg-blue-500' :'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">
            Intento {attemptCount} de {maxAttempts}
          </span>
        </div>
        
        {canRetry && (
          <span className="text-green-600 font-medium">
            {remainingAttempts} restante{remainingAttempts !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Retry Tips */}
      {canRetry && isHovered && (
        <div className="animate-slide-up">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Consejos para tu próximo intento:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Lee cuidadosamente la pregunta completa</li>
                  <li>• Considera todas las opciones disponibles</li>
                  <li>• Revisa el mensaje del administrador</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Max Attempts Reached */}
      {!canRetry && attemptCount >= maxAttempts && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="AlertTriangle" size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-red-900 mb-1">
                Límite de intentos alcanzado
              </p>
              <p className="text-red-800">
                Has utilizado todos los intentos disponibles para la pregunta {questionNumber}. 
                Puedes continuar con el siguiente paso o reiniciar el quiz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State Info */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
          <span>Enviando nueva respuesta al administrador...</span>
        </div>
      )}
    </div>
  );
};

export default RetryButton;