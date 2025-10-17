import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FraudTechniquesSection = () => {
  const [activeTab, setActiveTab] = useState('techniques');

  const fraudTechniques = [
    {
      id: 'visual-cloning',
      title: 'Clonación Visual Perfecta',
      icon: 'Copy',
      description: 'Los estafadores copian exactamente el diseño, colores y logotipos de sitios web legítimos.',
      examples: [
        'Uso de colores corporativos idénticos',
        'Logotipos y tipografías oficiales',
        'Estructura de navegación familiar',
        'Certificados SSL falsos para mostrar "seguridad"'
      ],
      redFlags: [
        'URL ligeramente diferente (aerolinas.com vs aerolineas.com)',
        'Errores ortográficos sutiles en el dominio',
        'Falta de información de contacto real',
        'Precios demasiado buenos para ser verdad'
      ]
    },
    {
      id: 'urgency-tactics',
      title: 'Tácticas de Urgencia',
      icon: 'Clock',
      description: 'Crean presión temporal para que tomes decisiones rápidas sin verificar.',
      examples: [
        'Ofertas que "expiran en minutos"',
        'Stock limitado con contadores regresivos',
        'Descuentos "exclusivos" por tiempo limitado',
        'Mensajes de "última oportunidad"'
      ],
      redFlags: [
        'Presión excesiva para completar la compra',
        'No permitir tiempo para verificar',
        'Amenazas de perder la oferta',
        'Solicitud inmediata de información personal'
      ]
    },
    {
      id: 'trust-signals',
      title: 'Señales de Confianza Falsas',
      icon: 'Award',
      description: 'Utilizan elementos que generan confianza pero que son fáciles de falsificar.',
      examples: [
        'Certificados de seguridad falsos',
        'Testimonios y reseñas inventadas',
        'Sellos de "sitio seguro" no verificables',
        'Números de contacto que no funcionan'
      ],
      redFlags: [
        'Certificados que no se pueden verificar',
        'Reseñas demasiado positivas o genéricas',
        'Falta de presencia en redes sociales oficiales',
        'Información de contacto incompleta'
      ]
    }
  ];

  const warningSignsMissed = [
    {
      step: 'Búsqueda de Vuelos',
      signs: [
        'URL no oficial (no era el dominio real de la aerolínea)',
        'Precios significativamente más bajos que la competencia',
        'Falta de información detallada sobre políticas de equipaje'
      ]
    },
    {
      step: 'Selección de Vuelo',
      signs: [
        'Opciones de vuelo limitadas y sospechosamente convenientes',
        'Falta de información sobre la aeronave o servicios',
        'No se mostraban términos y condiciones claros'
      ]
    },
    {
      step: 'Información Personal',
      signs: [
        'Solicitud de información excesiva para un vuelo doméstico',
        'Campos obligatorios innecesarios',
        'Falta de explicación sobre el uso de datos personales'
      ]
    },
    {
      step: 'Información de Pago',
      signs: [
        'Falta de opciones de pago seguras reconocidas',
        'No se mostraba información clara sobre cargos adicionales',
        'Ausencia de políticas de reembolso claras'
      ]
    }
  ];

  return (
    <div className="bg-muted/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-secondary mb-4">
            Aprende a Identificar el Fraude
          </h2>
          <p className="text-lg text-text-secondary">
            Conoce las técnicas que utilizan los estafadores y las señales que debes detectar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-surface rounded-lg p-2 shadow-soft">
          <button
            onClick={() => setActiveTab('techniques')}
            className={`px-6 py-3 rounded-md font-medium transition-micro ${
              activeTab === 'techniques' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-primary hover:bg-muted'
            }`}
          >
            Técnicas de Fraude
          </button>
          <button
            onClick={() => setActiveTab('warning-signs')}
            className={`px-6 py-3 rounded-md font-medium transition-micro ${
              activeTab === 'warning-signs' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-primary hover:bg-muted'
            }`}
          >
            Señales que Perdiste
          </button>
        </div>

        {/* Fraud Techniques Tab */}
        {activeTab === 'techniques' && (
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {fraudTechniques?.map((technique) => (
              <div key={technique?.id} className="bg-surface rounded-lg shadow-soft overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name={technique?.icon} size={24} className="text-warning" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-text-primary">
                      {technique?.title}
                    </h3>
                  </div>
                  
                  <p className="text-text-secondary mb-6">
                    {technique?.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
                        <Icon name="Target" size={16} className="mr-2 text-error" />
                        Cómo lo hacen:
                      </h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        {technique?.examples?.map((example, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-error mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
                        <Icon name="Eye" size={16} className="mr-2 text-success" />
                        Señales de alerta:
                      </h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        {technique?.redFlags?.map((flag, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warning Signs Tab */}
        {activeTab === 'warning-signs' && (
          <div className="space-y-6">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
                <h3 className="text-xl font-heading font-semibold text-warning">
                  Señales de Alerta que No Detectaste
                </h3>
              </div>
              <p className="text-text-secondary">
                Durante tu experiencia en el sitio fraudulento, había múltiples señales que indicaban que no era legítimo. 
                Aquí están organizadas por cada paso del proceso:
              </p>
            </div>

            {warningSignsMissed?.map((stepData, index) => (
              <div key={index} className="bg-surface rounded-lg shadow-soft p-6">
                <h4 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                  <span className="w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {stepData?.step}
                </h4>
                <ul className="space-y-2">
                  {stepData?.signs?.map((sign, signIndex) => (
                    <li key={signIndex} className="flex items-start text-text-secondary">
                      <Icon name="AlertCircle" size={16} className="text-error mr-3 mt-0.5 flex-shrink-0" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudTechniquesSection;