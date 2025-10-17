import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import RegistrationForm from './components/RegistrationForm';
import FeatureHighlights from './components/FeatureHighlights';
import SessionStats from './components/SessionStats';

const WelcomeRegistration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has an active session
    const existingSession = localStorage.getItem('quizSession');
    const currentStep = localStorage.getItem('currentStep');
    
    if (existingSession && currentStep) {
      try {
        const sessionData = JSON.parse(existingSession);
        
        // Check if session is still valid (less than 24 hours old)
        const sessionAge = Date.now() - new Date(sessionData.createdAt)?.getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge < maxAge && sessionData?.status !== 'completed') {
          // Resume existing session
          const step = parseInt(currentStep);
          
          switch (step) {
            case 1:
            case 2:
            case 3:
              navigate('/quiz-question');
              break;
            case 4:
              navigate('/admin-validation-loading');
              break;
            case 5:
              navigate('/rating-collection');
              break;
            case 6:
              navigate('/completion-thank-you');
              break;
            default:
              // Invalid step, clear session
              localStorage.removeItem('quizSession');
              localStorage.removeItem('currentStep');
          }
        } else {
          // Session expired, clear it
          localStorage.removeItem('quizSession');
          localStorage.removeItem('currentStep');
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
        localStorage.removeItem('quizSession');
        localStorage.removeItem('currentStep');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Welcome Header */}
          <WelcomeHeader />
          
          {/* Registration Form */}
          <RegistrationForm />
          
          {/* Feature Highlights */}
          <FeatureHighlights />
          
          {/* Session Statistics */}
          <SessionStats />
          
          {/* Footer Information */}
          <div className="mt-8 text-center">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-slate-600 mb-2">
                ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>© {new Date()?.getFullYear()} Quiz Interactivo</span>
                <span>•</span>
                <span>Versión 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeRegistration;