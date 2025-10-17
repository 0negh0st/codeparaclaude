import React from 'react';
import Icon from '../../../components/AppIcon';

const CompletionMessage = ({ 
  userName = '',
  completionTime = new Date(),
  sessionId = '',
  className = '' 
}) => {
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className={`text-center space-y-6 ${className}`}>
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Icon 
              name="CheckCircle" 
              size={48} 
              className="text-green-600" 
            />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Icon 
              name="Star" 
              size={16} 
              className="text-white fill-current" 
            />
          </div>
        </div>
      </div>
      {/* Main Thank You Message */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">
          ¡Gracias por participar!
        </h1>
        
        {userName && (
          <p className="text-lg text-slate-600">
            {userName}, has completado exitosamente el cuestionario
          </p>
        )}
        
        <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
          Tu participación y valoración han sido registradas correctamente. 
          Agradecemos el tiempo dedicado a responder todas las preguntas.
        </p>
      </div>
      {/* Completion Details */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Icon name="Clock" size={16} />
            <span>Completado el {formatTime(completionTime)}</span>
          </div>
          
          {sessionId && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Icon name="Hash" size={14} />
              <span className="font-mono">Sesión: {sessionId?.slice(-8)}</span>
            </div>
          )}
        </div>
      </div>
      {/* Achievement Summary */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="FileText" size={20} className="text-blue-600" />
          </div>
          <p className="text-xs text-slate-600">3 Preguntas</p>
          <p className="text-xs text-slate-500">Respondidas</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="UserCheck" size={20} className="text-green-600" />
          </div>
          <p className="text-xs text-slate-600">Validación</p>
          <p className="text-xs text-slate-500">Aprobada</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Star" size={20} className="text-amber-600" />
          </div>
          <p className="text-xs text-slate-600">Valoración</p>
          <p className="text-xs text-slate-500">Enviada</p>
        </div>
      </div>
    </div>
  );
};

export default CompletionMessage;