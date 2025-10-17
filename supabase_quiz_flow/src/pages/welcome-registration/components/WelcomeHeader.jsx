import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Icon name="ClipboardList" size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Bienvenido al Quiz Interactivo
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Completa nuestro cuestionario de 3 preguntas con validación en tiempo real
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3 text-left">
          <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <p className="font-medium mb-1">¿Cómo funciona?</p>
            <ul className="space-y-1 text-slate-600">
              <li>• Responde 3 preguntas sencillas</li>
              <li>• Un administrador validará tus respuestas</li>
              <li>• Recibe retroalimentación inmediata</li>
              <li>• Califica tu experiencia al final</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;