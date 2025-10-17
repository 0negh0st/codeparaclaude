import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ 
  isConnected = true,
  onRetry = null,
  className = '' 
}) => {
  const [connectionTime, setConnectionTime] = useState(0);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setConnectionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isConnected) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="WifiOff" size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-700">
              Conexión perdida
            </span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors duration-150"
            >
              Reconectar
            </button>
          )}
        </div>
        <p className="text-xs text-red-600 mt-1">
          Intentando reconectar automáticamente...
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Wifi" size={16} className="text-green-500" />
          <span className="text-sm text-green-700">Conectado</span>
        </div>
        <span className="text-xs text-green-600 font-mono">
          {formatTime(connectionTime)}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;