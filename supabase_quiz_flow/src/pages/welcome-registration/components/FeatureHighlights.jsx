import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureHighlights = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Completamente Anónimo',
      description: 'Tu privacidad está protegida. Solo recopilamos información básica.'
    },
    {
      icon: 'Clock',
      title: 'Validación en Tiempo Real',
      description: 'Recibe retroalimentación inmediata de nuestros administradores.'
    },
    {
      icon: 'Star',
      title: 'Experiencia Interactiva',
      description: 'Califica tu experiencia y ayúdanos a mejorar el servicio.'
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-slate-800 text-center mb-6">
        ¿Por qué elegir nuestro quiz?
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {features?.map((feature, index) => (
          <div 
            key={index}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100 hover:bg-white/80 transition-all duration-200"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Icon name={feature?.icon} size={24} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-800 mb-2">
                {feature?.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureHighlights;