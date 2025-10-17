import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = ({ 
  isVisible = false, 
  message = 'Validando tu respuesta...', 
  estimatedTime = '30 segundos',
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-40 animate-fade-in ${className}`}>
      <div className="text-center max-w-sm mx-4">
        {/* Loading Spinner */}
        <div className="relative inline-flex mb-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="UserCheck" size={24} className="text-blue-600" />
          </div>
        </div>

        {/* Loading Message */}
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {message}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Un administrador está revisando tu respuesta. Esto puede tomar unos momentos.
        </p>

        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Icon name="Clock" size={16} className="text-slate-500" />
          <span className="text-xs text-slate-500">
            Tiempo estimado: {estimatedTime}
          </span>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-xs text-blue-700 font-medium">
            Conexión en tiempo real activa
          </span>
        </div>

        {/* Loading Dots */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-1">
            {[0, 1, 2]?.map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
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
  );
};

export default LoadingState;