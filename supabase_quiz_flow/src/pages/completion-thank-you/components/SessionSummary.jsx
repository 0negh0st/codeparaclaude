import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionSummary = ({ 
  sessionData = {},
  className = '' 
}) => {
  // Mock session data structure
  const mockSessionData = {
    startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    endTime: new Date(),
    questionsAnswered: 3,
    correctAnswers: 3,
    attemptsUsed: 1,
    rating: 5,
    totalDuration: '15 min',
    ...sessionData
  };

  const formatDuration = (start, end) => {
    const diff = Math.floor((end - start) / 1000 / 60);
    return `${diff} min`;
  };

  const summaryStats = [
    {
      label: 'Tiempo total',
      value: mockSessionData?.totalDuration || formatDuration(mockSessionData?.startTime, mockSessionData?.endTime),
      icon: 'Clock',
      color: 'text-blue-600'
    },
    {
      label: 'Preguntas respondidas',
      value: `${mockSessionData?.questionsAnswered}/3`,
      icon: 'FileText',
      color: 'text-green-600'
    },
    {
      label: 'Respuestas correctas',
      value: `${mockSessionData?.correctAnswers}/3`,
      icon: 'CheckCircle',
      color: 'text-emerald-600'
    },
    {
      label: 'Valoración otorgada',
      value: `${mockSessionData?.rating}/5 estrellas`,
      icon: 'Star',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Resumen de tu sesión
        </h2>
        <p className="text-sm text-slate-600">
          Detalles de tu participación en el cuestionario
        </p>
      </div>
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryStats?.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Icon 
                  name={stat?.icon} 
                  size={18} 
                  className={stat?.color} 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">
                  {stat?.label}
                </p>
                <p className="font-semibold text-slate-800">
                  {stat?.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Performance Badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full border border-green-200">
          <Icon name="Award" size={16} />
          <span className="text-sm font-medium">
            ¡Cuestionario completado exitosamente!
          </span>
        </div>
      </div>
      {/* Timeline Summary */}
      <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
          <Icon name="Timeline" size={16} />
          Cronología de la sesión
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Inicio de sesión:</span>
            <span className="text-slate-800 font-medium">
              {mockSessionData?.startTime?.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Finalización:</span>
            <span className="text-slate-800 font-medium">
              {mockSessionData?.endTime?.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-slate-600">Estado:</span>
            <span className="text-green-600 font-medium flex items-center gap-1">
              <Icon name="CheckCircle" size={14} />
              Completado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;