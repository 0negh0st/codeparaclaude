import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EducationalCallToAction = () => {
  const navigate = useNavigate();

  const handleNavigateToEducational = () => {
    navigate('/educational-landing');
  };

  const handleRestartSimulation = () => {
    navigate('/flight-search-homepage');
  };

  const resources = [
    {
      title: 'Guía Completa de Ciberseguridad',
      description: 'Manual detallado con todas las técnicas de protección',
      icon: 'BookOpen',
      action: 'Leer Guía'
    },
    {
      title: 'Simulaciones Interactivas',
      description: 'Practica identificando sitios fraudulentos en un entorno seguro',
      icon: 'Play',
      action: 'Comenzar Práctica'
    },
    {
      title: 'Casos Reales de Estudio',
      description: 'Aprende de casos reales de fraude y cómo se pudieron prevenir',
      icon: 'FileText',
      action: 'Ver Casos'
    },
    {
      title: 'Herramientas de Verificación',
      description: 'Lista de herramientas gratuitas para verificar sitios web',
      icon: 'Tool',
      action: 'Descargar Lista'
    }
  ];

  const statistics = [
    {
      number: '73%',
      label: 'de adultos mayores han sido objetivo de estafas online',
      icon: 'TrendingUp'
    },
    {
      number: '$2.8B',
      label: 'perdidos anualmente por fraudes de phishing',
      icon: 'DollarSign'
    },
    {
      number: '15 seg',
      label: 'tiempo promedio que toma verificar un sitio web',
      icon: 'Clock'
    },
    {
      number: '95%',
      label: 'de fraudes se pueden prevenir con educación',
      icon: 'Shield'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-success/5 to-accent/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <Icon name="GraduationCap" size={40} className="text-success" />
          </div>
          
          <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
            Conviértete en un Experto en Ciberseguridad
          </h2>
          
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Esta experiencia te ha mostrado lo vulnerable que puedes ser. Ahora es momento de aprender 
            a protegerte y proteger a tus seres queridos de los ciberdelincuentes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleNavigateToEducational}
              iconName="ArrowRight"
              iconPosition="right"
              className="px-8 py-4"
            >
              Continuar Aprendiendo
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleRestartSimulation}
              iconName="RotateCcw"
              iconPosition="left"
              className="px-8 py-4"
            >
              Repetir Simulación
            </Button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statistics?.map((stat, index) => (
            <div key={index} className="bg-surface rounded-lg p-6 text-center shadow-soft">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <Icon name={stat?.icon} size={24} className="text-primary" />
              </div>
              <div className="text-3xl font-heading font-bold text-primary mb-2">
                {stat?.number}
              </div>
              <p className="text-sm text-text-secondary">
                {stat?.label}
              </p>
            </div>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources?.map((resource, index) => (
            <div key={index} className="bg-surface rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4 group-hover:bg-success/20 transition-micro">
                <Icon name={resource?.icon} size={24} className="text-success" />
              </div>
              
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                {resource?.title}
              </h3>
              
              <p className="text-sm text-text-secondary mb-4">
                {resource?.description}
              </p>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateToEducational}
                iconName="ExternalLink"
                iconPosition="right"
                className="w-full justify-between group-hover:bg-success/10 group-hover:text-success"
              >
                {resource?.action}
              </Button>
            </div>
          ))}
        </div>

        {/* Final Message */}
        <div className="bg-surface rounded-lg p-8 shadow-soft text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
            <Icon name="Lightbulb" size={32} className="text-warning" />
          </div>
          
          <h3 className="text-2xl font-heading font-semibold text-text-primary mb-3">
            Recuerda: La Educación es tu Mejor Defensa
          </h3>
          
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Los ciberdelincuentes evolucionan constantemente, pero con el conocimiento adecuado 
            y las herramientas correctas, puedes mantenerte siempre un paso adelante.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Verificación de sitios web</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Navegación segura</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Protección de datos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Pagos seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalCallToAction;