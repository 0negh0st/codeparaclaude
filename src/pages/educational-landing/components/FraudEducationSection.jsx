import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const FraudEducationSection = () => {
  const [activeTab, setActiveTab] = useState('warning-signs');

  const educationTabs = [
    {
      id: 'warning-signs',
      title: 'Señales de Alerta',
      icon: 'AlertTriangle',
      content: {
        title: 'Cómo Identificar Sitios Web Fraudulentos',
        description: 'Aprende a reconocer las señales más comunes que indican que un sitio web puede ser falso.',
        points: [
          {
            icon: 'Globe',
            title: 'URL Sospechosa',
            description: 'Revisa si la dirección web tiene errores ortográficos o dominios extraños como "aviancaa.com" en lugar de "avianca.com"'
          },
          {
            icon: 'Lock',
            title: 'Falta de Seguridad',
            description: 'Verifica que la URL comience con "https://" y tenga el candado de seguridad en el navegador'
          },
          {
            icon: 'CreditCard',
            title: 'Métodos de Pago Dudosos',
            description: 'Desconfía de sitios que solo aceptan transferencias bancarias o métodos de pago no seguros'
          },
          {
            icon: 'Phone',
            title: 'Información de Contacto Falsa',
            description: 'Los sitios legítimos siempre tienen números de teléfono y direcciones físicas verificables'
          }
        ]
      }
    },
    {
      id: 'protection-tips',
      title: 'Consejos de Protección',
      icon: 'Shield',
      content: {
        title: 'Cómo Protegerte del Fraude Digital',
        description: 'Medidas prácticas que puedes tomar para navegar de forma segura en internet.',
        points: [
          {
            icon: 'Search',
            title: 'Verifica Antes de Comprar',
            description: 'Siempre busca el sitio oficial de la aerolínea en Google y compara precios en múltiples fuentes'
          },
          {
            icon: 'Eye',
            title: 'Lee las Reseñas',
            description: 'Consulta opiniones de otros usuarios en sitios independientes antes de realizar cualquier compra'
          },
          {
            icon: 'UserCheck',
            title: 'Usa Tarjetas de Crédito',
            description: 'Las tarjetas de crédito ofrecen mejor protección contra fraudes que las débito o transferencias'
          },
          {
            icon: 'Smartphone',
            title: 'Confirma por Teléfono',
            description: 'Si tienes dudas, llama directamente a la aerolínea usando el número oficial de su sitio web'
          }
        ]
      }
    },
    {
      id: 'real-examples',
      title: 'Ejemplos Reales',
      icon: 'FileText',
      content: {
        title: 'Casos Reales de Fraude en Colombia',
        description: 'Conoce casos documentados de estafas digitales para aprender de las experiencias de otros.',
        points: [
          {
            icon: 'Plane',
            title: 'Falsa Avianca',
            description: 'En 2023, más de 200 personas fueron estafadas por un sitio que imitaba perfectamente a Avianca'
          },
          {
            icon: 'MapPin',
            title: 'Vuelos Bogotá-Cartagena',
            description: 'Estafadores crearon ofertas falsas de vuelos baratos durante temporada alta, robando datos de tarjetas'
          },
          {
            icon: 'Calendar',
            title: 'Promociones de Temporada',
            description: 'Durante diciembre, sitios falsos ofrecían descuentos del 70% para atraer víctimas desprevenidas'
          },
          {
            icon: 'DollarSign',
            title: 'Pérdidas Millonarias',
            description: 'Las víctimas perdieron en promedio $800.000 COP por transacción fraudulenta'
          }
        ]
      }
    }
  ];

  const activeContent = educationTabs?.find(tab => tab?.id === activeTab)?.content;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            Educación sobre Fraude Digital
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Conoce las tácticas más comunes de los estafadores y aprende a protegerte 
            con información práctica y casos reales de Colombia.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {educationTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-smooth ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-primary hover:bg-muted hover:text-primary'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  <span className="font-medium">{tab?.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-secondary mb-3">
                  {activeContent?.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {activeContent?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {activeContent?.points?.map((point, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={point?.icon} size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary mb-2">{point?.title}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {point?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Resources */}
              {activeTab === 'real-examples' && (
                <div className="mt-8 p-6 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertCircle" size={24} color="var(--color-warning)" />
                    <div>
                      <h4 className="font-medium text-warning mb-2">Importante</h4>
                      <p className="text-sm text-text-secondary">
                        Si has sido víctima de fraude digital, reporta inmediatamente a la 
                        Superintendencia de Industria y Comercio (SIC) y a tu entidad bancaria. 
                        Nunca compartas esta información en redes sociales.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FraudEducationSection;