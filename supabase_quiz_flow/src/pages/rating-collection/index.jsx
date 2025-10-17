import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import RatingForm from './components/RatingForm';
import RatingSuccess from './components/RatingSuccess';

const RatingCollection = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [sessionData, setSessionData] = useState(null);

  // Mock session data - in real app this would come from Supabase
  const mockSessionData = {
    id: "session_67890",
    userId: "user_12345",
    userName: "María González",
    userAge: 28,
    currentStep: 5,
    completedSteps: [1, 2, 3, 4],
    answers: [
      { questionId: 1, answer: "París", isCorrect: true, attempts: 1 },
      { questionId: 2, answer: "7", isCorrect: true, attempts: 1 },
      { questionId: 3, answer: "Marte", isCorrect: true, attempts: 2 }
    ],
    status: "awaiting_rating",
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
    lastActivity: new Date()
  };

  useEffect(() => {
    // Load session data from localStorage or API
    const loadSessionData = () => {
      try {
        const savedSession = localStorage.getItem('quizSession');
        if (savedSession) {
          const parsedSession = JSON.parse(savedSession);
          setSessionData(parsedSession);
        } else {
          // Use mock data if no session found
          setSessionData(mockSessionData);
          localStorage.setItem('quizSession', JSON.stringify(mockSessionData));
        }
      } catch (error) {
        console.error('Error loading session data:', error);
        setSessionData(mockSessionData);
      }
    };

    loadSessionData();

    // Verify user has completed all questions
    const checkQuizCompletion = () => {
      const currentSession = JSON.parse(localStorage.getItem('quizSession') || '{}');
      if (!currentSession?.answers || currentSession?.answers?.length < 3) {
        // Redirect to quiz if not completed
        navigate('/quiz-question');
        return;
      }
      
      // Check if all answers are correct
      const allCorrect = currentSession?.answers?.every(answer => answer?.isCorrect);
      if (!allCorrect) {
        navigate('/quiz-question');
        return;
      }
    };

    checkQuizCompletion();
  }, [navigate]);

  const handleSubmitRating = async (rating) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update session with rating
      const updatedSession = {
        ...sessionData,
        rating: rating,
        status: 'completed',
        completedAt: new Date(),
        lastActivity: new Date(),
        currentStep: 6,
        completedSteps: [1, 2, 3, 4, 5]
      };
      
      // Save to localStorage
      localStorage.setItem('quizSession', JSON.stringify(updatedSession));
      setSessionData(updatedSession);
      setSubmittedRating(rating);
      
      // Show success state
      setShowSuccess(true);
      
      // Auto-redirect to thank you page after 3 seconds
      setTimeout(() => {
        navigate('/completion-thank-you');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Handle error - could show error modal
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionData) {
    return (
      <LoadingOverlay
        isVisible={true}
        title="Cargando..."
        message="Preparando la página de calificación..."
        type="navigation"
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Calificación - Supabase Quiz Flow</title>
        <meta name="description" content="Califica tu experiencia con nuestro cuestionario interactivo" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Progress Indicator */}
        <div className="pt-4">
          <ProgressIndicator
            currentStep={sessionData?.currentStep}
            totalSteps={6}
            completedSteps={sessionData?.completedSteps}
            stepLabels={[
              'Registro',
              'Pregunta 1', 
              'Pregunta 2',
              'Pregunta 3',
              'Validación',
              'Calificación'
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
          <div className="w-full max-w-md">
            {showSuccess ? (
              <RatingSuccess 
                rating={submittedRating}
                onContinue={() => navigate('/completion-thank-you')}
              />
            ) : (
              <RatingForm
                onSubmitRating={handleSubmitRating}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Session Info Footer */}
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Sesión: {sessionData?.id?.slice(-8)}</span>
              <span>•</span>
              <span>Usuario: {sessionData?.userName}</span>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        <LoadingOverlay
          isVisible={isSubmitting}
          title="Enviando calificación"
          message="Guardando tu valoración de forma segura..."
          type="submission"
          progress={null}
        />
      </div>
    </>
  );
};

export default RatingCollection;