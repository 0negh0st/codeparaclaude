import React from 'react';
import Icon from '../../../components/AppIcon';

const NextStepsInfo = ({ className = '' }) => {
  const nextSteps = [
    {
      icon: 'Database',
      title: 'Datos seguros',
      description: 'Tus respuestas se han guardado de forma segura y anónima'
    },
    {
      icon: 'BarChart3',
      title: 'Análisis estadístico',
      description: 'Tu participación contribuye a nuestros estudios de investigación'
    },
    {
      icon: 'Shield',
      title: 'Privacidad garantizada',
      description: 'No se almacena información personal identificable'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          ¿Qué sucede ahora?
        </h2>
        <p className="text-sm text-slate-600">
          Tu participación es valiosa para nosotros
        </p>
      </div>
      <div className="space-y-4">
        {nextSteps?.map((step, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon 
                name={step?.icon} 
                size={20} 
                className="text-blue-600" 
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800 mb-1">
                {step?.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Información adicional
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Si tienes preguntas sobre este cuestionario o deseas más información 
              sobre nuestros estudios, puedes contactarnos a través de nuestros 
              canales oficiales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepsInfo;