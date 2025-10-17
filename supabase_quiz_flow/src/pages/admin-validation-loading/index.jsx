import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ValidationMessage from './components/ValidationMessage';
import WaitingIndicator from './components/WaitingIndicator';
import ConnectionStatus from './components/ConnectionStatus';

const AdminValidationLoading = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [validationTime, setValidationTime] = useState(0);

  // Mock session data - in real app this would come from localStorage/context
  const mockSessionData = {
    sessionId: "sess_2025101720203282",
    currentStep: 1,
    totalSteps: 3,
    userId: "user_anonymous_001",
    lastActivity: new Date()?.toISOString(),
    status: "waiting_validation",
    currentQuestion: {
      id: 1,
      text: "¿Cuál es la capital de Francia?",
      userAnswer: "París",
      submittedAt: new Date(Date.now() - 30000)?.toISOString()
    }
  };

  // Mock admin responses for demonstration
  const mockAdminResponses = [
    {
      type: "approved",
      delay: 8000,
      message: "Respuesta correcta. Continuando al siguiente paso."
    },
    {
      type: "rejected", 
      delay: 12000,
      message: "Respuesta incorrecta. Por favor, inténtalo de nuevo.",
      adminNote: "La respuesta debe ser más específica. París es correcto."
    },
    {
      type: "blocked",
      delay: 15000,
      message: "Sesión bloqueada por el administrador.",
      reason: "Múltiples intentos incorrectos detectados."
    }
  ];

  useEffect(() => {
    // Initialize session data
    setSessionData(mockSessionData);

    // Start validation timer
    const timer = setInterval(() => {
      setValidationTime(prev => prev + 1);
    }, 1000);

    // Simulate real-time admin validation
    const selectedResponse = mockAdminResponses?.[0]; // Use approved for demo
    
    const validationTimeout = setTimeout(() => {
      handleAdminResponse(selectedResponse);
    }, selectedResponse?.delay);

    // Simulate occasional connection issues
    const connectionCheck = setInterval(() => {
      // 95% uptime simulation
      setConnectionStatus(Math.random() > 0.05);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(validationTimeout);
      clearInterval(connectionCheck);
    };
  }, []);

  const handleAdminResponse = (response) => {
    // Update session with admin response
    const updatedSession = {
      ...sessionData,
      lastActivity: new Date()?.toISOString(),
      adminResponse: response,
      status: response?.type === 'approved' ? 'approved' : 
              response?.type === 'rejected' ? 'rejected' : 'blocked'
    };

    // Save to localStorage (mock)
    localStorage.setItem('quizSession', JSON.stringify(updatedSession));

    // Navigate based on response
    switch (response?.type) {
      case 'approved':
        // Move to next question or rating if last question
        if (sessionData?.currentStep < sessionData?.totalSteps) {
          navigate('/quiz-question', { 
            state: { 
              step: sessionData?.currentStep + 1,
              sessionId: sessionData?.sessionId 
            }
          });
        } else {
          navigate('/rating-collection', {
            state: { sessionId: sessionData?.sessionId }
          });
        }
        break;
      
      case 'rejected': navigate('/error-message-modal', {
          state: {
            message: response?.message,
            adminNote: response?.adminNote,
            sessionId: sessionData?.sessionId,
            allowRetry: true
          }
        });
        break;
      
      case 'blocked': navigate('/error-message-modal', {
          state: {
            message: response?.message,
            reason: response?.reason,
            sessionId: sessionData?.sessionId,
            allowRetry: false,
            isBlocked: true
          }
        });
        break;
      
      default:
        console.error('Unknown admin response type:', response?.type);
    }
  };

  const handleConnectionRetry = () => {
    setConnectionStatus(true);
    // In real app, this would attempt to reconnect to Supabase
    console.log('Attempting to reconnect to real-time validation...');
  };

  const formatValidationTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Connection Status */}
        <ConnectionStatus 
          isConnected={connectionStatus}
          onRetry={handleConnectionRetry}
        />

        {/* Main Loading Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <LoadingSpinner className="mb-6" />
          
          <ValidationMessage 
            estimatedTime="1-2 minutos"
            sessionId={sessionData?.sessionId}
            className="mb-6"
          />

          <WaitingIndicator 
            currentStep={sessionData?.currentStep}
            totalSteps={sessionData?.totalSteps}
            className="mb-4"
          />

          {/* Validation Timer */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700 font-mono">
                Tiempo transcurrido: {formatValidationTime(validationTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Importante:</strong> No cierres esta ventana durante la validación. 
            El proceso es automático y recibirás una respuesta en breve.
          </p>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env?.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600">
            <div><strong>Sesión:</strong> {sessionData?.sessionId}</div>
            <div><strong>Estado:</strong> {sessionData?.status}</div>
            <div><strong>Pregunta:</strong> {sessionData?.currentStep}/{sessionData?.totalSteps}</div>
            <div><strong>Respuesta:</strong> {sessionData?.currentQuestion?.userAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminValidationLoading;