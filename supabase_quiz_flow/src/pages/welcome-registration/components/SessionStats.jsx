import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionStats = () => {
  // Mock statistics data
  const stats = [
    {
      icon: 'Users',
      value: '2,847',
      label: 'Participantes hoy',
      color: 'text-green-600'
    },
    {
      icon: 'CheckCircle',
      value: '94%',
      label: 'Tasa de finalización',
      color: 'text-blue-600'
    },
    {
      icon: 'Clock',
      value: '3 min',
      label: 'Tiempo promedio',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="mt-8 bg-white/40 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          Estadísticas en Tiempo Real
        </h3>
        <p className="text-xs text-slate-500">
          Actualizado: {new Date()?.toLocaleTimeString('es-ES')}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name={stat?.icon} size={16} className={stat?.color} />
            </div>
            <div className="text-lg font-bold text-slate-800">
              {stat?.value}
            </div>
            <div className="text-xs text-slate-600 leading-tight">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-600">
            Sistema activo y monitoreado
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;