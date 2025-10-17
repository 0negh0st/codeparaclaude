import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionCard = ({ session, onFinalize, onRestart, onViewDetails }) => {
  const getStepIcon = (step) => {
    const stepIcons = {
      'search': 'Search',
      'selection': 'Plane',
      'passenger': 'User',
      'payment': 'CreditCard',
      'completed': 'CheckCircle'
    };
    return stepIcons?.[step] || 'Circle';
  };

  const getStepLabel = (step) => {
    const stepLabels = {
      'search': 'Búsqueda de Vuelos',
      'selection': 'Selección de Vuelo',
      'passenger': 'Información de Pasajeros',
      'payment': 'Pago y Facturación',
      'completed': 'Completado'
    };
    return stepLabels?.[step] || 'Desconocido';
  };

  const getProgressPercentage = (step) => {
    const stepProgress = {
      'search': 25,
      'selection': 50,
      'passenger': 75,
      'payment': 90,
      'completed': 100
    };
    return stepProgress?.[step] || 0;
  };

  const formatDuration = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMinutes = Math.floor((now - start) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Menos de 1 min';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-card p-6 shadow-soft hover:shadow-elevated transition-smooth">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-card-foreground">
              {session?.clientId}
            </h3>
            <p className="text-sm text-text-secondary">
              IP: {session?.ipAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            session?.isActive ? 'bg-success animate-pulse' : 'bg-text-secondary'
          }`} />
          <span className="text-sm text-text-secondary">
            {session?.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">
            Progreso Actual
          </span>
          <span className="text-sm text-text-secondary">
            {getProgressPercentage(session?.currentStep)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div 
            className="bg-primary h-2 rounded-full transition-smooth"
            style={{ width: `${getProgressPercentage(session?.currentStep)}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStepIcon(session?.currentStep)} 
            size={16} 
            className="text-primary" 
          />
          <span className="text-sm text-card-foreground">
            {getStepLabel(session?.currentStep)}
          </span>
        </div>
      </div>
      {/* Session Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-md">
        <div>
          <p className="text-xs text-text-secondary mb-1">Duración</p>
          <p className="text-sm font-medium text-card-foreground">
            {formatDuration(session?.startTime)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Última Actividad</p>
          <p className="text-sm font-medium text-card-foreground">
            {new Date(session.lastActivity)?.toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      {/* Collected Data Preview */}
      {session?.collectedData && Object.keys(session?.collectedData)?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-2">Datos Recopilados</p>
          <div className="space-y-1">
            {session?.collectedData?.origin && (
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="MapPin" size={14} className="text-accent" />
                <span className="text-card-foreground">
                  {session?.collectedData?.origin} → {session?.collectedData?.destination}
                </span>
              </div>
            )}
            {session?.collectedData?.passengers && (
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Users" size={14} className="text-accent" />
                <span className="text-card-foreground">
                  {session?.collectedData?.passengers} pasajeros
                </span>
              </div>
            )}
            {session?.collectedData?.email && (
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Mail" size={14} className="text-warning" />
                <span className="text-card-foreground truncate">
                  {session?.collectedData?.email}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewDetails(session)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-micro"
        >
          Ver Detalles
        </button>
        <button
          onClick={() => onRestart(session?.sessionId)}
          className="px-3 py-2 text-sm font-medium text-warning bg-warning/10 hover:bg-warning/20 rounded-md transition-micro"
        >
          <Icon name="RotateCcw" size={16} />
        </button>
        <button
          onClick={() => onFinalize(session?.sessionId)}
          className="px-3 py-2 text-sm font-medium text-success bg-success/10 hover:bg-success/20 rounded-md transition-micro"
        >
          <Icon name="Check" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SessionCard;