import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onStartTraining, onViewDemo }) => {
  return (
    <section className="bg-gradient-to-br from-success/10 via-surface to-primary/5 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Shield" size={24} />
                <span className="text-sm font-medium uppercase tracking-wide">Protección Digital</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-secondary leading-tight">
                Aprende a Protegerte del 
                <span className="text-primary"> Fraude Digital</span>
              </h1>
              
              <p className="text-lg text-text-secondary leading-relaxed">
                Descubre cómo los estafadores crean sitios web falsos que parecen reales. 
                Nuestra plataforma educativa te enseña a identificar y evitar el fraude en línea 
                a través de simulaciones seguras y contenido especializado.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Eye" size={16} color="var(--color-success)" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Simulaciones Reales</h3>
                  <p className="text-sm text-text-secondary">Experimenta sitios falsos en un entorno seguro</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="BookOpen" size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Educación Práctica</h3>
                  <p className="text-sm text-text-secondary">Aprende con ejemplos del mundo real</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Users" size={16} color="var(--color-accent)" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Para Todos</h3>
                  <p className="text-sm text-text-secondary">Especialmente diseñado para adultos mayores</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Award" size={16} color="var(--color-warning)" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Certificación</h3>
                  <p className="text-sm text-text-secondary">Obtén tu certificado de seguridad digital</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                iconName="Play"
                iconPosition="left"
                onClick={onStartTraining}
                className="flex-1 sm:flex-none">

                Comenzar Entrenamiento
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                iconName="Eye"
                iconPosition="left"
                onClick={onViewDemo}
                className="flex-1 sm:flex-none">

                Ver Demostración
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Users" size={16} />
                <span>+5,000 personas entrenadas</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Star" size={16} />
                <span>4.9/5 calificación</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative bg-surface rounded-2xl shadow-elevated p-8 border border-border">
              <Image
                src="https://images.unsplash.com/photo-1611206152671-2f6e4ded9ee6"
                alt="Elderly woman with gray hair wearing glasses looking at laptop screen with concerned expression in bright home office"
                className="w-full h-64 object-cover rounded-lg" />

              
              {/* Overlay Warning */}
              <div className="absolute top-4 right-4 bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Icon name="AlertTriangle" size={16} />
                <span>¡Sitio Falso!</span>
              </div>
              
              {/* Bottom Info */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Info" size={16} color="var(--color-primary)" />
                  <span className="text-text-primary font-medium">
                    Aprende a identificar señales de alerta como esta
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={24} color="var(--color-success)" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-primary)" />
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;