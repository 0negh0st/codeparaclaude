import React from 'react';
import Icon from '../AppIcon';

const SessionStatusBanner = ({ 
  status = 'active', // 'active', 'validating', 'success', 'error', 'waiting'
  message = '',
  sessionId = '',
  adminResponse = null,
  estimatedTime = null,
  onRetry = null,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'validating':
        return {
          icon: 'Clock',
          iconColor: 'text-accent',
          bgClass: 'session-status-banner validating',
          title: 'Validación en progreso',
          defaultMessage: 'Un administrador está revisando tu respuesta...'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          iconColor: 'text-success',
          bgClass: 'session-status-banner success',
          title: 'Validación completada',
          defaultMessage: 'Tu respuesta ha sido aprobada. Puedes continuar.'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconColor: 'text-error',
          bgClass: 'session-status-banner error',
          title: 'Acción requerida',
          defaultMessage: 'Se requiere tu atención para continuar.'
        };
      case 'waiting':
        return {
          icon: 'Users',
          iconColor: 'text-secondary',
          bgClass: 'session-status-banner validating',
          title: 'En cola de revisión',
          defaultMessage: 'Tu solicitud está en cola para revisión administrativa.'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig || status === 'active') {
    return null;
  }

  return (
    <div className={`animate-slide-up ${className}`}>
      <div className={statusConfig?.bgClass}>
        <div className="flex items-start gap-3">
          <Icon 
            name={statusConfig?.icon} 
            size={20} 
            className={`${statusConfig?.iconColor} flex-shrink-0 mt-0.5`} 
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-text-primary">
                {statusConfig?.title}
              </h4>
              {sessionId && (
                <span className="text-xs font-mono text-text-secondary bg-muted px-2 py-1 rounded">
                  ID: {sessionId?.slice(-8)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-text-secondary mb-2">
              {message || statusConfig?.defaultMessage}
            </p>

            {/* Admin Response */}
            {adminResponse && (
              <div className="bg-card rounded-md p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="User" size={14} className="text-text-secondary" />
                  <span className="text-xs font-medium text-text-secondary">
                    Respuesta del administrador
                  </span>
                </div>
                <p className="text-sm text-text-primary">{adminResponse}</p>
              </div>
            )}

            {/* Estimated Time */}
            {estimatedTime && status === 'validating' && (
              <div className="flex items-center gap-2 mt-2">
                <Icon name="Clock" size={14} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">
                  Tiempo estimado: {estimatedTime}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            {status === 'error' && onRetry && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors duration-150"
                >
                  <Icon name="RotateCcw" size={12} />
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Real-time Status Indicator */}
      {status === 'validating' && (
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Conexión en tiempo real activa</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionStatusBanner;