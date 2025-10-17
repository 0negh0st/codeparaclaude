import React from 'react';
import Icon from '../AppIcon';

const LoadingOverlay = ({ 
  isVisible = false,
  title = 'Procesando...',
  message = 'Por favor espera mientras procesamos tu solicitud.',
  type = 'default', // 'default', 'admin-validation', 'submission', 'navigation'
  progress = null, // 0-100 for progress bar
  estimatedTime = null,
  onCancel = null,
  className = '' 
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'admin-validation':
        return {
          icon: 'UserCheck',
          title: 'Validación administrativa',
          message: 'Un administrador está revisando tu respuesta. Esto puede tomar unos momentos.',
          showProgress: false
        };
      case 'submission':
        return {
          icon: 'Send',
          title: 'Enviando respuesta',
          message: 'Guardando tu respuesta de forma segura...',
          showProgress: true
        };
      case 'navigation':
        return {
          icon: 'ArrowRight',
          title: 'Cargando siguiente paso',
          message: 'Preparando la siguiente sección del cuestionario...',
          showProgress: true
        };
      default:
        return {
          icon: 'Loader2',
          title: title,
          message: message,
          showProgress: false
        };
    }
  };

  if (!isVisible) return null;

  const config = getTypeConfig();

  return (
    <div className={`loading-overlay animate-fade-in ${className}`}>
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="text-center">
          {/* Loading Icon */}
          <div className="mb-6">
            <div className="relative inline-flex">
              <div className="loading-spinner w-12 h-12" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon 
                  name={config?.icon} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {config?.title}
          </h3>

          {/* Message */}
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {config?.message}
          </p>

          {/* Progress Bar */}
          {(config?.showProgress || progress !== null) && (
            <div className="mb-6">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: progress !== null ? `${progress}%` : '0%',
                    animation: progress === null ? 'pulse 2s infinite' : 'none'
                  }}
                />
              </div>
              {progress !== null && (
                <div className="mt-2 text-xs text-text-secondary">
                  {progress}% completado
                </div>
              )}
            </div>
          )}

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Clock" size={14} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">
                Tiempo estimado: {estimatedTime}
              </span>
            </div>
          )}

          {/* Real-time Status for Admin Validation */}
          {type === 'admin-validation' && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-xs text-text-secondary bg-muted rounded-lg p-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>Esperando respuesta del administrador...</span>
              </div>
            </div>
          )}

          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-muted hover:bg-muted/80 rounded-md transition-colors duration-150"
            >
              <Icon name="X" size={14} />
              Cancelar
            </button>
          )}

          {/* Loading Dots Animation */}
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {[0, 1, 2]?.map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;