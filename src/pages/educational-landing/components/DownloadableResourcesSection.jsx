import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DownloadableResourcesSection = () => {
  const [downloadingId, setDownloadingId] = useState(null);

  const downloadableResources = [
    {
      id: 1,
      title: "Guía Completa de Seguridad Digital",
      description: "Manual completo con todos los consejos esenciales para navegar seguro en internet. Incluye casos reales y ejercicios prácticos.",
      type: "PDF",
      size: "2.3 MB",
      pages: "24 páginas",
      icon: "FileText",
      category: "Guía Principal",
      downloads: "5.2K",
      featured: true
    },
    {
      id: 2,
      title: "Lista de Verificación Pre-Compra",
      description: "Checklist imprimible para verificar la seguridad de sitios web antes de realizar compras online.",
      type: "PDF",
      size: "450 KB",
      pages: "2 páginas",
      icon: "CheckSquare",
      category: "Herramienta",
      downloads: "3.8K",
      featured: false
    },
    {
      id: 3,
      title: "Números de Emergencia Cyberseguridad",
      description: "Contactos importantes para reportar fraudes: bancos, autoridades y organizaciones de ayuda en Colombia.",
      type: "PDF",
      size: "320 KB",
      pages: "1 página",
      icon: "Phone",
      category: "Emergencia",
      downloads: "2.1K",
      featured: false
    },
    {
      id: 4,
      title: "Configuración de Seguridad Paso a Paso",
      description: "Instrucciones detalladas para configurar la seguridad en navegadores, correo electrónico y redes sociales.",
      type: "PDF",
      size: "1.8 MB",
      pages: "16 páginas",
      icon: "Settings",
      category: "Tutorial",
      downloads: "4.3K",
      featured: true
    },
    {
      id: 5,
      title: "Plantilla de Reporte de Fraude",
      description: "Formato oficial para reportar casos de fraude digital a las autoridades competentes.",
      type: "DOCX",
      size: "180 KB",
      pages: "3 páginas",
      icon: "AlertTriangle",
      category: "Formulario",
      downloads: "1.9K",
      featured: false
    },
    {
      id: 6,
      title: "Infografía: Señales de Alerta",
      description: "Póster visual con las principales señales que indican un sitio web fraudulento. Ideal para imprimir.",
      type: "PNG",
      size: "2.1 MB",
      pages: "1 imagen",
      icon: "Image",
      category: "Visual",
      downloads: "6.7K",
      featured: true
    }
  ];

  const handleDownload = async (resource) => {
    setDownloadingId(resource?.id);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Downloading: ${resource?.title}`);
    setDownloadingId(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Guía Principal': 'bg-primary/20 text-primary',
      'Herramienta': 'bg-success/20 text-success',
      'Emergencia': 'bg-error/20 text-error',
      'Tutorial': 'bg-warning/20 text-warning',
      'Formulario': 'bg-accent/20 text-accent',
      'Visual': 'bg-secondary/20 text-secondary'
    };
    return colors?.[category] || 'bg-muted text-text-secondary';
  };

  const featuredResources = downloadableResources?.filter(r => r?.featured);
  const regularResources = downloadableResources?.filter(r => !r?.featured);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            Recursos Descargables
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Descarga guías, listas de verificación y herramientas gratuitas para 
            protegerte del fraude digital. Todos los recursos están en español y 
            adaptados al contexto colombiano.
          </p>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h3 className="text-xl font-heading font-semibold text-secondary mb-6 flex items-center">
            <Icon name="Star" size={24} className="mr-2 text-warning" />
            Recursos Destacados
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources?.map((resource) => (
              <div key={resource?.id} className="bg-surface border border-border rounded-xl p-6 shadow-soft hover:shadow-elevated transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name={resource?.icon} size={24} color="var(--color-primary)" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource?.category)}`}>
                    {resource?.category}
                  </div>
                </div>

                <h4 className="text-lg font-heading font-semibold text-secondary mb-2">
                  {resource?.title}
                </h4>
                
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {resource?.description}
                </p>

                {/* Resource Meta */}
                <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="File" size={12} />
                      <span>{resource?.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="HardDrive" size={12} />
                      <span>{resource?.size}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={12} />
                    <span>{resource?.downloads}</span>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  loading={downloadingId === resource?.id}
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleDownload(resource)}
                  disabled={downloadingId !== null}
                >
                  {downloadingId === resource?.id ? 'Descargando...' : 'Descargar Gratis'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Resources */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-secondary mb-6">
            Recursos Adicionales
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularResources?.map((resource) => (
              <div key={resource?.id} className="bg-surface border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={resource?.icon} size={20} color="var(--color-text-secondary)" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-secondary text-sm leading-tight">
                        {resource?.title}
                      </h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0 ${getCategoryColor(resource?.category)}`}>
                        {resource?.category}
                      </div>
                    </div>
                    
                    <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                      {resource?.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-text-secondary">
                        <span>{resource?.type}</span>
                        <span>{resource?.size}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="xs"
                        loading={downloadingId === resource?.id}
                        iconName="Download"
                        iconPosition="left"
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId !== null}
                      >
                        {downloadingId === resource?.id ? 'Descargando...' : 'Descargar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary/10 border border-primary/20 rounded-xl p-8">
          <div className="text-center">
            <Icon name="Mail" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-secondary mb-3">
              Recibe Recursos Nuevos
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Suscríbete a nuestro boletín para recibir nuevos recursos, alertas de seguridad 
              y actualizaciones sobre las últimas técnicas de fraude digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                variant="default"
                iconName="Send"
                iconPosition="left"
                onClick={() => console.log('Newsletter signup')}
              >
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadableResourcesSection;