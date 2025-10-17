import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PreventionStrategiesSection = () => {
  const [expandedStrategy, setExpandedStrategy] = useState('verification');

  const preventionStrategies = [
    {
      id: 'verification',
      title: 'Verificación de Sitios Web',
      icon: 'CheckCircle',
      priority: 'Alta',
      description: 'Siempre verifica la autenticidad del sitio web antes de ingresar información personal.',
      steps: [
        {
          action: 'Revisa la URL cuidadosamente',
          details: 'Busca errores ortográficos, caracteres extraños o dominios sospechosos. Los sitios legítimos usan dominios oficiales.',
          example: '✓ avianca.com vs ✗ aviancaa.com o avianca-ofertas.com'
        },
        {
          action: 'Verifica el certificado SSL',
          details: 'Haz clic en el candado del navegador para ver los detalles del certificado. Debe coincidir con el nombre de la empresa.',
          example: 'El certificado debe estar emitido para el dominio exacto que estás visitando'
        },
        {
          action: 'Busca información de contacto',
          details: 'Los sitios legítimos tienen información de contacto clara, incluyendo dirección física y números de teléfono verificables.',
          example: 'Llama al número oficial de la aerolínea para confirmar ofertas sospechosas'
        },
        {
          action: 'Consulta fuentes oficiales',
          details: 'Ve directamente al sitio web oficial de la empresa escribiendo la URL conocida o buscando en Google.',
          example: 'No hagas clic en enlaces de emails o anuncios sospechosos'
        }
      ]
    },
    {
      id: 'secure-browsing',
      title: 'Navegación Segura',
      icon: 'Shield',
      priority: 'Alta',
      description: 'Adopta hábitos de navegación que protejan tu información personal y financiera.',
      steps: [
        {
          action: 'Usa navegación privada para compras',
          details: 'El modo incógnito evita que se guarden cookies y datos de sesión que podrían ser comprometidos.',
          example: 'Especialmente útil cuando usas computadoras públicas o compartidas'
        },
        {
          action: 'Mantén tu navegador actualizado',
          details: 'Las actualizaciones incluyen parches de seguridad importantes que protegen contra nuevas amenazas.',
          example: 'Habilita las actualizaciones automáticas en Chrome, Firefox o Safari'
        },
        {
          action: 'Usa extensiones de seguridad',
          details: 'Instala extensiones confiables que bloqueen sitios maliciosos y anuncios sospechosos.',
          example: 'uBlock Origin, Malwarebytes Browser Guard, o Web of Trust'
        },
        {
          action: 'Evita WiFi público para compras',
          details: 'Las redes públicas pueden ser interceptadas. Usa tu conexión móvil o una VPN confiable.',
          example: 'Nunca ingreses información financiera en redes de cafeterías o aeropuertos'
        }
      ]
    },
    {
      id: 'payment-security',
      title: 'Seguridad en Pagos',
      icon: 'CreditCard',
      priority: 'Crítica',
      description: 'Protege tu información financiera con métodos de pago seguros y verificaciones adicionales.',
      steps: [
        {
          action: 'Usa tarjetas de crédito, no débito',
          details: 'Las tarjetas de crédito ofrecen mejor protección contra fraudes y no acceden directamente a tu cuenta bancaria.',
          example: 'Los bancos pueden revertir cargos fraudulentos más fácilmente en tarjetas de crédito'
        },
        {
          action: 'Habilita notificaciones de transacciones',
          details: 'Recibe alertas inmediatas por SMS o email para cualquier transacción en tus tarjetas.',
          example: 'Configura alertas para transacciones mayores a $50.000 COP'
        },
        {
          action: 'Usa métodos de pago digitales seguros',
          details: 'PayPal, Apple Pay, Google Pay ofrecen capas adicionales de protección sin exponer tu número de tarjeta.',
          example: 'Estos servicios no comparten tu información financiera real con el comerciante'
        },
        {
          action: 'Revisa tus estados de cuenta regularmente',
          details: 'Verifica todas las transacciones semanalmente y reporta cualquier cargo no reconocido inmediatamente.',
          example: 'Usa las apps bancarias para revisar movimientos en tiempo real'
        }
      ]
    },
    {
      id: 'information-protection',
      title: 'Protección de Información Personal',
      icon: 'Lock',
      priority: 'Alta',
      description: 'Minimiza la exposición de tu información personal y mantén control sobre tus datos.',
      steps: [
        {
          action: 'Principio de información mínima',
          details: 'Solo proporciona la información estrictamente necesaria para completar una transacción legítima.',
          example: 'Un vuelo doméstico no debería requerir información de pasaporte'
        },
        {
          action: 'Usa emails secundarios para compras',
          details: 'Crea un email específico para compras online para evitar spam y phishing en tu email principal.',
          example: 'tunombre.compras@gmail.com para separar comunicaciones comerciales'
        },
        {
          action: 'No guardes información en sitios web',
          details: 'Evita que los sitios guarden tu información de pago o personal, incluso si es conveniente.',
          example: 'Siempre desmarca las casillas de "guardar información para futuras compras"'
        },
        {
          action: 'Usa contraseñas únicas y fuertes',
          details: 'Cada sitio debe tener una contraseña diferente. Usa un administrador de contraseñas confiable.',
          example: 'Bitwarden, 1Password, o LastPass pueden generar y guardar contraseñas seguras'
        }
      ]
    }
  ];

  const toggleStrategy = (strategyId) => {
    setExpandedStrategy(expandedStrategy === strategyId ? null : strategyId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Crítica': return 'text-error bg-error/10 border-error/20';
      case 'Alta': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="bg-surface py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-success mb-4">
            Estrategias de Protección
          </h2>
          <p className="text-lg text-text-secondary">
            Aprende a protegerte contra futuros intentos de fraude con estas estrategias probadas
          </p>
        </div>

        <div className="space-y-4">
          {preventionStrategies?.map((strategy) => {
            const isExpanded = expandedStrategy === strategy?.id;
            
            return (
              <div key={strategy?.id} className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleStrategy(strategy?.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-micro"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name={strategy?.icon} size={24} className="text-success" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-heading font-semibold text-text-primary">
                          {strategy?.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(strategy?.priority)}`}>
                          {strategy?.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {strategy?.description}
                      </p>
                    </div>
                  </div>
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-text-secondary flex-shrink-0"
                  />
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="space-y-6 mt-6">
                      {strategy?.steps?.map((step, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-success/20 text-success rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-text-primary mb-2">
                              {step?.action}
                            </h4>
                            <p className="text-sm text-text-secondary mb-2">
                              {step?.details}
                            </p>
                            <div className="bg-success/5 border-l-4 border-success/30 pl-4 py-2">
                              <p className="text-sm text-success font-medium">
                                💡 Ejemplo: {step?.example}
                              </p>
                            </div>
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

        {/* Quick Reference Card */}
        <div className="mt-8 bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-lg p-6">
          <h3 className="text-xl font-heading font-semibold text-success mb-4 flex items-center">
            <Icon name="Bookmark" size={24} className="mr-2" />
            Regla de Oro para Compras Online
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Pause" size={16} className="text-warning" />
              <span><strong>PAUSA:</strong> No te apresures</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Search" size={16} className="text-primary" />
              <span><strong>VERIFICA:</strong> Confirma la legitimidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span><strong>PROTEGE:</strong> Usa métodos seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventionStrategiesSection;