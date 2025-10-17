import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorModal = ({ 
  isOpen = false,
  onClose,
  onRetry,
  errorMessage = '',
  attemptCount = 1,
  maxAttempts = 3,
  questionNumber = 1,
  adminMessage = '',
  sessionId = ''
}) => {
  if (!isOpen) return null;

  const getAttemptMessage = () => {
    if (attemptCount >= maxAttempts) {
      return "Has alcanzado el número máximo de intentos para esta pregunta.";
    }
    if (attemptCount === 1) {
      return "Primera respuesta incorrecta. ¡Inténtalo de nuevo!";
    }
    if (attemptCount === 2) {
      return "Segunda respuesta incorrecta. Piensa cuidadosamente antes del último intento.";
    }
    return `Intento ${attemptCount} de ${maxAttempts}`;
  };

  const getEncouragementMessage = () => {
    const messages = [
      "¡No te preocupes! Todos cometemos errores mientras aprendemos.",
      "¡Sigue intentándolo! Estás muy cerca de la respuesta correcta.",
      "¡Ánimo! Cada intento te acerca más al éxito.",
      "¡Perfecto! Los errores son oportunidades de aprendizaje."
    ];
    return messages?.[Math.min(attemptCount - 1, messages?.length - 1)];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Respuesta Incorrecta
              </h3>
              <p className="text-sm text-gray-500">
                Pregunta {questionNumber} • {getAttemptMessage()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Admin Message */}
          {adminMessage && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="MessageSquare" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Mensaje del Administrador:
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {adminMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Default Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Encouragement Message */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Heart" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800 leading-relaxed">
                {getEncouragementMessage()}
              </p>
            </div>
          </div>

          {/* Attempt Counter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso de Intentos
              </span>
              <span className="text-sm text-gray-500">
                {attemptCount} de {maxAttempts}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(attemptCount / maxAttempts) * 100}%` }}
              />
            </div>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Hash" size={14} className="text-gray-500" />
                <span className="text-xs font-mono text-gray-600">
                  Sesión: {sessionId?.slice(-8)}
                </span>
                <span className="text-xs text-gray-500">
                  • {new Date()?.toLocaleString('es-ES')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          {attemptCount < maxAttempts ? (
            <>
              <Button
                variant="default"
                onClick={onRetry}
                iconName="RotateCcw"
                iconPosition="left"
                className="flex-1"
              >
                Intentar de Nuevo
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-initial"
              >
                Revisar Pregunta
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                iconName="ArrowLeft"
                iconPosition="left"
                className="flex-1"
              >
                Volver a la Pregunta
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/welcome-registration'}
                iconName="Home"
                iconPosition="left"
                className="flex-1"
              >
                Reiniciar Quiz
              </Button>
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Icon name="Info" size={12} />
              <span>
                ¿Necesitas ayuda? Los administradores están revisando tu respuesta en tiempo real.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;