import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionSection = () => {
  const navigate = useNavigate();

  const actionCards = [
    {
      id: 'restart-simulation',
      title: 'Repetir Simulación',
      description: 'Vuelve a experimentar la simulación de fraude para reforzar tu aprendizaje o practica con diferentes escenarios.',
      icon: 'RotateCcw',
      color: 'primary',
      action: () => navigate('/flight-search-homepage'),
      buttonText: 'Comenzar de Nuevo'
    },
    {
      id: 'view-revelation',
      title: 'Ver Revelación',
      description: 'Revisa cómo se revela el fraude y qué técnicas de engaño se utilizaron en la simulación.',
      icon: 'Eye',
      color: 'accent',
      action: () => navigate('/fraud-revelation'),
      buttonText: 'Ver Revelación'
    },
    {
      id: 'admin-access',
      title: 'Acceso Administrador',
      description: 'Si eres un educador o instructor, accede al panel de administración para gestionar sesiones.',
      icon: 'Shield',
      color: 'secondary',
      action: () => navigate('/admin-dashboard'),
      buttonText: 'Panel Admin'
    }
  ];

  const quickLinks = [
    {
      title: 'Superintendencia de Industria y Comercio',
      description: 'Reporta fraudes y estafas digitales',
      url: 'https://www.sic.gov.co',
      icon: 'ExternalLink'
    },
    {
      title: 'Fiscalía General de la Nación',
      description: 'Denuncia delitos informáticos',
      url: 'https://www.fiscalia.gov.co',
      icon: 'ExternalLink'
    },
    {
      title: 'ASOBANCARIA',
      description: 'Información sobre seguridad bancaria',
      url: 'https://www.asobancaria.com',
      icon: 'ExternalLink'
    },
    {
      title: 'Policía Nacional - CAI Virtual',
      description: 'Reporta delitos cibernéticos',
      url: 'https://caivirtual.policia.gov.co',
      icon: 'ExternalLink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 border-primary/20 text-primary',
      accent: 'bg-accent/10 border-accent/20 text-accent',
      secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
      success: 'bg-success/10 border-success/20 text-success'
    };
    return colors?.[color] || colors?.primary;
  };

  const getButtonVariant = (color) => {
    const variants = {
      primary: 'default',
      accent: 'warning',
      secondary: 'secondary',
      success: 'success'
    };
    return variants?.[color] || 'default';
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            ¿Qué Quieres Hacer Ahora?
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Continúa tu aprendizaje o explora más opciones para fortalecer tu conocimiento 
            sobre seguridad digital.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {actionCards?.map((card) => (
            <div key={card?.id} className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-elevated transition-smooth">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${getColorClasses(card?.color)}`}>
                <Icon name={card?.icon} size={32} />
              </div>
              
              <h3 className="text-xl font-heading font-semibold text-secondary mb-3">
                {card?.title}
              </h3>
              
              <p className="text-text-secondary mb-6 leading-relaxed">
                {card?.description}
              </p>
              
              <Button
                variant={getButtonVariant(card?.color)}
                fullWidth
                iconName={card?.icon}
                iconPosition="left"
                onClick={card?.action}
              >
                {card?.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-soft">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-bold text-secondary mb-3">
              Enlaces de Ayuda Oficial
            </h3>
            <p className="text-text-secondary">
              Recursos oficiales del gobierno colombiano para reportar fraudes y obtener ayuda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks?.map((link, index) => (
              <a
                key={index}
                href={link?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-border rounded-lg hover:border-primary hover:shadow-soft transition-smooth group"
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={link?.icon} 
                    size={20} 
                    className="text-text-secondary group-hover:text-primary transition-micro flex-shrink-0 mt-1" 
                  />
                  <div>
                    <h4 className="font-medium text-secondary group-hover:text-primary transition-micro text-sm mb-1">
                      {link?.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {link?.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-error/10 border border-error/20 rounded-xl p-8 text-center">
          <Icon name="AlertTriangle" size={48} color="var(--color-error)" className="mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-secondary mb-3">
            ¿Fuiste Víctima de Fraude?
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Si sospechas que has sido víctima de fraude digital, actúa inmediatamente. 
            Cada minuto cuenta para minimizar el daño.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="destructive"
              iconName="Phone"
              iconPosition="left"
              onClick={() => window.open('tel:123', '_self')}
            >
              Línea de Emergencia: 123
            </Button>
            
            <Button
              variant="outline"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => window.open('https://wa.me/573001234567', '_blank')}
            >
              WhatsApp de Ayuda
            </Button>
          </div>

          <div className="mt-6 text-sm text-text-secondary">
            <p className="mb-2">
              <strong>Pasos inmediatos:</strong> Bloquea tus tarjetas, cambia contraseñas, 
              reporta a tu banco y guarda evidencia.
            </p>
            <p>
              <strong>Recuerda:</strong> No es tu culpa. Los estafadores son cada vez más sofisticados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionSection;