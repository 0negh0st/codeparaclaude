import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotice = () => {
  return (
    <div className="bg-surface border border-border rounded-card p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-success" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-heading font-semibold text-text-primary mb-2">
            Información Segura y Protegida
          </h3>
          
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Check" size={14} className="mr-2 text-success" />
              <span>Conexión SSL encriptada de 256 bits</span>
            </div>
            
            <div className="flex items-center">
              <Icon name="Check" size={14} className="mr-2 text-success" />
              <span>Datos protegidos según normativas internacionales</span>
            </div>
            
            <div className="flex items-center">
              <Icon name="Check" size={14} className="mr-2 text-success" />
              <span>Información personal nunca compartida con terceros</span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-muted/50 rounded-md">
            <div className="flex items-center">
              <Icon name="Lock" size={16} className="mr-2 text-primary" />
              <span className="text-xs font-medium text-text-primary">
                Sus datos están completamente seguros con nosotros
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;