import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorModal = ({ 
  isVisible = false, 
  adminMessage = '', 
  onRetry, 
  onClose, 
  attemptCount = 0,
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-up">
        {/* Error Icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Icon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Respuesta Incorrecta
          </h3>
        </div>

        {/* Admin Message */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Icon name="User" size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">
                Mensaje del administrador:
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">
                {adminMessage || 'Tu respuesta no es correcta. Por favor, inténtalo de nuevo con una respuesta diferente.'}
              </p>
            </div>
          </div>
        </div>

        {/* Attempt Counter */}
        {attemptCount > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-600">
            <Icon name="RotateCcw" size={16} />
            <span className="text-sm font-medium">
              Intento {attemptCount + 1}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={onRetry}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Intentar de Nuevo
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-slate-500 text-center mt-4">
          Lee cuidadosamente la pregunta y piensa en tu respuesta antes de enviarla
        </p>
      </div>
    </div>
  );
};

export default ErrorModal;