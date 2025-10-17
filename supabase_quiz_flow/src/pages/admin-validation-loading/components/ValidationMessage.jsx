import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationMessage = ({ 
  estimatedTime = "1-2 minutos",
  sessionId = "",
  className = '' 
}) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Main message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Validación en progreso
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Un administrador está revisando tu respuesta. Por favor, mantén esta ventana abierta.
        </p>
      </div>
      {/* Status indicators */}
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Icon name="Clock" size={18} />
          <span className="text-sm font-medium">
            Tiempo estimado: {estimatedTime}
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Conexión en tiempo real activa</span>
        </div>

        {sessionId && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Icon name="Hash" size={14} />
            <span className="text-xs font-mono">
              Sesión: {sessionId?.slice(-8)}
            </span>
          </div>
        )}
      </div>
      {/* Progress dots */}
      <div className="flex justify-center gap-1">
        {[0, 1, 2]?.map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.3}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ValidationMessage;