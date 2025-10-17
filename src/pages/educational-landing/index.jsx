import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualBrandHeader from '../../components/ui/ContextualBrandHeader';
import EducationalResourceNavigation from '../../components/ui/EducationalResourceNavigation';
import HeroSection from './components/HeroSection';
import FraudEducationSection from './components/FraudEducationSection';
import InteractiveFAQSection from './components/InteractiveFAQSection';
import VideoTutorialSection from './components/VideoTutorialSection';
import DownloadableResourcesSection from './components/DownloadableResourcesSection';
import FeedbackSection from './components/FeedbackSection';
import ActionSection from './components/ActionSection';

const EducationalLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'CyberSafety Trainer - Educación en Seguridad Digital';
    
    // Log educational landing access
    console.log('Educational landing page accessed at:', new Date()?.toISOString());
  }, []);

  const handleStartTraining = () => {
    console.log('Starting new training session');
    navigate('/flight-search-homepage');
  };

  const handleViewDemo = () => {
    console.log('Viewing fraud revelation demo');
    navigate('/fraud-revelation');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualBrandHeader userRole="educational" />
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-16 p-6">
            <EducationalResourceNavigation />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection 
            onStartTraining={handleStartTraining}
            onViewDemo={handleViewDemo}
          />

          {/* Fraud Education Section */}
          <FraudEducationSection />

          {/* Interactive FAQ Section */}
          <InteractiveFAQSection />

          {/* Video Tutorial Section */}
          <VideoTutorialSection />

          {/* Downloadable Resources Section */}
          <DownloadableResourcesSection />

          {/* Feedback Section */}
          <FeedbackSection />

          {/* Action Section */}
          <ActionSection />
        </main>
      </div>
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                  <span className="text-success-foreground font-bold text-sm">CS</span>
                </div>
                <span className="text-xl font-heading font-bold">CyberSafety Trainer</span>
              </div>
              <p className="text-secondary-foreground/80 text-sm leading-relaxed">
                Protegiendo a las personas del fraude digital a través de educación práctica y simulaciones seguras.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => navigate('/flight-search-homepage')}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro"
                  >
                    Iniciar Simulación
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/fraud-revelation')}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro"
                  >
                    Ver Demostración
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro"
                  >
                    Panel de Administración
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro">
                    Guías Descargables
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro">
                    Videos Tutoriales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro">
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-micro">
                    Casos Reales
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-secondary-foreground/80">
                  soporte@cybersafety.co
                </li>
                <li className="text-secondary-foreground/80">
                  (601) 234-5678
                </li>
                <li className="text-secondary-foreground/80">
                  Bogotá, Colombia
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/60 text-sm">
              © {new Date()?.getFullYear()} CyberSafety Trainer. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground text-sm transition-micro">
                Política de Privacidad
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground text-sm transition-micro">
                Términos de Uso
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground text-sm transition-micro">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationalLanding;