import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VideoTutorialSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoTutorials = [
  {
    id: 1,
    title: "Cómo Identificar Sitios Web Falsos",
    description: "Aprende a reconocer las señales visuales que delatan un sitio fraudulento en solo 5 minutos.",
    duration: "5:23",
    thumbnail: "https://images.unsplash.com/photo-1614064643392-8dd713152ae9",
    thumbnailAlt: "Close-up of computer screen showing website security indicators with green padlock icon",
    category: "Básico",
    views: "2.1K"
  },
  {
    id: 2,
    title: "Verificación de URLs y Certificados",
    description: "Guía paso a paso para verificar la autenticidad de sitios web antes de ingresar información personal.",
    duration: "7:45",
    thumbnail: "https://images.unsplash.com/photo-1664575196644-808978af9b1f",
    thumbnailAlt: "Person pointing at browser address bar showing HTTPS security certificate on laptop screen",
    category: "Intermedio",
    views: "1.8K"
  },
  {
    id: 3,
    title: "Qué Hacer Si Fuiste Estafado",
    description: "Protocolo de emergencia: pasos inmediatos a seguir si sospechas que has sido víctima de fraude.",
    duration: "6:12",
    thumbnail: "https://images.unsplash.com/photo-1513149322119-bd83e691f24c",
    thumbnailAlt: "Worried elderly woman with glasses looking at smartphone while sitting at desk with laptop",
    category: "Emergencia",
    views: "3.2K"
  },
  {
    id: 4,
    title: "Configuración de Seguridad Bancaria",
    description: "Cómo configurar alertas y límites en tus cuentas bancarias para prevenir fraudes.",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1556204976-4a72b0565dab",
    thumbnailAlt: "Banking app interface on smartphone screen showing security settings and transaction alerts",
    category: "Avanzado",
    views: "1.5K"
  }];


  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    console.log(`Playing video: ${video?.title}`);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Básico': 'bg-success/20 text-success',
      'Intermedio': 'bg-warning/20 text-warning',
      'Avanzado': 'bg-error/20 text-error',
      'Emergencia': 'bg-accent/20 text-accent'
    };
    return colors?.[category] || 'bg-muted text-text-secondary';
  };

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            Tutoriales en Video
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Aprende de forma visual con nuestros tutoriales especializados en seguridad digital. 
            Cada video está diseñado para ser fácil de seguir y entender.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {videoTutorials?.map((video) =>
          <div key={video?.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-smooth">
              {/* Thumbnail */}
              <div className="relative group cursor-pointer" onClick={() => handleVideoSelect(video)}>
                <Image
                src={video?.thumbnail}
                alt={video?.thumbnailAlt}
                className="w-full h-48 object-cover" />

                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Play" size={24} color="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                  {video?.duration}
                </div>

                {/* Category Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(video?.category)}`}>
                  {video?.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-secondary mb-2 line-clamp-2">
                  {video?.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                  {video?.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={16} />
                    <span>{video?.views} visualizaciones</span>
                  </div>
                  <Button
                  variant="outline"
                  size="sm"
                  iconName="Play"
                  iconPosition="left"
                  onClick={() => handleVideoSelect(video)}>

                    Ver Video
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-8">
          <div className="text-center">
            <Icon name="Youtube" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-secondary mb-3">
              Canal de YouTube
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Suscríbete a nuestro canal para recibir los últimos tutoriales sobre seguridad digital, 
              casos reales de fraude y consejos de prevención actualizados semanalmente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                iconName="Youtube"
                iconPosition="left"
                onClick={() => console.log('Subscribe to YouTube')}>

                Suscribirse al Canal
              </Button>
              <Button
                variant="outline"
                iconName="Bell"
                iconPosition="left"
                onClick={() => console.log('Enable notifications')}>

                Activar Notificaciones
              </Button>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo &&
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-heading font-semibold text-secondary">
                  {selectedVideo?.title}
                </h3>
                <button
                onClick={handleCloseVideo}
                className="p-2 hover:bg-muted rounded-full transition-micro">

                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Video Player Placeholder */}
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon name="Play" size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Video: {selectedVideo?.title}</p>
                  <p className="text-sm opacity-75">Duración: {selectedVideo?.duration}</p>
                  <p className="text-xs opacity-50 mt-4">
                    En una implementación real, aquí se cargaría el reproductor de video
                  </p>
                </div>
              </div>

              {/* Video Description */}
              <div className="p-4">
                <p className="text-text-secondary">
                  {selectedVideo?.description}
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    </section>);

};

export default VideoTutorialSection;