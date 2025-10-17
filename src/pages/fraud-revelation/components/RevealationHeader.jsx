import React from 'react';
import Icon from '../../../components/AppIcon';

const RevealationHeader = () => {
  return (
    <div className="bg-gradient-to-r from-error to-warning text-white py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="AlertTriangle" size={48} className="text-white" />
          </div>
        </div>

        {/* Main Warning Message */}
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 animate-bounce">
          ¡ALTO!
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-3">
            Has sido víctima de una simulación de estafa
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Esta NO era una página web real de aerolínea
          </p>
        </div>

        {/* Shock Message */}
        <div className="bg-error/20 border-2 border-white/30 rounded-lg p-4">
          <p className="text-lg font-medium">
            🚨 Acabas de proporcionar información personal y financiera a un sitio web fraudulento 🚨
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevealationHeader;