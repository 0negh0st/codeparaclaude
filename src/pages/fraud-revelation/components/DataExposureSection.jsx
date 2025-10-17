import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DataExposureSection = () => {
  const [expandedSection, setExpandedSection] = useState('personal');

  // Mock captured data - would come from session storage in real implementation
  const capturedData = {
    personal: {
      title: "Información Personal Capturada",
      icon: "User",
      items: [
        { label: "Nombre completo", value: "María Elena Rodríguez García", sensitive: true },
        { label: "Número de documento", value: "52.847.392", sensitive: true },
        { label: "Fecha de nacimiento", value: "15/03/1965", sensitive: true },
        { label: "Teléfono", value: "+57 301 456 7890", sensitive: true },
        { label: "Email", value: "maria.rodriguez@gmail.com", sensitive: true }
      ]
    },
    travel: {
      title: "Información de Viaje",
      icon: "Plane",
      items: [
        { label: "Origen", value: "Bogotá (BOG)", sensitive: false },
        { label: "Destino", value: "Medellín (MDE)", sensitive: false },
        { label: "Fecha de salida", value: "25/10/2024", sensitive: false },
        { label: "Fecha de regreso", value: "30/10/2024", sensitive: false },
        { label: "Pasajeros", value: "2 adultos", sensitive: false }
      ]
    },
    financial: {
      title: "Información Financiera Capturada",
      icon: "CreditCard",
      items: [
        { label: "Número de tarjeta", value: "4532 **** **** 8901", sensitive: true },
        { label: "Fecha de vencimiento", value: "12/26", sensitive: true },
        { label: "Código CVV", value: "***", sensitive: true },
        { label: "Nombre en la tarjeta", value: "MARIA E RODRIGUEZ", sensitive: true },
        { label: "Dirección de facturación", value: "Calle 45 #12-34, Bogotá", sensitive: true }
      ]
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  return (
    <div className="bg-surface py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-error mb-4">
            Información Comprometida
          </h2>
          <p className="text-lg text-text-secondary">
            Mira toda la información personal y financiera que acabas de entregar:
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(capturedData)?.map(([key, section]) => {
            const isExpanded = expandedSection === key;
            
            return (
              <div key={key} className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-micro"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      key === 'financial' ? 'bg-error/10 text-error' : 
                      key === 'personal'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon name={section?.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-text-primary">
                        {section?.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {section?.items?.length} elementos capturados
                      </p>
                    </div>
                  </div>
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-text-secondary"
                  />
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="grid gap-4 mt-4">
                      {section?.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-text-secondary">
                            {item?.label}:
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-mono ${
                              item?.sensitive ? 'text-error font-semibold' : 'text-text-primary'
                            }`}>
                              {item?.value}
                            </span>
                            {item?.sensitive && (
                              <Icon name="AlertCircle" size={16} className="text-error" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Impact Message */}
        <div className="mt-8 bg-error/5 border border-error/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={24} className="text-error flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-heading font-semibold text-error mb-2">
                ¿Qué podría hacer un estafador con esta información?
              </h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Realizar compras fraudulentas con tu tarjeta de crédito</li>
                <li>• Abrir cuentas bancarias o solicitar préstamos a tu nombre</li>
                <li>• Acceder a tus cuentas personales y redes sociales</li>
                <li>• Vender tu información en mercados negros de internet</li>
                <li>• Realizar llamadas de phishing más convincentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExposureSection;